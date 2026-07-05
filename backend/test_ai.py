import asyncio
from dotenv import load_dotenv
import os

load_dotenv()

from app.services.question_extraction_service import extract_questions_from_text

async def main():
    try:
        print("Testing extraction with provider:", os.getenv("AI_PROVIDER"))
        res = await extract_questions_from_text("List two colors.")
        print("Success:", res)
    except Exception as e:
        print("Error:", type(e).__name__, e)

if __name__ == "__main__":
    asyncio.run(main())
