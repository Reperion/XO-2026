"""SpaceX launch tracker - fetch upcoming launches."""

import urllib.request
import json
from datetime import datetime

API_BASE = "https://api.spacexdata.com/v4"


def _api_get(endpoint):
    """Make GET request to SpaceX API and return parsed JSON."""
    url = f"{API_BASE}{endpoint}"
    with urllib.request.urlopen(url) as response:
        return json.loads(response.read())


def fetch_upcoming_launches():
    """Fetch upcoming SpaceX launches from the public API."""
    return _api_get("/launches/upcoming")


def format_launch_date(iso_string):
    """Convert ISO date string to readable format."""
    try:
        dt = datetime.fromisoformat(iso_string.replace("Z", "+00:00"))
        return dt.strftime("%B %d, %Y at %H:%M UTC")
    except ValueError:
        raise ValueError(f"Invalid date string: {iso_string}")


def get_rocket_name(rocket_id):
    """Fetch rocket name for a given rocket ID."""
    try:
        data = _api_get(f"/rockets/{rocket_id}")
        return data["name"]
    except Exception as e:
        raise ValueError(f"Failed to fetch rocket {rocket_id}: {e}")
