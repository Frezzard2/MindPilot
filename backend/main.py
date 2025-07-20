from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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
    detail: str

@app.get("/")
def read_root():
    return {"message": "MindPilot backend running!"}

@app.post("/api/explain")
def explain(req: ExplainRequest):
    if req.detail == "simple":
        tone = "Explain like I'm 10 years old. Use simple words and examples."
    elif req.detail == "detailed":
        tone = "Provide an in-depth and detailed explanation with clear structure and elaboration."
    else:
        tone = "Give a clear and understandable explanation"

    messages = f"Topic: {req.topic}\nSubject: {req.subject}\nInstruction: {tone}"
    response = client.chat(
        message=messages,
        model="command-r-plus",
        temperature=0.7,
    )
    return {"explanation": response.text}

app.mount("/", StaticFiles(directory="static", html=True), name="static")

