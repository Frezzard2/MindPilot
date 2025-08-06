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