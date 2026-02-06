import os
from dotenv import load_dotenv
from llm_factory import get_llm
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq

# Load environment variables
load_dotenv()

print("Testing LLM Configuration...")
print(f"OPENROUTER_API_KEY present: {bool(os.getenv('OPENROUTER_API_KEY'))}")
print(f"GROQ_API_KEY present: {bool(os.getenv('GROQ_API_KEY'))}")

try:
    llm = get_llm()
    
    if isinstance(llm, ChatOpenAI):
        print("\n✅ initialized with OpenRouter (ChatOpenAI)")
        print(f"Base URL: {llm.base_url}")
        print(f"Model: {llm.model_name}")
    elif isinstance(llm, ChatGroq):
        print("\n✅ initialized with Groq (ChatGroq)")
        print(f"Model: {llm.model_name}")
    else:
        print(f"\n⚠️ initialized with unknown type: {type(llm)}")

    print("\nAttempting simple invocation...")
    response = llm.invoke("Say 'Hello, World!'")
    print("\nResponse:")
    print(response.content)
    print("\n✅ Test Complete!")

except Exception as e:
    print(f"\n❌ Test Failed: {e}")
