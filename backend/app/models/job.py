from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database.connection import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String, nullable=False)
    vacancies = Column(Integer, nullable=False)
    expires_at = Column(DateTime, nullable=True) 
    created_by_id = Column(Integer, ForeignKey("users.id"))
    created_by = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User", back_populates="created_jobs")
    resumes = relationship("Resume", back_populates="job", cascade="all, delete-orphan")
