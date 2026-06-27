from flask import Blueprint, current_app
from services.mongo_service import get_collection
from utils.response import success_response, error_response
import traceback
from datetime import datetime

history_bp = Blueprint('history', __name__)

@history_bp.route('/history/<uid>', methods=['GET'])
def get_unified_history(uid):
    try:
        resumes_col = get_collection("resumes")
        roadmaps_col = get_collection("roadmaps")
        interviews_col = get_collection("mock_interviews")
        
        merged = []
        
        # 1. Resumes
        resumes = list(resumes_col.find({"uid": uid}))
        for r in resumes:
            metrics = r.get("analysis", {}).get("confidence_metrics", {})
            verdict = r.get("analysis", {}).get("recruiter_scan", {})
            score = r.get("atsScore") or r.get("ats_score") or metrics.get("ats_score")
            summary = r.get("verdict") or r.get("recruiter_feedback") or verdict.get("first_impression") or "ATS Scan completed."
            
            merged.append({
                "id": str(r.get("_id", "")),
                "type": "resume",
                "date": r.get("upload_date") or r.get("createdAt"),
                "title": r.get("targetRole") or r.get("target_role") or "Resume Analysis",
                "score": score,
                "summary": summary,
                "tags": ["ATS", "High Match" if score and isinstance(score, (int, float)) and score >= 80 else "Needs Work"]
            })
            
        # 2. Roadmaps
        roadmaps = list(roadmaps_col.find({"uid": uid}))
        for r in roadmaps:
            path = r.get("roadmap", {}).get("career_path") or r.get("career_path") or "Career Roadmap"
            timeline = r.get("roadmap", {}).get("estimated_timeline") or "N/A"
            merged.append({
                "id": str(r.get("_id", "")),
                "type": "roadmap",
                "date": r.get("created_at") or r.get("createdAt"),
                "title": path,
                "score": None,
                "summary": f"Generated timeline: {timeline}. Includes project & cert recommendations.",
                "tags": ["Strategy", "Planning"]
            })
            
        # 3. Interviews
        interviews = list(interviews_col.find({"uid": uid}))
        for i in interviews:
            score = i.get("overallScore") or i.get("overall_score")
            summary = i.get("recruiterVerdict", {}).get("hiringRecommendation") or "Interview session completed."
            merged.append({
                "id": str(i.get("_id", "")),
                "type": "interview",
                "date": i.get("created_at") or i.get("createdAt"),
                "title": i.get("targetRole") or i.get("target_role") or "Mock Interview",
                "score": score,
                "summary": summary,
                "tags": [i.get("difficulty") or "Mixed", i.get("companyStyle") or "Standard"]
            })
            
        # Ensure dates are strings for consistent frontend processing and sorting
        def parse_date(date_val):
            if isinstance(date_val, datetime):
                return date_val.isoformat()
            if isinstance(date_val, str):
                return date_val
            return ""

        for item in merged:
            item["date"] = parse_date(item["date"])

        # Sort by date descending
        def get_date(item):
            return item.get("date") or ""
        
        merged.sort(key=get_date, reverse=True)
            
        return success_response(data={"history": merged}, message="History fetched successfully")
    except Exception as e:
        current_app.logger.error(f"Unified history error: {e}\n{traceback.format_exc()}")
        return error_response("Failed to synchronize history archives.", 500)
