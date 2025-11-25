"""
Arduino CNC Control Center
Main Application Entry Point with WebSocket Support

Features:
- WebSocket for realtime communication
- Queue system for multiple scripts
- Progress callbacks
- Optimized startup (lazy loading)
"""

import threading
from flask import Flask
from flask_socketio import SocketIO, emit
from config import SERVER_HOST, SERVER_PORT, DEBUG_MODE

# Lazy imports - controllers will be loaded on demand
arduino = None
camera = None
ml_model = None
bins = None
executor = None
socketio = None

def create_app():
    """Application factory with optimized initialization"""
    global arduino, camera, ml_model, bins, executor, socketio
    
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'cnc-control-secret-key'
    
    # Initialize SocketIO
    socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')
    
    print("=" * 50)
    print("🚀 Arduino CNC Control Center v2.0")
    print("=" * 50)
    
    # FAST INIT: Only essential components
    # Serial connection (required for basic control) - use singleton
    from controllers.serial_controller import arduino
    
    # Camera - initialize in background
    from controllers.camera_controller import CameraController
    camera = CameraController()
    threading.Thread(target=camera.initialize, daemon=True).start()
    print("📷 Camera initializing in background...")
    
    # ML Model - LAZY LOAD (biggest bottleneck!)
    from controllers.ml_controller import MLController
    ml_model = MLController()
    # Don't load model here - load on first prediction
    print("🧠 ML Model will load on first use (lazy loading)")
    
    # Bin controller
    from controllers.bin_controller import BinController
    bins = BinController(arduino)
    
    # Email controller (for bin full notifications)
    from controllers.email_controller import email_controller
    bins.set_email_controller(email_controller)
    print("📧 Email notifications ready")
    
    # History controller
    from controllers.history_controller import HistoryController
    history = HistoryController()
    
    # Script executor with WebSocket support
    from controllers.script_executor_ws import ScriptExecutorWS
    executor = ScriptExecutorWS(arduino, camera, ml_model, bins, socketio)
    
    # Import and register routes
    from routes.main_routes import main_bp, init_main_routes
    from routes.api_routes import api_bp, init_api_routes
    
    init_main_routes(camera)
    init_api_routes(arduino, bins, executor, history)
    
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    
    # Register WebSocket events
    register_socket_events(socketio, executor, bins)
    
    print("=" * 50)
    print(f"✓ Server ready at http://{SERVER_HOST}:{SERVER_PORT}")
    print("✓ WebSocket enabled for realtime updates")
    print("=" * 50)
    
    return app, socketio


def register_socket_events(socketio, executor, bins):
    """Register WebSocket event handlers"""
    
    @socketio.on('connect')
    def handle_connect():
        print("🔌 Client connected")
        # Send current status
        emit('status', {
            'connected': True,
            'bins': bins.get_status(),
            'script_running': executor.is_running,
            'queue_size': executor.queue_size()
        })
    
    @socketio.on('disconnect')
    def handle_disconnect():
        print("🔌 Client disconnected")
    
    @socketio.on('execute_script')
    def handle_execute(data):
        """Execute script via WebSocket"""
        script = data.get('script', [])
        priority = data.get('priority', False)
        
        if priority:
            success = executor.execute_priority(script)
        else:
            success = executor.enqueue(script)
        
        emit('script_queued', {
            'success': success,
            'queue_size': executor.queue_size(),
            'position': executor.queue_size() if success else -1
        })
    
    @socketio.on('stop_script')
    def handle_stop():
        """Stop current script"""
        executor.stop()
        emit('script_stopped', {'status': 'stopping'})
    
    @socketio.on('clear_queue')
    def handle_clear_queue():
        """Clear script queue"""
        executor.clear_queue()
        emit('queue_cleared', {'queue_size': 0})
    
    @socketio.on('get_status')
    def handle_get_status():
        """Get current system status"""
        emit('status', {
            'serial_connected': arduino.is_connected(),
            'bins': bins.get_status(),
            'script_running': executor.is_running,
            'queue_size': executor.queue_size(),
            'current_step': executor.current_step,
            'total_steps': executor.total_steps
        })
    
    @socketio.on('reset_bins')
    def handle_reset_bins():
        """Reset bin flags"""
        bins.reset()
        emit('bins_reset', bins.get_status())
        # Broadcast to all clients
        socketio.emit('bin_status', bins.get_status())
    
    @socketio.on('manual_command')
    def handle_manual_command(data):
        """Send manual command to Arduino"""
        cmd = data.get('command')
        if cmd:
            response = arduino.send_command(cmd)
            emit('command_response', {
                'command': cmd,
                'response': response
            })


# ================= MAIN =================
if __name__ == '__main__':
    app, socketio = create_app()
    socketio.run(
        app,
        host=SERVER_HOST, 
        port=SERVER_PORT, 
        debug=DEBUG_MODE,
        allow_unsafe_werkzeug=True
    )
