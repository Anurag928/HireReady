from flask import Blueprint, request, jsonify, current_app
from services.user_service import get_user_by_uid, upsert_user
from bson import ObjectId

user_bp = Blueprint('user', __name__)

@user_bp.route('/user', methods=['POST'])
def create_or_update_user():
    """Create a new user document or return existing one.

    Expected JSON payload:
    {
        "uid": "string",
        "name": "string",
        "email": "string",
        "photoURL": "string"
    }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    # Validate required fields
    if not data.get("uid"):
        return jsonify({"error": "Missing field: uid"}), 400

    try:
        # Try to fetch existing user
        existing_user = get_user_by_uid(data["uid"])  # returns None if not found
        if existing_user:
            # Update lastLogin timestamp
            updated_user = upsert_user(data, is_update=True)
            if updated_user and "_id" in updated_user: updated_user["_id"] = str(updated_user["_id"])
            return jsonify({"message": "User exists", "user": updated_user}), 200
        else:
            new_user = upsert_user(data, is_update=False)
            if new_user and "_id" in new_user: new_user["_id"] = str(new_user["_id"])
            try:
                from services.activity_service import log_activity
                log_activity(data["uid"], "Account Created", "profile", event_type="ACCOUNT_CREATED")
            except Exception as e:
                current_app.logger.error(f"Failed to log ACCOUNT_CREATED: {e}")
            return jsonify({"message": "User saved successfully", "user": new_user}), 201
    except Exception as e:
        current_app.logger.error(f"User persistence error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@user_bp.route('/user/<uid>', methods=['GET'])
def get_user(uid):
    """Fetch user by uid"""
    try:
        user = get_user_by_uid(uid)
        if not user:
            return jsonify({"error": "User not found"}), 404
        if "_id" in user: user["_id"] = str(user["_id"])
        return jsonify({"message": "Success", "user": user}), 200
    except Exception as e:
        current_app.logger.error(f"Fetch user error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@user_bp.route('/user/<uid>', methods=['DELETE'])
def delete_user(uid):
    """Delete a user and all their associated data."""
    try:
        from services.user_service import delete_user_data
        success = delete_user_data(uid)
        if success:
            return jsonify({"message": "User and all associated data deleted successfully"}), 200
        else:
            return jsonify({"error": "Failed to delete user"}), 500
    except Exception as e:
        current_app.logger.error(f"Delete user error: {e}")
        return jsonify({"error": "Internal server error"}), 500
