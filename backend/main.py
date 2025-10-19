from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from datetime import datetime
from typing import List, Dict, Any
from perplexity import Perplexity
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import random
from urllib.parse import quote
import webbrowser

load_dotenv()

app = FastAPI(title="The Aggie Map API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TAMUFacilityTracker:
    """Track TAMU recreation facilities, libraries, and upcoming events."""

    def __init__(self):
        self.rec_api = (
            "https://goboardapi.azurewebsites.net/api/FacilityCount/"
            "GetCountsByAccount?AccountAPIKey=99563b55-ae4f-4001-b384-648e0ebeaeb5"
        )
        self.library_api = "https://php.library.tamu.edu/utilities/occupancy/index.php"
        self.events_api = (
            "https://calendar.tamu.edu/live/json/events?"
            "user_tz=America/Chicago&group=* Main University Calendar"
        )

    # ===================== FETCHING DATA ===================== #

    def _get_json(self, url: str) -> Any:
        """Safely fetch and return JSON data from a URL."""
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"❌ Error fetching data from {url}: {e}")
            return None

    def fetch_rec_data(self) -> List[Dict]:
        """Fetch recreation facility data."""
        return self._get_json(self.rec_api) or []

    def fetch_library_data(self) -> List[Dict]:
        """Fetch library occupancy data."""
        data = self._get_json(self.library_api)
        if not data:
            return []
        if isinstance(data, dict):
            return [v for k, v in data.items() if k != "lastupdate" and isinstance(v, dict)]
        return data if isinstance(data, list) else []

    def fetch_event_data(self, limit: int = 20) -> List[Dict]:
        """Fetch upcoming event data from TAMU calendar."""
        data = self._get_json(self.events_api)
        if not data:
            return []

        events = []
        if isinstance(data, dict) and "events" in data:
            for day_events in data["events"].values():
                events.extend(day_events)
        elif isinstance(data, list):
            events = data
        else:
            print(f"⚠️ Unexpected event data format: {type(data)}")
            return []

        parsed = []
        for event in events:
            try:
                start_ts = event.get("ts_start")
                end_ts = event.get("ts_end")

                start_time = (
                    datetime.fromtimestamp(start_ts).strftime("%Y-%m-%d %I:%M %p")
                    if start_ts else "N/A"
                )
                end_time = (
                    datetime.fromtimestamp(end_ts).strftime("%Y-%m-%d %I:%M %p")
                    if end_ts else "N/A"
                )

                parsed.append({
                    "title": event.get("title", "Untitled Event"),
                    "location": event.get("location", "Unknown"),
                    "latitude": event.get("latitude", "N/A"),
                    "longitude": event.get("longitude", "N/A"),
                    "start_time": start_time,
                    "end_time": end_time,
                    "link": f"https://calendar.tamu.edu/live/{event.get('href', '')}",
                    "summary": event.get("summary", "").strip(),
                })
            except Exception as e:
                print(f"⚠️ Skipped malformed event: {e}")

        return sorted(parsed, key=lambda e: e["start_time"])[:limit]

    # ===================== HELPERS ===================== #

    @staticmethod
    def calculate_percentage(current: int, total: int) -> float:
        """Calculate percentage capacity."""
        return round((current / total) * 100, 1) if total else 0.0

    @staticmethod
    def get_status_emoji(percentage: float, is_closed: bool = False) -> str:
        """Return emoji based on occupancy percentage."""
        if is_closed:
            return "🔒"
        if percentage < 40:
            return "🟢"
        elif percentage < 70:
            return "🟡"
        elif percentage < 90:
            return "🟠"
        return "🔴"

    @staticmethod
    def format_datetime(dt_string: str) -> str:
        """Format ISO datetime string to readable format."""
        try:
            if "T" in dt_string:
                dt = datetime.fromisoformat(dt_string.replace("Z", "+00:00").split(".")[0])
            else:
                dt = datetime.strptime(dt_string, "%Y-%m-%dT%H:%M:%S")
            return dt.strftime("%m/%d/%Y %I:%M %p")
        except Exception:
            return dt_string

    # ===================== DISPLAY METHODS ===================== #

    def display_libraries(self):
        """Display live library occupancy."""
        libraries = self.fetch_library_data()
        if not libraries:
            print("❌ No library data available.")
            return

        libraries.sort(key=lambda x: x.get("percentfull", 0), reverse=True)

        print("\n" + "=" * 80)
        print("📚 TAMU LIBRARIES - LIVE OCCUPANCY")
        print("=" * 80 + "\n")

        for lib in libraries:
            name = lib.get("name", "Unknown")
            max_cap = lib.get("max", 0)
            remaining = lib.get("remaining", 0)
            percent = lib.get("percentfull", 0)
            current = max_cap - remaining
            emoji = self.get_status_emoji(percent)

            print(f"{emoji} {name} Library")
            print(f"   Current: {current} / {max_cap} ({percent}% full)")
            print(f"   Available: {remaining} spaces remaining\n")

        print("=" * 80)

    def find_best_study_spot(self):
        """Find least crowded open libraries."""
        libraries = [
            lib for lib in self.fetch_library_data()
            if lib.get("percentfull", 100) < 100
        ]
        if not libraries:
            print("❌ No open libraries found.")
            return

        libraries.sort(key=lambda x: x.get("percentfull", 0))
        print("\n🎯 BEST LIBRARIES TO STUDY RIGHT NOW:\n")
        for i, lib in enumerate(libraries[:3], 1):
            print(f"{i}. {lib.get('name')} Library")
            print(f"   {lib.get('percentfull')}% full - {lib.get('remaining')} spaces available\n")

    def display_rec_facilities(self, sort_by: str = "capacity"):
        """Display recreation facility occupancy."""
        facilities = self.fetch_rec_data()
        if not facilities:
            print("❌ No recreation data available.")
            return

        if sort_by == "capacity":
            facilities.sort(
                key=lambda x: self.calculate_percentage(
                    x.get("LastCount", 0), x.get("TotalCapacity", 1)
                ),
                reverse=True,
            )
        elif sort_by == "name":
            facilities.sort(key=lambda x: x.get("LocationName", ""))

        print("\n" + "=" * 80)
        print("🏋️ TAMU RECREATION FACILITIES - LIVE CAPACITY")
        print("=" * 80 + "\n")

        for f in facilities:
            count = f.get("LastCount", 0)
            cap = f.get("TotalCapacity", 1)
            closed = f.get("IsClosed", False)
            percent = self.calculate_percentage(count, cap)
            emoji = self.get_status_emoji(percent, closed)

            print(f"{emoji} {f.get('LocationName', 'Unknown')}")
            print(f"   Status: {'CLOSED' if closed else 'OPEN'}")
            print(f"   Current: {count} / {cap} ({percent}%)")
            print(f"   Updated: {self.format_datetime(f.get('LastUpdatedDateAndTime', ''))}\n")

        print("=" * 80)

    def find_best_workout_spot(self):
        """Find least crowded open rec facilities."""
        facilities = [
            {
                "name": f.get("LocationName"),
                "percentage": self.calculate_percentage(f.get("LastCount", 0), f.get("TotalCapacity", 1)),
                "count": f.get("LastCount", 0),
                "capacity": f.get("TotalCapacity", 1),
            }
            for f in self.fetch_rec_data()
            if not f.get("IsClosed", False)
        ]
        if not facilities:
            print("❌ All facilities are closed.")
            return

        facilities.sort(key=lambda x: x["percentage"])
        print("\n🎯 BEST REC FACILITIES TO WORKOUT RIGHT NOW:\n")
        for i, f in enumerate(facilities[:5], 1):
            print(f"{i}. {f['name']} - {f['percentage']}% full ({f['count']}/{f['capacity']})\n")

    def display_events(self, limit: int = 10):
        """Display upcoming TAMU events."""
        events = self.fetch_event_data(limit)
        if not events:
            print("❌ No events found.")
            return

        print("\n" + "=" * 80)
        print("🎟️ UPCOMING TAMU EVENTS")
        print("=" * 80 + "\n")

        for e in events:
            print(f"📍 {e['title']}")
            print(f"   🕒 {e['start_time']} → {e['end_time']}")
            print(f"   📌 {e['location']} ({e['latitude']}, {e['longitude']})")
            print(f"   🔗 {e['link']}\n")

        print("=" * 80)

    # ===================== SUMMARY METHODS ===================== #

    def get_full_report(self):
        """Display a full live report."""
        self.display_libraries()
        self.find_best_study_spot()
        self.display_rec_facilities()
        self.find_best_workout_spot()

    def get_quick_summary(self):
        """Display a quick overview of best options."""
        print("\n" + "=" * 80)
        print("⚡ QUICK SUMMARY - BEST OPTIONS RIGHT NOW")
        print("=" * 80)
        self.find_best_study_spot()
        self.find_best_workout_spot()

    def load_all_data(self):
        self.data = {
            "libraries": self.fetch_library_data(),
            "rec": self.fetch_rec_data(),
            "events": self.fetch_event_data(limit=50)
        }
        print("✅ All data loaded successfully!")
    
    def get_all_locations_with_events(self) -> List[Dict[str, float]]:
        """
        Returns a list of dictionaries with location and occupancy percentage for:
        - Rec facilities (real occupancy)
        - Libraries (real occupancy)
        - Events (random capacities since actual occupancy is unknown)
        
        Example: [{"location": "Rec Center", "percent_full": 60.0}, ...]
        """
        result = []

        # --- Rec Facilities ---
        rec_facilities = self.fetch_rec_data()
        for f in rec_facilities:
            name = f.get("LocationName", "Unknown")
            current = f.get("LastCount", 0)
            total = f.get("TotalCapacity", 1)  # avoid division by zero
            percent = round((current / total) * 100, 1)
            result.append({"location": name, "percent_full": percent})

        # --- Libraries ---
        libraries = self.fetch_library_data()
        for lib in libraries:
            name = lib.get("name", "Unknown")
            max_cap = lib.get("max", 1)  # avoid division by zero
            remaining = lib.get("remaining", 0)
            current = max_cap - remaining
            percent = round((current / max_cap) * 100, 1)
            result.append({"location": name, "percent_full": percent})

        # --- Events ---
        events = self.fetch_event_data(limit=50)
        for event in events:
            # Use the event's location as the location name
            location_name = event.get("location", "Unknown Event Location")
            # Random occupancy percentage between 10% and 100%
            percent = round(random.uniform(10, 100), 1)
            result.append({"location": location_name, "percent_full": percent})

        return result

    def ask_perplexity(self, prompt: str) -> str:

        # System prompt: strict instructions to return valid JSON (string) only.
        system_prompt = """
        You are a TAMU campus assistant that returns structured data only.

        - Use ONLY the provided data embedded in the user message. Do NOT invent or call external data sources.
        - Output MUST be valid JSON text (a JSON array) and nothing else. Do NOT include any markdown, backticks, or explanatory text.
        - The JSON must be an array with up to 3 objects (default 3 if not specified).
        - Each object must contain exactly these keys:
          - "name" (string)
          - "percent_full" (number, e.g. 42.3)
          - "available_seats" (integer)
        - Prefer locations with the most available seats unless the user explicitly requests otherwise.
        - Do not include null, NaN, or non-JSON types. Use 0 for unknown available_seats if necessary.
        - Example output (exact format, no comments):
          [{"name":"Library A","percent_full":12.5,"available_seats":120}, {"name":"Rec B","percent_full":45.0,"available_seats":60}]
        """

        # Embed sanitized live data for the model to use
        try:
            embedded_data = json.dumps(self.data, default=str)
        except Exception:
            embedded_data = str(self.data)

        user_message = {
            "role": "user",
            "content": f"""
    User Query: {prompt}

    Here is the live TAMU data (use only this data): 
    {embedded_data}

    Return up to the top 3 results as a single JSON array (string) containing objects with keys:
    "name" (string), "percent_full" (number), and "available_seats" (integer).
    Return only the JSON array and nothing else.
    """
        }

        messages = [{"role": "system", "content": system_prompt}, user_message]

        client = Perplexity()
        try:
            response = client.chat.completions.create(model="sonar", messages=messages)
            resp_text = response.choices[0].message.content.strip()
        except Exception:
            resp_text = ""

        # Try to parse the model output as JSON. If it fails, attempt to extract a JSON array substring.
        def try_parse_json(s: str):
            try:
                return json.loads(s)
            except Exception:
                # Attempt to extract substring between first '[' and last ']'
                m = re.search(r"\[.*\]", s, re.S)
                if m:
                    try:
                        return json.loads(m.group(0))
                    except Exception:
                        return None
                return None

        parsed = try_parse_json(resp_text)
        if parsed is not None and isinstance(parsed, list):
            # Normalize and ensure types are correct
            normalized = []
            for item in parsed[:3]:
                try:
                    name = str(item.get("name", "")) if isinstance(item, dict) else ""
                    percent = float(item.get("percent_full", 0)) if isinstance(item, dict) else 0.0
                    available = int(item.get("available_seats", 0)) if isinstance(item, dict) else 0
                except Exception:
                    name, percent, available = "", 0.0, 0
                normalized.append({"name": name, "percent_full": percent, "available_seats": available})
            return json.dumps(normalized)
        else:
            # Fallback: build a deterministic top-3 list from local data (guaranteed JSON string)
            candidates = []

            # Rec facilities
            for f in self.fetch_rec_data():
                try:
                    name = f.get("LocationName", "Unknown")
                    current = int(f.get("LastCount", 0))
                    cap = int(f.get("TotalCapacity", 1)) or 1
                    available = max(cap - current, 0)
                    percent = round((current / cap) * 100, 1)
                    candidates.append({"name": name, "percent_full": percent, "available_seats": available})
                except Exception:
                    continue

            # Libraries
            for lib in self.fetch_library_data():
                try:
                    name = lib.get("name", "Unknown")
                    max_cap = int(lib.get("max", 1)) or 1
                    remaining = int(lib.get("remaining", 0))
                    current = max_cap - remaining
                    available = max(remaining, 0)
                    percent = round((current / max_cap) * 100, 1)
                    candidates.append({"name": name, "percent_full": percent, "available_seats": available})
                except Exception:
                    continue

            # Events (no reliable capacity) - skip or include with 0 available seats
            for ev in self.fetch_event_data(limit=20):
                try:
                    name = ev.get("location", "Event Location")
                    # We don't have capacity; set available_seats to 0 and percent_full to provided percent if any (else random-ish not allowed)
                    candidates.append({"name": name, "percent_full": float(ev.get("percent_full", 100.0)) if isinstance(ev, dict) and "percent_full" in ev else 100.0, "available_seats": 0})
                except Exception:
                    continue

            # Sort by available_seats descending (most available spots first), then by percent_full ascending
            candidates.sort(key=lambda x: (-int(x.get("available_seats", 0)), float(x.get("percent_full", 100.0))))
            top3 = candidates[:3]

            # Ensure correct types and return JSON string
            safe_top3 = []
            for it in top3:
                try:
                    safe_top3.append({
                        "name": str(it.get("name", "")),
                        "percent_full": float(it.get("percent_full", 0.0)),
                        "available_seats": int(it.get("available_seats", 0))
                    })
                except Exception:
                    safe_top3.append({"name": "", "percent_full": 0.0, "available_seats": 0})

            return json.dumps(safe_top3)



