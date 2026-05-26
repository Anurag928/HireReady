import datetime
from typing import Dict, Any

from services.mongo_service import users_collection
from pymongo.errors import PyMongoError


from typing import Dict, Any, Optional

def upsert_onboarding(data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update onboarding information for an existing user.

    Parameters
    ----------
    data: dict
        Must contain ``uid`` and onboarding fields:
        ``role``, ``experience_level``, ``skills``, ``target_role``,
        ``learning_goals``, ``preferred_domain``.

    Returns
    -------
    dict
        The updated user document after the operation.
    """
    uid = data.get("uid")
    if not uid:
        raise ValueError("uid is required for onboarding upsert")

    # Prepare fields to set
    onboarding_fields = {
        "role": data.get("role"),
        "experience_level": data.get("experience_level"),
        "skills": data.get("skills"),
        "target_role": data.get("target_role"),
        "learning_goals": data.get("learning_goals"),
        "preferred_domain": data.get("preferred_domain"),
        "onboarding_completed": True,
        "profile_complete": True,
        "updatedAt": datetime.datetime.now(datetime.timezone.utc),
    }

    try:
        result = users_collection.update_one({"uid": uid}, {"$set": onboarding_fields})
        if result.matched_count == 0:
            raise RuntimeError(f"User with uid {uid} not found for onboarding update")
        # Return the latest document state
        user_doc = users_collection.find_one({"uid": uid})
        return user_doc
    except PyMongoError as e:
        raise RuntimeError(f"Database error during onboarding upsert: {e}")
