from beanie import Document
from pydantic import Field
from datetime import datetime
from uuid import uuid4
from typing import Optional, Any


class Template(Document):
    """Template document for MongoDB."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: Optional[str] = None
    name: str
    description: Optional[str] = None
    category: str = "general"
    format_width: int = 1080
    format_height: int = 1080
    canvas_data: dict[str, Any] = Field(default_factory=dict)
    thumbnail_url: Optional[str] = None
    is_public: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "templates"
        indexes = [
            "user_id",
            "is_public",
            "category",
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Modern Template",
                "category": "social",
                "is_public": True,
            }
        }
