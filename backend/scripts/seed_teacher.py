"""Seed a test teacher account."""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database import init_db
from app.models.user import User
from app.models.teacher import Teacher
from app.core.security import get_password_hash


async def seed():
    await init_db()

    email = "teacher@test.com"
    password = "teacher123"

    # Remove existing if any
    existing_user = await User.find_one(User.email == email)
    if existing_user:
        existing_teacher = await Teacher.find_one(Teacher.user_id == existing_user.id)
        if existing_teacher:
            await existing_teacher.delete()
        await existing_user.delete()
        print("Removed existing teacher account")

    # Create User
    user = User(
        name="Test Teacher",
        email=email,
        password=get_password_hash(password),
        role="teacher",
    )
    await user.insert()

    # Create Teacher profile
    teacher = Teacher(
        user_id=user.id,
        name="Test Teacher",
        email=email,
        subject="Mathematics",
        employee_id="EMP001",
    )
    await teacher.insert()

    print(f"[OK] Teacher created successfully!")
    print(f"   Email:    {email}")
    print(f"   Password: {password}")
    print(f"   Subject:  Mathematics")
    print(f"   Role:     teacher")


if __name__ == "__main__":
    asyncio.run(seed())
