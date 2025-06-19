from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from pydantic import BaseModel
import os
import cohere
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("COHERE_API_KEY")

class ExplainRequest(BaseModel):
    topic: str
    subject: str

client = cohere.Client(api_key)
if not api_key:
    raise ValueError("API key for Cohere is not set.")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allows all origs, adjust as needed for security
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods, adjust as needed for security
    allow_headers=["*"],  # Allows all headers, adjust as needed for security
)

@app.get("/")
def read_root():
    return {"message": "MindPilot backend running!"}

@app.post("/api/explain")
def explain(req: ExplainRequest):
    messages = f"Explain the topic: {req.topic} in the subject of {req.subject} like I'm 10 years old."
    response = client.chat(
        message=messages,
        model="command-r-plus",
        temperature=0.7,
    )
    return { "explanation": response.text }
