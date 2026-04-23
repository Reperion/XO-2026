"""Tests for SpaceX launch tracker."""

def test_fetch_upcoming_launches_returns_list():
    """fetch_upcoming_launches should return a non-empty list of launches."""
    from src.spacex import fetch_upcoming_launches
    
    launches = fetch_upcoming_launches()
    
    assert isinstance(launches, list)
    assert len(launches) > 0


def test_fetch_upcoming_launches_has_expected_keys():
    """Each launch should have name, date_utc, and rocket keys."""
    from src.spacex import fetch_upcoming_launches
    
    launches = fetch_upcoming_launches()
    first_launch = launches[0]
    
    assert "name" in first_launch
    assert "date_utc" in first_launch
    assert "rocket" in first_launch


def test_format_launch_date_returns_readable_date():
    """format_launch_date should convert ISO date to readable format."""
    from src.spacex import format_launch_date
    
    iso_date = "2026-04-23T14:30:00Z"
    readable = format_launch_date(iso_date)
    
    assert isinstance(readable, str)
    assert "2026" in readable
    assert "April" in readable or "Apr" in readable


def test_format_launch_date_handles_invalid_date():
    """format_launch_date should raise ValueError for invalid date strings."""
    from src.spacex import format_launch_date
    
    try:
        format_launch_date("not-a-date")
        assert False, "Should have raised ValueError"
    except ValueError:
        pass


def test_get_rocket_name_returns_string():
    """get_rocket_name should return the rocket name for a valid ID."""
    from src.spacex import get_rocket_name, fetch_upcoming_launches
    
    launches = fetch_upcoming_launches()
    rocket_id = launches[0]["rocket"]
    
    name = get_rocket_name(rocket_id)
    
    assert isinstance(name, str)
    assert len(name) > 0


def test_get_rocket_name_invalid_id_raises_error():
    """get_rocket_name should raise an error for invalid rocket ID."""
    from src.spacex import get_rocket_name
    
    try:
        get_rocket_name("invalid-rocket-id-12345")
        assert False, "Should have raised an error"
    except Exception:
        pass


def test_format_launch_for_display_returns_formatted_string():
    """format_launch_for_display should return a readable string."""
    from src.spacex import format_launch_for_display
    
    launch = {
        "name": "Starlink-17",
        "date_utc": "2026-05-01T12:00:00Z",
        "rocket": "5e9d0d95eda69973a809d1ec"
    }
    
    result = format_launch_for_display(launch)
    
    assert isinstance(result, str)
    assert "Starlink-17" in result
    assert "May" in result or "2026" in result


def test_format_launch_for_display_includes_rocket_name():
    """format_launch_for_display should include rocket name when provided."""
    from src.spacex import format_launch_for_display
    
    launch = {
        "name": "Starship Orbital Test",
        "date_utc": "2026-06-15T14:00:00Z",
        "rocket": "5e9d0d95eda69973a809d1ec"
    }
    
    result = format_launch_for_display(launch, rocket_name="Starship")
    
    assert "Starship" in result
