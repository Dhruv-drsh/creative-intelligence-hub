from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from ..database import Base


class BrandKit(Base):
    __tablename__ = "brand_kits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    primary_color = Column(String(50), default="#22C55E")
    secondary_color = Column(String(50), default="#38BDF8")
    accent_color = Column(String(50), default="#F59E0B")
    font_heading = Column(String(100), default="Inter")
    font_body = Column(String(100), default="Inter")
    logo_url = Column(String(500))
    guidelines = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="brand_kits")
    projects = relationship("Project", back_populates="brand_kit")
