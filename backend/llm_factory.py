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
    Returns an LLM instance with a robust multi-tier fallback chain.
    Tier 1: Groq (Primary)
    Tier 2: Google Gemini (Native)
    Tier 3: OpenRouter (Stability Backup)
    Tier 4: OpenRouter Free Pool (Extreme Resilience)
    """
    fallback_chain = []

    # --- TIER 1: GROQ (Primary) ---
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        try:
            from langchain_groq import ChatGroq
            # Primary Llama 3.3
            fallback_chain.append(ChatGroq(
                groq_api_key=groq_key,
                model_name="llama-3.3-70b-versatile",
                temperature=0.7,
                max_retries=1
            ))
            # Secondary Qwen 2.5 (High Performance)
            fallback_chain.append(ChatGroq(
                groq_api_key=groq_key,
                model_name="qwen-2.5-32b",
                temperature=0.7,
                max_retries=1
            ))
            logger.info("Tier 1 (Groq Models) added to chain.")
        except Exception as e:
            logger.error(f"Failed to load Tier 1: {e}")

    # --- TIER 2: GOOGLE GEMINI (Native) ---
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            fallback_chain.append(ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=gemini_key,
                temperature=0.7
            ))
            logger.info("Tier 2 (Gemini Flash) added to chain.")
        except Exception as e:
            logger.error(f"Failed to load Tier 2: {e}")

    # --- TIER 3 & 4: OPENROUTER ---
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    if openrouter_key:
        try:
            from langchain_openai import ChatOpenAI
            # Tier 3 (Stable Paid Fallback)
            fallback_chain.append(ChatOpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=openrouter_key,
                model="google/gemini-2.0-flash-lite-001",
                temperature=0.7,
                default_headers={"HTTP-Referer": "https://cv-buddy.ai", "X-Title": "CV Buddy"}
            ))
            
            # Tier 4 (Power Free Pool & Specific User Requests)
            user_requested_models = [
                "meta-llama/llama-3.3-70b-instruct:free",
                "qwen/qwen-2.5-32b-instruct",
                "meta-llama/llama-4-scout", # Advanced Scout model
                "nousresearch/hermes-3-llama-3.1-405b:free",
                "arcee-ai/trinity-large-preview:free",
                "openai/gpt-oss-120b:free"
            ]
            
            for model_id in user_requested_models:
                fallback_chain.append(ChatOpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=openrouter_key,
                    model=model_id,
                    temperature=0.7,
                    default_headers={"HTTP-Referer": "https://cv-buddy.ai", "X-Title": "CV Buddy"}
                ))
            
            logger.info(f"OpenRouter Tiers added to chain ({len(user_requested_models) + 1} models).")
        except Exception as e:
            logger.error(f"Failed to load OpenRouter Tiers: {e}")

    if not fallback_chain:
        raise ValueError("No valid LLM API keys found. Please set GROQ_API_KEY, GEMINI_API_KEY, or OPENROUTER_API_KEY.")

    if len(fallback_chain) == 1:
        logger.info(f"Using single model: {fallback_chain[0].model_name if hasattr(fallback_chain[0], 'model_name') else 'LLM'}")
        return fallback_chain[0]
    
    logger.info(f"Configuring LLM with {len(fallback_chain)} fallback stages.")
    # The first model is the primary, the rest are fallbacks
    primary = fallback_chain[0]
    return primary.with_fallbacks(fallback_chain[1:])
