"""Question schemas."""
from pydantic import BaseModel
from typing import Optional


class QuestionCreate(BaseModel):
    question_number: int
    question_text: str
    question_type: str  # mcq, short_answer, long_answer
    marks: float
    keywords: Optional[str] = None
    correct_option: Optional[str] = None
    options: Optional[str] = None


class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    question_type: Optional[str] = None
    marks: Optional[float] = None
    reference_answer: Optional[str] = None
    keywords: Optional[str] = None
    correct_option: Optional[str] = None
    options: Optional[str] = None


class QuestionResponse(BaseModel):
    id: str  # MongoDB ObjectId as string
    question_number: int
    question_text: str
    question_type: str
    marks: float
    reference_answer: Optional[str] = None
    keywords: Optional[str] = None
    correct_option: Optional[str] = None

    class Config:
        from_attributes = True
