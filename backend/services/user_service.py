import datetime
from typing import Optional, Dict, Any

from services.mongo_service import users_collection
from pymongo.errors import PyMongoError

def get_user_by_uid(uid: str) -> Optional[Dict[str, Any]]:
    """Return a user document matching the provided uid, or None if not found."""
    try:
        user = users_collection.find_one({"uid": uid})
        return user
    except PyMongoError as e:
        raise RuntimeError(f"Database error while fetching user: {e}")

def create_user(uid: str, name: str, email: str, photo_url: str) -> Dict[str, Any]:
    """Insert a new user document and return the inserted document.
    ``createdAt`` and ``lastLogin`` are set to current UTC time.
    """
    now = datetime.datetime.utcnow()
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
        result = users_collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc
    except PyMongoError as e:
        raise RuntimeError(f"Database error while creating user: {e}")

def update_last_login(uid: str) -> Optional[Dict[str, Any]]:
    """Update the ``lastLogin`` field for the given uid and return the updated document.
    Returns None if the user does not exist.
    """
    now = datetime.datetime.utcnow()
    try:
        result = users_collection.find_one_and_update(
            {"uid": uid},
            {"$set": {"lastLogin": now}},
            return_document=True,
        )
        return result
    except PyMongoError as e:
        raise RuntimeError(f"Database error while updating lastLogin: {e}")

def upsert_user(data: Dict[str, Any], is_update: bool = False) -> Dict[str, Any]:
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

    now = datetime.datetime.utcnow()
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
        users_collection.update_one(
            {"uid": uid},
            {
                "$set": update_fields,
                "$setOnInsert": set_on_insert,
            },
            upsert=True,
        )
        # Return the latest document state
        user_doc = users_collection.find_one({"uid": uid})
        return user_doc
    except PyMongoError as e:
        raise RuntimeError(f"Database error during upsert_user: {e}")
