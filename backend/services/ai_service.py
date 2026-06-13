import os
import json
import time
import logging
import re
import random
from typing import Optional
from groq import Groq
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
        "focus_area": "Balanced Strategy",
        "roadmap_score": 80,
        "readiness_score": 50,
        "strongest_skill": "Foundations",
        "biggest_weakness": "Advanced Application",
        "strategy_mode": "Balanced Fallback",
        "market_demand": {
            "hiring_demand": 85,
            "salary_potential": 80,
            "industry_growth": 90,
            "automation_resistance": 70,
            "competition_level": 75
        },
        "weekly_plan": [
            {
                "week": "1-4",
                "focus": "Foundation & Core Skills",
                "ai_insight": "Even AI models need a solid foundation. Let's build yours.",
                "ai_reasoning": "This phase exists to solidify core engineering principles before moving to complex topics.",
                "priority_level": "High",
                "tasks": ["Identify knowledge gaps", "Review fundamental concepts", "Begin core technology tutorials"],
                "learning_goals": ["Understand core syntax", "Setup environment"]
            },
            {
                "week": "5-8",
                "focus": "Advanced Application",
                "ai_insight": "Time to apply theory to practice. The real learning happens when things break.",
                "ai_reasoning": "Practical application is required to ensure knowledge retention and debugging skills.",
                "priority_level": "Medium",
                "tasks": ["Build a small project", "Contribute to open source", "Practice advanced patterns"],
                "learning_goals": ["Build a complete application", "Implement API"]
            },
            {
                "week": "9-12",
                "focus": "Market Readiness & Interview Prep",
                "ai_insight": "Polishing your profile for human reviewers. Don't worry, we'll make you sound impressive.",
                "ai_reasoning": "This final phase ensures you can communicate your value to hiring managers.",
                "priority_level": "High",
                "tasks": ["Optimize resume and LinkedIn", "Conduct mock interviews", "Finalize portfolio"],
                "learning_goals": ["Pass mock interviews", "Complete resume"]
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
    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": "You are a professional career advisor and AI assistant. Always output valid JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        response_format={"type": "json_object"}
    )
    
    logging.info("[AI Stage] Groq raw response received")
    
    content = None
    try:
        content = response.choices[0].message.content
        if not content:
            raise ValueError("AI returned an empty response.")
        clean_text = clean_json_response(content)
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
            "raw_response": content[:500] if content else "None"
        }))

def retry_generation(client, prompt: str, user_profile: dict) -> dict:
    model_to_use = 'llama-3.3-70b-versatile'
    
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
        logging.info("[AI Stage] All Groq attempts failed. Using dynamic fallback.")
        return generate_dynamic_fallback(user_profile)

def generate_roadmap_json(user_profile: dict, force_regenerate: bool = False, strategy_mode: Optional[str] = None) -> dict:
    """Generate a career roadmap using the new google-genai package."""
    
    logging.info("[AI Stage] Request received for generation")
    
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logging.error("[AI Stage] GROQ_API_KEY not set")
        return generate_dynamic_fallback(user_profile)
    
    try:
        client = Groq(api_key=api_key)
        logging.info("[AI Stage] Groq initialized successfully")
    except Exception as e:
        logging.error(f"[AI Stage] Groq initialization failed: {e}")
        return generate_dynamic_fallback(user_profile)
    
    try:
        strategies = [
            "Production AI Engineer Path (Focus: Deployment, Kubernetes, CI/CD, scalable inference)",
            "Research Scientist Path (Focus: research papers, transformers, experimentation, deep theory)",
            "AI Infrastructure Engineer Path (Focus: cloud architecture, TPU/GPU clusters, data pipelines)",
            "Startup AI Builder Path (Focus: rapid product delivery, APIs, SaaS AI systems, MVP velocity)",
            "Data-Centric ML Engineer Path (Focus: data quality, synthetic data, feature engineering)",
            "MLOps Specialist Path (Focus: monitoring, drift detection, security, automation)",
            "AI Systems Architect (Focus: high-level design, model mesh, distributed training)"
        ]
        chosen_strategy = strategy_mode if strategy_mode else (random.choice(strategies) if force_regenerate else "A balanced, standard approach to achieving the target role.")

        prompt = ROADMAP_PROMPT_TEMPLATE.format(
            role=user_profile.get("role", "Unknown"),
            target_role=user_profile.get("target_role", "Unknown"),
            experience_level=user_profile.get("experience_level", "Unknown"),
            preferred_domain=user_profile.get("preferred_domain", "Unknown"),
            skills=", ".join(user_profile.get("skills", [])),
            learning_goals=user_profile.get("learning_goals", "None"),
            focus_strategy=chosen_strategy
        )
        logging.info("[AI Stage] Prompt generated successfully")
    except Exception as e:
        logging.error(f"[AI Stage] Prompt generation failed: {e}")
        return generate_dynamic_fallback(user_profile)
    
    try:
        logging.info("[AI Stage] Sending request to Groq via retry logic")
        roadmap_data = retry_generation(client, prompt, user_profile)
        return roadmap_data
    except Exception as e:
        logging.error(f"[AI Stage] Unhandled exception during generation: {e}")
        return generate_dynamic_fallback(user_profile)
