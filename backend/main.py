from typing import List, Dict, Any, Union, Optional
import os
import datetime
import json
import io
import asyncio
from fastapi import FastAPI, UploadFile, File, HTTPException, Form, status, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from dotenv import load_dotenv
from PIL import Image

load_dotenv()

app = FastAPI()

# --- CRITICAL: Add CORS Middleware ---
# This allows your React app (running on a different port/domain) to talk to this API
FRONTEND_URL = os.getenv("FRONTEND_URL", "*") 

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from llm_factory import get_llm
from agent import get_agent_response
from ocr_service import get_available_engines, extract_text_from_pdf, extract_text_from_image

llm = get_llm()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    thread_id: Optional[str] = "default"

@app.post("/chat")
async def chat_with_agent(request: ChatRequest):
    try:
        # Convert request messages to LangChain format
        history = []
        for msg in request.messages:
            if msg.role == "user":
                history.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                # Only add assistant messages if we've already started with a user message
                if history:
                    history.append(AIMessage(content=msg.content))
            elif msg.role == "system":
                # Convert middle-of-conversation system messages to user context for better compatibility
                history.append(HumanMessage(content=f"[Context]: {msg.content}"))
        
        # If history is empty after filtering, or if first message is not user, 
        # ensure we don't send an invalid start to Groq
        if not history:
             return {
                "role": "assistant",
                "content": "I'm ready to help! What's on your mind?",
                "tool_calls": []
            }

        result = await get_agent_response(history, thread_id=request.thread_id)
        new_messages = result["messages"][len(history):]
        
        # Collect all tool calls that were made during this turn
        all_tool_calls = []
        final_content = ""
        download_paths = []
        
        for msg in new_messages:
            if isinstance(msg, AIMessage):
                if msg.tool_calls:
                    all_tool_calls.extend(msg.tool_calls)
                if msg.content:
                    final_content = msg.content # The last content message is usually the final response
            elif isinstance(msg, ToolMessage):
                # If a tool returned a DOWNLOAD_PATH, we want to make sure it's visible to the user
                if "DOWNLOAD_PATH:" in str(msg.content):
                    path_part = str(msg.content).split("DOWNLOAD_PATH:")[1].strip()
                    download_paths.append(path_part)

        # Append all collected download paths to the final content
        for path in download_paths:
            if "DOWNLOAD_PATH:" not in final_content:
                final_content = final_content.strip() + f"\n\nDOWNLOAD_PATH: {path}"

        return {
            "role": "assistant",
            "content": final_content,
            "tool_calls": all_tool_calls
        }
    except Exception as e:
        print(f"CHAT ERROR: {str(e)}")
        # If it's a Groq/OpenAI error, it might have more details
        if hasattr(e, 'response') and hasattr(e.response, 'text'):
            print(f"DEBUG: Groq Response: {e.response.text}")
        raise HTTPException(status_code=500, detail=f"AI Agent Error: {str(e)}")




class ExtractedData(BaseModel):
    filename: str
    summary: str
    fields: Dict[str, Any]
    raw_text: str

@app.get("/ocr/engines")
async def list_ocr_engines():
    """Return the list of available OCR engines."""
    return {"engines": get_available_engines()}

@app.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    schema: str = Form(None),
    ocr_engine: str = Form("tesseract")
):
    # Process files in parallel
    tasks = [process_single_file(file, schema, ocr_engine) for file in files]
    results = await asyncio.gather(*tasks)
    return results

