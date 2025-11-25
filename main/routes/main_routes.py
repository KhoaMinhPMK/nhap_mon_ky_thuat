"""
Main Routes
Handles page rendering and video feed
"""

from flask import Blueprint, render_template, Response

main_bp = Blueprint('main', __name__)

# Will be set by app factory
camera = None


def init_main_routes(camera_controller):
    """Initialize routes with camera controller"""
    global camera
    camera = camera_controller


@main_bp.route('/')
def index():
    """Render main page"""
    return render_template('index.html')


@main_bp.route('/video_feed')
def video_feed():
    """Stream video feed as MJPEG"""
    if camera is None:
        return "Camera not initialized", 500
    
    return Response(
        camera.generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )
