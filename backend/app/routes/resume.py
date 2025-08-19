from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import fitz  # PyMuPDF
import json

from app.database.connection import get_db
from app.models.resume import Resume
from app.models.job import Job
from app.models.user import User, UserRole
from app.schemas.resume import ResumeOut
from app.services.gemini import match_resume_to_job
from app.auth.auth_utils import get_current_user, require_role

router = APIRouter(tags=["Resumes"])

# Upload resume — only students
@router.post("/upload", response_model=dict)
def upload_resume(
    file: UploadFile = File(...),
    job_id: int = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.student]))
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files accepted.")

    contents = file.file.read()
    try:
        doc = fitz.open(stream=contents, filetype="pdf")
        raw_text = "".join([page.get_text() for page in doc])
    except Exception:
        raise HTTPException(status_code=400, detail="Error reading PDF.")

    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    resume = Resume(
        filename=file.filename,
        raw_text=raw_text,
        uploaded_by_id=current_user.id,
        uploaded_by=current_user.username,
        email=email,
        phone=phone,
        job_id=job_id,
        created_at=datetime.utcnow()
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # AI Matching
    result = match_resume_to_job(raw_text, job.description)
    resume.match_score = result.get("score")
    resume.match_summary = result.get("summary")
    resume.match_points = json.dumps(result.get("match_points", []))
    resume.match_flags = json.dumps(result.get("flags", []))

    db.commit()
    db.refresh(resume)

    return {
        "msg": "Resume uploaded and matched successfully",
        "resume_id": resume.id,
        "score": resume.match_score,
        "summary": resume.match_summary
    }

# HR/Manager/Admin can view resumes for a job
@router.get("/job/{job_id}", response_model=List[ResumeOut])
def get_resumes_for_job(
    job_id: int,
    shortlisted_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.hr, UserRole.manager, UserRole.admin]))
):
    query = db.query(Resume).filter(Resume.job_id == job_id)

    # Managers: show shortlisted by default, but allow override with query param
    if current_user.role == UserRole.manager:
        if shortlisted_only:   # Manager explicitly asked for shortlisted only
            query = query.filter(Resume.shortlisted == "yes")
        # else: Manager can see all resumes as well

    # HR/Admin: can use query param to filter
    elif shortlisted_only:
        query = query.filter(Resume.shortlisted == "yes")

    resumes = query.all()

    for resume in resumes:
        resume.match_points = json.loads(resume.match_points or "[]")
        resume.match_flags = json.loads(resume.match_flags or "[]")

    return resumes


# Re-run AI match — HR only
@router.post("/match/{resume_id}")
def match_resume_again(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.hr]))
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    job = db.query(Job).filter(Job.id == resume.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    result = match_resume_to_job(resume.raw_text, job.description)
    resume.match_score = result.get("score")
    resume.match_summary = result.get("summary")
    resume.match_points = json.dumps(result.get("match_points", []))
    resume.match_flags = json.dumps(result.get("flags", []))

    db.commit()
    db.refresh(resume)

    return {"msg": "Re-matched successfully", "score": resume.match_score}

# Shortlist a resume — HR only
@router.post("/shortlist/{resume_id}")
def shortlist_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.hr]))
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume.shortlisted = "yes"
    db.commit()
    return {"msg": f"Resume ID {resume_id} shortlisted"}

# Remove shortlist — HR only
@router.post("/unshortlist/{resume_id}")
def unshortlist_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.hr]))
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume.shortlisted = "no"
    db.commit()
    return {"msg": f"Resume ID {resume_id} removed from shortlist"}

# Delete — by student (own) or admin
@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if current_user.role != UserRole.admin and resume.uploaded_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized to delete this resume")

    db.delete(resume)
    db.commit()
    return {"msg": f"Resume ID {resume_id} deleted"}

# Get my own resumes (Student only)
@router.get("/my", response_model=List[ResumeOut])
def get_my_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.student]))
):
    resumes = db.query(Resume).filter(Resume.uploaded_by_id == current_user.id).all()
    for resume in resumes:
        resume.match_points = json.loads(resume.match_points or "[]")
        resume.match_flags = json.loads(resume.match_flags or "[]")
    return resumes
