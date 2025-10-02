# app/routes/job.py
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.connection import get_db
from ..models.job import Job
from ..schemas.job import JobCreate, JobOut, JobUpdate
from ..auth.auth_utils import require_role
from ..models.user import User, UserRole

router = APIRouter(tags=["Jobs"])

@router.post("/", response_model=JobOut)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.hr]))
):
    new_job = Job(
        title=job.title,
        description=job.description,
        vacancies=job.vacancies,
        created_by_id=current_user.id,
        created_by=current_user.username,
        created_at=datetime.utcnow(),
        expires_at=job.expires_at
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.get("/", response_model=List[JobOut])
def get_all_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()

@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/{job_id}", response_model=JobOut)
def update_job(
    job_id: int,
    updated: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.hr, UserRole.admin]))
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if current_user.role != UserRole.admin and job.created_by != current_user.username:
        raise HTTPException(status_code=403, detail="You can only edit your own jobs")

    for key, value in updated.dict(exclude_unset=True).items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)
    return job

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.admin]))
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(job)
    db.commit()
    return {"msg": "Job deleted successfully"}
