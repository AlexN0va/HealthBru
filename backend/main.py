import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from google_calendar.calendar_api import get_upcoming_events




app  = FastAPI(
    title="Healthbru",
    description="Backend API for our collaborative project.",
    version="1.0.0"
)

origins = [
    "http://localhost:5173" 
]

# Define the expected request body
class UserGoals(BaseModel):
    name: str
    age: int
    weight: int
    height: int
    fitnessGoal: str

@app.post("/")
def receive_user_goals(goals: UserGoals):
    print("Received goals:", goals)
    return {"message": "Data received successfully"}

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

@app.get("/events")
def read_calendar_events():
    events = get_upcoming_events()
    return {"events": events}