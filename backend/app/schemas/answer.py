"""Answer schemas."""
from pydantic import BaseModel
from typing import Optional


class AnswerCreate(BaseModel):
    question_id: int
    answer_text: Optional[str] = None


class AnswerUpdate(BaseModel):
    marks_obtained: Optional[float] = None
    feedback: Optional[str] = None


class AnswerResponse(BaseModel):
    id: str  # MongoDB ObjectId as string
    question_id: int
    answer_text: Optional[str] = None
    marks_obtained: Optional[float] = None
    max_marks: Optional[float] = None
    ai_score: Optional[float] = None
    feedback: Optional[str] = None

    class Config:
        from_attributes = True
