import os
import cohere
from dotenv import load_dotenv

load_dotenv()

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.Client(COHERE_API_KEY)

def generate_explanation(topic: str, subject: str, detail: str) -> str:
    prompt = (
        f"Explain the following {subject} topic in a {detail} \n"
        f"Topic: {topic}\n"
        f"Explanation:"
    )

    try: 
        response = co.generate(
            model="command-r-plus",
            prompt=prompt,
            max_tokens=500,
            temperature=0.7,
        )
        return response.generations[0].text.strip()
    except Exception as e:
        print(f"Error generating explanation: {e}")
        return "An error occurred while generating the explanation."

def generate_learning_tips(existing_tips=None):
    if existing_tips is None:
        existing_tips = []
    
    prompt = f"You are an AI tutor. Suggest 5 new, short, and practical learning tips. Make sure they are different from these existing tips: {existing_tips}. Each tip should be concise and actionable. Respond in plain text, one tip per line."

    try:
        response = co.generate(
            model="command-r-plus",
            prompt=prompt,
            max_tokens=300,
            temperature=0.7,
        )
        tips_text = response.generations[0].text.strip()
        tips_list = [tip.strip("-• ") for tip in tips_text.split("\n") if tip.strip()]
        
        return tips_list
    except Exception as e:
        print(f"Error generating learning tips: {e}")
        return [
            "Break down complex topics into smaller, manageable chunks",
            "Use active recall techniques like flashcards or self-quizzing",
            "Teach the concept to someone else to reinforce your understanding",
            "Take regular breaks to maintain focus and prevent burnout",
            "Connect new information to things you already know"
        ]