"""
Bin Status Controller Module
Handles bin status checking and management
"""

import time
from config import BIN_CHECK_SAMPLES, BIN_CHECK_INTERVAL, BIN_FULL_THRESHOLD


class BinController:
    """Controller for managing bin status (Premium & Second-grade)"""
    
    def __init__(self, serial_controller):
        self.arduino = serial_controller
        self.bin1_full = False  # Premium bin
        self.bin2_full = False  # Second-grade bin
        self.bin1_count = 0     # Item count in bin 1
        self.bin2_count = 0     # Item count in bin 2
        self.bin1_capacity = 50 # Max capacity
        self.bin2_capacity = 50
        self._email_controller = None
        self._cloud_sync = None
    
    def set_email_controller(self, email_controller):
        """Set email controller for notifications"""
        self._email_controller = email_controller
    
    def set_cloud_sync(self, cloud_sync):
        """Set cloud sync controller"""
        self._cloud_sync = cloud_sync
    
    def check_status(self):
        """
        Check bin status by reading sensors over time.
        Distinguishes 'actually full' vs 'object falling through'.
        
        Returns:
            tuple: (bin1_full, bin2_full)
        """
        s1_samples = []
        s2_samples = []
        
        # Track previous state to detect change
        was_bin1_full = self.bin1_full
        was_bin2_full = self.bin2_full
        
        print("🔍 Checking bin status...")
        
        # Take samples over time
        for _ in range(BIN_CHECK_SAMPLES):
            try:
                resp = self.arduino.send_command("C")
                if resp and "S1:" in resp:
                    parts = resp.split('|')
                    s1 = int(parts[0].split(':')[1])
                    s2 = int(parts[1].split(':')[1])
                    s1_samples.append(s1)
                    s2_samples.append(s2)
            except Exception as e:
                print(f"✗ Error reading sensors: {e}")
            
            time.sleep(BIN_CHECK_INTERVAL)
        
        # Analyze: if >= threshold samples = 0 (detected) → Bin is full
        if len(s1_samples) > 0:
            s1_zero_ratio = s1_samples.count(0) / len(s1_samples)
            s2_zero_ratio = s2_samples.count(0) / len(s2_samples)
            
            self.bin1_full = s1_zero_ratio >= BIN_FULL_THRESHOLD
            self.bin2_full = s2_zero_ratio >= BIN_FULL_THRESHOLD
            
            print(f"  Bin 1 (Premium): {s1_zero_ratio*100:.1f}% → {'FULL' if self.bin1_full else 'OK'}")
            print(f"  Bin 2 (Second):  {s2_zero_ratio*100:.1f}% → {'FULL' if self.bin2_full else 'OK'}")
            
            # Send email notification if bin just became full
            if self._email_controller:
                if self.bin1_full and not was_bin1_full:
                    self._email_controller.notify_bin_full(1, s1_zero_ratio * 100)
                if self.bin2_full and not was_bin2_full:
                    self._email_controller.notify_bin_full(2, s2_zero_ratio * 100)
            
            # Send cloud alert if bin just became full
            if self._cloud_sync:
                if self.bin1_full and not was_bin1_full:
                    self._cloud_sync.push_alert(
                        alert_type="bin_full",
                        message=f"Thùng Premium (Bin 1) đã đầy! ({s1_zero_ratio*100:.0f}%)",
                        bin_id=1,
                        severity="critical"
                    )
                if self.bin2_full and not was_bin2_full:
                    self._cloud_sync.push_alert(
                        alert_type="bin_full",
                        message=f"Thùng Second-grade (Bin 2) đã đầy! ({s2_zero_ratio*100:.0f}%)",
                        bin_id=2,
                        severity="critical"
                    )
        
        return self.bin1_full, self.bin2_full
    
    def get_status(self):
        """
        Get current bin status without checking
        
        Returns:
            dict: Status of both bins
        """
        return {
            "bin1_full": self.bin1_full,
            "bin2_full": self.bin2_full,
            "bin1_count": self.bin1_count,
            "bin2_count": self.bin2_count
        }
    
    def reset(self):
        """Reset bin flags (after user cleans the bins)"""
        self.bin1_full = False
        self.bin2_full = False
        self.bin1_count = 0
        self.bin2_count = 0
        print("✓ Bin flags reset")
        
        # Sync to cloud
        if self._cloud_sync:
            self._cloud_sync.push_alert(
                alert_type="bin_reset",
                message="Tất cả thùng chứa đã được reset",
                severity="info"
            )
            self._sync_inventory_to_cloud()
    
    def add_item(self, bin_id, class_name="Unknown"):
        """
        Add item to bin and sync to cloud
        
        Args:
            bin_id: 1 for Premium, 2 for Second-grade
            class_name: Classification label
        """
        if bin_id == 1:
            self.bin1_count += 1
            if self.bin1_count >= self.bin1_capacity:
                self.bin1_full = True
        elif bin_id == 2:
            self.bin2_count += 1
            if self.bin2_count >= self.bin2_capacity:
                self.bin2_full = True
        
        # Push detection to cloud
        if self._cloud_sync:
            self._cloud_sync.push_detection(
                class_name=class_name,
                class_id=bin_id,
                confidence=0.95,  # Default confidence
                bin_id=bin_id
            )
            self._sync_inventory_to_cloud()
    
    def _sync_inventory_to_cloud(self):
        """Push current inventory status to cloud"""
        if self._cloud_sync:
            bins_data = [
                {
                    "bin_id": 1,
                    "bin_name": "Premium Bin",
                    "current_count": self.bin1_count,
                    "max_capacity": self.bin1_capacity,
                    "is_full": self.bin1_full,
                    "last_item_class": "Premium-grade watermelon"
                },
                {
                    "bin_id": 2,
                    "bin_name": "Second-grade Bin",
                    "current_count": self.bin2_count,
                    "max_capacity": self.bin2_capacity,
                    "is_full": self.bin2_full,
                    "last_item_class": "Second-grade watermelon"
                }
            ]
            self._cloud_sync.push_inventory(bins_data)
    
    def is_any_full(self):
        """Check if any bin is full"""
        return self.bin1_full or self.bin2_full
    
    def is_bin_full_for_label(self, label):
        """
        Check if the appropriate bin is full for a given label
        
        Args:
            label (str): Product label (e.g., "Premium-grade watermelon")
            
        Returns:
            bool: True if the target bin is full
        """
        label_lower = label.lower()
        
        if "premium" in label_lower:
            return self.bin1_full
        elif "second" in label_lower:
            return self.bin2_full
        
        return False
