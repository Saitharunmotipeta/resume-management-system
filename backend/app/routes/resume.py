from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import fitz 
import json

from ..database.connection import get_db
from ..models.resume import Resume
from ..models.job import Job
from ..models.user import User, UserRole
from ..models.interview import Interview
from ..schemas.resume import ResumeOut
from ..services.gemini import match_resume_to_job
from ..auth.auth_utils import get_current_user, require_role
from ..schemas.interview import ScheduleRequest

router = APIRouter(tags=["Resumes"])

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

@router.get("/job/{job_id}", response_model=List[ResumeOut])
def get_resumes_for_job(
    job_id: int,
    shortlisted_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.hr, UserRole.manager, UserRole.admin]))
):
    query = db.query(Resume).filter(Resume.job_id == job_id)

    if shortlisted_only:
        query = query.filter(Resume.shortlisted == "yes")

    resumes = query.all()

    for resume in resumes:
        resume.match_points = json.loads(resume.match_points or "[]")
        resume.match_flags = json.loads(resume.match_flags or "[]")

    return resumes

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


@router.post("/reject/{resume_id}")
def reject_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.hr]))
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    resume.shortlisted = "no"
    db.commit()
    return {"msg": f"Resume ID {resume_id} rejected"}

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

@router.get("/applications/me")
def get_my_applications(
    db: Session = Depends(get_db),
    user: User = Depends(require_role([UserRole.student]))
):
    apps = (
        db.query(Resume, Job, Interview)
        .join(Job, Resume.job_id == Job.id)
        .outerjoin(Interview, Resume.id == Interview.resume_id)
        .filter(Resume.uploaded_by_id == user.id)
        .all()
    )

    result = []
    for resume, job, interview in apps:
        result.append({
            "id": resume.id,
            "job_id": job.id,
            "job_title": job.title,
            "applied_at": resume.created_at,
            "shortlisted": resume.shortlisted == "yes",
            "interview_at": interview.scheduled_at if interview else None,
            "interview_mode": interview.mode if interview else None,
            "interview_venue": interview.venue if interview else None,
        })

    return result

@router.get("/shortlisted")
def get_shortlisted(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.hr, UserRole.manager, UserRole.admin]))
):
    """
    Return all resumes marked shortlisted == "yes" with optional interview info.
    """
    resumes = (
        db.query(Resume)
        .filter(Resume.shortlisted == "yes")
        .all()
    )

    result = []
    for r in resumes:
        job = db.query(Job).filter(Job.id == r.job_id).first()
        student = db.query(User).filter(User.id == r.uploaded_by_id).first()
        interview = db.query(Interview).filter(Interview.resume_id == r.id).first()

        result.append({
            "resume_id": r.id,
            "job_id": r.job_id,
            "job_name": job.title if job else None,
            "student_name": getattr(student, "name", None),
            "student_email": getattr(student, "email", None),
            "match_score": r.match_score,
            "status": "interview scheduled" if interview else "shortlisted",
            "feedback": getattr(r, "feedback", None),
            "scheduled_at": interview.scheduled_at if interview else None,
            "mode": interview.mode if interview else None,
            "venue": interview.venue if interview else None,
        })

    return result

@router.post("/interviews/schedule/{job_id}")
def schedule_interview(
    job_id: int,
    schedule: ScheduleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.hr, UserRole.manager, UserRole.admin]))
):
    shortlisted = db.query(Resume).filter(
        Resume.job_id == job_id,
        Resume.shortlisted == "yes"
    ).all()

    if not shortlisted:
        raise HTTPException(status_code=404, detail="No shortlisted candidates")

    created_interviews = []
    for r in shortlisted:
        interview = db.query(Interview).filter(Interview.resume_id == r.id).first()
        if interview:
            # update
            interview.scheduled_at = datetime.combine(schedule.date, schedule.time)
            interview.mode = schedule.mode
            interview.venue = schedule.location
        else:
            interview = Interview(
                resume_id=r.id,
                scheduled_at=datetime.combine(schedule.date, schedule.time),
                mode=schedule.mode,
                venue=schedule.location,
                created_at=datetime.utcnow()
            )
            db.add(interview)
        created_interviews.append(interview)

    db.commit()

    return {
        "message": f"Interview scheduled/updated for {len(created_interviews)} candidates of job {job_id}",
        "date": str(schedule.date),
        "time": str(schedule.time),
        "mode": schedule.mode,
        "location": schedule.location
    }

@router.post("/{resume_id}/schedule")
def schedule_interview_single(
    resume_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.hr, UserRole.manager, UserRole.admin]))
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.shortlisted != "yes":
        raise HTTPException(status_code=400, detail="Candidate is not shortlisted")

    dt_raw = payload.get("datetime")
    mode = payload.get("mode")
    venue = payload.get("venue", "")

    if not dt_raw or not mode:
        raise HTTPException(status_code=400, detail="`datetime` and `mode` are required")

    try:
        scheduled_at = datetime.fromisoformat(dt_raw)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid datetime format; expected ISO format (YYYY-MM-DDTHH:MM)")

    interview = db.query(Interview).filter(Interview.resume_id == resume_id).first()
    if interview:
        interview.scheduled_at = scheduled_at
        interview.mode = mode
        interview.venue = venue
    else:
        interview = Interview(
            resume_id=resume_id,
            scheduled_at=scheduled_at,
            mode=mode,
            venue=venue,
            created_at=datetime.utcnow()
        )
        db.add(interview)

    db.commit()
    return {"msg": "Interview scheduled successfully", "resume_id": resume_id, "scheduled_at": scheduled_at.isoformat()}
