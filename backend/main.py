from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import cohere
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("COHERE_API_KEY")
if not api_key:
    raise ValueError("API key for Cohere is not set.")

client = cohere.Client(api_key)

app = FastAPI()

# CORS engedélyezése a frontend számára
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request modell, subject opcionálissá téve
class ExplainRequest(BaseModel):
    topic: str
    subject: Optional[str] = "general"

@app.get("/")
def read_root():
    return {"message": "MindPilot backend running!"}

@app.post("/api/explain")
def explain(req: ExplainRequest):
    prompt = f"Explain the topic: {req.topic} in the subject of {req.subject or 'general'} like I'm 10 years old."
    response = client.chat(
        message=prompt,
        model="command-r-plus",
        temperature=0.7,
    )
    return {"explanation": response.text}
