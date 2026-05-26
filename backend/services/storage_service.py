import logging
from datetime import datetime, timezone
from services.mongo_service import db
from services.ai_resume_service import analyze_resume

resumes_collection = db["resumes"]
resume_history_collection = db["resume_history"]

from typing import Optional

def process_and_store_resume(uid: str, resume_text: str, target_role: str, job_description: str = "", debug_mode: bool = False) -> Optional[dict]:
    logging.info(f"[Storage Service] Processing resume for {uid} (Debug: {debug_mode})")
    
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text is empty.")

    # 1. Analyze with AI
    logging.info("[Storage Service] Running AI analysis...")
    analysis_result = analyze_resume(resume_text, target_role, job_description, debug_mode=debug_mode)
    
    # 2. Prepare MongoDB document
    now = datetime.now(timezone.utc)
    
    # If debug mode, we don't necessarily want to treat this as a standard versioned resume
    if debug_mode:
        return {
            "uid": uid,
            "is_debug": True,
            "analysis": analysis_result,
            "timestamp": now.isoformat()
        }

    # Determine version
    existing = resumes_collection.find_one({"uid": uid})
    version = 1
    if existing and "version" in existing:
        version = existing["version"] + 1

    analysis = analysis_result or {}
    metrics = analysis.get("confidence_metrics") or {}
    scan = analysis.get("recruiter_scan") or {}

    resume_doc = {
        "uid": uid,
        "file_name": "Raw Text Upload",
        "upload_date": now,
        "parsed_text": resume_text,
        "target_role": target_role,
        "job_description": job_description,
        "version": version,
        "analysis": analysis_result,
        "ats_score": metrics.get("ats_score", 0),
        "interview_probability": metrics.get("interview_probability", 0),
        "tech_depth": metrics.get("technical_depth", 0),
        "recruiter_feedback": scan.get("first_impression", ""),
        "recruiter_risk": scan.get("rejection_risk", ""),
        "jd_coverage": metrics.get("jd_match", 0),
    }

    # 3. Save to MongoDB
    logging.info("[Storage Service] Saving resume to MongoDB...")
    
    # Upsert the active resume
    resumes_collection.replace_one(
        {"uid": uid}, 
        resume_doc, 
        upsert=True
    )
    
    # Save to history collection
    history_doc = resume_doc.copy()
    history_doc.pop("_id", None)
    resume_history_collection.insert_one(history_doc)
    
    # Return document
    saved_resume = resumes_collection.find_one({"uid": uid})
    if saved_resume and "_id" in saved_resume:
        saved_resume["_id"] = str(saved_resume["_id"])
        
    return saved_resume

def get_latest_resume(uid: str) -> Optional[dict]:
    doc = resumes_collection.find_one({"uid": uid})
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

def get_resume_history(uid: str) -> list:
    history_cursor = resume_history_collection.find({"uid": uid}).sort("upload_date", -1)
    history = []
    for doc in history_cursor:
        doc["_id"] = str(doc["_id"])
        history.append(doc)
    return history
