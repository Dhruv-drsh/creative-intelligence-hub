from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional


class Profile(Document):
    """Profile document for MongoDB."""
    id: str  # Same as user_id for 1:1 relationship
    email: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "profiles"
        indexes = [
            "id",
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "id": "user-uuid",
                "email": "user@example.com",
                "full_name": "John Doe",
            }
        }