async def process_single_file(file: UploadFile, schema: str = None, ocr_engine: str = "tesseract") -> ExtractedData:
    try:
        content = await file.read()
        
        # 1. Extract Text based on file type
        text = ""
        if file.content_type.startswith("image/"):
            text = extract_text_from_image(content, engine=ocr_engine)
        elif file.content_type == "application/pdf":
            text = extract_text_from_pdf(content, engine=ocr_engine)
        else:
            return {
                "filename": file.filename,
                "summary": "Error",
                "fields": {"error": "Unsupported file type"},
                "raw_text": ""
            }

        if not text.strip():
             return {
                "filename": file.filename,
                "summary": "Error",
                "fields": {"error": "No text extracted"},
                "raw_text": ""
            }

        # 2. Process with Groq to get Structured Data
        if schema:
            instruction_text = f"""Extract SPECIFICALLY the following fields: {schema}.
Do not invent fields not asked for.
Each requested field MUST be its own separate key in the 'fields' dictionary."""
        else:
            instruction_text = """Identify ALL distinct entities such as Names, Dates, Amounts, Addresses, Phone Numbers,
Invoice Numbers, Vendor Names, Items, Quantities, Totals, and any other distinct fields.
CRITICAL: Each piece of information MUST be its own SEPARATE key in the 'fields' dictionary.
Do NOT combine multiple values into a single key or a single text blob.
For example:
CORRECT:   {{"vendor_name": "Acme Corp", "invoice_date": "2024-01-15", "total_amount": "$500"}}
INCORRECT: {{"extracted_text": "Vendor: Acme Corp, Date: 2024-01-15, Total: $500"}}"""

        system_prompt = f"""You are an AI data extraction assistant.
Analyze the following text extracted from a document.
Extract key information into structured JSON format.
{instruction_text}
Return ONLY valid JSON. No markdown, no explanation.
Structure:
{{{{
    "summary": "Brief one-line summary of the document",
    "fields": {{{{
        "field_name_1": "value_1",
        "field_name_2": "value_2"
    }}}}
}}}}
Remember: every distinct piece of data must be a SEPARATE key inside 'fields'."""
        
        chain = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{text}")
        ]) | llm

        result = await chain.ainvoke({"text": text})
        
        # 3. Parse JSON
        import json
        try:
            cleaned_content = result.content.strip()
            if cleaned_content.startswith("```json"):
                cleaned_content = cleaned_content[7:]
            if cleaned_content.endswith("```"):
                cleaned_content = cleaned_content[:-3]
            
            data = json.loads(cleaned_content)
            return {
                "filename": file.filename,
                "summary": data.get("summary", ""),
                "fields": data.get("fields", {}),
                "raw_text": text
            }
        except Exception:
             return {
                "filename": file.filename,
                "summary": "Error parsing LLM response",
                "fields": {"raw_response": result.content},
                "raw_text": text
            }
    except Exception as e:
        return {
            "filename": file.filename,
            "summary": "Processing Error",
            "fields": {"error": str(e)},
            "raw_text": ""
        }





class TextInput(BaseModel):
    text: str

@app.post("/analyze")
async def analyze_sentiment(data: TextInput):
    # Using async/await keeps the API responsive
    chain = ChatPromptTemplate.from_messages([
         ("system", "You are a sentiment analysis assistant. Reply with only one word: Positive, Neutral, or Negative."),
         ("human", "Text: {text}")
    ]) | llm
    result = await chain.ainvoke({"text": data.text})

    return {
        "sentiment": result.content.strip()
    }

class ImproveRequest(BaseModel):
    text: str
    section: str = "general"

@app.post("/cv/improve")
async def improve_cv_text(request: ImproveRequest):
    system_prompt = f"""You are a professional CV editor.
    Improve the following text for a {request.section} section of a resume.
    Make it more professional, impactful, and concise. Use active verbs.
    Return ONLY the improved text, no explanations.
    """
    
    chain = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{text}")
    ]) | llm

    result = await chain.ainvoke({"text": request.text})
    return {"improved_text": result.content.strip()}

    return {
        "tesseract_path": tesseract_path,
        "tesseract_version": tesseract_version,
        "path_env": os.environ.get("PATH"),
        "cwd": os.getcwd(),
        "files_in_cwd": os.listdir(".")
    }

# --- AUTH & DB INTEGRATION ---
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import models, auth, database

# Create tables
models.Base.metadata.create_all(bind=database.engine)


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

@app.post("/signup", response_model=Token)
async def signup(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = auth.get_user(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        gender=user.gender,
        address=user.address
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")))
    access_token = auth.create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return {"email": current_user.email, "id": current_user.id}

# --- CV Persistence Routes ---

@app.post("/cv/save")
async def save_cv(
    cv_data: CVSaveRequest, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    import json
    # Check if CV already exists for this user (simple 1 user = 1 CV model for now, or append)
    # For now, let's just create a new entry every time or update the latest one.
    # Let's simple check: Update if exists, else create.
    
    # We will just append new versions for now to keep history, or you can update.
    # User requirement: "if user login his cv data... is store... he can do changes"
    # Strategy: Find latest CV, update it, or create new if none.
    
    existing_cv = db.query(models.CV).filter(models.CV.user_id == current_user.id).order_by(models.CV.created_at.desc()).first()
    
    content_str = json.dumps(cv_data.content)
    
    if existing_cv:
        existing_cv.content = content_str
        existing_cv.filename = cv_data.filename
        existing_cv.updated_at = database.func.now()
    else:
        new_cv = models.CV(
            user_id=current_user.id,
            filename=cv_data.filename,
            content=content_str
        )
        db.add(new_cv)
        
    db.commit()
    return {"status": "success", "message": "CV saved successfully"}

@app.get("/cv/load")
async def load_cv(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    import json
    cv = db.query(models.CV).filter(models.CV.user_id == current_user.id).order_by(models.CV.created_at.desc()).first()
    
    if not cv or not cv.content:
        return {"content": None}
        
    return {"content": json.loads(cv.content), "filename": cv.filename}

