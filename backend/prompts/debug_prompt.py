RESUME_DEBUG_PROMPT = """
🧠 HIREREADY — NEURAL PIPELINE DIAGNOSTIC (DEBUG MODE)

This is a STRICT technical diagnostic mode. You are acting as a validator for the AI-to-Frontend pipeline.
Your goal is to verify data integrity and structural adherence.

🚨 RULES
- DO NOT generate career advice.
- DO NOT fill missing fields with placeholders like "N/A" or "Unknown".
- DO NOT hallucinate analysis.
- DO NOT return markdown.
- ONLY return a structured debug report in the exact JSON format specified below.

📥 INPUTS
Target Role: {target_role}
Job Description: {jd}
Resume Text: {resume}

========================
REQUIRED DEBUG STRUCTURE
========================
{{
  "debug_info": {{
    "groq_response_status": "SUCCESS",
    "raw_output_integrity": {{
        "is_empty": false,
        "is_partial": false,
        "is_malformed": false
    }},
    "field_existence_verification": {{
        "ats_score": "boolean",
        "skill_match": "boolean",
        "missing_skills": "boolean",
        "recruiter_scan": "boolean",
        "career_trajectory": "boolean",
        "impact_improvements": "boolean"
    }},
    "parsing_diagnostics": {{
        "json_parse_success": true,
        "undefined_fields": ["List of missing keys from production spec"],
        "null_fields": ["List of keys with null values"]
    }},
    "data_integrity_score": 0,
    "error_classification": null,
    "final_debug_verdict": "Groq working correctly OR Groq response broken – pipeline issue detected"
  }},
  "production_payload_preview": {{
    "confidence_metrics": {{ "ats_score": 0, "interview_probability": 0, "technical_depth": 0, "recruiter_confidence": 0 }},
    "recruiter_scan": {{ "first_impression": "", "rejection_risk": "", "immediate_red_flags": [] }},
    "parsed_data": {{ "skills": [], "experience_summary": "" }},
    "career_trajectory": {{ "current_market_level": "", "market_positioning": "" }},
    "section_feedback": {{ "summary_feedback": {{ "strengths": [], "weaknesses": [] }}, "skills_feedback": {{ "strengths": [], "weaknesses": [] }} }},
    "impact_improvements": []
  }}
}}

Note: "data_integrity_score" should be 0-100 based on field presence.
"""
