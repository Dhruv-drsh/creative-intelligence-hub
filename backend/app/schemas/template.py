from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, Any


class TemplateCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str = "general"
    format_width: int = 1080
    format_height: int = 1080
    canvas_data: dict[str, Any] = {}
    thumbnail_url: Optional[str] = None
    is_public: bool = False


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    format_width: Optional[int] = None
    format_height: Optional[int] = None
    canvas_data: Optional[dict[str, Any]] = None
    thumbnail_url: Optional[str] = None
    is_public: Optional[bool] = None


class TemplateResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID] = None
    name: str
    description: Optional[str] = None
    category: str
    format_width: int
    format_height: int
    canvas_data: dict[str, Any]
    thumbnail_url: Optional[str] = None
    is_public: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TemplateFavoriteResponse(BaseModel):
    id: UUID
    user_id: UUID
    template_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True
