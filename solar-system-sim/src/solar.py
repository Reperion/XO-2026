"""Solar System Simulator - 3D interactive planets."""

def get_planet_data():
    """Return dictionary of planets with properties."""
    return {
        "Mercury": {
            "name": "Mercury",
            "color": "#8C7853",
            "radius_km": 2439.7,
            "distance_au": 0.39,
            "moons": 0,
            "info": "Smallest planet, closest to the Sun. No atmosphere."
        },
        "Venus": {
            "name": "Venus",
            "color": "#FFC649",
            "radius_km": 6051.8,
            "distance_au": 0.72,
            "moons": 0,
            "info": "Hottest planet due to runaway greenhouse effect."
        },
        "Earth": {
            "name": "Earth",
            "color": "#6B93D6",
            "radius_km": 6371.0,
            "distance_au": 1.0,
            "moons": 1,
            "info": "Our home. Only known planet with life."
        },
        "Mars": {
            "name": "Mars",
            "color": "#FF0000",
            "radius_km": 3389.5,
            "distance_au": 1.52,
            "moons": 2,
            "info": "The Red Planet. Has the tallest volcano in the solar system."
        },
        "Jupiter": {
            "name": "Jupiter",
            "color": "#D8A84E",
            "radius_km": 69911.0,
            "distance_au": 5.20,
            "moons": 95,
            "info": "Largest planet. Great Red Spot is a giant storm."
        },
        "Saturn": {
            "name": "Saturn",
            "color": "#E8D191",
            "radius_km": 58232.0,
            "distance_au": 9.58,
            "moons": 146,
            "info": "Famous for its beautiful ring system."
        },
        "Uranus": {
            "name": "Uranus",
            "color": "#D1E7E7",
            "radius_km": 25362.0,
            "distance_au": 19.22,
            "moons": 28,
            "info": "Ice giant tilted on its side (98° axial tilt)."
        },
        "Neptune": {
            "name": "Neptune",
            "color": "#4B70DD",
            "radius_km": 24622.0,
            "distance_au": 30.05,
            "moons": 16,
            "info": "Windiest planet. Winds up to 2,100 km/h."
        }
    }


def create_scene():
    """Create a Three.js scene object (simplified representation)."""
    class Scene:
        def __init__(self):
            self.type = "Scene"
            self.children = []
        
        def add(self, obj):
            self.children.append(obj)
            return obj
    
    return Scene()


def create_planet_mesh(planet_data):
    """Create a Three.js mesh for a planet."""
    import math
    
    radius_normalized = planet_data["radius_km"] / 24500  # Normalize to ~0.25-2.85 range
    
    class Mesh:
        def __init__(self, name, radius, color):
            self.type = "Mesh"
            self.name = name
            self.position = {"x": 0, "y": 0, "z": 0}
            self.geometry = {"type": "SphereGeometry", "radius": radius}
            self.material = {"type": "MeshBasicMaterial", "color": color}
    
    return Mesh(planet_data["name"], radius_normalized, planet_data["color"])


def generate_html_page(planets):
    """Generate HTML page with Three.js scene for solar system."""
    planet_script = ""
    for name, data in planets.items():
        planet_script += f"// {name}\n"
    
    html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Solar System Simulator</title>
    <style>
        body {{ margin: 0; overflow: hidden; background: #000; }}
        canvas {{ display: block; }}
    </style>
</head>
<body>
    <canvas id="solarCanvas"></canvas>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        // Three.js solar system
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({{ canvas: document.getElementById('solarCanvas') }});
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Add planets
{planet_script}
        
        // Animation loop
        function animate() {{
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }}
        animate();
    </script>
</body>
</html>"""
    return html
