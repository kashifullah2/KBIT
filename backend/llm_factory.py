import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_llm():
    """
    Returns an LLM instance with automatic fallback.
    Primary: Groq (Llama-3.3-70b)
    Fallback: OpenRouter (Gemini 2.0 Flash Lite Free)
    """
    llm_primary = None
    llm_fallback = None

    # 1. Initialize Groq (Primary)
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        try:
            from langchain_groq import ChatGroq
            llm_primary = ChatGroq(
                groq_api_key=groq_key,
                model_name="llama-3.3-70b-versatile",
                temperature=0.7
            )
            logger.info("Groq initialized (Primary).")
        except Exception as e:
            logger.error(f"Failed to initialize Groq: {e}")

    # 2. Initialize OpenRouter (Fallback)
    # Check for both possible environment variable names
    openrouter_key = os.getenv("OPENROUTER_API_KEY") or os.getenv("open_router")
    
    if openrouter_key:
        try:
            from langchain_openai import ChatOpenAI
            llm_fallback = ChatOpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=openrouter_key,
                model="google/gemini-2.0-flash-lite-preview-02-05:free",
                temperature=0.7
            )
            logger.info("OpenRouter initialized (Fallback).")
        except Exception as e:
            logger.error(f"Failed to initialize OpenRouter: {e}")

    # 3. Construct Fallback Mechanism
    if llm_primary and llm_fallback:
        logger.info("Configuring LLM with automatic fallback: Groq -> OpenRouter")
        return llm_primary.with_fallbacks([llm_fallback])
    elif llm_primary:
        logger.info("Using only Groq (No fallback available).")
        return llm_primary
    elif llm_fallback:
        logger.info("Using only OpenRouter (Groq not available).")
        return llm_fallback
    else:
        raise ValueError("No valid LLM API keys found. Please set GROQ_API_KEY or OPENROUTER_API_KEY in .env.")
