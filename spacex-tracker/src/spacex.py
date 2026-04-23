"""SpaceX launch tracker - fetch upcoming launches."""

import urllib.request
import json


def fetch_upcoming_launches():
    """Fetch upcoming SpaceX launches from the public API."""
    url = "https://api.spacexdata.com/v4/launches/upcoming"
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read())
    return data
