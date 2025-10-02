from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database.connection import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), unique=True, nullable=False)

    scheduled_at = Column(DateTime, nullable=True)
    mode = Column(String(50), nullable=True)   
    venue = Column(String(255), nullable=True) 

    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="interview")
