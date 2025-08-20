import os
from openai import OpenAI
from dotenv import load_dotenv
import json
from typing import List, Dict, Any, Optional

load_dotenv()

def get_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=api_key)

def safe_parse_ai_response(content: str):
    """
    Safely parse AI response, handling both JSON arrays and regular text.
    Returns the parsed content or the original content if parsing fails.
    """
    content = content.strip()
    
    # Try to parse as JSON array
    try:
        parsed = json.loads(content)
        if isinstance(parsed, list):
            return parsed
    except json.JSONDecodeError:
        pass
    
    # If it's not a valid JSON array, return as is
    return content

def generate_explanation(topic: str, subject: str, detail:str) -> str:
    if detail == "simple":
        tone = "Explain it like I'm five years old, with simple words and examples."
    elif detail == "detailed":
        tone = "Provide an in-depth and detailed explanation with structure, headings and examples."
    elif detail == "summary":
        tone = "Provide a concise summary with only key points and takeaways."
    else:
        tone = "Give a clear and understandable explanation with short structure."

    prompt = (
        f"Subject: {subject}\n"
        f"Instruction: {tone}\n\n"
        f"Task: Explain the following topic in markdown format:\n"
        f"-----\n"
        f"{topic}\n"
        f"-----\n"
    )

    client = get_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful study assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    content = response.choices[0].message.content.strip()
    return safe_parse_ai_response(content)

def generate_explanation_from_notes(subject: str, detail_level: str, notes: str) -> str:
    if detail_level == "simple":
        tone = "Explain it like I'm five years old, with simple words and examples."
    elif detail_level == "detailed":
        tone = "Provide an in-depth and detailed explanation with structure, headings and examples."
    elif detail_level == "summary":
        tone = "Provide a concise summary with only key points and takeaways."
    else:
        tone = "Give a clear and understandable explanation with short structure."

    prompt = (
        f"Subject: {subject}\n"
        f"Instruction: {tone}\n\n"
        f"These are the student's notes:\n"
        f"-----\n"
        f"{notes}\n"
        f"-----\n\n"
        f"Task: Turn these notes into a well-structured explanation in markdown."
        f"Use short sections with headings, bullet points, key takeaways, and examples where appropriate."
        f"Keep it concise and focused on the main points. And be understandable."
    )

    client = get_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful study assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    content = response.choices[0].message.content.strip()
    return safe_parse_ai_response(content)

def generate_learning_tips() -> str:
    prompt = (
        "Generate exactly 5 practical and effective study tips for students. "
        "Return ONLY a JSON array of 5 strings, each containing one tip. "
        "Do NOT include any markdown formatting, code blocks, or extra text. "
        "Return ONLY the array like this: [\"tip1\", \"tip2\", \"tip3\", \"tip4\", \"tip5\"]"
    )

    client = get_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful study assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    content = response.choices[0].message.content.strip()
    return safe_parse_ai_response(content)

def generate_adaptive_learning_profile(answers: List[str], locale: str = "en") -> Dict[str, Any]:
    answer_lines = [f"{i + 1}. {str(a)}" for i, a in enumerate(answers)]

    system_prompt = {
        "en": (
            "You are a learning science coach. Generate a concise, structured learning profile "
            "from the user's multiple-choice and 1-10 scale answers. Keep it practical and actionable. "
        )
    }.get(locale, "You are a learning science coach.")

    user_prompt = (
        f"Answers (ordered):\n" +
        "\n".join(answer_lines) +
        "\n\nReturn STRICT JSON with keys: \n"
        "{\n"
        '  "styleType": "Visual | Auditory | Text-Based | Kinesthetic | Mixed",\n'
        '  "confidence": 0.0-1.0,\n'
        '  "strengths": [string, ...],\n'
        '  "challenges": [string, ...],\n'
        '  "preferredModalities": [ "reading", "listening", "visuals", "practice", ... ],\n'
        '  "studyTactics": [string, ...],\n'
        '  "scheduleHints": [string, ...],\n'
        '  "motivationStyle": "short description",\n'
        '  "focusEnvironment": [string, ...],\n'
        '  "readingLevelHint": "short description",\n'
        '  "version": "v1"\n'
        "}\n"
        "No commentary, no markdown, only valid JSON."
    )

    completion = get_client().chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        temperature=0.3,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
    )

    raw = completion.choices[0].message.content
    try:
        data = json.loads(raw)
    except Exception:
        data = {
            "styleType": "Mixed",
            "confidence": 0.5,
            "strengths": [],
            "challenges": [],
            "preferredModalities": [],
            "studyTactics": [],
            "scheduleHints": [],
            "motivationStyle": "-",
            "focusEnvironment": [],
            "readingLevelHint": "-",
            "version": "v1"
        }
    return data
