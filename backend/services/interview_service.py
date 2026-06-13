import os
import json
import time
import logging
from typing import Optional
from datetime import datetime, timezone
from bson import ObjectId
from groq import Groq

from services.mongo_service import get_collection
from services.user_service import get_user_by_uid
from services.storage_service import get_latest_resume
from services.ai_service import clean_json_response

from prompts.interview_prompt import (
    MOCK_INTERVIEW_QUESTIONS_PROMPT,
    MOCK_INTERVIEW_EVALUATION_PROMPT,
    MOCK_INTERVIEW_FINAL_PROMPT
)

def _interview_history_collection():
    return get_collection("interview_history")


def _roadmaps_collection():
    return get_collection("roadmaps")

def escape_format_chars(text: str) -> str:
    """Escapes curly braces in user input to prevent KeyError in str.format()"""
    if not text:
        return ""
    return text.replace("{", "{{").replace("}", "}}")

def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY not set in environment variables")
    return Groq(api_key=api_key)

def generate_with_retry(prompt: str, primary_model='llama-3.3-70b-versatile') -> dict:
    client = get_groq_client()
    models_to_try = [primary_model]
    for attempt, model_name in enumerate(models_to_try, 1):
        try:
            logging.info(f"[Interview Service] Attempt {attempt} using model {model_name}...")
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": "You are a professional AI recruiter. You MUST output your responses in valid JSON format only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            if not content:
                raise RuntimeError("AI returned an empty response.")
                
            clean_text = clean_json_response(content)
            try:
                return json.loads(clean_text)
            except json.JSONDecodeError as jde:
                logging.error(f"[Interview Service] Failed to parse JSON from Groq response: {jde}. Raw response: {clean_text}")
                raise RuntimeError("AI response is not valid JSON. Please try again later.")
        except Exception as e:
            logging.warning(f"[Interview Service] Attempt {attempt} with {model_name} failed: {e}")
            if attempt < len(models_to_try):
                time.sleep(1.5)
            else:
                logging.error("[Interview Service] All fallback models failed.")
                
    # Return structured failure object instead of crashing completely
    logging.error("[Interview Service] Returning safe AI unavailable fallback.")
    return {
        "success": False,
        "error": "AI evaluation unavailable"
    }

def start_interview_session(uid: str, settings: dict) -> dict:
    """Fetch user, resume, and roadmap data, generate 10 personalized questions."""
    logging.info(f"[Interview Service] Generating questions for user {uid}")
    
    # 1. Fetch Context
    user = get_user_by_uid(uid) or {}
    resume = get_latest_resume(uid) or {}
    
    # Fetch roadmap directly from db to avoid circular imports or direct roadmap service dependency
    roadmap = _roadmaps_collection().find_one({"uid": uid}) or {}
    
    # 2. Extract specific values for prompt replacement
    role = user.get("role", "Professional")
    experience_level = user.get("experience_level", "Mid-Level")
    skills = ", ".join(user.get("skills", [])) if user.get("skills") else "Not specified"
    learning_goals = user.get("learning_goals", "General career growth")
    
    # Resume Summary Context
    resume_summary = "No resume uploaded."
    if resume:
        analysis = resume.get("analysis", {})
        scan = analysis.get("recruiter_scan", {})
        metrics = analysis.get("confidence_metrics", {})
        resume_summary = (
            f"Parsed Resume text: {resume.get('parsed_text', '')[:800]}... "
            f"ATS Score: {resume.get('ats_score', 0)}. "
            f"Recruiter impression: {scan.get('first_impression', 'N/A')}. "
            f"Technical depth score: {metrics.get('technical_depth', 0)}."
        )
        
    # Roadmap Weakness Context
    roadmap_weakness = "No roadmap generated yet."
    if roadmap:
        roadmap_data = roadmap.get("roadmap") or {}
        roadmap_weakness = (
            f"Biggest Weakness identified: {roadmap.get('biggest_weakness', '') or roadmap_data.get('biggest_weakness', '')}. "
            f"Focus Area: {roadmap.get('focus_area', '') or roadmap_data.get('focus_area', '')}."
        )
        
    # 3. Read Settings
    target_role = settings.get("target_role", "Software Engineer")
    difficulty = settings.get("difficulty", "Medium")
    company_style = settings.get("company_style", "Generic Recruiter")
    interview_type = settings.get("interview_type", "Mixed")
    
    question_count = settings.get("question_count", 10)
    
    # 4. Formulate Prompt
    prompt = MOCK_INTERVIEW_QUESTIONS_PROMPT.format(
        role=escape_format_chars(role),
        experience_level=escape_format_chars(experience_level),
        skills=escape_format_chars(skills),
        learning_goals=escape_format_chars(learning_goals),
        resume_summary=escape_format_chars(resume_summary),
        roadmap_weakness=escape_format_chars(roadmap_weakness),
        target_role=escape_format_chars(target_role),
        difficulty=escape_format_chars(difficulty),
        company_style=escape_format_chars(company_style),
        interview_type=escape_format_chars(interview_type),
        question_count=question_count
    )
    
    # 5. Call Groq
    result = generate_with_retry(prompt)
    
    # Validate and fallback format
    if "questions" not in result or not isinstance(result["questions"], list):
        raise ValueError("AI failed to return the standard question array format.")
        
    return result

