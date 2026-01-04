from beanie import Document
from pydantic import Field
from datetime import datetime
from uuid import uuid4
from typing import Optional


class BrandKit(Document):
    """BrandKit document for MongoDB."""
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    name: str
    primary_color: str = "#22C55E"
    secondary_color: str = "#38BDF8"
    accent_color: str = "#F59E0B"
    font_heading: str = "Inter"
    font_body: str = "Inter"
    logo_url: Optional[str] = None
    guidelines: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "brand_kits"
        indexes = [
            "user_id",
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-uuid",
                "name": "My Brand",
                "primary_color": "#22C55E",
            }
        }
