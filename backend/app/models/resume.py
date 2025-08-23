from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    raw_text = Column(Text, nullable=False)

    # Track uploader
    uploaded_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    uploaded_by = Column(String(100), nullable=False)  # ✅ Store username directly

    # Link to job
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)

    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)

    match_score = Column(Float, nullable=True)
    match_summary = Column(Text, nullable=True)
    match_points = Column(Text, nullable=True)  # Stored as JSON string
    match_flags = Column(Text, nullable=True)   # Stored as JSON string

    shortlisted = Column(String(10), default="no")  # yes / no

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    uploader = relationship("User", back_populates="resumes_uploaded", foreign_keys=[uploaded_by_id])
    job = relationship("Job", back_populates="resumes")
    interview = relationship("Interview", back_populates="resume", uselist=False)
