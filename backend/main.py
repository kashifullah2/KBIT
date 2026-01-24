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
    allow_origins=["*"],  # In production, replace "*" with your specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"), 
    model_name="openai/gpt-oss-120b"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a sentiment analysis assistant. Reply with only one word: Positive, Neutral, or Negative."),
    ("human", "Text: {text}")
])

class TextInput(BaseModel):
    text: str

@app.post("/analyze")
async def analyze_sentiment(data: TextInput):
    # Using async/await keeps the API responsive
    chain = prompt | llm
    result = await chain.ainvoke({"text": data.text})

    return {
        "sentiment": result.content.strip()
    }