"""
Serial Controller Module
Handles communication with Arduino via Serial
"""

import serial
import threading
import time
from config import SERIAL_PORT, BAUD_RATE, SERIAL_TIMEOUT


class SerialController:
    """Thread-safe serial communication controller"""
    
    def __init__(self):
        self.lock = threading.Lock()
        self.ser = None
        self.connect()

    def connect(self):
        """Establish serial connection to Arduino"""
        try:
            self.ser = serial.Serial(
                SERIAL_PORT, 
                BAUD_RATE, 
                timeout=SERIAL_TIMEOUT
            )
            print(f"✓ Connected to {SERIAL_PORT}")
            time.sleep(2)  # Wait for Arduino reset
        except Exception as e:
            print(f"✗ Serial Error: {e}")
            self.ser = None

    def is_connected(self):
        """Check if serial connection is active"""
        return self.ser is not None and self.ser.is_open

    def reconnect(self):
        """Attempt to reconnect to Arduino"""
        if self.ser:
            try:
                self.ser.close()
            except:
                pass
        self.connect()

    def send_command(self, cmd):
        """
        Send command to Arduino and wait for response
        
        Args:
            cmd (str): Command string to send
            
        Returns:
            str: Response from Arduino or error message
        """
        if not self.ser:
            return "Error: No Serial Connection"
        
        with self.lock:
            try:
                print(f"→ Sending: {cmd}")
                self.ser.write(f"{cmd}\n".encode('utf-8'))
                
                # Wait for acknowledgment
                response = self.ser.readline().decode('utf-8').strip()
                print(f"← Arduino: {response}")
                return response
                
            except Exception as e:
                print(f"✗ Write Error: {e}")
                return f"Error: {e}"

    def close(self):
        """Close serial connection"""
        if self.ser:
            try:
                self.ser.close()
                print("✓ Serial connection closed")
            except:
                pass


# Singleton instance
arduino = SerialController()
