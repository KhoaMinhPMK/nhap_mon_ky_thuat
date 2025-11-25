"""
Camera Controller Module
Handles video capture and streaming
"""

import cv2
from config import CAMERA_INDEX, CAMERA_FALLBACK_INDEX


class CameraController:
    """Camera management for video feed and frame capture"""
    
    def __init__(self):
        self.camera = None
        
    def initialize(self):
        """Initialize camera capture"""
        try:
            self.camera = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)
            if not self.camera.isOpened():
                print(f"⚠ Camera {CAMERA_INDEX} not available, trying fallback...")
                self.camera = cv2.VideoCapture(CAMERA_FALLBACK_INDEX, cv2.CAP_DSHOW)
            
            if self.camera.isOpened():
                print(f"✓ Camera initialized")
                return True
            else:
                print("✗ Failed to initialize camera")
                return False
        except Exception as e:
            print(f"✗ Camera Error: {e}")
            return False
    
    def is_opened(self):
        """Check if camera is opened"""
        return self.camera is not None and self.camera.isOpened()
    
    def read_frame(self):
        """
        Read a single frame from camera
        
        Returns:
            tuple: (success, frame)
        """
        if not self.is_opened():
            if not self.initialize():
                return False, None
        
        return self.camera.read()
    
    def generate_frames(self):
        """
        Generator for streaming frames (MJPEG)
        
        Yields:
            bytes: JPEG encoded frame with MJPEG headers
        """
        if not self.is_opened():
            self.initialize()
            
        while True:
            success, frame = self.camera.read()
            if not success:
                break
            
            ret, buffer = cv2.imencode('.jpg', frame)
            if ret:
                frame_bytes = buffer.tobytes()
                yield (
                    b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
                )
    
    def release(self):
        """Release camera resources"""
        if self.camera:
            self.camera.release()
            print("✓ Camera released")


# Singleton instance
camera = CameraController()
