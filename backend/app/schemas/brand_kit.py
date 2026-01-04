from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class BrandKitCreate(BaseModel):
    name: str
    primary_color: str = "#22C55E"
    secondary_color: str = "#38BDF8"
    accent_color: str = "#F59E0B"
    font_heading: str = "Inter"
    font_body: str = "Inter"
    logo_url: Optional[str] = None
    guidelines: Optional[str] = None


class BrandKitUpdate(BaseModel):
    name: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    font_heading: Optional[str] = None
    font_body: Optional[str] = None
    logo_url: Optional[str] = None
    guidelines: Optional[str] = None


class BrandKitResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    primary_color: str
    secondary_color: str
    accent_color: str
    font_heading: str
    font_body: str
    logo_url: Optional[str] = None
    guidelines: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
