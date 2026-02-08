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

from llm_factory import get_llm

llm = get_llm()

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
# --- NEW: File Upload and Processing Endpoint ---
from fastapi import UploadFile, File, HTTPException, Form, status, Response
from typing import List
import asyncio
from ocr_service import extract_text_from_image, extract_text_from_pdf

from PIL import Image
import io


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


# --- BUSINESS IDEA VALIDATOR ENDPOINTS ---
from idea_validator import (
    validate_idea, 
    refine_idea, 
    generate_startup_names, 
    generate_tagline,
    INDUSTRY_CATEGORIES
)

class IdeaInput(BaseModel):
    title: str
    problem: str
    target_users: str
    industry: str = "Other"
    business_model: str = ""
    target_market: str = "Global"
    additional_notes: str = ""

class IdeaRefineRequest(BaseModel):
    idea_id: int
    instruction: str

class NameGenerationRequest(BaseModel):
    title: str
    description: str
    industry: str = "Technology"

class TaglineRequest(BaseModel):
    name: str
    description: str
    target_audience: str


@app.get("/idea/industries")
async def get_industries():
    """Get list of industry categories for dropdown."""
    return {"industries": INDUSTRY_CATEGORIES}


@app.post("/idea/validate")
async def validate_business_idea(
    idea: IdeaInput,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user_optional)
):
    """
    Validate a business idea using AI analysis.
    Optionally saves to database if user is authenticated.
    """
    try:
        idea_data = idea.model_dump()
        
        # Run AI validation
        analysis = await validate_idea(idea_data)
        
        # Save to database if authenticated
        idea_id = None
        if current_user:
            new_idea = models.BusinessIdea(
                user_id=current_user.id,
                title=idea.title,
                input_data=json.dumps(idea_data),
                analysis_result=json.dumps(analysis),
                viability_score=analysis.get("viability_score")
            )
            db.add(new_idea)
            db.commit()
            db.refresh(new_idea)
            idea_id = new_idea.id
        
        return {
            "id": idea_id,
            "analysis": analysis,
            "saved": current_user is not None
        }
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")


