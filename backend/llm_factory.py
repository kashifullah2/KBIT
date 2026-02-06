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
    Returns an LLM instance based on available API keys.
    Priority:
    1. OpenRouter (using ChatOpenAI)
    2. Groq (using ChatGroq)
    """
    
    # 1. Try OpenRouter first
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    if openrouter_key:
        try:
            from langchain_openai import ChatOpenAI
            logger.info("Initializing LLM with OpenRouter...")
            
            return ChatOpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=openrouter_key,
                model="google/gemini-2.0-flash-lite-preview-02-05:free", # Cost-effective default
                temperature=0.7
            )
        except ImportError:
            logger.error("langchain-openai not installed. Skipping OpenRouter.")
        except Exception as e:
            logger.error(f"Failed to initialize OpenRouter: {e}")

    # 2. Fallback to Groq
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        try:
            from langchain_groq import ChatGroq
            logger.info("Initializing LLM with Groq...")
            
            return ChatGroq(
                groq_api_key=groq_key,
                model_name="llama-3.3-70b-versatile",
                temperature=0.7
            )
        except ImportError:
            logger.error("langchain-groq not installed. Skipping Groq.")
        except Exception as e:
            logger.error(f"Failed to initialize Groq: {e}")

    raise ValueError("No valid LLM API keys found. Please set OPENROUTER_API_KEY or GROQ_API_KEY in .env file.")
