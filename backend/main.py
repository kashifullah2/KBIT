from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional
import os
import datetime
import json
import asyncio

from fastapi import FastAPI, UploadFile, File, HTTPException, Form, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Security Headers Middleware
# ---------------------------------------------------------------------------
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), notifications=self"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

# ---------------------------------------------------------------------------
# Lifespan — opens / closes the SQLite checkpointer cleanly
# ---------------------------------------------------------------------------
from agent import init_checkpointer, close_checkpointer

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_checkpointer()   # ✅ runs BEFORE first request
    yield
    await close_checkpointer()  # ✅ runs on shutdown

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(lifespan=lifespan)  # 🔑 must pass lifespan here

# Add security headers middleware
app.add_middleware(SecurityHeadersMiddleware)

FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Lazy imports (after app is created to avoid circular issues)
# ---------------------------------------------------------------------------
from llm_factory import get_llm
from agent import get_agent_response
from ocr_service import get_available_engines, extract_text_from_pdf, extract_text_from_image

llm = get_llm()

# ---------------------------------------------------------------------------
# Auth / DB
# ---------------------------------------------------------------------------
from sqlalchemy.orm import Session
import models, auth, database

models.Base.metadata.create_all(bind=database.engine)

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    thread_id: Optional[str] = "default"

class Token(BaseModel):
    access_token: str
    token_type: str

class CVSaveRequest(BaseModel):
    content: dict
    filename: str = "My CV"

class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    phone: str
    gender: str
    address: str

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str | None = None
    last_name: str | None = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TextInput(BaseModel):
    text: str

class ImproveRequest(BaseModel):
    text: str
    section: str = "general"

class ExtractedData(BaseModel):
    filename: str
    summary: str
    fields: Dict[str, Any]
    raw_text: str

# ---------------------------------------------------------------------------
# /chat
# ---------------------------------------------------------------------------

@app.post("/chat")
async def chat_with_agent(
    request: ChatRequest,
    current_user: Optional[models.User] = Depends(auth.get_current_user_optional)
):
    try:
        # 1) Use user ID to isolate history if they are logged in.
        # This ensures that even if two users have the same local thread_id,
        # their data is perfectly separated on the server.
        user_prefix = f"user_{current_user.id}_" if current_user else "guest_"
        internal_thread_id = f"{user_prefix}{request.thread_id or 'default'}"

        # Find the last user message — only this gets sent to the agent.
        # The checkpointer already holds prior history; re-sending it would duplicate it.
        last_user_msg = next(
            (msg for msg in reversed(request.messages) if msg.role == "user"),
            None,
        )

        if not last_user_msg:
            return {
                "role": "assistant",
                "content": "I'm ready to help! What's on your mind?",
                "cv_update": None,
                "download": None,
            }

        # ✅ Correct signature: just a string + thread_id
        result = await get_agent_response(
            user_message=last_user_msg.content,
            thread_id=internal_thread_id,
        )

        return {
            "role": "assistant",
            "content": result["reply"],
            "cv_update": result["cv_update"],   # dict or None
            "download": result["download"],      # path string or None
        }

    except Exception as e:
        print(f"CHAT ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"AI Agent Error: {str(e)}")


# ---------------------------------------------------------------------------
# /upload  (OCR + structured extraction)
# ---------------------------------------------------------------------------

@app.get("/ocr/engines")
async def list_ocr_engines():
    return {"engines": get_available_engines()}


@app.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    schema: str = Form(None),
    ocr_engine: str = Form("tesseract"),
):
    tasks = [process_single_file(f, schema, ocr_engine) for f in files]
    results = await asyncio.gather(*tasks)
    return results


async def process_single_file(
    file: UploadFile, schema: str = None, ocr_engine: str = "tesseract"
) -> dict:
    try:
        content = await file.read()

        if file.content_type.startswith("image/"):
            text = extract_text_from_image(content, engine=ocr_engine)
        elif file.content_type == "application/pdf":
            text = extract_text_from_pdf(content, engine=ocr_engine)
        else:
            return {"filename": file.filename, "summary": "Error",
                    "fields": {"error": "Unsupported file type"}, "raw_text": ""}

        if not text.strip():
            return {"filename": file.filename, "summary": "Error",
                    "fields": {"error": "No text extracted"}, "raw_text": ""}

        if schema:
            instruction_text = (
                f"Extract SPECIFICALLY the following fields: {schema}. "
                "Do not invent fields not asked for. "
                "Each requested field MUST be its own separate key in the 'fields' dictionary."
            )
        else:
            instruction_text = (
                "Identify ALL distinct entities such as Names, Dates, Amounts, Addresses, "
                "Phone Numbers, Invoice Numbers, Vendor Names, Items, Quantities, Totals, "
                "and any other distinct fields. "
                "CRITICAL: Each piece of information MUST be its own SEPARATE key in the 'fields' dictionary. "
                "Do NOT combine multiple values into a single key or a single text blob."
            )

        system_prompt = f"""You are an AI data extraction assistant.
Analyze the following text extracted from a document.
{instruction_text}
Return ONLY valid JSON. No markdown, no explanation.
Structure:
{{{{
    "summary": "Brief one-line summary of the document",
    "fields": {{{{
        "field_name_1": "value_1",
        "field_name_2": "value_2"
    }}}}
}}}}"""

        chain = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{text}"),
        ]) | llm

        result = await chain.ainvoke({"text": text})

        cleaned = result.content.strip().removeprefix("```json").removesuffix("```").strip()
        try:
            data = json.loads(cleaned)
            return {
                "filename": file.filename,
                "summary": data.get("summary", ""),
                "fields": data.get("fields", {}),
                "raw_text": text,
            }
        except Exception:
            return {
                "filename": file.filename,
                "summary": "Error parsing LLM response",
                "fields": {"raw_response": result.content},
                "raw_text": text,
            }

    except Exception as e:
        return {"filename": file.filename, "summary": "Processing Error",
                "fields": {"error": str(e)}, "raw_text": ""}


