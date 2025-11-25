"""
Script Executor with WebSocket & Queue Support
Enhanced version with:
- Queue system for multiple scripts
- WebSocket progress callbacks
- Priority execution
- Optimized performance
"""

import threading
import time
from queue import Queue, PriorityQueue
from dataclasses import dataclass, field
from typing import Any


@dataclass(order=True)
class ScriptTask:
    """Script task with priority support"""
    priority: int
    script: Any = field(compare=False)
    task_id: str = field(compare=False)


class ScriptExecutorWS:
    """Script executor with WebSocket support and queue system"""
    
    def __init__(self, serial_controller, camera_controller, ml_controller, bin_controller, socketio):
        self.arduino = serial_controller
        self.camera = camera_controller
        self.ml = ml_controller
        self.bins = bin_controller
        self.socketio = socketio
        
        # Execution state
        self.is_running = False
        self.stop_flag = False
        self.pause_flag = False
        
        # Progress tracking
        self.current_step = 0
        self.total_steps = 0
        self.current_task_id = None
        
        # Queue system
        self.script_queue = PriorityQueue()
        self.task_counter = 0
        
        # Start queue processor thread
        self.queue_thread = threading.Thread(target=self._queue_processor, daemon=True)
        self.queue_thread.start()
        
        # ML Model pre-warming (load in background)
        self._ml_loaded = False
        threading.Thread(target=self._prewarm_ml, daemon=True).start()
    
    def _prewarm_ml(self):
        """Pre-warm ML model in background"""
        time.sleep(2)  # Wait a bit for other init
        if not self._ml_loaded:
            print("🔥 Pre-warming ML model...")
            self.ml.load_model()
            self._ml_loaded = True
            self._emit('ml_ready', {'status': 'loaded'})
    
    def _emit(self, event, data):
        """Emit WebSocket event safely"""
        if self.socketio:
            try:
                self.socketio.emit(event, data)
            except Exception as e:
                print(f"WebSocket emit error: {e}")
    
    def enqueue(self, script, priority=10):
        """
        Add script to queue
        
        Args:
            script: List of command blocks
            priority: Lower = higher priority (default 10)
            
        Returns:
            str: Task ID
        """
        self.task_counter += 1
        task_id = f"task_{self.task_counter}_{int(time.time())}"
        
        task = ScriptTask(
            priority=priority,
            script=script,
            task_id=task_id
        )
        
        self.script_queue.put(task)
        
        self._emit('script_queued', {
            'task_id': task_id,
            'queue_size': self.queue_size(),
            'priority': priority
        })
        
        return task_id
    
    def execute_priority(self, script):
        """Execute script with high priority (cuts the queue)"""
        return self.enqueue(script, priority=1)
    
    def execute(self, script):
        """Direct execution (backwards compatibility)"""
        return self.enqueue(script, priority=5)
    
    def queue_size(self):
        """Get current queue size"""
        return self.script_queue.qsize()
    
    def clear_queue(self):
        """Clear all pending scripts"""
        while not self.script_queue.empty():
            try:
                self.script_queue.get_nowait()
            except:
                break
        
        self._emit('queue_cleared', {'queue_size': 0})
    
    def stop(self):
        """Stop current script execution"""
        self.stop_flag = True
        self._emit('script_stopping', {'task_id': self.current_task_id})
    
    def pause(self):
        """Pause execution"""
        self.pause_flag = True
        self._emit('script_paused', {'task_id': self.current_task_id})
    
    def resume(self):
        """Resume execution"""
        self.pause_flag = False
        self._emit('script_resumed', {'task_id': self.current_task_id})
    
    def _queue_processor(self):
        """Background thread that processes script queue"""
        while True:
            try:
                # Wait for next task
                task = self.script_queue.get(timeout=1)
                
                # Execute it
                self._run_script(task.script, task.task_id)
                
                # Mark as done
                self.script_queue.task_done()
                
            except:
                # Queue empty or timeout - continue waiting
                pass
    
    def _run_script(self, script, task_id):
        """Execute a script with progress tracking"""
        self.is_running = True
        self.stop_flag = False
        self.pause_flag = False
        self.current_task_id = task_id
        self.current_step = 0
        self.total_steps = self._count_steps(script)
        
        self._emit('script_started', {
            'task_id': task_id,
            'total_steps': self.total_steps
        })
        
        print(f"▶ Starting Script {task_id} ({self.total_steps} steps)")
        
        # Debug: Show script content
        if not script or len(script) == 0:
            print(f"⚠ Script is empty!")
        else:
            print(f"📋 Script blocks: {[b.get('type') for b in script[:5]]}...")
        
        try:
            self._execute_block_list(script)
            
            self._emit('script_completed', {
                'task_id': task_id,
                'status': 'completed' if not self.stop_flag else 'stopped'
            })
            
        except Exception as e:
            print(f"✗ Script Error: {e}")
            self._emit('script_error', {
                'task_id': task_id,
                'error': str(e)
            })
        finally:
            self.is_running = False
            self.current_task_id = None
            print(f"■ Script {task_id} Finished")
    
    def _count_steps(self, blocks):
        """Count total steps in script (including nested)"""
        count = 0
        for block in blocks:
            count += 1
            if block.get("type") == "REPEAT":
                times = int(block.get("times", 1))
                inner = self._count_steps(block.get("do", []))
                count += times * inner
            elif block.get("type") == "IF":
                count += self._count_steps(block.get("then", []))
                count += self._count_steps(block.get("else", []))
        return count
    
    def _execute_block_list(self, blocks):
        """Execute a list of blocks with progress updates"""
        if not blocks:
            print("⚠ Empty block list!")
            return
            
        for block in blocks:
            # Check stop flag
            if self.stop_flag:
                print(f"⏹ Stop flag detected, breaking...")
                break
            
            # Handle pause
            while self.pause_flag:
                time.sleep(0.1)
                if self.stop_flag:
                    break
            
            # Update progress
            self.current_step += 1
            self._emit('script_progress', {
                'task_id': self.current_task_id,
                'current_step': self.current_step,
                'total_steps': self.total_steps,
                'percent': round(self.current_step / max(self.total_steps, 1) * 100, 1),
                'block_type': block.get("type")
            })
            
            # Execute block
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
        
        self._emit('executing', {'action': 'move', 'params': {'x': x, 'y': y, 'z': z, 'time': t, 'speed': s}})
        self.arduino.send_command(f"M {x} {y} {z} {t} {s}")
    
    def _execute_relay(self, block):
        """Execute relay command"""
        state = block.get("state", 0)
        self._emit('executing', {'action': 'relay', 'state': state})
        self.arduino.send_command(f"R {state}")
    
    def _execute_wait(self, block):
        """Execute wait command with progress updates"""
        t = block.get("time", 1)
        self._emit('executing', {'action': 'wait', 'duration': t})
        
        # Wait with granular updates
        start = time.time()
        while time.time() - start < t:
            if self.stop_flag:
                break
            while self.pause_flag:
                time.sleep(0.1)
            time.sleep(0.1)
    
    def _execute_if(self, block):
        """Execute conditional block"""
        condition = block.get("condition")
        result = self._evaluate_condition(condition)
        
        self._emit('executing', {'action': 'if', 'condition_result': result})
        
        if result:
            self._execute_block_list(block.get("then", []))
        else:
            self._execute_block_list(block.get("else", []))
    
    def _execute_repeat(self, block):
        """Execute loop block"""
        count = int(block.get("times", 1))
        
        for i in range(count):
            if self.stop_flag:
                break
            
            self._emit('executing', {'action': 'repeat', 'iteration': i + 1, 'total': count})
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
        
        self._emit('executing', {'action': 'check_label', 'target': target_label})
        
        # Ensure ML model is loaded
        if not self._ml_loaded:
            self._emit('ml_loading', {'status': 'loading'})
            self.ml.load_model()
            self._ml_loaded = True
        
        # Capture frame
        if not self.camera.is_opened():
            self._emit('error', {'message': 'Camera not ready'})
            return False
        
        success, frame = self.camera.read_frame()
        if not success:
            self._emit('error', {'message': 'Failed to capture frame'})
            return False
        
        # Predict
        idx, label, score = self.ml.predict_frame(frame)
        
        self._emit('prediction', {
            'label': label,
            'confidence': round(score * 100, 1),
            'target': target_label
        })
        
        # Match check
        clean_label = label.strip().lower()
        label_match = target_label in clean_label
        
        # Check bin status if match
        if label_match:
            self.bins.check_status()
            bin_status = self.bins.get_status()
            
            self._emit('bin_status', bin_status)
            
            if self.bins.is_bin_full_for_label(target_label):
                self._emit('bin_full_warning', {
                    'label': target_label,
                    'bin_status': bin_status
                })
                self.stop_flag = True
                return False
        
        return label_match
