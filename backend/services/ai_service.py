import os
import json
import time
import logging
import re
from google import genai
from google.genai import types
from prompts.roadmap_prompt import ROADMAP_PROMPT_TEMPLATE

def clean_json_response(text: str) -> str:
    # 1. Strip basic markdown
    text = text.strip()
    if text.startswith('```json'):
        text = text[7:]
    elif text.startswith('```'):
        text = text[3:]
    if text.endswith('```'):
        text = text[:-3]
    text = text.strip()
    
    # 2. Extract JSON block using regex if there's extra text
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
        
    return text

def generate_dynamic_fallback(user_profile: dict) -> dict:
    role = user_profile.get("role", "Professional")
    target_role = user_profile.get("target_role", "Advanced Professional")
    
    return {
        "career_path": f"A targeted transition plan from {role} to {target_role}, focusing on core competencies and market-ready skills.",
        "weekly_plan": [
            {
                "week": "1-4",
                "focus": "Foundation & Core Skills",
                "ai_insight": "Even AI models need a solid foundation. Let's build yours.",
                "tasks": ["Identify knowledge gaps", "Review fundamental concepts", "Begin core technology tutorials"]
            },
            {
                "week": "5-8",
                "focus": "Advanced Application",
                "ai_insight": "Time to apply theory to practice. The real learning happens when things break.",
                "tasks": ["Build a small project", "Contribute to open source", "Practice advanced patterns"]
            },
            {
                "week": "9-12",
                "focus": "Market Readiness & Interview Prep",
                "ai_insight": "Polishing your profile for human reviewers. Don't worry, we'll make you sound impressive.",
                "tasks": ["Optimize resume and LinkedIn", "Conduct mock interviews", "Finalize portfolio"]
            }
        ],
        "technologies_to_learn": [
            {
                "category": "Core Technologies",
                "technologies": ["Industry Standard Tools", "Domain Specific Languages"]
            },
            {
                "category": "Advanced",
                "technologies": ["System Design", "Architecture Patterns"]
            }
        ],
        "recommended_projects": [
            {
                "title": f"{target_role} Capstone Project",
                "difficulty": "Intermediate",
                "estimated_time": "3-4 weeks",
                "technologies_used": ["Core Tech Stack"]
            }
        ],
        "certifications": [
            {
                "provider": "Industry Standard Provider",
                "name": f"Certified {target_role} Professional",
                "relevance": "Highly relevant for market credibility"
            }
        ],
        "interview_preparation": [
            {
                "topic": "Technical Knowledge",
                "details": ["Review core concepts", "Practice problem solving"]
            },
            {
                "topic": "System Design",
                "details": ["Understand scalable architecture", "Review common design patterns"]
            }
        ],
        "estimated_timeline": "12 weeks"
    }

def validate_and_fill_roadmap(data: dict, user_profile: dict) -> dict:
    fallback = generate_dynamic_fallback(user_profile)
    required_keys = ["career_path", "weekly_plan", "technologies_to_learn", "recommended_projects", "certifications", "interview_preparation", "estimated_timeline"]
    
    if not isinstance(data, dict):
        return fallback

    for key in required_keys:
        if key not in data or not data[key]:
            data[key] = fallback[key]
            
    return data

def generate_and_parse(client, prompt: str, model_name: str, user_profile: dict) -> dict:
    logging.info(f"[AI Stage] Model selected: {model_name}")
    print(f"Trying model: {model_name}")
    response = client.models.generate_content(
        model=model_name,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.7,
        )
    )
    
    logging.info("[AI Stage] Gemini raw response received")
    
    try:
        clean_text = clean_json_response(response.text)
        data = json.loads(clean_text)
        data = validate_and_fill_roadmap(data, user_profile)
        logging.info("[AI Stage] Parsed and validated response successfully")
        return data
    except Exception as e:
        logging.error(f"[AI Stage] JSON Parsing/Validation Failed. Error: {str(e)}")
        raise ValueError(json.dumps({
            "success": False,
            "stage": "json_parsing",
            "error": f"Failed to parse JSON: {str(e)}",
            "raw_response": response.text[:500] if response.text else "None"
        }))

def retry_generation(client, prompt: str, user_profile: dict) -> dict:
    model_to_use = 'gemini-1.5-flash'
    
    # Attempt 1
    logging.info("[AI Stage] Attempt 1 starting...")
    try:
        return generate_and_parse(client, prompt, model_to_use, user_profile)
    except Exception as e:
        logging.warning(f"[AI Stage] Attempt 1 failed: {e}")
        
    # Attempt 2
    logging.info("[AI Stage] Waiting 2s before Attempt 2...")
    time.sleep(2)
    try:
        return generate_and_parse(client, prompt, model_to_use, user_profile)
    except Exception as e:
        logging.warning(f"[AI Stage] Attempt 2 failed: {e}")
        
    # Attempt 3
    logging.info("[AI Stage] Waiting 4s before Attempt 3...")
    time.sleep(4)
    try:
        return generate_and_parse(client, prompt, model_to_use, user_profile)
    except Exception as e:
        logging.error(f"[AI Stage] Attempt 3 failed: {e}")
        logging.info("[AI Stage] All Gemini attempts failed. Using dynamic fallback.")
        return generate_dynamic_fallback(user_profile)

def generate_roadmap_json(user_profile: dict) -> dict:
    """Generate a career roadmap using the new google-genai package."""
    
    logging.info("[AI Stage] Request received for generation")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logging.error("[AI Stage] GEMINI_API_KEY not set")
        return generate_dynamic_fallback(user_profile)
    
    try:
        client = genai.Client(api_key=api_key)
        logging.info("[AI Stage] Gemini initialized successfully")
    except Exception as e:
        logging.error(f"[AI Stage] Gemini initialization failed: {e}")
        return generate_dynamic_fallback(user_profile)
    
    try:
        prompt = ROADMAP_PROMPT_TEMPLATE.format(
            role=user_profile.get("role", "Unknown"),
            target_role=user_profile.get("target_role", "Unknown"),
            experience_level=user_profile.get("experience_level", "Unknown"),
            preferred_domain=user_profile.get("preferred_domain", "Unknown"),
            skills=", ".join(user_profile.get("skills", [])),
            learning_goals=user_profile.get("learning_goals", "None")
        )
        logging.info("[AI Stage] Prompt generated successfully")
    except Exception as e:
        logging.error(f"[AI Stage] Prompt generation failed: {e}")
        return generate_dynamic_fallback(user_profile)
    
    try:
        logging.info("[AI Stage] Sending request to Gemini via retry logic")
        roadmap_data = retry_generation(client, prompt, user_profile)
        return roadmap_data
    except Exception as e:
        logging.error(f"[AI Stage] Unhandled exception during generation: {e}")
        return generate_dynamic_fallback(user_profile)
