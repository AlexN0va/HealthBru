import os

from groq import Groq

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
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
            "content": "Create a one week fitness plan, including diet, and a workout split. For the sample meal plan, include some snacks you can easily buy at the grocery store, like specific protein bars. The inputted weight is in pounds, and height is in inches. Given age: 19, current weight (lb): 170, height (in): 67 (5'7), sex: male, fitness level: advanced, and primary fitness goal: to bulk and gain muscle. Make sure to clearly specify which workout happens on which day of the week (Monday, Tuesday, Wednesday, etc.). For each workout day, list the specific exercises with sets and reps like this: 'Bench Press: 3 sets x 12 reps'. Be specific about muscle groups - say 'Chest & Triceps' instead of just 'strength training'. IMPORTANT: Include the estimated duration in minutes for each workout day. Format each day like this: 'Monday: Chest & Triceps workout (75 minutes) - Bench Press: 3 sets x 12 reps, Incline Dumbbell Press: 3 sets x 10 reps'. For rest days, you can say 'Rest day (0 minutes)' or 'Active Recovery (30 minutes)'."
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