def evaluate_user_answer(settings: dict, active_question: dict, answer: str, history: Optional[list] = None) -> dict:
    """Evaluate a single user answer to a question, return scores, feedback, and possible follow-up."""
    target_role = settings.get("target_role", "Software Engineer")
    company_style = settings.get("company_style", "Generic Recruiter")
    difficulty = settings.get("difficulty", "Medium")
    
    question_type = active_question.get("type", "Technical")
    question_text = active_question.get("question", "")
    intent = active_question.get("intent", "Evaluating technical capability.")
    guidelines = active_question.get("guidelines", "")
    
    prompt = MOCK_INTERVIEW_EVALUATION_PROMPT.format(
        target_role=escape_format_chars(target_role),
        company_style=escape_format_chars(company_style),
        difficulty=escape_format_chars(difficulty),
        question_type=escape_format_chars(question_type),
        intent=escape_format_chars(intent),
        guidelines=escape_format_chars(guidelines),
        question=escape_format_chars(question_text),
        answer=escape_format_chars(answer)
    )
    
    result = generate_with_retry(prompt)
    
    # Enforce default fields
    result.setdefault("technicalDepth", 50)
    result.setdefault("communication", 50)
    result.setdefault("confidence", 50)
    result.setdefault("completeness", 50)
    result.setdefault("overallQuality", 50)
    result.setdefault("feedback", "Completed response.")
    result.setdefault("follow_up_question", None)
    
    return result

