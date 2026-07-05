"""Question paper schemas."""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .question import QuestionResponse


class QuestionPaperCreate(BaseModel):
    subject: str
    exam_name: str
    total_marks: float
    num_questions: int
    questions: Optional[List[dict]] = None


class QuestionPaperResponse(BaseModel):
    id: str  # MongoDB ObjectId as string
    subject: str
    exam_name: str
    total_marks: float
    num_questions: int
    file_path: Optional[str] = None
    created_at: datetime
    questions: Optional[List[QuestionResponse]] = []

    class Config:
        from_attributes = True
