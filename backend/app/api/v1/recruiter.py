from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Any, cast

from core.security import decode_token, settings
from crud.user import create_user, get_user_by_email, get_user
from crud.job import create_job, delete_job, get_job, recruiter_jobs
from crud.application import get_applications_by_job
from crud.resume import get_resume_by_user
from api.dependencies import get_db_session
from schemas.user import UserCreate
from schemas.job import JobCreate, JobResponse
from models.job import Job


router = APIRouter()


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: Session = get_db_session()) -> None :
    """Register a new recruiter user."""
    existing = get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    create_user(db, user, role="recruiter")


@router.get("/job_titles")
async def job_titles(token: str, db: Session = get_db_session()) -> List[str]:
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "recruiter":
        raise HTTPException(status_code=403, detail="Access denied: only recruiter can create jobs")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return settings.JOBS


@router.post("/add_job", status_code=status.HTTP_201_CREATED)
async def add_job(token: str, job: JobCreate, db: Session = get_db_session()) -> None:
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "recruiter":
        raise HTTPException(status_code=403, detail="Access denied: only recruiter can create jobs")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if job.title_id >= len(settings.JOBS):
        raise HTTPException(status_code=400, detail="Invalid tittle id")
    
    create_job(db, user_id, job)


@router.get("/my_jobs", response_model=list[JobResponse])
async def my_jobs(token: str, db: Session = get_db_session()) -> List[Job]:
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "recruiter":
        raise HTTPException(status_code=403, detail="Access denied: only recruiter can see there jobs")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return recruiter_jobs(db, user_id)


@router.delete("/remove_job", status_code=status.HTTP_204_NO_CONTENT)
async def remove_job(token: str, job_id: int, db: Session = get_db_session()) -> None:
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "recruiter":
        raise HTTPException(status_code=403, detail="Access denied: only recruiter can delete job")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    job = get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if str(job.recruiter_id) != str(user.id):
        raise HTTPException(status_code=403, detail="Access denied: only job's recruiter can delete that job")
    
    delete_job(db, job_id)


@router.get("/applications")
async def applications(token: str, job_id: int, db: Session = get_db_session()) -> List[Any]:
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "recruiter":
        raise HTTPException(status_code=403, detail="Access denied: only recruiter can delete job")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    job = get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if str(job.recruiter_id) != str(user.id):
        raise HTTPException(status_code=403, detail="Access denied: only job's recruiter can see there job applications.")
    
    applications = get_applications_by_job(db, job_id)
    results = []

    for app in applications:
        resume = get_resume_by_user(db, cast(int, app.candidate_id))

        if not resume:
            continue

        results.append({
            "application_id": app.id,
            "applicant_name": app.candidate.name,
            "email": app.candidate.email,
            "resume": FileResponse(
                path=str(resume.storage_path),
                filename=str(resume.filename),
                media_type="application/octet-stream",
                headers={"Content-Disposition": f"attachment; filename={resume.filename}"}
            )
        })
    
    return results
