"""
ML Controller Module
Handles machine learning model loading and predictions
Optimized for fast startup with lazy loading and caching
"""

import numpy as np
from PIL import Image, ImageOps
from config import MODEL_PATH, LABELS_PATH, IMAGE_SIZE
import threading
import time

# Lazy import for keras
model_layer = None
class_names = []


class MLController:
    """Machine Learning model controller with lazy loading"""
    
    def __init__(self):
        self.model_layer = None
        self.class_names = []
        self.is_loaded = False
        self.is_loading = False
        self._load_lock = threading.Lock()
        
        # Cache for recent predictions (avoid repeated inference)
        self._prediction_cache = {}
        self._cache_ttl = 0.5  # Cache valid for 0.5 seconds
    
    def load_model(self):
        """Load the ML model and labels (thread-safe)"""
        global model_layer, class_names
        
        # Prevent multiple simultaneous loads
        with self._load_lock:
            if self.is_loaded or self.is_loading:
                return self.is_loaded
            
            self.is_loading = True
        
        print("📦 Loading ML model...")
        start_time = time.time()
        
        try:
            # Import keras lazily
            from keras.layers import TFSMLayer
            
            self.model_layer = TFSMLayer(MODEL_PATH, call_endpoint='serving_default')
            self.class_names = open(LABELS_PATH, "r").readlines()
            
            # Update global references
            model_layer = self.model_layer
            class_names = self.class_names
            
            self.is_loaded = True
            
            elapsed = time.time() - start_time
            print(f"✓ Model loaded in {elapsed:.2f}s")
            return True
            
        except Exception as e:
            print(f"✗ Error loading model: {e}")
            return False
        finally:
            self.is_loading = False
    
    def load_model_async(self, callback=None):
        """Load model in background thread"""
        def _load():
            result = self.load_model()
            if callback:
                callback(result)
        
        thread = threading.Thread(target=_load, daemon=True)
        thread.start()
    
    def preprocess_image(self, image_pil):
        """
        Preprocess PIL image for model input
        Optimized version with numpy operations
        """
        data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
        
        # Resize and fit
        image = ImageOps.fit(image_pil, IMAGE_SIZE, Image.Resampling.LANCZOS)
        
        # Convert to array and normalize in one step
        image_array = np.asarray(image, dtype=np.float32)
        data[0] = (image_array / 127.5) - 1
        
        return data
    
    def predict_frame(self, frame):
        """
        Run prediction on a video frame
        With caching for repeated frames
        
        Args:
            frame: OpenCV frame (BGR format)
            
        Returns:
            tuple: (index, class_name, confidence_score)
        """
        # Ensure model is loaded
        if not self.is_loaded:
            if not self.load_model():
                return -1, "Model Not Loaded", 0.0
        
        try:
            import cv2
            
            # Create frame hash for caching (fast hash of downsampled frame)
            small_frame = cv2.resize(frame, (32, 32))
            frame_hash = hash(small_frame.tobytes())
            
            # Check cache
            current_time = time.time()
            if frame_hash in self._prediction_cache:
                cached_time, cached_result = self._prediction_cache[frame_hash]
                if current_time - cached_time < self._cache_ttl:
                    return cached_result
            
            # Convert BGR to RGB
            image_cv = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image_pil = Image.fromarray(image_cv)
            
            # Preprocess
            data = self.preprocess_image(image_pil)
            
            # Predict
            prediction_dict = self.model_layer(data)
            prediction = list(prediction_dict.values())[0]
            
            if hasattr(prediction, 'numpy'):
                prediction = prediction.numpy()
            
            index = np.argmax(prediction)
            class_name = self.class_names[index].strip()
            confidence_score = float(prediction[0][index])
            
            result = (index, class_name, confidence_score)
            
            # Cache result
            self._prediction_cache[frame_hash] = (current_time, result)
            
            # Clean old cache entries
            self._clean_cache(current_time)
            
            return result
            
        except Exception as e:
            print(f"✗ Prediction Error: {e}")
            return -1, "Error", 0.0
    
    def _clean_cache(self, current_time):
        """Remove expired cache entries"""
        expired_keys = [
            k for k, (t, _) in self._prediction_cache.items() 
            if current_time - t > self._cache_ttl * 2
        ]
        for k in expired_keys:
            del self._prediction_cache[k]
    
    def warmup(self):
        """
        Warm up the model with a dummy prediction
        Call this after loading to prepare TensorFlow graph
        """
        if not self.is_loaded:
            return
        
        print("🔥 Warming up model...")
        try:
            # Create dummy image
            dummy = np.zeros((1, 224, 224, 3), dtype=np.float32)
            self.model_layer(dummy)
            print("✓ Model warmed up")
        except Exception as e:
            print(f"Warmup error: {e}")


# Singleton instance
ml_model = MLController()
