import openai
import os

def get_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    return openai.OpenAI(api_key=api_key)

def generate_learning_profile(answers: list[str]) -> str:
    user_content = "Based on the following answers, generate a brief learning profile:\n"
    for idx, answer in enumerate(answers, start=1):
        user_content += f"{idx}. {answer}\n"
    user_content += "\nLearning Profile:"

    client = get_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.6,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant that generates a brief learning profile based on a list of answers provided by the user."
                ),
            },
            {
                "role": "user",
                "content": user_content,
            },
        ],
        max_tokens=300,
    )
    return response.choices[0].message.content.strip()