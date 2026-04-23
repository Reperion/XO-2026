"""SpaceX Launch Tracker CLI - show upcoming launches."""

from src.spacex import get_upcoming_launches_formatted


def main():
    """Fetch and display upcoming SpaceX launches."""
    print("\n🚀 Upcoming SpaceX Launches\n")
    
    launches = get_upcoming_launches_formatted()
    
    for launch in launches:
        print(f"  • {launch}")
    
    print(f"\nTotal: {len(launches)} launches\n")


if __name__ == "__main__":
    main()
