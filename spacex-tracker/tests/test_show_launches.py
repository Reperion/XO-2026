"""Tests for SpaceX CLI script."""

def test_cli_main_outputs_launches(capsys, monkeypatch):
    """main() should output formatted launches to stdout."""
    from src.spacex import get_upcoming_launches_formatted
    
    # Mock the function to return test data
    test_data = [
        "Starlink-17 | May 01, 2026 at 12:00 UTC | Falcon 9",
        "Starship Orbital | June 15, 2026 at 14:00 UTC | Starship"
    ]
    monkeypatch.setattr("src.spacex.get_upcoming_launches_formatted", lambda limit=None: test_data)
    
    # Import and run main
    from show_launches import main
    main()
    
    captured = capsys.readouterr()
    assert "Starlink-17" in captured.out
    assert "Falcon 9" in captured.out
