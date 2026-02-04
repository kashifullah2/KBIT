import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import datetime
load_dotenv()

app = FastAPI()

# --- CRITICAL: Add CORS Middleware ---
# This allows your React app (running on a different port/domain) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"), 
    model_name="openai/gpt-oss-120b"
)

# --- NEW: Pydantic models for structured output ---
class ExtractedData(BaseModel):
    filename: str
    summary: str
    fields: dict
    raw_text: str

class RefineRequest(BaseModel):
    current_data: dict
    instructions: str

# --- NEW: File Upload and Processing Endpoint ---
from fastapi import UploadFile, File, HTTPException, Form, status
from typing import List
import asyncio
from ocr_service import extract_text_from_image, extract_text_from_pdf

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...), schema: str = Form(None)):
    # Process files in parallel
    tasks = [process_single_file(file, schema) for file in files]
    results = await asyncio.gather(*tasks)
    return results

async def process_single_file(file: UploadFile, schema: str = None) -> ExtractedData:
    try:
        content = await file.read()
        
        # 1. Extract Text based on file type
        text = ""
        if file.content_type.startswith("image/"):
            text = extract_text_from_image(content)
        elif file.content_type == "application/pdf":
            text = extract_text_from_pdf(content)
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
            instruction_text = f"Extract SPECIFICALLY the following fields: {schema}. Do not invent fields not asked for."
        else:
            instruction_text = "Identify entities like Names, Dates, Amounts, Addresses, or technical specifications."

        system_prompt = f"""You are an AI data extraction assistant. 
        Analyze the following text extracted from a document. 
        Extract key information into structured JSON format. 
        {instruction_text}
        Return ONLY valid JSON.
        Structure:
        {{{{
            "summary": "Brief summary",
            "fields": {{{{ "key": "value" }}}}
        }}}}
        """
        
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



@app.post("/refine")
async def refine_data(request: RefineRequest):
    """
    Allows user to provide instructions to update the extracted data.
    """
    system_prompt = """You are a data correction assistant.
    You will be provided with existing JSON data and User Instructions.
    Update the JSON data based EXTREMELY strictly on the user instructions.
    Return ONLY the valid updated JSON.
    """
    
    chain = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "Current Data: {current_data}\nUser Instructions: {instructions}")
    ]) | llm

    result = await chain.ainvoke({
        "current_data": str(request.current_data),
        "instructions": request.instructions
    })
    
    # Parse result
    import json
    try:
        cleaned_content = result.content.strip()
        if cleaned_content.startswith("```json"):
            cleaned_content = cleaned_content[7:]
        if cleaned_content.endswith("```"):
            cleaned_content = cleaned_content[:-3]
        
        return json.loads(cleaned_content)
    except:
        raise HTTPException(status_code=500, detail="Failed to parse refined data")

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