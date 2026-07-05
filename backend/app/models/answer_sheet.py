"""Answer sheet and answer models."""
from datetime import datetime
from beanie import Document
from pydantic import Field
from typing import Any, Optional


class AnswerSheet(Document):
    question_paper_id: Any  # ObjectId reference to QuestionPaper
    teacher_id: Any  # ObjectId reference to Teacher
    student_name: str
    student_roll: Optional[str] = None
    file_path: str
    total_marks: Optional[float] = None
    obtained_marks: Optional[float] = None
    status: str = "pending"  # pending, evaluated, reviewed
    feedback: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    evaluated_at: Optional[datetime] = None

    class Settings:
        name = "answer_sheets"


class Answer(Document):
    answer_sheet_id: Any  # ObjectId reference to AnswerSheet
    question_id: Any  # ObjectId reference to Question
    answer_text: Optional[str] = None
    marks_obtained: Optional[float] = None
    max_marks: Optional[float] = None
    ai_score: Optional[float] = None
    feedback: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "answers"
