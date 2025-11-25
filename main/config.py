"""
Configuration Module
Centralized configuration for the application
"""

import os

# ================= PATHS =================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model.savedmodel")
LABELS_PATH = os.path.join(BASE_DIR, "labels.txt")

# ================= SERIAL =================
SERIAL_PORT = "COM5"
BAUD_RATE = 9600
SERIAL_TIMEOUT = 1

# ================= CAMERA =================
CAMERA_INDEX = 1
CAMERA_FALLBACK_INDEX = 0

# ================= SERVER =================
SERVER_HOST = '0.0.0.0'
SERVER_PORT = 5000
DEBUG_MODE = False

# ================= API =================
API_ENDPOINT = "https://bkuteam.site/upload/receive.php"

# ================= BIN DETECTION =================
BIN_CHECK_SAMPLES = 30        # Number of samples to take
BIN_CHECK_INTERVAL = 0.1      # Seconds between samples
BIN_FULL_THRESHOLD = 0.9      # 90% coverage = full

# ================= ML MODEL =================
IMAGE_SIZE = (224, 224)
