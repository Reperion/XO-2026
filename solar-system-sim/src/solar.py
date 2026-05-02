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
        planet_script += render_planet(data)
    
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
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script>
        // Three.js solar system
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({{ canvas: document.getElementById('solarCanvas') }});
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Create starfield background
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i += 3) {{
            starPositions[i] = (Math.random() - 0.5) * 2000;
            starPositions[i+1] = (Math.random() - 0.5) * 2000;
            starPositions[i+2] = (Math.random() - 0.5) * 2000;
        }}
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({{ color: 0xFFFFFF, size: 0.7 }});
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
        
        // Add planets
{planet_script}
        
        // Camera controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        camera.position.set(0, 50, 100);
        
        // Animation loop
        function animate() {{
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }}
        animate();
    </script>
</body>
</html>"""
    return html


def render_planet(planet_data):
    """Return JavaScript code to create and position a planet mesh."""
    import math
    
    radius_normalized = planet_data.get("radius_km", 6371.0) / 24500  # Default to Earth radius
    distance = planet_data.get("distance_au", 1.0) * 100  # Scale for visualization
    
    js = f"""
    // Create {planet_data['name']}
    const {planet_data['name'].lower()}_geometry = new THREE.SphereGeometry({radius_normalized:.3f}, 32, 32);
    const {planet_data['name'].lower()}_material = new THREE.MeshBasicMaterial({{ color: {planet_data['color']} }});
    const {planet_data['name'].lower()}_mesh = new THREE.Mesh({planet_data['name'].lower()}_geometry, {planet_data['name'].lower()}_material);
    {planet_data['name'].lower()}_mesh.position.x = {distance:.1f};
    {planet_data['name'].lower()}_mesh.position.z = 0;
    scene.add({planet_data['name'].lower()}_mesh);
    """
    return js
