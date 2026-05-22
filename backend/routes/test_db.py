from flask import Blueprint, jsonify, current_app
from services.mongo_service import users_collection
import traceback

test_db_bp = Blueprint('test_db', __name__)

@test_db_bp.route('/test-db', methods=['GET'])
def test_db():
    try:
        # Insert a sample document
        result = users_collection.insert_one({"name": "test_user", "created_at": current_app.config.get('NOW')})
        return jsonify({
            "status": "success",
            "inserted_id": str(result.inserted_id)
        }), 200
    except Exception as e:
        # Log error and return failure response
        current_app.logger.error(f"MongoDB insertion error: {e}\n{traceback.format_exc()}")
        return jsonify({"status": "error", "message": str(e)}), 500
