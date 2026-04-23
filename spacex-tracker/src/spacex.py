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


def format_launch_for_display(launch, rocket_name=None):
    """Format a launch dict into a readable display string."""
    name = launch.get("name", "Unknown Mission")
    date_str = launch.get("date_utc", "")
    
    if rocket_name is None:
        rocket_name = launch.get("rocket", "Unknown Rocket")
    
    if date_str:
        date_formatted = format_launch_date(date_str)
        return f"{name} | {date_formatted} | {rocket_name}"
    return f"{name} | {rocket_name}"


def get_upcoming_launches_formatted(limit=None):
    """Fetch and format upcoming launches for display."""
    launches = fetch_upcoming_launches()
    
    if limit is not None:
        launches = launches[:limit]
    
    result = []
    for launch in launches:
        rocket_id = launch.get("rocket")
        rocket_name = None
        if rocket_id:
            try:
                rocket_name = get_rocket_name(rocket_id)
            except ValueError:
                rocket_name = "Unknown Rocket"
        
        formatted = format_launch_for_display(launch, rocket_name=rocket_name)
        result.append(formatted)
    
    return result
