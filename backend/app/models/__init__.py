"""Database models."""
from .user import User, OTPVerification
from .teacher import Teacher
from .subject import Subject
from .question_paper import QuestionPaper, Question
from .answer_sheet import AnswerSheet, Answer
from .evaluation import EvaluationResult

__all__ = [
    "User",
    "OTPVerification",
    "Teacher",
    "Subject",
    "QuestionPaper",
    "Question",
    "AnswerSheet",
    "Answer",
    "EvaluationResult",
]
