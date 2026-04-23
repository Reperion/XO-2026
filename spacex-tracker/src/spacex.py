"""SpaceX launch tracker - fetch upcoming launches."""

import urllib.request
import json
from datetime import datetime

API_BASE = "https://api.spacexdata.com/v4"


def fetch_upcoming_launches():
    """Fetch upcoming SpaceX launches from the public API."""
    url = f"{API_BASE}/launches/upcoming"
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read())
    return data


def format_launch_date(iso_string):
    """Convert ISO date string to readable format."""
    try:
        dt = datetime.fromisoformat(iso_string.replace("Z", "+00:00"))
        return dt.strftime("%B %d, %Y at %H:%M UTC")
    except ValueError:
        raise ValueError(f"Invalid date string: {iso_string}")
