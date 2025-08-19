from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str = Field(..., example="Frontend Developer Intern")
    description: str = Field(..., example="We are looking for a passionate React dev...")
    vacancies: int = Field(..., gt=0, example=5)
    expires_at: Optional[datetime] = Field(None, example="2025-09-01T23:59:00")

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    vacancies: Optional[int] = None
    expires_at: Optional[datetime] = None

class JobOut(JobBase):
    id: int
    created_by: str
    created_at: datetime

    model_config = {"from_attributes": True}
