from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, Form, HTTPException, APIRouter
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from ai_service import generate_explanation
from learning_profile import generate_learning_profile
from ai_service import generate_learning_tips
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
    
    if detail_level == "simple":
        tone = "Explain like I'm five years old. Use simple words and examples."
    elif detail_level == "detailed":
        tone = "Provide an in-depth and detailed explanation with a clear structure, headings and examples."
    elif detail_level == "summary":
        tone = "Provide a concise summary with key points and main takeaways."
    else:
        tone = "Give a clear and understandable explanation with brief structure."

    prompt = (
        f"Subject: {subject}\n"
        f"Instruction: {tone}\n\n"
        f"These are the student's notes:\n"
        f"-----\n"
        f"{content}\n"
        f"-----\n\n"
        f"Task: Turn these notes into a well-structured explanation in markdown."
        f"Use short sections with headings, bullet points, key takeaways, and examples where appropriate."
        f"Keep it concise and focused on the main points. And be understandable."
    )

    try:
        from ai_service import get_client
        client = get_client()
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful study assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
        return {"explanation": response.choices[0].message.content}
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

