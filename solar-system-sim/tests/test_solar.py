"""Solar System Simulator - 3D interactive planets."""

def test_planet_data_contains_all_planets():
    """get_planet_data should return dict with all 8 planets."""
    from src.solar import get_planet_data
    
    planets = get_planet_data()
    
    assert isinstance(planets, dict)
    assert len(planets) == 8
    for name in ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]:
        assert name in planets


def test_planet_data_has_required_fields():
    """Each planet should have name, color, radius, distance, moons, info."""
    from src.solar import get_planet_data
    
    planets = get_planet_data()
    first_planet = next(iter(planets.values()))
    
    assert "name" in first_planet
    assert "color" in first_planet
    assert "radius_km" in first_planet
    assert "distance_au" in first_planet
    assert "moons" in first_planet
    assert "info" in first_planet


def test_create_scene_returns_scene_object():
    """create_scene should return a Three.js scene object."""
    from src.solar import create_scene
    
    scene = create_scene()
    
    assert scene is not None
    assert hasattr(scene, 'add')
    assert hasattr(scene, 'children')


def test_create_planet_mesh_returns_mesh():
    """create_planet_mesh should return a mesh with geometry and material."""
    from src.solar import create_planet_mesh
    
    planet_data = {
        "name": "Earth",
        "color": "#6B93D6",
        "radius_km": 6371.0
    }
    
    mesh = create_planet_mesh(planet_data)
    
    assert mesh is not None
    assert hasattr(mesh, 'position')


def test_generate_html_page_contains_planets():
    """generate_html_page should return HTML with planet data."""
    from src.solar import generate_html_page
    
    planets = {
        "Earth": {"name": "Earth", "color": "#6B93D6", "distance_au": 1.0}
    }
    
    html = generate_html_page(planets)
    
    assert "<!DOCTYPE html>" in html
    assert "Earth" in html
    assert "Three.js" in html


def test_generate_html_page_includes_canvas():
    """generate_html_page should include a canvas element for WebGL."""
    from src.solar import generate_html_page
    
    planets = {"Mars": {"name": "Mars", "color": "#FF0000"}}
    
    html = generate_html_page(planets)
    
    assert "<canvas id=" in html
    assert "script" in html.lower()


def test_render_planet_returns_javascript():
    """render_planet should return JavaScript code for creating a planet mesh."""
    from src.solar import render_planet
    
    planet_data = {
        "name": "Earth",
        "color": "#6B93D6",
        "radius_km": 6371.0,
        "distance_au": 1.0
    }
    
    js_code = render_planet(planet_data)
    
    assert "THREE.Mesh" in js_code
    assert "THREE.SphereGeometry" in js_code
    assert "Earth" in js_code


def test_render_planet_positions_at_distance():
    """render_planet should position planet at its orbital distance."""
    from src.solar import render_planet
    
    planet_data = {
        "name": "Mars",
        "color": "#FF0000",
        "radius_km": 3389.5,
        "distance_au": 1.52
    }
    
    js_code = render_planet(planet_data)
    
    assert "position.x" in js_code or "position.z" in js_code

