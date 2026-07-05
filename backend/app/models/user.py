"""User model."""
from datetime import datetime
from beanie import Document, Indexed
from pydantic import Field


class User(Document):
    name: str
    email: Indexed(str, unique=True)
    password: str
    role: str  # admin or teacher
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"


class OTPVerification(Document):
    email: Indexed(str)
    otp: str
    purpose: str = "password_reset"
    expires_at: datetime
    used: int = 0  # 0 = not used, 1 = used
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "otp_verifications"
