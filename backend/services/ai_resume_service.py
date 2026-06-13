import os
import json
import logging
import time
from groq import Groq
from prompts.resume_prompt import RESUME_ANALYSIS_PROMPT, RESUME_REWRITE_PROMPT, INTERVIEW_QUESTIONS_PROMPT
from prompts.debug_prompt import RESUME_DEBUG_PROMPT
from services.ai_service import clean_json_response

from typing import Optional

def generate_with_retry(client, prompt: str, primary_model='llama-3.3-70b-versatile') -> Optional[dict]:
    models_to_try = [primary_model]
    
    for attempt, model_name in enumerate(models_to_try, 1):
        try:
            logging.info(f"[AI Resume Service] Attempt {attempt} using model {model_name}...")
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": "You are a professional AI resume advisor. You MUST output your responses in valid JSON format only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            if not content:
                raise ValueError("AI returned an empty response.")
            clean_text = clean_json_response(content)
            return json.loads(clean_text)
        except Exception as e:
            logging.warning(f"[AI Resume Service] Attempt {attempt} with {model_name} failed: {e}")
            if attempt < len(models_to_try):
                time.sleep(1) # Brief pause before fallback
            else:
                logging.error("[AI Resume Service] All fallback models failed.")
                raise Exception("AI service unavailable after multiple model fallbacks.")

def analyze_resume(resume_text: str, target_role: str, job_description: str = "", debug_mode: bool = False) -> Optional[dict]:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise Exception("GROQ_API_KEY not set")
    
    client = Groq(api_key=api_key)
    
    if debug_mode:
        prompt = RESUME_DEBUG_PROMPT.format(
            resume=resume_text, 
            target_role=target_role, 
            jd=job_description
        )
    else:
        prompt = RESUME_ANALYSIS_PROMPT.format(
            resume=resume_text, 
            target_role=target_role, 
            jd=job_description
        )
    
    return generate_with_retry(client, prompt)

def rewrite_resume_section(original_text: str, style: str) -> Optional[dict]:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise Exception("GROQ_API_KEY not set")
        
    client = Groq(api_key=api_key)
    prompt = RESUME_REWRITE_PROMPT.format(original_text=original_text, style=style)
    
    return generate_with_retry(client, prompt)

def generate_interview_questions(resume_text: str) -> Optional[dict]:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise Exception("GROQ_API_KEY not set")
        
    client = Groq(api_key=api_key)
    prompt = INTERVIEW_QUESTIONS_PROMPT.format(resume_text=resume_text)
    
    return generate_with_retry(client, prompt)
