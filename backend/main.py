from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from datetime import datetime
from typing import List, Dict, Any
from perplexity import Perplexity
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

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
        

    def ask_perplexity(self, prompt: str):
        

        # Define the system prompt right here
        system_prompt = """
        You are a concise TAMU campus assistant.

        - You have live data on library occupancies (percentfull), recreation facilities, and events.
        - Only return exactly what the user asked for. Do not add extra explanations or alternatives.
        - If the user asks for top 3 study spots, return only a list of the 3 locations with their current % full and available seats.
        - Output in simple readable format.
        - Do not hallucinate; rely only on provided data.
        """

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"""
            User Query: {prompt}
            Here is the live TAMU data:
            {self.data}

        Return only the top 3 results in a short, plain list with name, % full, and available seats and an assuring message before.
        """}
            ]

        client = Perplexity()

        response = client.chat.completions.create(
            model="sonar",
            messages=messages
        )

        print(response.choices[0].message.content)


app = FastAPI(title="TAMU Perplexity Campus API")

# Load tracker and data once at startup
tracker = TAMUFacilityTracker()
tracker.load_all_data()

# Request body model
class QueryRequest(BaseModel):
    query: str

@app.post("/ask")
def ask_perplexity(request: QueryRequest):
    """Send a query to the Perplexity assistant and return the answer."""
    
    # We'll capture the output as a string
    import io
    import sys

    buffer = io.StringIO()
    sys_stdout = sys.stdout
    sys.stdout = buffer  # redirect prints to buffer

    try:
        tracker.ask_perplexity(request.query)
    finally:
        sys.stdout = sys_stdout  # restore stdout

    result = buffer.getvalue().strip()
    return {"response": result}



@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/suggested")
def suggested():
    return [
        {
            "id": "evans-2f",
            "name": "Evans Library 2F",
            "distanceMeters": 420,
            "busyScore": 22,
            "status": "Quiet",
            "tags": ["Solo", "Outlets", "Sunlight"],
            "imageUrl": "/og-image.png",
        },
        {
            "id": "zach-atrium",
            "name": "ZACH Atrium",
            "distanceMeters": 760,
            "busyScore": 58,
            "status": "Moderate",
            "tags": ["Group", "Open seating"],
            "imageUrl": "/og-image.png",
        },
        {
            "id": "sbisa",
            "name": "Sbisa Dining",
            "distanceMeters": 300,
            "busyScore": 34,
            "status": "Quiet",
            "tags": ["Food", "Short line"],
            "imageUrl": "/og-image.png",
        },
    ]
