"""Teacher model."""
from beanie import Document, Indexed
from pydantic import Field
from typing import Any, Optional


class Teacher(Document):
    user_id: Any  # ObjectId reference to User
    name: str
    email: Indexed(str, unique=True)
    subject: str
    employee_id: Indexed(str, unique=True)

    class Settings:
        name = "teachers"