class RefineRequest(BaseModel):
    current_data: Dict[str, Any]
    raw_text: str
    instructions: str

# ---------------------------------------------------------------------------
# /refine (Intelligent correction)
# ---------------------------------------------------------------------------

@app.post("/refine")
async def refine_extraction(request: RefineRequest):
    try:
        system_prompt = f"""You are an expert data refinement assistant.
Your goal is to correct and improve structured data based on user instructions and the raw text provided.

CURRENT DATA:
{json.dumps(request.current_data, indent=2)}

USER INSTRUCTIONS:
{request.instructions}

RAW DOCUMENT TEXT:
{request.raw_text}

Analyze the instructions and the raw text to produce a CORRECTED version of the 'fields' and 'summary'.
Return ONLY valid JSON. No markdown, no explanation.
Structure:
{{{{
    "summary": "Brief updated summary",
    "fields": {{{{
        "key": "updated_value"
    }}}}
}}}}"""

        chain = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "Refine the extraction based on my instructions."),
        ]) | llm

        result = await chain.ainvoke({})
        cleaned = result.content.strip().removeprefix("```json").removesuffix("```").strip()
        return json.loads(cleaned)

    except Exception as e:
        print(f"REFINE ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# /analyze  (sentiment)
# ---------------------------------------------------------------------------

@app.post("/analyze")
async def analyze_sentiment(data: TextInput):
    chain = ChatPromptTemplate.from_messages([
        ("system", "You are a sentiment analysis assistant. Reply with only one word: Positive, Neutral, or Negative."),
        ("human", "Text: {text}"),
    ]) | llm
    result = await chain.ainvoke({"text": data.text})
    return {"sentiment": result.content.strip()}


# ---------------------------------------------------------------------------
# /cv/improve
# ---------------------------------------------------------------------------

@app.post("/cv/improve")
async def improve_cv_text(request: ImproveRequest):
    system_prompt = f"""You are a professional CV editor.
Improve the following text for a {request.section} section of a resume.
Make it more professional, impactful, and concise. Use active verbs.
Return ONLY the improved text, no explanations."""

    chain = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{text}"),
    ]) | llm
    result = await chain.ainvoke({"text": request.text})
    return {"improved_text": result.content.strip()}


# ---------------------------------------------------------------------------
# Auth routes
# ---------------------------------------------------------------------------

@app.post("/signup", response_model=Token)
async def signup(user: UserCreate, db: Session = Depends(database.get_db)):
    if auth.get_user(db, email=user.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        gender=user.gender,
        address=user.address,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    from datetime import timedelta
    expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")))
    token = auth.create_access_token(data={"sub": new_user.email}, expires_delta=expires)
    return {"access_token": token, "token_type": "bearer"}


@app.post("/token", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db),
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    from datetime import timedelta
    expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = auth.create_access_token(data={"sub": user.email}, expires_delta=expires)
    return {"access_token": token, "token_type": "bearer"}


@app.get("/users/me")
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return {"email": current_user.email, "id": current_user.id}


# ---------------------------------------------------------------------------
# CV persistence
# ---------------------------------------------------------------------------

@app.post("/cv/save")
async def save_cv(
    cv_data: CVSaveRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    content_str = json.dumps(cv_data.content)
    existing = (
        db.query(models.CV)
        .filter(models.CV.user_id == current_user.id)
        .order_by(models.CV.created_at.desc())
        .first()
    )

    if existing:
        existing.content = content_str
        existing.filename = cv_data.filename
    else:
        db.add(models.CV(
            user_id=current_user.id,
            filename=cv_data.filename,
            content=content_str,
        ))

    db.commit()
    return {"status": "success", "message": "CV saved successfully"}


@app.get("/cv/load")
async def load_cv(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    cv = (
        db.query(models.CV)
        .filter(models.CV.user_id == current_user.id)
        .order_by(models.CV.created_at.desc())
        .first()
    )

    if not cv or not cv.content:
        return {"content": None}

    return {"content": json.loads(cv.content), "filename": cv.filename}