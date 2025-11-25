"""
Cloud Sync Controller Module
Handles pushing data to remote PHP API for mobile app access
"""

import requests
import threading
import time
from datetime import datetime

# Cloud API Configuration
CLOUD_API_URL = "https://bkuteam.site/upload"
CLOUD_AUTH = ("root", "123456")  # Basic Auth credentials

class CloudSyncController:
    """Controller for syncing local data to cloud"""
    
    def __init__(self, device_id="device_001"):
        self.device_id = device_id
        self.enabled = True
        self._sync_thread = None
        self._stop_flag = False
    
    def _post_data(self, endpoint, data):
        """Send POST request to cloud API"""
        try:
            url = f"{CLOUD_API_URL}/{endpoint}"
            response = requests.post(
                url,
                json=data,
                auth=CLOUD_AUTH,
                timeout=10
            )
            if response.status_code == 200:
                print(f"☁ Cloud sync OK: {endpoint}")
                return response.json()
            else:
                print(f"⚠ Cloud sync error {response.status_code}: {endpoint}")
                return None
        except Exception as e:
            print(f"✗ Cloud sync failed: {e}")
            return None
    
    # ==================== PUSH METHODS ====================
    
    def push_inventory(self, bins_data):
        """
        Push inventory status to cloud
        
        Args:
            bins_data: List of bin dicts with keys:
                - bin_id, bin_name, current_count, max_capacity, is_full, last_item_class
        """
        if not self.enabled:
            return
        
        data = {
            "type": "inventory",
            "inventory": {
                "device_id": self.device_id,
                "bins": bins_data
            }
        }
        return self._post_data("push_data.php", data)
    
    def push_alert(self, alert_type, message, bin_id=None, severity="warning"):
        """
        Push alert to cloud
        
        Args:
            alert_type: e.g., "bin_full", "error", "maintenance"
            message: Alert message text
            bin_id: Related bin ID (optional)
            severity: "info", "warning", "critical"
        """
        if not self.enabled:
            return
        
        data = {
            "type": "alert",
            "alert": {
                "device_id": self.device_id,
                "alert_type": alert_type,
                "bin_id": bin_id,
                "message": message,
                "severity": severity
            }
        }
        return self._post_data("push_data.php", data)
    
    def push_device_status(self, is_online=True, serial_connected=False, script_running=False, ip_address=None):
        """
        Push device status (heartbeat) to cloud
        """
        if not self.enabled:
            return
        
        data = {
            "type": "device_status",
            "device_status": {
                "device_id": self.device_id,
                "device_name": "PDscript Control Center",
                "is_online": is_online,
                "serial_connected": serial_connected,
                "script_running": script_running,
                "ip_address": ip_address
            }
        }
        return self._post_data("push_data.php", data)
    
    def push_detection(self, class_name, class_id, confidence, bin_id=None):
        """
        Push detection log to cloud (also updates inventory)
        
        Args:
            class_name: Detected class name
            class_id: Class ID
            confidence: Confidence score (0-1)
            bin_id: Target bin ID (for auto inventory update)
        """
        if not self.enabled:
            return
        
        data = {
            "type": "detection",
            "detection": {
                "device_id": self.device_id,
                "class_name": class_name,
                "class_id": class_id,
                "confidence": confidence,
                "bin_id": bin_id,
                "timestamp": datetime.now().isoformat()
            }
        }
        return self._post_data("push_data.php", data)
    
    # ==================== HEARTBEAT ====================
    
    def start_heartbeat(self, interval=30, serial_controller=None, executor=None):
        """
        Start background thread for periodic status updates
        
        Args:
            interval: Seconds between heartbeats
            serial_controller: Reference to check serial connection
            executor: Reference to check if script is running
        """
        def _heartbeat_loop():
            import socket
            try:
                # Get local IP
                s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                s.connect(("8.8.8.8", 80))
                local_ip = s.getsockname()[0]
                s.close()
            except:
                local_ip = "unknown"
            
            while not self._stop_flag:
                serial_ok = serial_controller.is_connected() if serial_controller else False
                running = executor.is_running if executor else False
                
                self.push_device_status(
                    is_online=True,
                    serial_connected=serial_ok,
                    script_running=running,
                    ip_address=local_ip
                )
                
                time.sleep(interval)
        
        self._stop_flag = False
        self._sync_thread = threading.Thread(target=_heartbeat_loop, daemon=True)
        self._sync_thread.start()
        print(f"☁ Cloud heartbeat started (every {interval}s)")
    
    def stop_heartbeat(self):
        """Stop heartbeat thread"""
        self._stop_flag = True
        # Push offline status
        self.push_device_status(is_online=False)


# Singleton instance
cloud_sync = CloudSyncController()
