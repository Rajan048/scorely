"""Service for generating reference answers using AI."""
from ..config import get_settings

settings = get_settings()

async def generate_reference_answer(question_text: str) -> str:
    """Uses AI to generate a reference answer for a question."""
    prompt = f"""Generate a concise exam-style reference answer for the following question suitable for full marks.

Question: {question_text}
"""
    
    if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash')
        try:
            response = await model.generate_content_async(prompt)
            return response.text.strip()
        except:
            response = model.generate_content(prompt)
            return response.text.strip()
    elif settings.AI_PROVIDER == "openai" and settings.OPENAI_API_KEY:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        response = await client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()
    else:
        raise ValueError("No valid AI provider configured in .env")
