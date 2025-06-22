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
            "content": "You are a personal fitness trainer."
        },
        # Set a user message for the assistant to respond to.
        {
            "role": "user",
            "content": "Create a one week fitness plan, including diet, and a workout split. For the sample meal plan, include some snacks you can easily buy at the grocery store, like specific protein bars. The inputted weight is in pounds, and height is in feet and inches. Given age: 19, current weight (lb): 170, height (ft): 5'8, sex: male, fitness level: advanced, and primary fitness goal: to bulk and gain muscle."
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