"""
History Controller Module
Handles logging and history of operations
"""

import json
import os
from datetime import datetime
from config import BASE_DIR


class HistoryController:
    """Controller for managing operation history and logs"""
    
    def __init__(self, log_file=None):
        self.log_file = log_file or os.path.join(BASE_DIR, "main", "history.json")
        self.history = []
        self._load_history()
    
    def _load_history(self):
        """Load history from file"""
        try:
            if os.path.exists(self.log_file):
                with open(self.log_file, 'r', encoding='utf-8') as f:
                    self.history = json.load(f)
        except Exception as e:
            print(f"⚠ Could not load history: {e}")
            self.history = []
    
    def _save_history(self):
        """Save history to file"""
        try:
            with open(self.log_file, 'w', encoding='utf-8') as f:
                json.dump(self.history, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"⚠ Could not save history: {e}")
    
    def log(self, action, details=None, status="success"):
        """
        Log an action to history
        
        Args:
            action: Action name (e.g., "script_run", "prediction", "bin_reset")
            details: Additional details dict
            status: "success", "error", "warning"
        """
        entry = {
            "timestamp": datetime.now().isoformat(),
            "action": action,
            "status": status,
            "details": details or {}
        }
        
        self.history.append(entry)
        
        # Keep only last 1000 entries
        if len(self.history) > 1000:
            self.history = self.history[-1000:]
        
        self._save_history()
        return entry
    
    def get_history(self, limit=100, action_filter=None):
        """
        Get recent history
        
        Args:
            limit: Max entries to return
            action_filter: Filter by action type
            
        Returns:
            list: History entries
        """
        filtered = self.history
        
        if action_filter:
            filtered = [h for h in filtered if h.get("action") == action_filter]
        
        return filtered[-limit:]
    
    def get_stats(self):
        """Get statistics from history"""
        stats = {
            "total_actions": len(self.history),
            "by_action": {},
            "by_status": {
                "success": 0,
                "error": 0,
                "warning": 0
            }
        }
        
        for entry in self.history:
            action = entry.get("action", "unknown")
            status = entry.get("status", "unknown")
            
            stats["by_action"][action] = stats["by_action"].get(action, 0) + 1
            if status in stats["by_status"]:
                stats["by_status"][status] += 1
        
        return stats
    
    def clear(self):
        """Clear all history"""
        self.history = []
        self._save_history()


# Singleton instance
history = HistoryController()
