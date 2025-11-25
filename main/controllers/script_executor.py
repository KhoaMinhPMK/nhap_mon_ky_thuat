"""
Script Executor Module
Handles execution of Blockly-generated scripts
"""

import threading
import time


class ScriptExecutor:
    """Executes Blockly scripts on Arduino"""
    
    def __init__(self, serial_controller, camera_controller, ml_controller, bin_controller):
        self.arduino = serial_controller
        self.camera = camera_controller
        self.ml = ml_controller
        self.bins = bin_controller
        
        self.is_running = False
        self.stop_flag = False
    
    def execute(self, script):
        """
        Start script execution in a separate thread
        
        Args:
            script (list): List of command blocks
            
        Returns:
            bool: True if started successfully
        """
        if self.is_running:
            return False
        
        thread = threading.Thread(target=self._run_script, args=(script,))
        thread.start()
        return True
    
    def stop(self):
        """Request script to stop"""
        self.stop_flag = True
    
    def _run_script(self, script):
        """Internal method to run script"""
        self.is_running = True
        self.stop_flag = False
        
        print("▶ Starting Script Execution...")
        
        try:
            self._execute_block_list(script)
        except Exception as e:
            print(f"✗ Script Error: {e}")
        finally:
            self.is_running = False
            print("■ Script Execution Finished")
    
    def _execute_block_list(self, blocks):
        """Execute a list of blocks"""
        if self.stop_flag:
            return
        
        for block in blocks:
            if self.stop_flag:
                break
            
            cmd_type = block.get("type")
            
            if cmd_type == "M":
                self._execute_move(block)
            elif cmd_type == "R":
                self._execute_relay(block)
            elif cmd_type == "W":
                self._execute_wait(block)
            elif cmd_type == "H":
                self.arduino.send_command("H")
            elif cmd_type == "HX":
                self.arduino.send_command("HX")
            elif cmd_type == "IF":
                self._execute_if(block)
            elif cmd_type == "REPEAT":
                self._execute_repeat(block)
    
    def _execute_move(self, block):
        """Execute move command"""
        x = block.get("x", 0)
        y = block.get("y", 0)
        z = block.get("z", 0)
        t = block.get("time", 1000)
        s = block.get("speed", 50)
        self.arduino.send_command(f"M {x} {y} {z} {t} {s}")
    
    def _execute_relay(self, block):
        """Execute relay command"""
        state = block.get("state", 0)
        self.arduino.send_command(f"R {state}")
    
    def _execute_wait(self, block):
        """Execute wait command"""
        t = block.get("time", 1)
        print(f"⏳ Waiting {t}s...")
        time.sleep(t)
    
    def _execute_if(self, block):
        """Execute conditional block"""
        condition = block.get("condition")
        result = self._evaluate_condition(condition)
        
        print(f"🔀 IF Condition Result: {result}")
        
        if result:
            print("  → Executing THEN branch...")
            self._execute_block_list(block.get("then", []))
        else:
            print("  → Executing ELSE branch...")
            self._execute_block_list(block.get("else", []))
    
    def _execute_repeat(self, block):
        """Execute loop block"""
        count = int(block.get("times", 1))
        print(f"🔄 Repeating {count} times...")
        
        for i in range(count):
            if self.stop_flag:
                break
            print(f"  Loop {i+1}/{count}")
            self._execute_block_list(block.get("do", []))
    
    def _evaluate_condition(self, condition):
        """Evaluate a condition block"""
        if not condition:
            return False
        
        cond_type = condition.get("type")
        
        if cond_type == "CHECK_LABEL":
            return self._check_label(condition)
        
        return False
    
    def _check_label(self, condition):
        """Check if camera sees the specified label"""
        target_label = condition.get("label", "").lower()
        print(f"🏷 Checking Label: {target_label}...")
        
        # Capture frame
        if not self.camera.is_opened():
            print("✗ Camera not initialized")
            return False
        
        success, frame = self.camera.read_frame()
        if not success:
            print("✗ Failed to capture frame")
            return False
        
        # Predict
        idx, label, score = self.ml.predict_frame(frame)
        print(f"  Detected: {label} ({score:.2f})")
        
        # Match check
        clean_label = label.strip().lower()
        label_match = target_label in clean_label
        
        # Check bin status before continuing
        if label_match:
            print("  ✓ Label matched! Checking bin status...")
            self.bins.check_status()
            
            # Stop if target bin is full
            if self.bins.is_bin_full_for_label(target_label):
                print(f"  ⚠️ WARNING: Target bin is FULL!")
                self.stop_flag = True
                return False
            
            # Stop if both bins are full
            if self.bins.bin1_full and self.bins.bin2_full:
                print("  ⚠️ WARNING: Both bins are FULL!")
                self.stop_flag = True
                return False
        
        return label_match
