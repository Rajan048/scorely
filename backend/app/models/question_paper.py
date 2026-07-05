"""Question paper and question models."""
from datetime import datetime
from beanie import Document
from pydantic import Field
from typing import Any, Optional


class QuestionPaper(Document):
    created_by: Any  # ObjectId reference to Teacher
    subject: str
    exam_name: str
    pdf_path: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "question_papers"


class Question(Document):
    paper_id: Any  # ObjectId reference to QuestionPaper
    question_text: str
    marks: float
    reference_answer: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "questions"
