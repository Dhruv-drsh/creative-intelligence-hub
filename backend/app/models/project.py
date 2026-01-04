from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from ..database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    brand_kit_id = Column(UUID(as_uuid=True), ForeignKey("brand_kits.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(255), default="Untitled Creative")
    format_id = Column(String(100), default="instagram-feed")
    format_width = Column(Integer, default=1080)
    format_height = Column(Integer, default=1080)
    canvas_data = Column(JSONB, default=dict)
    thumbnail_url = Column(String(500))
    compliance_score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="projects")
    brand_kit = relationship("BrandKit", back_populates="projects")
