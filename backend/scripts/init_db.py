"""Initialize database with admin user and seed data."""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database import init_db
from app.models import User
from app.core.security import get_password_hash


async def seed():
    """Create tables and seed."""
    await init_db()

    # Create admin if not exists
    if not await User.find_one(User.email == "admin@admin.com"):
        admin = User(
            name="Admin",
            email="admin@admin.com",
            password=get_password_hash("admin123"),
            role="admin",
        )
        await admin.insert()
        print("Created admin user: admin@admin.com / admin123")
    else:
        print("Admin user already exists: admin@admin.com")


if __name__ == "__main__":
    asyncio.run(seed())
    print("Database initialized successfully")
