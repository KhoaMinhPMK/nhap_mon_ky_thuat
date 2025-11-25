"""
Arduino CNC Control Center
Main Application Entry Point

This is the new modular version of the server.
Run this file instead of server.py
"""

from flask import Flask
from config import SERVER_HOST, SERVER_PORT, DEBUG_MODE

# Import controllers
from controllers.serial_controller import arduino
from controllers.camera_controller import camera
from controllers.ml_controller import ml_model
from controllers.bin_controller import BinController
from controllers.script_executor import ScriptExecutor

# Import routes
from routes.main_routes import main_bp, init_main_routes
from routes.api_routes import api_bp, init_api_routes


def create_app():
    """Application factory"""
    app = Flask(__name__)
    
    # Initialize controllers
    print("=" * 50)
    print("🚀 Arduino CNC Control Center")
    print("=" * 50)
    
    # Camera
    camera.initialize()
    
    # ML Model
    ml_model.load_model()
    
    # Bin controller (needs arduino)
    bins = BinController(arduino)
    
    # Script executor (needs all controllers)
    executor = ScriptExecutor(arduino, camera, ml_model, bins)
    
    # Initialize routes with controllers
    init_main_routes(camera)
    init_api_routes(arduino, bins, executor)
    
    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    
    print("=" * 50)
    print(f"✓ Server ready at http://{SERVER_HOST}:{SERVER_PORT}")
    print("=" * 50)
    
    return app


# ================= MAIN =================
if __name__ == '__main__':
    app = create_app()
    app.run(
        host=SERVER_HOST, 
        port=SERVER_PORT, 
        debug=DEBUG_MODE, 
        threaded=True
    )
