from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allows all origs, adjust as needed for security
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods, adjust as needed for security
    allow_headers=["*"],  # Allows all headers, adjust as needed for security
)

@app.get("/")
def read_root():
    return {"message": "MindPilot backend running!"}