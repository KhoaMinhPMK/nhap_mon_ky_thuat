import cv2
import numpy as np
import serial
import time
import json
import os
import requests
from datetime import datetime
import keras
from keras.layers import TFSMLayer
from PIL import Image, ImageOps

# Disable scientific notation for clarity
np.set_printoptions(suppress=True)

# ================= CONFIGURATION =================
MODEL_PATH = "E:/project/detect/model.savedmodel"
LABELS_PATH = "E:/project/detect/labels.txt"
SERIAL_PORT = "COM11"
BAUD_RATE = 9600
CAMERA_INDEX = 1 # Switch to secondary camera (User requested "camera 2")
API_ENDPOINT = "https://bkuteam.site/upload/receive.php"

# ================= LOAD MODEL =================
print("Loading model...")
try:
    # Use TFSMLayer for Keras 3 compatibility with SavedModel
    model_layer = TFSMLayer(MODEL_PATH, call_endpoint='serving_default')
    print("Model loaded successfully using TFSMLayer.")
except Exception as e:
    print(f"Error loading model: {e}")
    exit()

class_names = open(LABELS_PATH, "r").readlines()

# ================= SETUP SERIAL =================
try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=0.1) # Low timeout for non-blocking loop
    print(f"Connected to {SERIAL_PORT} at {BAUD_RATE} baud.")
    time.sleep(2) # Wait for Arduino to reset
except Exception as e:
    print(f"Error connecting to serial: {e}")
    print("Continuing without serial for testing...")
    ser = None



# ================= LOGGING FUNCTION =================
def save_log(prediction_data):
    log_file = "report.json"
    
    # Create entry
    entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "class_name": prediction_data.get("class_name", "Unknown"),
        "class_id": prediction_data.get("class_id", -1),
        "confidence": float(prediction_data.get("confidence", 0.0))
    }
    
    try:
        # Load existing logs
        if os.path.exists(log_file):
            with open(log_file, "r", encoding="utf-8") as f:
                try:
                    logs = json.load(f)
                    if not isinstance(logs, list):
                        logs = []
                except json.JSONDecodeError:
                    logs = []
        else:
            logs = []
            
        # Append new entry
        logs.append(entry)
        
        # Save back
        with open(log_file, "w", encoding="utf-8") as f:
            json.dump(logs, f, indent=4, ensure_ascii=False)
            
        print(f"Log saved to {log_file}: {entry}")
        
    except Exception as e:
        print(f"Error saving log: {e}")

def upload_log(prediction_data, image_pil=None):
    # Removed the example.com check since we have a real URL now
    
    # Prepare JSON data as a string for the 'data' field
    payload_dict = {
        "timestamp": datetime.now().isoformat(),
        "class_name": prediction_data.get("class_name", "Unknown"),
        "class_id": prediction_data.get("class_id", -1),
        "confidence": float(prediction_data.get("confidence", 0.0)),
        "device_id": "machine_01" 
    }
    
    try:
        print(f"Uploading to {API_ENDPOINT}...")
        
        files = {}
        if image_pil:
            # Save to temp file
            temp_filename = "temp_upload.jpg"
            image_pil.save(temp_filename, format="JPEG")
            # Open for reading in binary mode
            files['image'] = ('image.jpg', open(temp_filename, 'rb'), 'image/jpeg')

        # Send as multipart/form-data: 'data' field contains JSON, 'image' field contains file
        response = requests.post(
            API_ENDPOINT, 
            data={'data': json.dumps(payload_dict)}, 
            files=files,
            auth=('root', '123456'), 
            timeout=10 # Increase timeout for file upload
        )
        
        # Close file if opened
        if 'image' in files:
            files['image'][1].close()
            
        if response.status_code == 200 or response.status_code == 201:
            print("Upload successful!")
        else:
            print(f"Upload failed with status: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"Error uploading log: {e}")

# ================= HELPER FUNCTIONS =================
def preprocess_image(image_pil):
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
    size = (224, 224)
    image = ImageOps.fit(image_pil, size, Image.Resampling.LANCZOS)
    image_array = np.asarray(image)
    normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1
    data[0] = normalized_image_array
    return data

def predict(data):
    # TFSMLayer returns a dictionary
    prediction_dict = model_layer(data)
    # Usually the key is 'dense_X' or similar, but we can just take the first value
    prediction = list(prediction_dict.values())[0]
    # Convert tensor to numpy if needed
    if hasattr(prediction, 'numpy'):
        prediction = prediction.numpy()
        
    index = np.argmax(prediction)
    class_name = class_names[index]
    confidence_score = prediction[0][index]
    return index, class_name, confidence_score

# ================= MAIN LOOP =================
print("Server started. Press 'q' to quit.")

cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)
if not cap.isOpened():
    print(f"Cannot open camera {CAMERA_INDEX}")
    # Try fallback to index 0 if 1 fails
    if CAMERA_INDEX != 0:
        print("Trying camera index 0...")
        cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        if not cap.isOpened():
             print("Cannot open camera 0 either.")
             exit()
    else:
        exit()

