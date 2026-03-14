import os
import json
from typing import List, Dict, Any, Optional

from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage, trim_messages
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

from llm_factory import get_llm

# ---------------------------------------------------------------------------
# LLM
# ---------------------------------------------------------------------------
llm = get_llm()

# ---------------------------------------------------------------------------
# Pydantic Models
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Tools
# ---------------------------------------------------------------------------

@tool
def update_cv_data(
    personalInfo: Optional[PersonalInfo] = None,
    experience: Optional[List[ExperienceEntry]] = None,
    education: Optional[List[EducationEntry]] = None,
    skills: Optional[List[str]] = None,
    certifications: Optional[List[Dict[str, str]]] = None,
    languages: Optional[List[Dict[str, str]]] = None,
) -> str:
    """
    Updates the CV preview with new information.
    Call this whenever you collect or refine any CV data from the user.
    ALL field values must be in English regardless of the conversation language.
    """
    updated_sections: List[str] = []
    payload: Dict[str, Any] = {}

    if personalInfo:
        updated_sections.append("Personal Info")
        payload["personalInfo"] = personalInfo.model_dump(exclude_unset=True)
    if experience:
        updated_sections.append(f"Experience ({len(experience)} entr{'y' if len(experience) == 1 else 'ies'})")
        payload["experience"] = [e.model_dump(exclude_unset=True) for e in experience]
    if education:
        updated_sections.append(f"Education ({len(education)} entr{'y' if len(education) == 1 else 'ies'})")
        payload["education"] = [e.model_dump(exclude_unset=True) for e in education]
    if skills:
        updated_sections.append(f"Skills ({len(skills)} items)")
        payload["skills"] = skills
    if certifications:
        updated_sections.append(f"Certifications ({len(certifications)} items)")
        payload["certifications"] = certifications
    if languages:
        updated_sections.append(f"Languages ({len(languages)} items)")
        payload["languages"] = languages

    if not updated_sections:
        return "No data provided — nothing was updated."

    return f"CV_UPDATE:{json.dumps(payload)} | Updated sections: {', '.join(updated_sections)}."


@tool
def merge_pdfs_tool(file_names: List[str]) -> str:
    """
    Merges multiple uploaded PDF files into one combined PDF.
    Input: list of file names that the user has already uploaded.
    """
    if not file_names or len(file_names) < 2:
        return "Error: please provide at least 2 PDF files to merge."
    try:
        output_name = "merged_output.pdf"
        return f"Successfully merged {len(file_names)} files into '{output_name}'. DOWNLOAD_PATH:/downloads/{output_name}"
    except Exception as exc:
        return f"Error merging PDFs: {exc}"


@tool
def convert_pdf_to_docx(file_name: str) -> str:
    """
    Converts an uploaded PDF file to a DOCX file.
    Input: name of the already-uploaded PDF file.
    """
    if not file_name or not file_name.lower().endswith(".pdf"):
        return "Error: please provide a valid .pdf file name."
    try:
        output_name = file_name[:-4] + ".docx"
        return f"Converted '{file_name}' to '{output_name}'. DOWNLOAD_PATH:/downloads/{output_name}"
    except Exception as exc:
        return f"Error converting to DOCX: {exc}"


TOOLS = [update_cv_data, merge_pdfs_tool, convert_pdf_to_docx]

# ---------------------------------------------------------------------------
# System prompt
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """You are 'CV Buddy', an expert AI career assistant that builds professional CVs through conversation.

RULES:
1. COLLECT one section at a time: personal info → summary → experience → education → skills → certifications → languages.
2. RESPOND in the user's language (English, Urdu, Pashto, Arabic, etc.).
3. ALL data passed to `update_cv_data` tool MUST be in English — translate if needed.
4. Call `update_cv_data` IMMEDIATELY whenever you have new or refined CV data. Do NOT wait.
5. After each update, briefly confirm what changed and ask about the next section.
6. Write strong, action-oriented bullet points for experience descriptions.
7. Keep responses concise — no walls of text. Use markdown formatting.
8. If the user provides a full CV dump, parse ALL sections and call `update_cv_data` with everything at once.

CRITICAL FORMATTING RULES FOR TOOL CALLS:
- **Skills**: MUST be a LIST. If user provides comma-separated skills like "python, java, docker", split them into: ["python", "java", "docker"]
- **Languages**: MUST be a LIST of objects. Each item needs name (required) and optional level. Example: [{"name": "English", "level": "Native"}]
- **Certifications**: MUST be a LIST of objects with name, issuer, and optional date. Example: [{"name": "AWS Solutions Architect", "issuer": "Amazon", "date": "2023"}]
- **Experience & Education**: MUST be LISTS of objects with all required fields.
- NEVER pass comma-separated strings as skills, languages, certifications, experience, or education. Always convert to proper LIST format.
"""

