from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, Form, HTTPException, APIRouter
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from .ai_service import generate_explanation, generate_explanation_from_notes
from .learning_profile import generate_learning_profile
from .ai_service import generate_learning_tips
from pathlib import Path

from openai import OpenAI

load_dotenv()

router = APIRouter()

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

@router.post("/api/explain-from-notes")
async def explain_from_notes(
    subject: Optional[str] = Form("general"),
    detail_level: str = Form("normal"),
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    content = None
    if file is not None:
        if file.content_type not in ["text/plain", "application/octet-stream"]:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a .txt file.")
        
        # Check file size (limit to 1MB)
        raw = await file.read()
        if len(raw) > 1024 * 1024:  # 1MB limit
            raise HTTPException(status_code=400, detail="File too large. Please upload a file smaller than 1MB.")
        
        try:
            content = raw.decode("utf-8", errors="ignore").strip()
        except Exception:
            raise HTTPException(status_code=400, detail="Failed to decode file content. Please ensure the file is a valid text file.")
    elif text is not None:
        content = (text or "").strip()

    if not content:
        raise HTTPException(status_code=400, detail="No content provided.")
    
    try:
        result = generate_explanation_from_notes(subject, detail_level, content)
        return {"explanation": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating explanation: {str(e)}")

@router.post("/api/profile")
async def create_profile(req: ProfileRequest):
    profile = generate_learning_profile(req.answers)
    return {"profile": profile}

@router.get("/api/generate-tips")
async def generate_tips():
    tips = generate_learning_tips()
    return {"tips": tips}

app.include_router(router)

static_path = Path(__file__).parent / "static"
app.mount("/", StaticFiles(directory=static_path, html=True), name="static")

