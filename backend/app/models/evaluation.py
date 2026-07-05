"""Evaluation models."""
from datetime import datetime
from beanie import Document
from pydantic import Field
from typing import Any, Optional, List, Dict


class EvaluationResult(Document):
    student_name: str
    paper_id: Any  # ObjectId reference to QuestionPaper
    answers: Dict[str, str]  # Map of Question ID to Student Answer Text
    similarity_scores: Dict[str, float]  # Map of Question ID to Similarity Score
    marks: Dict[str, float]  # Map of Question ID to Marks obtained
    total_marks: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "evaluation_results"
