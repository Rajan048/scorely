"""Service for extracting student answers from raw text."""
import re
import json
import asyncio
from typing import Dict


def extract_student_answers_regex(text: str) -> Dict[str, str]:
    """
    Fallback: Extracts answers based on regex patterns like Q1, Q2, etc.
    Returns a dictionary mapping question number (str) to answer text.
    """
    answers = {}
    pattern = re.compile(r'(?:^|\n)\s*(?:Q|Ques(?:tion)?|Ans(?:wer)?)\s*(\d+)[\.\:\-\s]+', re.IGNORECASE)
    matches = list(pattern.finditer(text))

    if not matches:
        return {"1": text.strip()} if text.strip() else {}

    for i, match in enumerate(matches):
        q_num = str(int(match.group(1)))
        start_idx = match.end()
        end_idx = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        answer_text = text[start_idx:end_idx].strip()
        if q_num in answers:
            answers[q_num] += "\n" + answer_text
        else:
            answers[q_num] = answer_text

    return answers


async def extract_student_answers_ai(text: str, questions: list) -> Dict[str, str]:
    """
    Uses AI to intelligently map raw OCR text to the correct question numbers.
    Questions is a list of dicts: [{"num": 1, "text": "..."}, ...]
    Returns dict mapping question number (str) to answer text.
    """
    from ..config import get_settings
    settings = get_settings()

    questions_block = "\n".join([f"Q{q['num']}: {q['text']}" for q in questions])

    prompt = f"""You are a student answer extractor. Given the raw OCR text from a student's answer sheet and a list of questions, extract which part of the text answers each question.

Questions:
{questions_block}

Student Answer Sheet (raw OCR text):
{text}

Return ONLY a JSON object mapping question numbers to their answers. If no answer is found for a question, return an empty string.
Example: {{"1": "answer text here", "2": "another answer", "3": ""}}

Rules:
- Map answers by the question number (as string)
- If the text is unstructured, do your best to match content to the right question
- Never return null, always use empty string if no answer found
"""

    try:
        if settings.AI_PROVIDER == "nvidia" and settings.NVIDIA_API_KEY:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(
                api_key=settings.NVIDIA_API_KEY,
                base_url="https://integrate.api.nvidia.com/v1"
            )
            response = await client.chat.completions.create(
                model="meta/llama-3.1-70b-instruct",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            raw = response.choices[0].message.content
        elif settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model_g = genai.GenerativeModel('gemini-2.5-flash')
            response = await model_g.generate_content_async(prompt)
            raw = response.text
        else:
            return extract_student_answers_regex(text)

        # Parse JSON
        raw = raw.strip()
        if raw.startswith("```"):
            raw = re.sub(r"```(?:json)?", "", raw).strip().rstrip("```").strip()
        return json.loads(raw)

    except Exception as e:
        print(f"AI answer extraction failed, falling back to regex: {e}")
        return extract_student_answers_regex(text)


def extract_student_answers(text: str) -> Dict[str, str]:
    """Sync wrapper - uses regex only. Use extract_student_answers_ai for AI-powered extraction."""
    return extract_student_answers_regex(text)
