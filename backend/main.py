import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import re
import json
from datetime import datetime, timedelta
#from google_calendar.calendar_api import get_upcoming_events

from dotenv import load_dotenv, find_dotenv
import os
from groq import Groq

load_dotenv(find_dotenv())

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
    sex: str
    fitnessLevel: str
    fitnessGoal: str

@app.post("/")
def receive_user_goals(goals: UserGoals):
    print("Received goals:", goals)
    fitness_plan, workout_schedule = call_groq(goals)
    return {
        "message": "Data received successfully", 
        "fitness_plan": fitness_plan,
        "workout_schedule": workout_schedule
    }

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

def parse_workout_schedule(groq_output: str) -> Dict[str, Any]:
    """Parse workout schedule from Groq output"""
    workout_schedule = {}
    
    # Get the current week's Monday
    today = datetime.now()
    start_of_week = today - timedelta(days=today.weekday())
    
    # More specific patterns to match day names and workout descriptions
    day_patterns = [
        r'\b(monday|mon)\s*[:\-]?\s*(.+?)(?=\b(tuesday|tue|wednesday|wed|thursday|thu|friday|fri|saturday|sat|sunday|sun)\b|$)',
        r'\b(tuesday|tue)\s*[:\-]?\s*(.+?)(?=\b(monday|mon|wednesday|wed|thursday|thu|friday|fri|saturday|sat|sunday|sun)\b|$)',
        r'\b(wednesday|wed)\s*[:\-]?\s*(.+?)(?=\b(monday|mon|tuesday|tue|thursday|thu|friday|fri|saturday|sat|sunday|sun)\b|$)',
        r'\b(thursday|thu)\s*[:\-]?\s*(.+?)(?=\b(monday|mon|tuesday|tue|wednesday|wed|friday|fri|saturday|sat|sunday|sun)\b|$)',
        r'\b(friday|fri)\s*[:\-]?\s*(.+?)(?=\b(monday|mon|tuesday|tue|wednesday|wed|thursday|thu|saturday|sat|sunday|sun)\b|$)',
        r'\b(saturday|sat)\s*[:\-]?\s*(.+?)(?=\b(monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|sunday|sun)\b|$)',
        r'\b(sunday|sun)\s*[:\-]?\s*(.+?)(?=\b(monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|saturday|sat)\b|$)',
    ]
    
    # Day mapping
    day_mapping = {
        'monday': 0, 'mon': 0,
        'tuesday': 1, 'tue': 1,
        'wednesday': 2, 'wed': 2,
        'thursday': 3, 'thu': 3,
        'friday': 4, 'fri': 4,
        'saturday': 5, 'sat': 5,
        'sunday': 6, 'sun': 6
    }
    
    def extract_duration(text):
        """Extract duration from text using regex patterns"""
        # Look for duration in parentheses like "(75 minutes)" or "(60 min)"
        duration_patterns = [
            r'\((\d+)\s*(?:minutes?|mins?|min)\)',
            r'(\d+)\s*(?:minutes?|mins?|min)',
            r'\((\d+)\s*min\)',
        ]
        
        for pattern in duration_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                duration_minutes = int(match.group(1))
                return f"{duration_minutes}min"
        
        # Default durations based on workout type
        return "60min"  # Default fallback
    
    def extract_exercises_with_sets_reps(text):
        """Extract exercises with sets and reps from text"""
        exercises = []
        
        # First, try to find exercise lists with commas or line breaks
        # Look for patterns like "Squats: 3 sets x 10 reps, Leg Press: 3 sets x 12 reps"
        exercise_list_patterns = [
            # Pattern for comma-separated exercises with sets/reps
            r'([A-Za-z\s]+(?:Press|Squat|Deadlift|Row|Curl|Extension|Fly|Pull-up|Push-up|Dip|Lunge|Raise|Crunch|Plank|Curls?|Extensions?|Presses?|Flies?|Ups?|Dips?|Lunges?|Raises?|Crunches?|Planks?))\s*:\s*(\d+)\s*(?:sets?|x)\s*(\d+)\s*(?:reps?|repetitions?)(?:\s*per\s*\w+)?',
            # Pattern for exercises with sets/reps separated by commas
            r'([A-Za-z\s]+(?:Press|Squat|Deadlift|Row|Curl|Extension|Fly|Pull-up|Push-up|Dip|Lunge|Raise|Crunch|Plank|Curls?|Extensions?|Presses?|Flies?|Ups?|Dips?|Lunges?|Raises?|Crunches?|Planks?))\s+(\d+)\s*(?:sets?|x)\s*(\d+)\s*(?:reps?|repetitions?)(?:\s*per\s*\w+)?',
            # Pattern for "3x12" format
            r'([A-Za-z\s]+(?:Press|Squat|Deadlift|Row|Curl|Extension|Fly|Pull-up|Push-up|Dip|Lunge|Raise|Crunch|Plank|Curls?|Extensions?|Presses?|Flies?|Ups?|Dips?|Lunges?|Raises?|Crunches?|Planks?))\s+(\d+)x(\d+)',
            # Pattern for "3 12" format (exercise name followed by two numbers)
            r'([A-Za-z\s]+(?:Press|Squat|Deadlift|Row|Curl|Extension|Fly|Pull-up|Push-up|Dip|Lunge|Raise|Crunch|Plank|Curls?|Extensions?|Presses?|Flies?|Ups?|Dips?|Lunges?|Raises?|Crunches?|Planks?))\s+(\d+)\s+(\d+)',
        ]
        
        for pattern in exercise_list_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                exercise_name = match[0].strip().title()
                sets = match[1]
                reps = match[2]
                
                # Clean up exercise name
                exercise_name = re.sub(r'\s+', ' ', exercise_name)  # Remove extra spaces
                
                # Skip if it's too generic
                if len(exercise_name) < 3 or exercise_name.lower() in ['sets', 'reps', 'x', 'and', 'the', 'for', 'per']:
                    continue
                    
                exercises.append(f"{exercise_name}: {sets} sets x {reps} reps")
        
        # If still no exercises found, try more generic patterns
        if not exercises:
            generic_patterns = [
                r'\b(\w+(?:\s+\w+)*)\s*:\s*(\d+)\s*(?:sets?|x)\s*(\d+)\s*(?:reps?|repetitions?)\b',
                r'\b(\w+(?:\s+\w+)*)\s*(\d+)\s*(?:sets?|x)\s*(\d+)\s*(?:reps?|repetitions?)\b',
                r'\b(\w+(?:\s+\w+)*)\s*(\d+)\s*x\s*(\d+)\b',
                r'\b(\w+(?:\s+\w+)*)\s+(\d+)\s+sets?\s+(\d+)\s+reps?\b',
            ]
            
            for pattern in generic_patterns:
                matches = re.findall(pattern, text, re.IGNORECASE)
                for match in matches:
                    exercise_name = match[0].strip().title()
                    sets = match[1]
                    reps = match[2]
                    
                    # Clean up exercise name
                    exercise_name = re.sub(r'\s+', ' ', exercise_name)
                    
                    # Skip if it's too generic
                    if len(exercise_name) < 3 or exercise_name.lower() in ['sets', 'reps', 'x', 'and', 'the', 'for', 'per']:
                        continue
                        
                    exercises.append(f"{exercise_name}: {sets} sets x {reps} reps")
        
        # If no sets/reps found, extract just specific exercise names
        if not exercises:
            # Look for specific exercise names without sets/reps
            specific_exercises = [
                'bench press', 'incline press', 'decline press', 'dumbbell press', 'barbell press',
                'squat', 'squats', 'deadlift', 'deadlifts', 'leg press', 'lunges', 'lunge', 'calf raises', 'calf raise',
                'pull-up', 'pull-ups', 'push-up', 'push-ups', 'dip', 'dips', 'row', 'rows', 'lat pulldown', 'lat pulldowns',
                'bicep curl', 'bicep curls', 'tricep extension', 'tricep extensions', 'shoulder press', 'shoulder presses', 'overhead press', 'overhead presses',
                'chest fly', 'chest flies', 'lateral raise', 'lateral raises', 'front raise', 'front raises', 'rear delt fly', 'rear delt flies',
                'plank', 'planks', 'crunch', 'crunches', 'sit-up', 'sit-ups', 'leg raise', 'leg raises', 'russian twist', 'russian twists',
                'burpee', 'burpees', 'mountain climber', 'mountain climbers', 'jumping jack', 'jumping jacks', 'high knee', 'high knees',
                'leg extension', 'leg extensions', 'leg curl', 'leg curls'
            ]
            
            found_exercises = []
            for exercise in specific_exercises:
                if exercise in text.lower():
                    found_exercises.append(exercise.title())
            
            # Also look for compound exercise patterns
            compound_patterns = [
                r'\b(bench|incline|decline|dumbbell|barbell|machine)\s+(press|squat|row|curl|extension|fly|raise)\b',
                r'\b(pull|push|lat|seated|standing|lying|kneeling)\s+(up|down|press|row|curl|extension)\b',
                r'\b(overhead|shoulder|chest|back|leg|arm|core)\s+(press|squat|row|curl|extension|fly|raise)\b'
            ]
            
            for pattern in compound_patterns:
                matches = re.findall(pattern, text.lower())
                for match in matches:
                    exercise_name = f"{match[0]} {match[1]}".title()
                    if exercise_name not in found_exercises:
                        found_exercises.append(exercise_name)
            
            # Take the first 8 specific exercises found (increased from 5)
            exercises = found_exercises[:8]
            
            # If still no exercises, fall back to generic muscle groups
            if not exercises:
                exercise_names = re.findall(r'\b(chest|bench|squat|deadlift|pull.?up|push.?up|row|overhead|press|shoulder|bicep|tricep|leg|back|core|abs|lunges?|lunge|calf|raises?|raise|curls?|curl|presses?|press|dips?|dip|flyes?|fly|incline|decline|lat|pulldown|seated|standing|dumbbell|barbell|machine|extension|extensions)\b', text.lower())
                exercises = [ex.title() for ex in exercise_names[:8]]
        
        # Deduplicate exercises to remove singular/plural duplicates
        def normalize_exercise_name(exercise):
            """Normalize exercise name to remove singular/plural variations"""
            name_part = exercise.split(':')[0].strip().lower()
            # Remove common plural endings
            if name_part.endswith('s'):
                name_part = name_part[:-1]
            return name_part
        
        # Deduplicate exercises
        seen_exercises = set()
        deduplicated_exercises = []
        
        for exercise in exercises:
            normalized_name = normalize_exercise_name(exercise)
            if normalized_name not in seen_exercises:
                seen_exercises.add(normalized_name)
                deduplicated_exercises.append(exercise)
        
        return deduplicated_exercises
    
    def get_workout_name(text):
        """Generate a specific workout name based on muscle groups mentioned"""
        text_lower = text.lower()
        
        # Look for specific workout name patterns first - more specific patterns
        workout_name_patterns = [
            r'\b(chest\s*&\s*triceps?|chest\s*and\s*triceps?)\b',
            r'\b(back\s*&\s*biceps?|back\s*and\s*biceps?)\b',
            r'\b(shoulders?\s*&\s*arms?|shoulders?\s*and\s*arms?)\b',
            r'\b(legs?\s*day|leg\s*workout)\b',
            r'\b(core\s*&\s*abs?|core\s*and\s*abs?)\b',
            r'\b(full\s*body|total\s*body)\b',
            r'\b(upper\s*body|lower\s*body)\b',
            r'\b(push\s*day|pull\s*day)\b',
        ]
        
        for pattern in workout_name_patterns:
            match = re.search(pattern, text_lower)
            if match:
                return match.group(1).title()
        
        # Look for specific workout mentions
        if 'chest' in text_lower and 'tricep' in text_lower:
            return "Chest & Triceps"
        elif 'back' in text_lower and 'bicep' in text_lower:
            return "Back & Biceps"
        elif 'shoulder' in text_lower or 'deltoid' in text_lower:
            return "Shoulders & Arms"
        elif 'leg' in text_lower or 'squat' in text_lower or 'deadlift' in text_lower:
            return "Legs"
        elif 'core' in text_lower or 'abs' in text_lower:
            return "Core & Abs"
        elif 'full body' in text_lower or 'total body' in text_lower:
            return "Full Body"
        elif 'chest' in text_lower:
            return "Chest"
        elif 'back' in text_lower:
            return "Back"
        elif 'cardio' in text_lower or 'hiit' in text_lower:
            return "Cardio"
        else:
            return "Strength Training"
    
    # Process each day pattern
    for pattern in day_patterns:
        matches = re.findall(pattern, groq_output.lower(), re.DOTALL | re.IGNORECASE)
        for match in matches:
            day_name = match[0]
            workout_desc = match[1].strip()
            
            # Skip if no workout description
            if not workout_desc or len(workout_desc) < 10:
                continue
            
            # Calculate the date for this day
            day_index = day_mapping.get(day_name.lower(), 0)
            day_date = start_of_week + timedelta(days=day_index)
            date_str = day_date.strftime("%Y-%m-%d")
            
            # Extract duration from the workout description
            duration = extract_duration(workout_desc)
            
            # Determine workout type and details
            workout_type = "Rest"
            exercises = []
            workout_name = "Rest Day"
            
            # Check if it's a rest day
            rest_patterns = [
                r'\b(rest|recovery|off|break|stretch|yoga|flexibility)\b',
                r'\b(active recovery|mobility|rest day)\b'
            ]
            
            if any(re.search(rest_pattern, workout_desc.lower()) for rest_pattern in rest_patterns):
                workout_type = "Rest"
                exercises = ["Active Recovery", "Stretching"]
                workout_name = "Rest & Recovery"
                # For rest days, set duration to 0 if not specified
                if duration == "60min":  # Default fallback
                    duration = "0min"
            # Check if it's strength training
            else:
                strength_patterns = [
                    r'\b(chest|bench|squat|deadlift|pull.?up|push.?up|row|overhead|press|shoulder|bicep|tricep|leg|back|core|abs)\b',
                    r'\b(strength|weight|lifting|muscle|power)\b'
                ]
                
                if any(re.search(strength_pattern, workout_desc.lower()) for strength_pattern in strength_patterns):
                    workout_type = "Strength"
                    workout_name = get_workout_name(workout_desc)
                    exercises = extract_exercises_with_sets_reps(workout_desc)
                    if not exercises:
                        # Try to extract exercises from the full description
                        full_desc = workout_desc + " " + groq_output.lower()
                        exercises = extract_exercises_with_sets_reps(full_desc)
                        if not exercises:
                            exercises = ["Strength Training", "Compound Movements"]
                # Check if it's cardio
                else:
                    cardio_patterns = [
                        r'\b(run|jog|cardio|hiit|cycling|bike|jump|rope|sprint|endurance|aerobic)\b',
                        r'\b(treadmill|elliptical|rowing|swimming)\b'
                    ]
                    
                    if any(re.search(cardio_pattern, workout_desc.lower()) for cardio_pattern in cardio_patterns):
                        workout_type = "Cardio"
                        workout_name = "Cardio"
                        exercise_matches = re.findall(r'\b(run|jog|cardio|hiit|cycling|bike|jump|rope|sprint|treadmill|elliptical|rowing|swimming)\b', workout_desc.lower())
                        exercises = [ex.title() for ex in exercise_matches[:3]]
                        if not exercises:
                            exercises = ["Cardio Training", "Endurance Work"]
                    # If no specific type detected, default to strength
                    else:
                        workout_type = "Strength"
                        workout_name = get_workout_name(workout_desc)
                        exercises = extract_exercises_with_sets_reps(workout_desc)
                        if not exercises:
                            # Try to extract exercises from the full description
                            full_desc = workout_desc + " " + groq_output.lower()
                            exercises = extract_exercises_with_sets_reps(full_desc)
                            if not exercises:
                                exercises = ["General Training", "Fitness Workout"]
            
            # Add to schedule
            workout_schedule[date_str] = {
                "type": workout_type,
                "name": workout_name,
                "duration": duration,
                "exercises": exercises,
                "description": workout_desc
            }
    
    return workout_schedule

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
                "content": "You are a personal fitness trainer, but talk like a gym bro. When creating workout plans, be very specific about which days of the week each workout happens on. Use clear day names like Monday, Tuesday, etc. For each workout, specify the exact exercises with sets and reps in this format: 'Exercise Name: X sets x Y reps'. For example: 'Bench Press: 3 sets x 12 reps', 'Squats: 4 sets x 10 reps'. Be specific about muscle groups like 'Chest & Triceps', 'Back & Biceps', 'Legs', etc. Always start each day with the day name followed by a colon, like 'Monday: Chest & Triceps workout' and then list the specific exercises. IMPORTANT: For each workout day, include the estimated duration in minutes. Format each day like this: 'Monday: Chest & Triceps workout (75 minutes) - Bench Press: 3 sets x 12 reps, Incline Dumbbell Press: 3 sets x 10 reps'. Include realistic durations: 60-90 minutes for strength training, 30-60 minutes for cardio, 20-30 minutes for active recovery."
            },
            # Set a user message for the assistant to respond to.
            {
                "role": "user",
                "content": f"Create a one week fitness plan, including diet, and a workout split. For the sample meal plan, include some snacks you can easily buy at the grocery store, like specific protein bars. The inputted weight is in pounds, and height is in inches. Given name: {goals.name}, age: {goals.age}, current weight (lb): {goals.weight}, height (in): {goals.height}, sex: {goals.sex}, fitness level: {goals.fitnessLevel}, and primary fitness goal: {goals.fitnessGoal}. Make sure to clearly specify which workout happens on which day of the week (Monday, Tuesday, Wednesday, etc.). For each workout day, list the specific exercises with sets and reps like this: 'Bench Press: 3 sets x 12 reps'. Be specific about muscle groups - say 'Chest & Triceps' instead of just 'strength training'. IMPORTANT: Include the estimated duration in minutes for each workout day. Format each day like this: 'Monday: Chest & Triceps workout (75 minutes) - Bench Press: 3 sets x 12 reps, Incline Dumbbell Press: 3 sets x 10 reps'. For rest days, you can say 'Rest day (0 minutes)' or 'Active Recovery (30 minutes)'."
            }
        ],

        # The language model which will generate the completion.
        model="llama-3.3-70b-versatile",
        temperature=0.5,
        max_completion_tokens=1024,
        top_p=0.9
    )

    # Get the raw fitness plan
    fitness_plan = chat_completion.choices[0].message.content
    
    # Debug output
    print("=== RAW GROQ OUTPUT ===")
    print(fitness_plan)
    print("=======================")
    
    # Parse the workout schedule from the fitness plan
    workout_schedule = parse_workout_schedule(fitness_plan)
    
    # Debug output
    print("=== PARSED WORKOUT SCHEDULE ===")
    for date, workout in workout_schedule.items():
        print(f"{date}: {workout}")
    print("================================")
    
    return fitness_plan, workout_schedule

@app.get("/events")
def read_calendar_events():
    events = get_upcoming_events()
    return {"events": events}