def finalize_interview_session(uid: str, settings: dict, transcript: list) -> dict:
    """Analyze the entire interview transcript, generate final scorecard, calculate achievements, and store in DB."""
    target_role = settings.get("target_role", "Software Engineer")
    company_style = settings.get("company_style", "Generic Recruiter")
    difficulty = settings.get("difficulty", "Medium")
    duration = settings.get("duration", "20 min")
    
    # Formulate transcript text for prompt
    transcript_text_list = []
    for item in transcript:
        question = item.get("question", "")
        answer = item.get("answer", "")
        
        entry = (
            f"Question: {question}\n"
            f"Answer: {answer}\n"
        )
        
        evaluation = item.get("evaluation")
        if evaluation:
            eval_feedback = evaluation.get("feedback", "")
            eval_scores = (
                f"Tech Depth: {evaluation.get('technicalDepth', 0)}, "
                f"Comm: {evaluation.get('communication', 0)}, "
                f"Confidence: {evaluation.get('confidence', 0)}"
            )
            entry += f"AI Evaluation: {eval_feedback} ({eval_scores})\n"
            
        if item.get("follow_up_question"):
            fu_q = item.get("follow_up_question")
            fu_a = item.get("follow_up_answer", "N/A")
            entry += (
                f"  Follow-up Question: {fu_q}\n"
                f"  Follow-up Answer: {fu_a}\n"
            )
            fu_eval_dict = item.get("follow_up_evaluation")
            if fu_eval_dict:
                fu_eval = fu_eval_dict.get("feedback", "N/A")
                entry += f"  Follow-up Evaluation: {fu_eval}\n"
                
        transcript_text_list.append(entry)
        
    transcript_text = "\n---\n".join(transcript_text_list)
    
    prompt = MOCK_INTERVIEW_FINAL_PROMPT.format(
        target_role=escape_format_chars(target_role),
        company_style=escape_format_chars(company_style),
        difficulty=escape_format_chars(difficulty),
        transcript=escape_format_chars(transcript_text)
    )
    
    scorecard = generate_with_retry(prompt)
    
    # Enforce standard scores
    overall_score = scorecard.get("overallScore", 70)
    technical_score = scorecard.get("technicalScore", 70)
    communication_score = scorecard.get("communicationScore", 70)
    problem_solving_score = scorecard.get("problemSolvingScore", 70)
    confidence_score = scorecard.get("confidenceScore", 70)
    system_design_readiness = scorecard.get("systemDesignReadiness", 70)
    recruiter_confidence = scorecard.get("recruiterConfidence", 70)
    production_readiness = scorecard.get("productionReadiness", 70)
    verdict = scorecard.get("recruiterVerdict", {})
    weaknesses = scorecard.get("weaknesses", [])
    learning_plan = scorecard.get("learningPlan", {})
    timeline = scorecard.get("timeline", [])
    
    # Calculate Achievements
    achievements = []
    
    # 1. Interview Master (completed 10 interviews)
    past_interviews_count = _interview_history_collection().count_documents({"userId": uid})
    if past_interviews_count + 1 >= 10:
        achievements.append({
            "name": "Interview Master",
            "description": "Completed 10 interviews",
            "icon": "🏆"
        })
        
    # 2. Technical Expert (90+ Technical Score)
    if technical_score >= 90:
        achievements.append({
            "name": "Technical Expert",
            "description": "90+ Technical Score",
            "icon": "💻"
        })
        
    # 3. Communication Pro (90+ Communication Score)
    if communication_score >= 90:
        achievements.append({
            "name": "Communication Pro",
            "description": "90+ Communication Score",
            "icon": "🗣️"
        })
        
    # 4. Consistent Performer (5 interviews above 80% overall score)
    # Fetch past 4 interviews overall scores
    past_docs = list(_interview_history_collection().find({"userId": uid}).sort("date", -1).limit(4))
    if len(past_docs) >= 4:
        all_above_80 = True
        for doc in past_docs:
            if doc.get("overallScore", 0) < 80:
                all_above_80 = False
                break
        if all_above_80 and overall_score >= 80:
            achievements.append({
                "name": "Consistent Performer",
                "description": "5 Interviews Above 80%",
                "icon": "📈"
            })
            
    # Prepare MongoDB document
    now = datetime.now(timezone.utc)
    interview_doc = {
        "userId": uid,
        "uid": uid,
        "date": now,
        "role": target_role,
        "companyStyle": company_style,
        "difficulty": difficulty,
        "duration": duration,
        "overallScore": overall_score,
        "technicalScore": technical_score,
        "communicationScore": communication_score,
        "problemSolvingScore": problem_solving_score,
        "confidenceScore": confidence_score,
        "systemDesignReadiness": system_design_readiness,
        "recruiterConfidence": recruiter_confidence,
        "productionReadiness": production_readiness,
        "recruiterVerdict": verdict,
        "weaknesses": weaknesses,
        "learningPlan": learning_plan,
        "timeline": timeline,
        "achievements": achievements,
        "transcript": transcript
    }
    
    # Store in database
    result = _interview_history_collection().insert_one(interview_doc)
    interview_doc["_id"] = str(result.inserted_id)
    interview_doc["date"] = now.isoformat()
    
    return interview_doc

def get_user_interview_history(uid: str) -> list:
    """Fetch all completed interviews for a user."""
    cursor = _interview_history_collection().find({"userId": uid}).sort("date", -1)
    history = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        date_val = doc.get("date")
        if isinstance(date_val, datetime):
            doc["date"] = date_val.isoformat()
        history.append(doc)
    return history

def delete_user_interview(interview_id: str) -> bool:
    """Delete a mock interview record by ID."""
    try:
        res = _interview_history_collection().delete_one({"_id": ObjectId(interview_id)})
        return res.deleted_count > 0
    except Exception as e:
        logging.error(f"Error deleting interview: {e}")
        return False
