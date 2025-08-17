import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def get_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=api_key)

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

    return response.choices[0].message.content.strip()

def generate_explanation_from_notes(subject: str, detail: str, notes: str) -> str:
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

    return response.choices[0].message.content.strip()

def generate_learning_tips() -> str:
    prompt = (
        "Generate a list of 5 practical and effective study tips for students. "
        "Each tip should be concise, actionable, and easy to understand. "
        "Focus on techniques that improve learning efficiency and retention."
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

    return response.choices[0].message.content.strip()