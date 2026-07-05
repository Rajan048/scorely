"""Teacher schemas."""
from pydantic import BaseModel, EmailStr
from typing import Optional


class TeacherCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    employee_id: str
    password: str


class TeacherUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    subject: Optional[str] = None
    employee_id: Optional[str] = None


class TeacherResponse(BaseModel):
    teacher_id: str  # MongoDB ObjectId as string
    name: str
    email: str
    subject: str
    employee_id: str

    class Config:
        from_attributes = True
