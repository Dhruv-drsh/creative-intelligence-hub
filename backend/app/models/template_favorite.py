from beanie import Document
from pydantic import Field
from datetime import datetime
from uuid import uuid4


class TemplateFavorite(Document):
    """TemplateFavorite document for MongoDB."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    template_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "template_favorites"
        indexes = [
            "user_id",
            "template_id",
            [("user_id", 1), ("template_id", 1)],  # Compound unique index
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-uuid",
                "template_id": "template-uuid",
            }
        }
