from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, Form, HTTPException, APIRouter
from pydantic import BaseModel
from typing import Optional, List, Any, Dict
import os
from dotenv import load_dotenv
from .ai_service import generate_explanation, generate_explanation_from_notes
from .ai_service import generate_adaptive_learning_profile
from .ai_service import generate_learning_tips
from pathlib import Path
import json

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
    profile: Optional[Dict[str, Any]] = None

class GenerateProfileRequest(BaseModel):
    answers: List[Any]
    locale: Optional[str] = "en"

@router.post("/api/explain")
async def explain_topic(req: ExplainRequest):
    result = generate_explanation(req.topic, req.subject, req.detail, req.profile)
    return {"explanation": result}

@router.post("/api/explain-from-notes")
async def explain_from_notes(
    subject: Optional[str] = Form("general"),
    detail_level: str = Form("normal"),
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    profile: Optional[str] = Form(None)
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

    # Parse optional profile JSON string
    profile_obj: Optional[Dict[str, Any]] = None
    if profile:
        try:
            profile_obj = json.loads(profile)
        except Exception:
            profile_obj = None

    try:
        result = generate_explanation_from_notes(subject, detail_level, content, profile_obj)
        return {"explanation": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating explanation: {str(e)}")

# Removed legacy /api/profile endpoint that referenced undefined ProfileRequest

@router.get("/api/generate-tips")
async def generate_tips():
    tips = generate_learning_tips()
    return {"tips": tips}

@router.post("/api/profile/generate")
def api_generate_profile(req: GenerateProfileRequest):
    profile = generate_adaptive_learning_profile(req.answers, req.locale or "en")
    return {"profile": profile}

app.include_router(router)

static_path = Path(__file__).parent / "static"
app.mount("/", StaticFiles(directory=static_path, html=True), name="static")

