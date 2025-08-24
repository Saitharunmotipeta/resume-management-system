from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class ResumeUpload(BaseModel):
    uploaded_by: str
    email: EmailStr
    phone: str
    job_id: int


class MatchResult(BaseModel):
    score: Optional[float]
    summary: Optional[str]
    match_points: Optional[List[str]]
    match_flags: Optional[List[str]]


class ResumeOut(BaseModel):
    id: int
    filename: str
    uploaded_by: str
    email: str
    phone: str
    job_id: int
    created_at: datetime

    # AI Results
    match_score: Optional[float]
    match_summary: Optional[str]
    match_points: Optional[List[str]]
    match_flags: Optional[List[str]]

    class Config:
        orm_mode = True

class ShortlistedOut(BaseModel):
    resume_id: int
    job_id: int
    job_name: Optional[str]
    student_name: Optional[str]
    student_email: Optional[str]
    match_score: Optional[float]
    status: str
    feedback: Optional[str]
    scheduled_at: Optional[datetime]
    mode: Optional[str]
    venue: Optional[str]

    class Config:
        orm_mode = True
