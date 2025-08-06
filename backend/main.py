from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import os
import cohere
from dotenv import load_dotenv
from ai_service import generate_explanation
from pathlib import Path

load_dotenv()

router = APIRouter()

api_key = os.getenv("COHERE_API_KEY")
if not api_key:
    raise ValueError("API key for Cohere is not set.")

client = cohere.Client(api_key)

app = FastAPI()

# CORS engedélyezése a frontend számára
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request modell, subject opcionálissá téve
class ExplainRequest(BaseModel):
    topic: str
    subject: Optional[str] = "general"
    detail: str

@router.post("/api/explain")
async def explain_topic(req: ExplainRequest):
    result = generate_explanation(req.topic, req.subject, req.detail)
    return {"explanation": result} 

app.include_router(router)
static_path = Path(__file__).parent / "static"
app.mount("/", StaticFiles(directory=static_path, html=True), name="static")

