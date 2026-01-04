from beanie import Document
from pydantic import Field
from datetime import datetime
from uuid import uuid4
from typing import Optional, Any


class Project(Document):
    """Project document for MongoDB."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    brand_kit_id: Optional[str] = None
    name: str = "Untitled Creative"
    format_id: str = "instagram-feed"
    format_width: int = 1080
    format_height: int = 1080
    canvas_data: dict[str, Any] = Field(default_factory=dict)
    thumbnail_url: Optional[str] = None
    compliance_score: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "projects"
        indexes = [
            "user_id",
            "brand_kit_id",
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-uuid",
                "name": "My Creative",
                "format_id": "instagram-feed",
            }
        }
