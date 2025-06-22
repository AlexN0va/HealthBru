import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
#from google_calendar.calendar_api import get_upcoming_events

from dotenv import load_dotenv
import os
from groq import Groq

load_dotenv()

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
    call_groq(goals)
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


def call_groq(goals: UserGoals):
    # groq
    client = Groq(
        api_key = os.getenv("GROQ_API_KEY")
    )

    chat_completion = client.chat.completions.create(
        messages=[
            # Set an optional system message. This sets the behavior of the
            # assistant and can be used to provide specific instructions for
            # how it should behave throughout the conversation.
            {
                "role": "system",
                "content": "You are a personal fitness trainer, but talk with gen z slang."
            },
            # Set a user message for the assistant to respond to.
            {
                "role": "user",
                "content": f"Create a one week fitness plan, including diet, and a workout split. For the sample meal plan, include some snacks you can easily buy at the grocery store, like specific protein bars. The inputted weight is in pounds, and height is in inches. Given name: {goals.name}, age: {goals.age}, current weight (lb): {goals.weight}, height (in): {goals.height}, sex: male, fitness level: advanced, and primary fitness goal: {goals.fitnessGoal}."
            }
        ],

        # The language model which will generate the completion.
        model="llama-3.3-70b-versatile",
        temperature=0.5,
        max_completion_tokens=1024,
        top_p=0.9
    )

    # Print the completion returned by the LLM.
    print(chat_completion.choices[0].message.content)


@app.get("/events")
def read_calendar_events():
    events = get_upcoming_events()
    return {"events": events}
