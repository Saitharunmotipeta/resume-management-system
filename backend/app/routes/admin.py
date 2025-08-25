from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.job import Job
from app.models.resume import Resume
from app.models.interview import Interview

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/metrics")
def get_admin_metrics(db: Session = Depends(get_db)):
    """
    Returns basic platform statistics for admin dashboard
    """
    total_users = db.query(User).count()
    total_jobs = db.query(Job).count()
    total_resumes = db.query(Resume).count()
    total_interviews = db.query(Interview).count()

    # breakdown by role
    roles = db.query(User.role).all()
    role_counts = {}
    for (role,) in roles:
        role_counts[role] = role_counts.get(role, 0) + 1

    return {
        "users": total_users,
        "jobs": total_jobs,
        "resumes": total_resumes,
        "interviews": total_interviews,
        "roles": role_counts
    }
