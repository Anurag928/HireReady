import logging
from datetime import datetime
from services.mongo_service import db
from services.ai_resume_service import analyze_resume

resumes_collection = db["resumes"]
resume_history_collection = db["resume_history"]

def process_and_store_resume(uid: str, resume_text: str, target_role: str) -> dict:
    logging.info(f"[Storage Service] Processing resume for {uid}")
    
    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text is empty.")

    # 1. Analyze with AI
    logging.info("[Storage Service] Running AI analysis...")
    analysis_result = analyze_resume(resume_text, target_role)
    
    # 2. Prepare MongoDB document
    now = datetime.utcnow()
    
    # Determine version
    existing = resumes_collection.find_one({"uid": uid})
    version = 1
    if existing and "version" in existing:
        version = existing["version"] + 1

    resume_doc = {
        "uid": uid,
        "file_name": "Raw Text Upload",
        "upload_date": now,
        "parsed_text": resume_text,
        "version": version,
        "analysis": analysis_result,
        "ats_score": analysis_result.get("confidence_metrics", {}).get("ats_score", 0),
        "recruiter_feedback": analysis_result.get("recruiter_scan", {}).get("first_impression", "")
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

def get_latest_resume(uid: str) -> dict:
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
