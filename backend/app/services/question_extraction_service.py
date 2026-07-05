"""Service for extracting questions from raw text using AI."""
import json
from ..config import get_settings
from typing import Dict, Any

settings = get_settings()

async def extract_questions_from_text(text: str) -> Dict[str, Any]:
    """Uses AI to extract questions and marks from the raw text."""
    prompt = f"""Extract all questions and marks from the following exam paper.
Return JSON format:

{{
"questions":[
{{"question":"...","marks":10}}
]
}}

Exam Paper Text:
{text}
"""
    
    if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash')
        try:
            response = await model.generate_content_async(prompt)
            content = response.text
        except Exception as e:
            # Fallback for sync generate
            response = model.generate_content(prompt)
            content = response.text
    elif settings.AI_PROVIDER == "openai" and settings.OPENAI_API_KEY:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        response = await client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        content = response.choices[0].message.content
    elif settings.AI_PROVIDER == "nvidia" and settings.NVIDIA_API_KEY:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(
            api_key=settings.NVIDIA_API_KEY,
            base_url="https://integrate.api.nvidia.com/v1"
        )
        response = await client.chat.completions.create(
            model="meta/llama-3.1-70b-instruct",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        content = response.choices[0].message.content
    else:
        raise ValueError("No valid AI provider configured in .env")
        
    # Strip markdown if any
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:-3].strip()
    elif content.startswith("```"):
        content = content[3:-3].strip()
        
    try:
        return json.loads(content)
    except Exception as e:
        print(f"Failed to parse JSON: {content}")
        raise ValueError(f"Failed to parse AI response into JSON. Response: {content[:100]}...")
