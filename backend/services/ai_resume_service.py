import os
import json
import logging
import time
# pyrefly: ignore [missing-import]
from google import genai
# pyrefly: ignore [missing-import]
from google.genai import types
from prompts.resume_prompt import RESUME_ANALYSIS_PROMPT, RESUME_REWRITE_PROMPT, INTERVIEW_QUESTIONS_PROMPT
from services.ai_service import clean_json_response

def generate_with_retry(client, prompt: str, primary_model='gemini-2.5-flash') -> dict:
    models_to_try = [primary_model, 'gemini-1.5-pro', 'gemini-1.5-flash']
    
    for attempt, model_name in enumerate(models_to_try, 1):
        try:
            logging.info(f"[AI Resume Service] Attempt {attempt} using model {model_name}...")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                )
            )
            clean_text = clean_json_response(response.text)
            return json.loads(clean_text)
        except Exception as e:
            logging.warning(f"[AI Resume Service] Attempt {attempt} with {model_name} failed: {e}")
            if attempt < len(models_to_try):
                time.sleep(1) # Brief pause before fallback
            else:
                logging.error("[AI Resume Service] All fallback models failed.")
                raise Exception("AI service unavailable after multiple model fallbacks.")

def analyze_resume(resume_text: str, target_role: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not set")
    
    client = genai.Client(api_key=api_key)
    prompt = RESUME_ANALYSIS_PROMPT.format(resume_text=resume_text, target_role=target_role)
    
    return generate_with_retry(client, prompt)

def rewrite_resume_section(original_text: str, style: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not set")
        
    client = genai.Client(api_key=api_key)
    prompt = RESUME_REWRITE_PROMPT.format(original_text=original_text, style=style)
    
    return generate_with_retry(client, prompt)

def generate_interview_questions(resume_text: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not set")
        
    client = genai.Client(api_key=api_key)
    prompt = INTERVIEW_QUESTIONS_PROMPT.format(resume_text=resume_text)
    
    return generate_with_retry(client, prompt)
