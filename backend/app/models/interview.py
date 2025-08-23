from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), unique=True, nullable=False)

    scheduled_at = Column(DateTime, nullable=True)   # date + time
    mode = Column(String(50), nullable=True)         # online / offline
    venue = Column(String(255), nullable=True)       # optional if online

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    resume = relationship("Resume", back_populates="interview")
