from datetime import datetime, timezone
from services.ai_service import generate_roadmap_json
from services.user_service import get_user_by_uid
from services.mongo_service import db

# Collection for storing roadmaps
roadmaps_collection = db["roadmaps"]
roadmap_history_collection = db["roadmap_history"]

import logging

from typing import Optional

def create_and_store_roadmap(uid: str, force_regenerate: bool = False, strategy_mode: Optional[str] = None) -> Optional[dict]:
    """Fetch user, generate roadmap via AI, and store in MongoDB."""
    logging.info(f"[Roadmap Service] Initiating roadmap for {uid}")
    
    try:
        user = get_user_by_uid(uid)
        if not user:
            raise Exception("User not found")
        if not user.get("onboarding_completed"):
            raise Exception("User must complete onboarding before generating a roadmap")
        logging.info("[Roadmap Service] MongoDB user fetch successful")
    except Exception as e:
        raise Exception(f'{{"stage": "mongodb_fetch", "error": "{str(e)}"}}')
        
    try:
        # Check if roadmap already exists in MongoDB cache (unless forcing regeneration)
        if not force_regenerate:
            existing_roadmap = roadmaps_collection.find_one({"uid": uid})
            if existing_roadmap:
                logging.info(f"[Roadmap Service] Found cached roadmap for {uid}, returning instantly")
                if "_id" in existing_roadmap:
                    existing_roadmap["_id"] = str(existing_roadmap["_id"])
                return existing_roadmap
    except Exception as e:
        logging.error(f"Error checking roadmap cache: {e}")
        
    # generate_roadmap_json handles its own internal stage errors
    roadmap_data = generate_roadmap_json(user, force_regenerate=force_regenerate, strategy_mode=strategy_mode)
    
    now = datetime.now(timezone.utc)
    
    # Calculate trajectory based on score difference if possible
    trajectory = "Stable"
    try:
        existing = roadmaps_collection.find_one({"uid": uid})
        if existing:
            prev_score = existing.get("readiness_score", existing.get("roadmap_score", 0))
            curr_score = roadmap_data.get("readiness_score", roadmap_data.get("roadmap_score", 0))
            if curr_score > prev_score + 10:
                trajectory = "Accelerating"
            elif curr_score > prev_score + 2:
                trajectory = "Strong"
            elif curr_score < prev_score:
                trajectory = "Needs Focus"
    except:
        pass

    roadmap_doc = {
        "uid": uid,
        "createdAt": now,
        "updatedAt": now,
        "generationStatus": "success",
        "aiModelUsed": "gemini-1.5-flash",
        "focus_area": roadmap_data.get("focus_area", "Balanced Strategy"),
        "roadmap_score": roadmap_data.get("roadmap_score", 85),
        "readiness_score": roadmap_data.get("readiness_score", 50),
        "strongest_skill": roadmap_data.get("strongest_skill", "N/A"),
        "biggest_weakness": roadmap_data.get("biggest_weakness", "N/A"),
        "strategy_mode": roadmap_data.get("strategy_mode", "Standard"),
        "trajectory": roadmap_data.get("trajectory", trajectory),
        "top_gap": roadmap_data.get("biggest_weakness", "N/A"),
        "roadmap": roadmap_data
    }
    
    try:
        logging.info("[Roadmap Service] Saving roadmap to MongoDB")
        
        # Check for existing version number
        existing = roadmaps_collection.find_one({"uid": uid})
        roadmapVersion = 1
        if existing and "roadmapVersion" in existing:
            roadmapVersion = existing["roadmapVersion"] + 1
        elif existing and "version" in existing:
            roadmapVersion = existing["version"] + 1

        roadmap_doc["roadmapVersion"] = roadmapVersion
        
        if existing and "createdAt" in existing:
            roadmap_doc["createdAt"] = existing["createdAt"]
        
        # Upsert the active roadmap
        roadmaps_collection.replace_one(
            {"uid": uid}, 
            roadmap_doc, 
            upsert=True
        )
        
        # Save to history collection
        history_doc = roadmap_doc.copy()
        history_doc["_id"] = None
        roadmap_history_collection.insert_one(history_doc)
        
        # Return document
        saved_roadmap = roadmaps_collection.find_one({"uid": uid})
        if saved_roadmap and "_id" in saved_roadmap:
            saved_roadmap["_id"] = str(saved_roadmap["_id"])
            
        logging.info("[Roadmap Service] Roadmap saved successfully")
        return saved_roadmap
    except Exception as e:
        raise Exception(f'{{"stage": "mongodb_save", "error": "{str(e)}"}}')

def get_roadmap_history(uid: str) -> list:
    """Fetch all past roadmap versions for a user."""
    history_cursor = roadmap_history_collection.find({"uid": uid}).sort("createdAt", -1)
    history = []
    for doc in history_cursor:
        doc["_id"] = str(doc["_id"])
        history.append(doc)
    return history

def get_roadmap_version(version_id: str) -> Optional[dict]:
    """Fetch a specific roadmap version by ID."""
    from bson.objectid import ObjectId
    try:
        doc = roadmap_history_collection.find_one({"_id": ObjectId(version_id)})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc
    except:
        return None
