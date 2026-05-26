from flask import Blueprint, request, jsonify, current_app

from services.onboarding_service import upsert_onboarding

onboarding_bp = Blueprint('onboarding', __name__)

@onboarding_bp.route('/onboarding', methods=['POST'])
def handle_onboarding():
    """Create or update onboarding information for a user.

    Expected JSON payload:
    {
        "uid": "string",
        "role": "student" | "developer" | ...,
        "experience_level": "string",
        "skills": ["skill1", "skill2"],
        "target_role": "string",
        "learning_goals": "string",
        "preferred_domain": "string"
    }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    required_fields = ["uid", "role", "experience_level", "skills", "target_role", "learning_goals", "preferred_domain"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        user_doc = upsert_onboarding(data)
        if user_doc and "_id" in user_doc: user_doc["_id"] = str(user_doc["_id"])
        return jsonify({"message": "Onboarding saved", "user": user_doc}), 200
    except Exception as e:
        current_app.logger.error(f"Onboarding error: {e}")
        return jsonify({"error": "Internal server error"}), 500
