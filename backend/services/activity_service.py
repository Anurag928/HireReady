from datetime import datetime, timezone
import logging
from typing import List, Dict

def log_activity(uid: str, title: str, category: str = "general") -> bool:
    """
    Logs a new user activity into the database.
    
    Args:
        uid: User ID
        title: Description of the activity (e.g. "Roadmap Generated")
        category: Category string (e.g. "roadmap", "interview", "resume", "profile")
    """
    try:
        from services.mongo_service import get_collection
        collection = get_collection("activities")
        
        doc = {
            "uid": uid,
            "title": title,
            "category": category,
            "timestamp": datetime.now(timezone.utc)
        }
        collection.insert_one(doc)
        return True
    except Exception as e:
        logging.error(f"Failed to log activity: {e}")
        return False

def get_recent_activities(uid: str, limit: int = 5) -> List[Dict]:
    """
    Fetches recent activities for the user.
    """
    try:
        from services.mongo_service import get_collection
        collection = get_collection("activities")
        
        activities = list(collection.find({"uid": uid}).sort("timestamp", -1).limit(limit))
        
        # Format the timestamp for the frontend
        formatted_activities = []
        for act in activities:
            # We calculate a simple "time ago" string or just send the ISO string and let frontend handle
            formatted_activities.append({
                "title": act.get("title"),
                "category": act.get("category"),
                "timestamp": act.get("timestamp").isoformat() if act.get("timestamp") else None
            })
            
        return formatted_activities
    except Exception as e:
        logging.error(f"Failed to fetch activities: {e}")
        return []