# Set resolution to 640x480 for stability
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
# Force MJPG video format (Less bandwidth, better for USB 2.0)
cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc('M', 'J', 'P', 'G'))
cap.set(cv2.CAP_PROP_FPS, 30)

last_prediction_text = "Waiting..."
last_color = (255, 255, 255)
current_prediction_data = {}
current_image_pil = None # Store image for upload

while True:
    # 1. Read Camera
    ret, frame = cap.read()
    if not ret:
        print("Can't receive frame (stream end?). Exiting ...")
        break

    # 2. Check Serial Request
    if ser:
        while ser.in_waiting > 0:
            try:
                line = ser.readline().decode('utf-8').strip()
                if line == "REQ_PREDICT":
                    print("\nReceived request from Arduino.")
                    
                    # Convert to PIL for preprocessing
                    image_cv = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    image_pil = Image.fromarray(image_cv)
                    
                    # Predict
                    data = preprocess_image(image_pil)
                    index, class_name, score = predict(data)
                    
                    print(f"Class: {class_name.strip()} (ID: {index})")
                    print(f"Confidence: {score}")
                    
                    # Update UI Text
                    last_prediction_text = f"{class_name.strip()} ({score:.2f})"
                    if index == 0: last_color = (0, 255, 0) # Green
                    elif index == 1: last_color = (255, 215, 0) # Gold
                    else: last_color = (0, 0, 255) # Red
                    
                    # Send result back to Arduino
                    ser.write(f"{index}\n".encode('utf-8'))

                    print(f"Sent command: {index}")

                    # Store for logging later
                    current_prediction_data = {
                        "class_name": class_name.strip(),
                        "class_id": int(index),
                        "confidence": score
                    }
                    current_image_pil = image_pil # Save image reference
                    
                elif line:
                    # Just print debug, don't block
                    print(f"Arduino: {line}")
                    
                    if "===== HOAN TAT TOAN BO KICH BAN =====" in line:
                        if current_prediction_data:
                            print("Cycle complete. Saving log...")
                            save_log(current_prediction_data)
                            
                            # Run upload in a separate thread to avoid blocking the camera
                            import threading
                            upload_thread = threading.Thread(target=upload_log, args=(current_prediction_data, current_image_pil))
                            upload_thread.start()
                            
                            current_prediction_data = {} # Reset after saving
                            current_image_pil = None
                        else:
                            print("Cycle complete but no prediction data to save.")
                    
            except Exception as e:
                print(f"Error reading serial: {e}")

    # 3. Draw UI
    # Add a background rectangle for text
    cv2.rectangle(frame, (10, 10), (400, 60), (0, 0, 0), -1)
    cv2.putText(frame, last_prediction_text, (20, 45), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, last_color, 2)
    
    cv2.imshow('Watermelon Classifier', frame)

    # 4. Handle Quit
    if cv2.waitKey(1) == ord('q'):
        break

# Cleanup
cap.release()
cv2.destroyAllWindows()
if ser:
    ser.close()
