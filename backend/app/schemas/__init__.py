"""Pydantic schemas."""
from .user import UserCreate, UserLogin, UserResponse, Token, TokenData
from .teacher import TeacherCreate, TeacherResponse
from .subject import SubjectCreate, SubjectResponse
from .question import QuestionCreate, QuestionUpdate, QuestionResponse
from .question_paper import QuestionPaperCreate, QuestionPaperResponse
from .answer import AnswerCreate, AnswerUpdate, AnswerResponse
from .answer_sheet import AnswerSheetResponse, AnswerSheetBulkUpload
from .evaluation import EvaluationResponse, EvaluationSettingsUpdate

__all__ = [
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "Token",
    "TokenData",
    "TeacherCreate",
    "TeacherResponse",
    "SubjectCreate",
    "SubjectResponse",
    "QuestionCreate",
    "QuestionUpdate",
    "QuestionResponse",
    "QuestionPaperCreate",
    "QuestionPaperResponse",
    "AnswerCreate",
    "AnswerUpdate",
    "AnswerResponse",
    "AnswerSheetResponse",
    "AnswerSheetBulkUpload",
    "EvaluationResponse",
    "EvaluationSettingsUpdate",
]
