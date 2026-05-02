"""SpaceX launch tracker - fetch upcoming launches using Launch Library 2."""

import urllib.request
import json
from datetime import datetime

# Using Launch Library 2 as it is more reliably maintained in 2026
API_BASE = "https://ll.thespacedevs.com/2.2.0"
USER_AGENT = "SpaceXTracker/1.0 (Contact: Reperion)"

def _api_get(endpoint):
    """Make GET request to API and return parsed JSON."""
    url = f"{API_BASE}{endpoint}"
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read())

def fetch_upcoming_launches(limit=20):
    """Fetch upcoming SpaceX launches from Launch Library 2 API."""
    # Filter for SpaceX missions (search=SpaceX) with a higher default limit
    data = _api_get(f"/launch/upcoming/?search=SpaceX&limit={limit}")
    
    # Map LL2 structure to the format expected by the rest of the app
    launches = []
    for item in data.get("results", []):
        launch = {
            "name": item.get("name"),
            "date_utc": item.get("net"),  # 'net' is ISO 8601
            "rocket": item.get("rocket", {}).get("configuration", {}).get("full_name", "Unknown Rocket")
        }
        launches.append(launch)
    return launches

def format_launch_date(iso_string):
    """Convert ISO date string to readable format."""
    try:
        # LL2 dates are typically like '2026-05-03T06:59:00Z'
        dt = datetime.fromisoformat(iso_string.replace("Z", "+00:00"))
        return dt.strftime("%B %d, %Y at %H:%M UTC")
    except ValueError:
        raise ValueError(f"Invalid date string: {iso_string}")

def get_rocket_name(rocket_id):
    """
    Fetch rocket name. 
    Note: LL2 includes this in the launch object, so this is now a passthrough 
    or legacy support for the test suite.
    """
    return str(rocket_id)

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

def get_upcoming_launches_formatted(limit=20):
    """Fetch and format upcoming launches for display."""
    launches = fetch_upcoming_launches(limit=limit)
    
    if limit is not None:
        launches = launches[:limit]
    
    result = []
    for launch in launches:
        # Rocket name is already embedded in our mapped structure
        formatted = format_launch_for_display(launch)
        result.append(formatted)
    
    return result
