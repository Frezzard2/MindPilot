import cohere
import os

api_key = os.getenv("COHERE_API_KEY")
client = cohere.Client(api_key)

def generate_learning_profile(answers: list[str]) -> str:
    prompt = "Based on the following answers, generate a brief learning profile:\n"
    for idx, answer in enumerate(answers, start=1):
        prompt += f"{idx}. {answer}\n"
    prompt += "\nLearning Profile:"

    response = client.generate(
        prompt=prompt,
        model="command-r-plus",
        max_tokens=300,
        temperature=0.6,
    )
    return response.generations[0].text.strip()