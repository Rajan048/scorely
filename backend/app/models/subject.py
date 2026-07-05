"""Subject model."""
from datetime import datetime
from beanie import Document, Indexed
from pydantic import Field
from typing import Optional


class Subject(Document):
    name: Indexed(str, unique=True)
    code: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "subjects"
