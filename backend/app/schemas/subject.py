"""Subject schemas."""
from pydantic import BaseModel
from typing import Optional


class SubjectCreate(BaseModel):
    name: str
    code: Optional[str] = None
    description: Optional[str] = None


class SubjectResponse(BaseModel):
    id: str  # MongoDB ObjectId as string
    name: str
    code: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True