# Load tracker and data once at startup
tracker = TAMUFacilityTracker()
tracker.load_all_data()

# Request body model
class QueryRequest(BaseModel):
    query: str

@app.post("/ask")
def ask_perplexity(request: QueryRequest):
    result = tracker.ask_perplexity(request.query)
    return {"response": result}


@app.get("/retrieve")
def retrieve_locations():
    """
    Retrieve all locations (rec facilities, libraries, events) with occupancy percentages.
    """
    return tracker.get_all_locations_with_events()

class EventRequest(BaseModel):
    text: str
    start: str  # YYYYMMDDTHHMMSS±HHMM
    end: str    # YYYYMMDDTHHMMSS±HHMM
    details: str = ""
    location: str = ""

def generate_google_calendar_link(event: dict) -> str:
    """
    Generate a Google Calendar event creation URL and open it automatically.
    """
    base_url = "https://calendar.google.com/calendar/r/eventedit?"
    params = (
        f"text={quote(event.get('text', ''))}"
        f"&dates={event.get('start','')}/{event.get('end','')}"
        f"&details={quote(event.get('details',''))}"
        f"&location={quote(event.get('location',''))}"
    )

    link = base_url + params
    #webbrowser.open(link)  # Opens the link automatically on the server
    return link

@app.post("/create-event")
def create_event(event: EventRequest):
    """
    Endpoint to generate a Google Calendar link and open it automatically.
    """
    event_dict = event.dict()
    link = generate_google_calendar_link(event_dict)
    return {"message": "Google Calendar link opened on the server!", "link": link}

import pytz
import json
import re

@app.get("/get-event-requests", response_model=List[EventRequest])
def get_event_requests():
    """
    Endpoint to return a list of events formatted as EventRequest dictionaries.
    """
    raw_events = tracker.fetch_event_data(limit=10)  # Adjust limit as needed
    formatted_events = []

    for event in raw_events:
        try:
            # Convert readable time back to datetime object
            start_dt = datetime.strptime(event["start_time"], "%Y-%m-%d %I:%M %p")
            end_dt = datetime.strptime(event["end_time"], "%Y-%m-%d %I:%M %p")

            # Format to RFC5545-compliant Google Calendar format: YYYYMMDDTHHMMSS±HHMM
            tz = pytz.timezone("America/Chicago")  # Adjust to your local timezone
            start_str = start_dt.astimezone(tz).strftime("%Y%m%dT%H%M%S%z")
            end_str = end_dt.astimezone(tz).strftime("%Y%m%dT%H%M%S%z")

            formatted_events.append(EventRequest(
                text=event["title"],
                start=start_str,
                end=end_str,
                details=event["summary"],
                location=event["location"]
            ))
        except Exception as e:
            print(f"⚠️ Failed to format event: {e}")

    return formatted_events
