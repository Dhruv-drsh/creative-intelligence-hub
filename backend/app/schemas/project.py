from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, Any


class ProjectCreate(BaseModel):
    name: str = "Untitled Creative"
    format_id: str = "instagram-feed"
    format_width: int = 1080
    format_height: int = 1080
    canvas_data: dict[str, Any] = {}
    brand_kit_id: Optional[UUID] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    format_id: Optional[str] = None
    format_width: Optional[int] = None
    format_height: Optional[int] = None
    canvas_data: Optional[dict[str, Any]] = None
    thumbnail_url: Optional[str] = None
    compliance_score: Optional[int] = None
    brand_kit_id: Optional[UUID] = None


class ProjectResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    format_id: str
    format_width: int
    format_height: int
    canvas_data: dict[str, Any]
    thumbnail_url: Optional[str] = None
    compliance_score: int
    brand_kit_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
