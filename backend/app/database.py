"""MongoDB configuration with Beanie ODM."""
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from .config import get_settings
from .models.user import User, OTPVerification
from .models.teacher import Teacher
from .models.subject import Subject
from .models.question_paper import QuestionPaper, Question
from .models.answer_sheet import AnswerSheet, Answer
from .models.evaluation import EvaluationResult

settings = get_settings()
client: AsyncIOMotorClient | None = None


async def init_db():
    """Initialize MongoDB connection and Beanie document models."""
    global client
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(
        database=client[settings.MONGODB_DB_NAME],
        document_models=[
            User,
            OTPVerification,
            Teacher,
            Subject,
            QuestionPaper,
            Question,
            AnswerSheet,
            Answer,
            EvaluationResult,
        ],
    )
