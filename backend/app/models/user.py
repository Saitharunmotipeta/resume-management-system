from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from ..database.connection import Base
import enum


class UserRole(enum.Enum):
    admin = "admin"
    hr = "hr"
    manager = "manager"
    student = "student"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)

    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)

    resumes_uploaded = relationship("Resume", back_populates="uploader", foreign_keys="Resume.uploaded_by_id")
    created_jobs = relationship("Job", back_populates="creator", foreign_keys="[Job.created_by_id]")  # ✅ updated
