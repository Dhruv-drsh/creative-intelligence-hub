from beanie import Document
from pydantic import EmailStr, Field
from datetime import datetime
from uuid import uuid4
from typing import Optional


class User(Document):
    """User document for MongoDB."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    email: EmailStr
    password_hash: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
        indexes = [
            "email",
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password_hash": "hashed_password",
            }
        }
