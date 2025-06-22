import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

# Set up scopes and service account file
SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]
SERVICE_ACCOUNT_FILE = "credentials.json"  # from Google Cloud

# Create credentials and service
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)

# Connect to calendar API
service = build("calendar", "v3", credentials=credentials)

def get_upcoming_events():
    now = datetime.now(timezone.utc).isoformat()
    events_result = service.events().list(
        calendarId= os.getenv("GOOGLE_CALENDAR_ID"),
        timeMin=now,
        maxResults=10,
        singleEvents=True,
        orderBy="startTime",
    ).execute()
    events = events_result.get("items", [])

    if not events:
        return []

    return [
        {
        "start": event["start"].get("dateTime", event["start"].get("date")),
        "summary": event.get("summary", "No Title")
        }
        for event in events
    ]

# For quick testing in terminal
if __name__ == "__main__":
    upcoming = get_upcoming_events()

    if not upcoming:
        print("No upcoming events found.")
    else:
        for event in upcoming:
            print(event["start"], event["summary"])
