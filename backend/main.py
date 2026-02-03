import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

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
from fastapi import UploadFile, File, HTTPException, Form
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

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    # Process files in parallel
    tasks = [process_single_file(file) for file in files]
    results = await asyncio.gather(*tasks)
    return results

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