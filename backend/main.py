import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List




app  = FastAPI(
    title="Healthbru",
    description="Backend API for our collaborative project.",
    version="1.0.0"
)

origins = [
    "https://localhost:3000" 
]



app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to the team API!"}

