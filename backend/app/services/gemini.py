import requests
import os
import json
import re
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Fetch API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise ValueError("❌ OPENROUTER_API_KEY not found. Please set it in your .env file.")

def clean_json_response(raw_text: str) -> str:
    """
    Extract and clean a JSON string from model output.
    """
    # Extract JSON block if wrapped with { ... }
    json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
    if json_match:
        raw_text = json_match.group(0)

    # Remove trailing commas before closing braces/brackets
    raw_text = re.sub(r',(\s*[}\]])', r'\1', raw_text)

    return raw_text.strip()

def match_resume_to_job(resume_text: str, job_description: str) -> dict:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",  # Optional but recommended by OpenRouter
        "X-Title": "Resume Matcher"
    }

    prompt = f"""
You are a resume evaluator.

Compare the following resume and job description.
Return ONLY a valid JSON object with the following keys:
- "score": number (float, 0 to 10)
- "summary": string
- "match_points": list of strings
- "flags": list of strings

No extra text, no markdown, no explanations.

Job Description:
{job_description}

Resume:
{resume_text}
"""

    data = {
        "model": "mistralai/mistral-7b-instruct",
        "messages": [
            {"role": "system", "content": "You are a strict JSON-only resume evaluation bot."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data
        )
        response.raise_for_status()

        result = response.json()
        content = result["choices"][0]["message"]["content"]

        # Clean and parse JSON
        cleaned = clean_json_response(content)
        return json.loads(cleaned)

    except json.JSONDecodeError:
        print("❌ Failed to parse JSON response:", content)
        return {
            "score": 0.0,
            "summary": "AI returned invalid JSON",
            "match_points": [],
            "flags": []
        }

    except Exception as e:
        print("❌ OpenRouter API failed:", getattr(response, "status_code", None), getattr(response, "text", None))
        return {
            "score": 0.0,
            "summary": f"Error: {str(e)}",
            "match_points": [],
            "flags": []
        }
