from flask import Blueprint, request, current_app
from services.roadmap_service import create_and_store_roadmap, get_roadmap_history, get_roadmap_version
from services.mongo_service import get_collection
from utils.response import success_response, error_response

roadmap_bp = Blueprint('roadmap', __name__)

@roadmap_bp.route('/generate-roadmap', methods=['POST'])
def generate_roadmap_route():
    data = request.get_json(silent=True)
    if not data or not data.get("uid"):
        return error_response("Missing uid in request", 400)
        
    uid = data["uid"]
    force_regenerate = data.get("force_regenerate", False)
    strategy_mode = data.get("strategy_mode", None)
    
    try:
        from services.activity_service import log_activity
        roadmap = create_and_store_roadmap(uid, force_regenerate=force_regenerate, strategy_mode=strategy_mode)
        
        # Log activity
        event_data = {
            "target_role": roadmap.get("targetRole", "Not Selected"),
            "progress_percentage": 0,
            "roadmap_data": True
        }
        log_activity(uid, "Roadmap Generated", "roadmap", event_type="ROADMAP_CREATED", event_data=event_data)
        
        return success_response(data={"roadmap": roadmap}, message="Roadmap generated successfully")
    except Exception as e:
        import json
        from flask import jsonify
        error_msg = str(e)
        
        # Check if the error message is our custom JSON formatted stage error
        try:
            error_data = json.loads(error_msg)
            if "error_type" in error_data and error_data["error_type"] == "service_unavailable":
                current_app.logger.error("Roadmap generation failed: AI services overloaded.")
                return jsonify(error_data), 503
                
            if "stage" in error_data and "error" in error_data:
                current_app.logger.error(f"Roadmap generation failed at stage [{error_data['stage']}]: {error_data['error']}")
                return error_response(
                    error_data['error'],
                    500, 
                    details={"error_type": "backend_error", "stage": error_data['stage']}
                )
        except:
            pass
            
        current_app.logger.error(f"Roadmap generation error: {error_msg}")
        return error_response(
            "An unexpected error occurred during generation. Please try again.", 
            500, 
            details={"error_type": "backend_error"}
        )

@roadmap_bp.route('/test-groq', methods=['GET'])
def test_groq_route():
    from services.ai_service import generate_roadmap_json
    try:
        sample_user = {
            "role": "Software Engineer",
            "target_role": "Senior Full Stack Engineer",
            "experience_level": "Intermediate",
            "preferred_domain": "Web Development",
            "skills": ["React", "Python"],
            "learning_goals": "Master system design"
        }
        roadmap = generate_roadmap_json(sample_user)
        return success_response(data={"roadmap": roadmap}, message="Test Groq generation successful")
    except Exception as e:
        import json
        error_msg = str(e)
        try:
            error_data = json.loads(error_msg)
            if "stage" in error_data:
                return error_response(error_data['error'], 500, details={"stage": error_data['stage']})
        except:
            pass
        return error_response(str(e), 500)

@roadmap_bp.route('/roadmap/<uid>', methods=['GET'])
def get_roadmap_route(uid):
    try:
        roadmaps_collection = get_collection("roadmaps")
        roadmap = roadmaps_collection.find_one({"uid": uid})
        if not roadmap:
            return error_response("Roadmap not found", 404)
            
        if "_id" in roadmap:
            roadmap["_id"] = str(roadmap["_id"])
            
        return success_response(data={"roadmap": roadmap})
    except Exception as e:
        current_app.logger.error(f"Fetch roadmap error: {e}")
        return error_response("Failed to fetch roadmap", 500)

@roadmap_bp.route('/roadmap/history/<uid>', methods=['GET'])
def get_history_route(uid):
    try:
        history = get_roadmap_history(uid)
        return success_response(data={"history": history})
    except Exception as e:
        current_app.logger.error(f"Fetch history error: {e}")
        return error_response("Failed to fetch history", 500)

@roadmap_bp.route('/roadmap/version/<version_id>', methods=['GET'])
def get_version_route(version_id):
    try:
        version = get_roadmap_version(version_id)
        if not version:
            return error_response("Version not found", 404)
        return success_response(data={"version": version})
    except Exception as e:
        current_app.logger.error(f"Fetch version error: {e}")
        return error_response("Failed to fetch version", 500)
