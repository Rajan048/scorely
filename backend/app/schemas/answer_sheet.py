"""Answer sheet schemas."""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .answer import AnswerResponse


class AnswerSheetResponse(BaseModel):
    id: str  # MongoDB ObjectId as string
    student_name: str
    student_roll: Optional[str] = None
    total_marks: Optional[float] = None
    obtained_marks: Optional[float] = None
    status: str
    feedback: Optional[str] = None
    created_at: datetime
    evaluated_at: Optional[datetime] = None
    answers: Optional[List[AnswerResponse]] = []

    class Config:
        from_attributes = True


class AnswerSheetBulkUpload(BaseModel):
    question_paper_id: int
    student_mappings: Optional[dict] = None  # filename -> student_name
