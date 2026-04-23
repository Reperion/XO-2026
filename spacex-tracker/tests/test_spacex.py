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
