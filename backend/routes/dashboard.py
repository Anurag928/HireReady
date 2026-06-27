from flask import Blueprint, jsonify, current_app
from services.mongo_service import get_collection
from services.activity_service import get_recent_activities

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard/<uid>', methods=['GET'])
def get_dashboard_metrics(uid):
    try:
        # 1. User Profile
        users_col = get_collection("users")
        user = users_col.find_one({"uid": uid}) or {}
        
        # Calculate Profile Strength
        profile_fields = ["name", "role", "targetRole", "experienceLevel", "preferredDomain", "learningGoals", "skills"]
        filled_fields = sum(1 for field in profile_fields if user.get(field))
        profile_strength = int((filled_fields / len(profile_fields)) * 100) if profile_fields else 0
        
        missing_sections = []
        if not user.get("skills"): missing_sections.append("Add Skills")
        if not user.get("learningGoals"): missing_sections.append("Set Learning Goals")
        
        skills = user.get("skills") or []
        
        # 2. Resume Intelligence
        resumes_col = get_collection("resumes")
        # Get latest resume
        latest_resume = resumes_col.find({"uid": uid}).sort("created_at", -1).limit(1)
        latest_resume_doc = list(latest_resume)
        
        resume_intelligence = None
        if latest_resume_doc:
            res_doc = latest_resume_doc[0]
            analysis = res_doc.get("analysis") or {}
            resume_intelligence = {
                "ats_score": analysis.get("atsScore", 0),
                "keyword_match": analysis.get("keywordMatch", 0),
                "missing_keywords": analysis.get("missingKeywords", []),
                "suggestions": analysis.get("improvementSuggestions", [])
            }
        else:
            missing_sections.append("Upload Resume")
            
        # 3. Roadmap Progress
        roadmaps_col = get_collection("roadmaps")
        roadmap = roadmaps_col.find_one({"uid": uid})
        roadmap_progress = None
        if roadmap:
            content = roadmap.get("content") or {}
            phases = content.get("phases") or []
            total_phases = len(phases)
            # Default to 0 completed phases for now, or calculate based on user progress if available
            completed_phases = 0
            current_phase = phases[0].get("title") if phases else "Phase 1"
            roadmap_progress = {
                "completed_milestones": completed_phases,
                "current_phase": current_phase,
                "remaining_milestones": max(0, total_phases - completed_phases),
                "total_milestones": total_phases
            }
        else:
            missing_sections.append("Generate AI Roadmap")

        # 4. Mock Interview Performance
        interviews_col = get_collection("mock_interviews")
        interviews = list(interviews_col.find({"uid": uid}).sort("created_at", -1))
        
        mock_interview_stats = None
        if interviews:
            scores = [(i.get("scorecard") or {}).get("overallScore", 0) for i in interviews]
            valid_scores = [s for s in scores if s > 0]
            if valid_scores:
                mock_interview_stats = {
                    "latest_score": valid_scores[0],
                    "best_score": max(valid_scores),
                    "average_score": int(sum(valid_scores) / len(valid_scores))
                }
        else:
            missing_sections.append("Complete Mock Interview")
            
        # 5. GitHub Intelligence
        # Just stubbing this based on user connection status (assuming github_token exists)
        github_connected = bool(user.get("github_token"))
        github_intelligence = {
            "connected": github_connected
        }
        if not github_connected:
            missing_sections.append("Connect GitHub")

        # Roadmap Percentage
        roadmap_percentage = 0
        if roadmap_progress and int(roadmap_progress.get("total_milestones", 0)) > 0:
            completed = int(roadmap_progress.get("completed_milestones", 0))
            total = int(roadmap_progress.get("total_milestones", 1))
            roadmap_percentage = int((completed / total) * 100)

        # 6. Readiness Score (Strict Formula)
        # Career Readiness = (Resume Score + Roadmap Completion + Interview Performance + Profile Completion) / 4
        resume_score = resume_intelligence["ats_score"] if resume_intelligence else 0
        interview_score = mock_interview_stats["average_score"] if mock_interview_stats else 0
        
        readiness_score = int((resume_score + roadmap_percentage + interview_score + profile_strength) / 4)
        
        status = "Beginner"
        if readiness_score >= 90: status = "Industry Ready"
        elif readiness_score >= 75: status = "Interview Ready"
        elif readiness_score >= 60: status = "Competitive"
        elif readiness_score >= 40: status = "Developing"
        
        # 7. Market Fit Score / Alignment
        market_alignment = 0
        target_role = user.get("targetRole", "Not Selected")
        if target_role and target_role != "Not Selected":
            if resume_intelligence and resume_intelligence.get("keyword_match", 0) > 0:
                market_alignment = resume_intelligence["keyword_match"]
            else:
                if len(skills) >= 5: market_alignment = 65
                elif len(skills) >= 3: market_alignment = 40
                else: market_alignment = 20
        
        if mock_interview_stats and mock_interview_stats["average_score"] > 80: 
            market_alignment += 10
        if market_alignment > 100: market_alignment = 100

        # Top Skill Gap
        top_skill_gap = "Upload Resume"
        if resume_intelligence and resume_intelligence.get("missing_keywords"):
            top_skill_gap = resume_intelligence["missing_keywords"][0]

        # Current Position
        current_position = user.get("role") or "Building Profile"
        if current_position == "student": current_position = f"Aspiring {user.get('targetRole', 'Not Selected')}"

        # Generate insight based on available data
        if readiness_score > 75:
            insight = f"Your profile indicates strong technical foundations. Strengthening {top_skill_gap if top_skill_gap != 'Upload Resume' else 'your portfolio'} could improve hiring readiness."
        elif readiness_components:
            insight = f"You are progressing well toward {user.get('targetRole', 'your target role')} roles. Focus on closing your skill gap in {top_skill_gap if top_skill_gap != 'Upload Resume' else 'core competencies'}."
        else:
            insight = "Welcome! Complete your profile and upload your resume to unlock personalized career insights."

        # 8. Recent Activity
        activities = get_recent_activities(uid, limit=5)

        # Unified Payload
        response_data = {
            "profile": {
                "name": user.get("name") or user.get("displayName", "Explorer"),
                "currentPosition": current_position,
                "targetRole": user.get("targetRole", "Not Selected"),
                "experienceLevel": user.get("experienceLevel", "Level 1"),
                "preferredDomain": user.get("preferredDomain", "Tech Domain"),
                "skills": skills
            },
            "profile_strength": profile_strength,
            "missing_sections": missing_sections,
            "readiness_score": readiness_score,
            "readiness_status": status,
            "career_insight": insight,
            "market_alignment": market_alignment,
            "market_trend": "High Demand",
            "top_skill_gap": top_skill_gap,
            "roadmap_percentage": roadmap_percentage,
            "roadmap_progress": roadmap_progress,
            "mock_interview": mock_interview_stats,
            "resume_intelligence": resume_intelligence,
            "github_intelligence": github_intelligence,
            "activities": activities
        }

        return jsonify({"success": True, "data": response_data}), 200

    except Exception as e:
        current_app.logger.error(f"Dashboard fetch error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500