@app.post("/idea/refine")
async def refine_business_idea(
    request: IdeaRefineRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Refine an existing idea with new instructions."""
    idea = db.query(models.BusinessIdea).filter(
        models.BusinessIdea.id == request.idea_id,
        models.BusinessIdea.user_id == current_user.id
    ).first()
    
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    try:
        original_idea = json.loads(idea.input_data)
        previous_analysis = json.loads(idea.analysis_result)
        
        # Run refinement
        refined_analysis = await refine_idea(original_idea, previous_analysis, request.instruction)
        
        # Update database
        idea.analysis_result = json.dumps(refined_analysis)
        idea.viability_score = refined_analysis.get("viability_score")
        db.commit()
        
        return {
            "id": idea.id,
            "analysis": refined_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Refinement failed: {str(e)}")


@app.get("/idea/history")
async def get_idea_history(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get user's idea history."""
    ideas = db.query(models.BusinessIdea).filter(
        models.BusinessIdea.user_id == current_user.id
    ).order_by(models.BusinessIdea.created_at.desc()).all()
    
    return {
        "ideas": [
            {
                "id": idea.id,
                "title": idea.title,
                "viability_score": idea.viability_score,
                "created_at": idea.created_at.isoformat() if idea.created_at else None
            }
            for idea in ideas
        ]
    }


@app.get("/idea/{idea_id}")
async def get_idea(
    idea_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get a specific idea with full analysis."""
    idea = db.query(models.BusinessIdea).filter(
        models.BusinessIdea.id == idea_id,
        models.BusinessIdea.user_id == current_user.id
    ).first()
    
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    return {
        "id": idea.id,
        "title": idea.title,
        "input_data": json.loads(idea.input_data) if idea.input_data else {},
        "analysis": json.loads(idea.analysis_result) if idea.analysis_result else {},
        "viability_score": idea.viability_score,
        "created_at": idea.created_at.isoformat() if idea.created_at else None
    }


@app.delete("/idea/{idea_id}")
async def delete_idea(
    idea_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Delete an idea."""
    idea = db.query(models.BusinessIdea).filter(
        models.BusinessIdea.id == idea_id,
        models.BusinessIdea.user_id == current_user.id
    ).first()
    
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    db.delete(idea)
    db.commit()
    
    return {"status": "deleted", "id": idea_id}


@app.post("/idea/names")
async def generate_names(request: NameGenerationRequest):
    """Generate startup name suggestions."""
    try:
        names = await generate_startup_names(
            request.title,
            request.description,
            request.industry
        )
        return {"names": names}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Name generation failed: {str(e)}")


@app.post("/idea/tagline")
async def generate_taglines(request: TaglineRequest):
    """Generate tagline suggestions."""
    try:
        taglines = await generate_tagline(
            request.name,
            request.description,
            request.target_audience
        )
        return {"taglines": taglines}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tagline generation failed: {str(e)}")


@app.get("/idea/export/{idea_id}/{format}")
async def export_idea(
    idea_id: int,
    format: str,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Export idea analysis in different formats (json, md)."""
    idea = db.query(models.BusinessIdea).filter(
        models.BusinessIdea.id == idea_id,
        models.BusinessIdea.user_id == current_user.id
    ).first()
    
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    input_data = json.loads(idea.input_data) if idea.input_data else {}
    analysis = json.loads(idea.analysis_result) if idea.analysis_result else {}
    
    if format == "json":
        return {
            "title": idea.title,
            "input": input_data,
            "analysis": analysis,
            "exported_at": datetime.datetime.now().isoformat()
        }
    elif format == "md":
        # Generate markdown report
        md_content = f"""# Business Idea Analysis: {idea.title}

## Overview
**Viability Score:** {analysis.get('viability_score', 'N/A')}/10

{analysis.get('idea_summary', '')}

## Market Demand
**Score:** {analysis.get('market_demand', {}).get('score', 'N/A')}/10

{analysis.get('market_demand', {}).get('analysis', '')}

## Target Customers
**Primary:** {analysis.get('target_customers', {}).get('primary', 'N/A')}

**Secondary:** {analysis.get('target_customers', {}).get('secondary', 'N/A')}

## Competition
**Level:** {analysis.get('competition', {}).get('level', 'N/A')}

{analysis.get('competition', {}).get('differentiation', '')}

## Risks
"""
        for risk in analysis.get('risks', []):
            md_content += f"- **{risk.get('type', 'Risk')}** ({risk.get('severity', 'medium')}): {risk.get('description', '')}\n"
        
        md_content += f"""
## Improvements
"""
        for imp in analysis.get('improvements', []):
            md_content += f"- {imp}\n"
        
        md_content += f"""
## MVP Recommendation
{analysis.get('mvp_recommendation', {}).get('timeline', '')}

### Core Features
"""
        for feat in analysis.get('mvp_recommendation', {}).get('core_features', []):
            md_content += f"- {feat}\n"
        
        md_content += f"""
## Verdict
{analysis.get('verdict', '')}

---
*Generated by KBIT AI Business Idea Validator*
"""
        return {"markdown": md_content, "filename": f"{idea.title.replace(' ', '_')}_analysis.md"}
    else:
        raise HTTPException(status_code=400, detail="Unsupported format. Use 'json' or 'md'")

# --- AI CAREER SIMULATOR ENDPOINTS ---
from career_service import start_game, process_turn

class StartGameRequest(BaseModel):
    role: str
    industry: str

class GameActionRequest(BaseModel):
    state: dict
    action: str

@app.post("/career/start")
async def start_career_game(request: StartGameRequest):
    """Starts a new career simulation game."""
    try:
        initial_state = await start_game(request.role, request.industry)
        return initial_state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/career/act")
async def process_game_turn(request: GameActionRequest):
    """Process a user action and advance the game state."""
    try:
        new_state = await process_turn(request.state, request.action)
        return new_state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))