from flask import Blueprint, request, current_app
from services.storage_service import process_and_store_resume, get_latest_resume, get_resume_history
from services.ai_resume_service import rewrite_resume_section, generate_interview_questions
from utils.response import success_response, error_response
import json

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/analyze-resume', methods=['POST'])
def analyze_resume_route():
    data = request.get_json(silent=True)
    if not data or not data.get("uid") or not data.get("resume_text"):
        return error_response("Missing uid or resume_text in request", 400)
        
    uid = data["uid"]
    resume_text = data["resume_text"]
    target_role = data.get("target_role", "Software Engineer")
    job_description = data.get("job_description", "")
    debug_mode = data.get("debug_mode", False)
    
    try:
        current_app.logger.info(f"Analyzing resume for user {uid} (Debug: {debug_mode})")
        resume_data = process_and_store_resume(uid, resume_text, target_role, job_description, debug_mode=debug_mode)
        return success_response(data={"resume": resume_data}, message="Resume analyzed successfully")
    except Exception as e:
        current_app.logger.error(f"Resume analysis error: {str(e)}")
        return error_response(str(e), 500)

@resume_bp.route('/resume-analysis/<uid>', methods=['GET'])
def get_resume_analysis_route(uid):
    try:
        resume = get_latest_resume(uid)
        if not resume:
            return error_response("Resume analysis not found", 404)
        return success_response(data={"resume": resume})
    except Exception as e:
        current_app.logger.error(f"Fetch resume analysis error: {str(e)}")
        return error_response("Failed to fetch resume analysis", 500)

@resume_bp.route('/resume-history/<uid>', methods=['GET'])
def get_resume_history_route(uid):
    try:
        history = get_resume_history(uid)
        return success_response(data={"history": history})
    except Exception as e:
        current_app.logger.error(f"Fetch resume history error: {str(e)}")
        return error_response("Failed to fetch resume history", 500)

@resume_bp.route('/rewrite-resume', methods=['POST'])
def rewrite_resume_route():
    data = request.get_json(silent=True)
    if not data or not data.get("original_text") or not data.get("style"):
        return error_response("Missing original_text or style", 400)
        
    try:
        improved = rewrite_resume_section(data["original_text"], data["style"])
        return success_response(data=improved)
    except Exception as e:
        return error_response(str(e), 500)

@resume_bp.route('/generate-interview-questions', methods=['POST'])
def generate_interview_questions_route():
    data = request.get_json(silent=True)
    if not data or not data.get("resume_text"):
        return error_response("Missing resume_text", 400)
        
    try:
        questions = generate_interview_questions(data["resume_text"])
        return success_response(data=questions)
    except Exception as e:
        return error_response(str(e), 500)
