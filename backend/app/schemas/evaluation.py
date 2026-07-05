"""Evaluation schemas."""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class EvaluationResponse(BaseModel):
    id: str  # MongoDB ObjectId as string
    total_marks: float
    obtained_marks: float
    ai_accuracy_score: Optional[float] = None
    evaluation_mode: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class EvaluationSettingsUpdate(BaseModel):
    mode: Optional[str] = None
    reference_weight: Optional[float] = None
    similarity_weight: Optional[float] = None
    similarity_threshold: Optional[float] = None
