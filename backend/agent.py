import os
import io
import json
from typing import List, Dict, Any, Union, Optional
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from llm_factory import get_llm
import pypdf
from docx import Document
from langgraph.prebuilt import create_react_agent

from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

# Initialize LLM
llm = get_llm()


# Personal Info Models

class PersonalInfo(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    jobTitle: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    summary: Optional[str] = None

class ExperienceEntry(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    description: Optional[str] = None

class EducationEntry(BaseModel):
    degree: Optional[str] = None
    school: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None

@tool
def update_cv_data(
    personalInfo: Optional[PersonalInfo] = None,
    experience: Optional[List[ExperienceEntry]] = None,
    education: Optional[List[EducationEntry]] = None,
    skills: Optional[List[str]] = None,
    certifications: Optional[List[Dict[str, str]]] = None,
    languages: Optional[List[Dict[str, str]]] = None
) -> str:
    """
    Updates the CV with new information. Use this whenever you collect data from the user.
    Arguments should be objects matching the CV structure.
    """
    # Convert Pydantic models to dict if provided
    result = {}
    if personalInfo: result["personalInfo"] = personalInfo.model_dump(exclude_unset=True)
    if experience: result["experience"] = [e.model_dump(exclude_unset=True) for e in experience]
    if education: result["education"] = [e.model_dump(exclude_unset=True) for e in education]
    if skills: result["skills"] = skills
    if certifications: result["certifications"] = certifications
    if languages: result["languages"] = languages
    
    return json.dumps(result)

@tool
def merge_pdfs_tool(file_names: List[str]) -> str:
    """
    Merges multiple PDF files into one. Input is a list of file names that have been uploaded.
    Returns a success message with a download path.
    """
    try:
        # Simulate merge logic
        output_name = "merged_output.pdf"
        return f"Successfully merged {len(file_names)} files. DOWNLOAD_PATH:/downloads/{output_name}"
    except Exception as e:
        return f"Error merging PDFs: {str(e)}"

@tool
def convert_pdf_to_docx(file_name: str) -> str:
    """
    Converts a PDF file to a DOCX file. Input is the name of the uploaded file.
    Returns a success message with a download path.
    """
    try:
        output_name = file_name.replace('.pdf', '.docx')
        return f"Converted {file_name} to DOCX. DOWNLOAD_PATH:/downloads/{output_name}"
    except Exception as e:
        return f"Error converting to DOCX: {str(e)}"

# Define the system prompt for the CV Assistant
SYSTEM_PROMPT = """You are 'CV Buddy', a sophisticated AI career assistant and professional CV architect.
Your primary goal is to help the user build an exceptional, high-impact CV through a natural conversation.

PRIME DIRECTIVES:
1. COLLECT INFO: Ask targeted, professional questions to gather contact info, summary, experience, education, skills, certs, and languages.
2. ITERATIVE REFINEMENT: Don't ask everything at once. Focus on one section at a time.
3. MULTILINGUAL SUPPORT: Respond in the language the user speaks. You are fluent in English, Urdu (اردو), Pashto (پښتو), and other regional languages. Help the user construct their CV in their preferred language while ensuring professional terminology.
   - CRITICAL: Regardless of the conversation language, ALL data passed to `update_cv_data` MUST be in English. Translate any Urdu, Pashto, or other language inputs into professional English before syncing.
4. PROACTIVE DESIGN: Suggest improvements to the content you collect. If the user is writing in Urdu/Pashto, you can still help them translate or refine their professional summary into high-quality English.
5. TOOL USAGE: 
   - Use `update_cv_data` frequently to sync gathered info to the CV preview.
   - Use `merge_pdfs_tool` if requested.
   - Use `convert_pdf_to_docx` if requested.

IMPORTANT: When you update CV data, the user sees it instantly. Always confirm what you've updated.
If a user asks for a download link after merging/converting, mention the file name; the system will handle the button.
"""

# Create tools list
tools = [update_cv_data, merge_pdfs_tool, convert_pdf_to_docx]

async def get_agent_response(messages: List[Union[HumanMessage, AIMessage, SystemMessage]], thread_id: str = "default"):
    """
    Invokes the agent and returns the full state messages.
    Uses AsyncSqliteSaver for persistent memory.
    """
    async with AsyncSqliteSaver.from_conn_string("cv_buddy_memory.db") as checkpointer:
        # Create the agent with the current checkpointer
        agent_executor = create_react_agent(
            llm, 
            tools, 
            prompt=SYSTEM_PROMPT, 
            checkpointer=checkpointer
        )
        
        config = {"configurable": {"thread_id": thread_id}}
        return await agent_executor.ainvoke({"messages": messages}, config=config)
