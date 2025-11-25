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
        self._email_controller = None
    
    def set_email_controller(self, email_controller):
        """Set email controller for notifications"""
        self._email_controller = email_controller
    
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
        
        return self.bin1_full, self.bin2_full
    
    def get_status(self):
        """
        Get current bin status without checking
        
        Returns:
            dict: Status of both bins
        """
        return {
            "bin1_full": self.bin1_full,
            "bin2_full": self.bin2_full
        }
    
    def reset(self):
        """Reset bin flags (after user cleans the bins)"""
        self.bin1_full = False
        self.bin2_full = False
        print("✓ Bin flags reset")
    
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
