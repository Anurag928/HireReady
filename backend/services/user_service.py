import datetime
from typing import Optional, Dict, Any

from services.mongo_service import get_collection
from pymongo.errors import PyMongoError


def _users_collection():
    return get_collection("users")

def get_user_by_uid(uid: str) -> Optional[Dict[str, Any]]:
    """Return a user document matching the provided uid, or None if not found."""
    try:
        user = _users_collection().find_one({"uid": uid})
        return user
    except PyMongoError as e:
        raise RuntimeError(f"Database error while fetching user: {e}")

def create_user(uid: str, name: str, email: str, photo_url: str) -> Dict[str, Any]:
    """Insert a new user document and return the inserted document.
    ``createdAt`` and ``lastLogin`` are set to current UTC time.
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    doc = {
        "uid": uid,
        "name": name,
        "email": email,
        "photoURL": photo_url,
        "onboarding_completed": False,
        "profile_complete": False,
        "createdAt": now,
        "lastLogin": now,
    }
    try:
        result = _users_collection().insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc
    except PyMongoError as e:
        raise RuntimeError(f"Database error while creating user: {e}")

def update_last_login(uid: str) -> Optional[Dict[str, Any]]:
    """Update the ``lastLogin`` field for the given uid and return the updated document.
    Returns None if the user does not exist.
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    try:
        result = _users_collection().find_one_and_update(
            {"uid": uid},
            {"$set": {"lastLogin": now}},
            return_document=True,
        )
        return result
    except PyMongoError as e:
        raise RuntimeError(f"Database error while updating lastLogin: {e}")

def upsert_user(data: Dict[str, Any], is_update: bool = False) -> Optional[Dict[str, Any]]:
    """Insert or update a user document.

    Parameters
    ----------
    data: dict
        Must contain ``uid``, ``name``, ``email``, ``photoURL``.
    is_update: bool
        If True, treats operation as an update (only updates mutable fields and ``lastLogin``).
        If False, creates a new user with defaults for profile completion flags.
    Returns
    -------
    dict
        The user document after the upsert.
    """
    uid = data.get("uid")
    if not uid:
        raise ValueError("uid is required for upsert_user")

    now = datetime.datetime.now(datetime.timezone.utc)
    # Base fields to set on every upsert
    update_fields = {
        "name": data.get("name"),
        "email": data.get("email"),
        "photoURL": data.get("photoURL"),
        "lastLogin": now,
    }
    set_on_insert = {
        "onboarding_completed": False,
        "profile_complete": False,
        "createdAt": now,
    }
    try:
        _users_collection().update_one(
            {"uid": uid},
            {
                "$set": update_fields,
                "$setOnInsert": set_on_insert,
            },
            upsert=True,
        )
        # Return the latest document state
        user_doc = _users_collection().find_one({"uid": uid})
        return user_doc
    except PyMongoError as e:
        raise RuntimeError(f"Database error during upsert_user: {e}")

def delete_user_data(uid: str) -> bool:
    """Delete all data associated with a user across all collections."""
    try:
        # Delete main user record
        _users_collection().delete_one({"uid": uid})
        
        # Delete associated records in other collections
        from services.mongo_service import get_collection
        
        collections_to_clear = [
            "activities",
            "mock_interviews",
            "interview_history",
            "resumes",
            "resume_history",
            "roadmaps",
            "roadmap_history"
        ]
        
        for col_name in collections_to_clear:
            collection = get_collection(col_name)
            # Most collections associate via "uid", some might use "userId", we'll check both just in case,
            # but standard is "uid"
            collection.delete_many({"uid": uid})
            
        return True
    except PyMongoError as e:
        raise RuntimeError(f"Database error during delete_user_data: {e}")