# ---------------------------------------------------------------------------
# Checkpointer — singleton, opened once at startup
# ---------------------------------------------------------------------------
# ✅ Use MemorySaver for conversation history (simpler than SQLite for now)
_checkpointer = MemorySaver()


async def init_checkpointer() -> None:
    """Call once at application startup (inside FastAPI lifespan)."""
    global _checkpointer
    _checkpointer = MemorySaver()
    print("✅ In-memory conversation checkpointer initialized")


async def close_checkpointer() -> None:
    """Call once at application shutdown."""
    global _checkpointer
    _checkpointer = None
    print("✅ Conversation checkpointer closed")


# ---------------------------------------------------------------------------
# Agent — built lazily, cached after first use
# ---------------------------------------------------------------------------
_agent = None


def _build_agent():
    if _checkpointer is None:
        raise RuntimeError(
            "Checkpointer is not initialised. "
            "Call `await init_checkpointer()` at application startup."
        )
    # LangGraph 1.0.x: use prompt= for system prompt.
    return create_react_agent(
        llm,
        TOOLS,
        prompt=SYSTEM_PROMPT,
        checkpointer=_checkpointer,
    )


def _get_agent():
    global _agent
    if _agent is None:
        _agent = _build_agent()
    return _agent


# ---------------------------------------------------------------------------
# Context trimming helper
# ---------------------------------------------------------------------------
def _trim(messages: list, max_tokens: int = 6000) -> list:
    """
    Trims message history to keep context window manageable.
    """
    try:
        return trim_messages(
            messages,
            max_tokens=max_tokens,
            strategy="last",
            token_counter=llm,
            include_system=True,
            allow_partial=False,
            start_on="human",
        )
    except Exception:
        # If trimming fails for any reason, return as-is
        return messages


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

async def get_agent_response(
    user_message: str,
    thread_id: str = "default",
) -> Dict[str, Any]:
    """
    Send a single user message to the agent and return its response.

    Args:
        user_message: Plain-text message from the user.
        thread_id:    Unique conversation ID (one per user/session).

    Returns:
        {
            "reply":     str  — assistant's text response,
            "cv_update": dict — parsed CV payload if update_cv_data was called, else None,
            "download":  str  — download path if a file tool was called, else None,
        }
    """
    agent = _get_agent()
    config = {"configurable": {"thread_id": thread_id}}

    try:
        # 1) Load existing history for the thread
        state_history = await agent.aget_state(config)
        messages = state_history.values.get("messages", []) if state_history.values else []

        # 2) Trim history (prevents unbounded growth / slowness over time)
        trimmed_history = _trim(messages, max_tokens=6000)

        # 3) ✅ Persist trimmed history back into the checkpoint state (best fix)
        # Note: availability depends on LangGraph version.
        try:
            await agent.aupdate_state(config, {"messages": trimmed_history})
        except Exception:
            # If aupdate_state isn't supported, continue without failing.
            # (Long-term performance may still degrade on very long threads.)
            pass

        # 4) Invoke with ONLY the new user message
        state = await agent.ainvoke(
            {"messages": [HumanMessage(content=user_message)]},
            config=config,
        )

    except Exception as exc:
        raise RuntimeError(f"Agent invocation failed (thread={thread_id}): {exc}") from exc

    # Extract the last AI text reply
    ai_messages = [m for m in state["messages"] if isinstance(m, AIMessage)]
    reply_text: str = ai_messages[-1].content if ai_messages else ""

    # Parse CV update and download path from ONLY the last 10 messages
    # (tool outputs from the current turn, not the entire history)
    cv_update: Optional[Dict] = None
    download_path: Optional[str] = None

    recent_messages = state["messages"][-10:]
    for msg in reversed(recent_messages):
        content = getattr(msg, "content", "")
        if not isinstance(content, str):
            continue

        if "CV_UPDATE:" in content and cv_update is None:
            try:
                json_part = content.split("CV_UPDATE:")[1].split(" | ")[0].strip()
                cv_update = json.loads(json_part)
            except (IndexError, json.JSONDecodeError):
                pass

        if "DOWNLOAD_PATH:" in content and download_path is None:
            try:
                download_path = content.split("DOWNLOAD_PATH:")[1].split()[0].strip()
            except IndexError:
                pass

        # Stop early once both are found
        if cv_update is not None and download_path is not None:
            break

    return {
        "reply": reply_text,
        "cv_update": cv_update,
        "download": download_path,
    }
