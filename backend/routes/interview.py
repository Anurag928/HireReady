import json
from flask import Blueprint, request, current_app
from services.interview_service import (
    start_interview_session,
    evaluate_user_answer,
    finalize_interview_session,
    get_user_interview_history,
    delete_user_interview
)
from utils.response import success_response, error_response

interview_bp = Blueprint('interview', __name__)

@interview_bp.route('/mock-interview/start', methods=['POST'])
def start_interview_route():
    data = request.get_json(silent=True)
    if not data or not data.get("uid"):
        current_app.logger.warning("[Interview Route] Missing uid in start request")
        return error_response("Missing uid in request", 400)
        
    uid = data["uid"]
    settings = {
        "target_role": data.get("target_role", "Software Engineer"),
        "interview_type": data.get("interview_type", "Mixed"),
        "difficulty": data.get("difficulty", "Medium"),
        "company_style": data.get("company_style", "Generic Recruiter"),
        "duration": data.get("duration", "20 min"),
        "question_count": data.get("question_count", 10)
    }
    
    try:
        current_app.logger.info(f"Generating interview questions for user {uid}")
        questions_data = start_interview_session(uid, settings)
        return success_response(data=questions_data, message="Mock interview questions generated successfully")
    except RuntimeError as e:
        current_app.logger.exception(f"[Interview Route] Runtime error starting interview for {uid}: {e}")
        message = str(e)
        status = 503 if "GROQ_API_KEY" in message or "MongoDB is unavailable" in message or "overloaded" in message.lower() else 500
        return error_response(message, status)
    except Exception as e:
        current_app.logger.exception(f"[Interview Route] Error starting mock interview for {uid}: {e}")
        return error_response(f"Failed to generate questions: {str(e)}", 500)

@interview_bp.route('/mock-interview/evaluate', methods=['POST'])
def evaluate_answer_route():
    data = request.get_json(silent=True)
    if not data:
        current_app.logger.warning("[Interview Route] Empty payload in evaluate request")
        return error_response("Empty request payload", 400)
        
    if not data.get("active_question"):
        current_app.logger.warning("[Interview Route] Missing active_question in evaluate request")
        return error_response("Missing active_question in request", 400)
        
    if data.get("answer") is None:
        current_app.logger.warning("[Interview Route] Missing answer in evaluate request")
        return error_response("Missing answer in request", 400)
        
    settings = data.get("settings", {})
    active_question = data["active_question"]
    answer = data["answer"]
    
    current_app.logger.info(f"Interview Submit Request payload: {json.dumps(data)[:200]}...")
    
    try:
        evaluation = evaluate_user_answer(settings, active_question, answer)
        if evaluation.get("success") is False:
            return error_response(evaluation.get("error", "AI evaluation unavailable"), 503)
        return success_response(data=evaluation, message="Answer evaluated successfully")
    except RuntimeError as e:
        current_app.logger.exception(f"[Interview Route] Runtime error evaluating answer: {e}")
        message = str(e)
        status = 503 if "GROQ_API_KEY" in message or "MongoDB is unavailable" in message or "overloaded" in message.lower() else 500
        return error_response(message, status)
    except Exception as e:
        current_app.logger.exception(f"[Interview Route] Error evaluating answer: {e}")
        return error_response(f"Evaluation failed: {str(e)}", 500)

@interview_bp.route('/mock-interview/finalize', methods=['POST'])
def finalize_interview_route():
    data = request.get_json(silent=True)
    if not data:
        current_app.logger.warning("[Interview Route] Empty payload in finalize request")
        return error_response("Empty request payload", 400)
        
    if not data.get("uid"):
        current_app.logger.warning("[Interview Route] Missing uid in finalize request")
        return error_response("Missing uid in request", 400)
        
    if not data.get("transcript"):
        current_app.logger.warning("[Interview Route] Missing transcript in finalize request")
        return error_response("Missing transcript in request", 400)
        
    uid = data["uid"]
    settings = data.get("settings", {})
    transcript = data["transcript"]
    
    current_app.logger.info(f"Finalizing interview Request payload: uid={uid}, transcript length={len(transcript)}")
    
    try:
        from services.activity_service import log_activity
        scorecard = finalize_interview_session(uid, settings, transcript)
        
        # Log activity
        event_data = {
            "interview_score": scorecard.get("overallScore", 0),
            "questions_count": len(transcript),
            "feedback": scorecard.get("feedback", "")
        }
        log_activity(uid, "Interview Completed", "interview", event_type="INTERVIEW_COMPLETED", event_data=event_data)
        
        return success_response(data=scorecard, message="Interview report compiled successfully")
    except RuntimeError as e:
        current_app.logger.exception(f"[Interview Route] Runtime error finalizing interview for {uid}: {e}")
        message = str(e)
        status = 503 if "GROQ_API_KEY" in message or "MongoDB is unavailable" in message or "overloaded" in message.lower() else 500
        return error_response(message, status)
    except Exception as e:
        current_app.logger.exception(f"[Interview Route] Error finalising interview for {uid}: {e}")
        return error_response(f"Report compile failed: {str(e)}", 500)

@interview_bp.route('/mock-interview/history/<uid>', methods=['GET'])
def get_history_route(uid):
    try:
        current_app.logger.info(f"Fetching interview history for user {uid}")
        history = get_user_interview_history(uid)
        return success_response(data={"history": history})
    except Exception as e:
        current_app.logger.error(f"Error fetching interview history: {str(e)}")
        return error_response(f"Failed to fetch history: {str(e)}", 500)

@interview_bp.route('/mock-interview/history/<interview_id>', methods=['DELETE'])
def delete_interview_route(interview_id):
    try:
        current_app.logger.info(f"Deleting interview {interview_id}")
        success = delete_user_interview(interview_id)
        if success:
            return success_response(message="Interview deleted successfully")
        return error_response("Interview record not found or could not be deleted", 404)
    except Exception as e:
        current_app.logger.error(f"Error deleting interview: {str(e)}")
        return error_response(f"Failed to delete interview: {str(e)}", 500)
