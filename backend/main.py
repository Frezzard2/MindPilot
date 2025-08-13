from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import os
import cohere
from dotenv import load_dotenv
from .ai_service import generate_explanation
from .learning_profile import generate_learning_profile
from .ai_service import generate_learning_tips
from pathlib import Path
from typing import List

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

class ProfileRequest(BaseModel):
    answers: List[str]

@router.post("/api/explain")
async def explain_topic(req: ExplainRequest):
    result = generate_explanation(req.topic, req.subject, req.detail)
    return {"explanation": result} 

@router.post("/api/profile")
async def create_profile(req: ProfileRequest):
    profile = generate_learning_profile(req.answers)
    return {"profile": profile}

@router.post("/api/generate-tips")
async def generate_tips(request: Request):
    data = await request.json()
    existing_tips = data.get("existingTips", [])
    new_tips = generate_learning_tips(existing_tips)
    return {"newTips": new_tips}

app.include_router(router)

static_path = Path(__file__).parent / "static"
app.mount("/", StaticFiles(directory=static_path, html=True), name="static")

