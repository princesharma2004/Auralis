from fastapi import APIRouter, HTTPException, status
import base64
from sqlalchemy.orm import Session
from typing import List, Dict, Any, cast

from core.security import decode_token, settings
from crud.user import create_user, get_user_by_email, get_user
from crud.job import create_job, delete_job, get_job, recruiter_jobs, get_total_recruiter_jobs
from crud.application import get_applications_by_job, get_total_applications_by_job
from crud.application import update_application_status as crud_update_application_status
from crud.resume import get_resume_by_user
from api.dependencies import get_db_session
from schemas.user import UserCreate
from schemas.job import JobCreate, JobResponse


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


@router.get("/my_jobs")
async def my_jobs(token: str, skip: int = 0, limit: int = 100, db: Session = get_db_session()) -> Dict[str, Any]:
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
    
    jobs = recruiter_jobs(db, user_id)
    total = get_total_recruiter_jobs(db, user_id)

    return {
        "data": [JobResponse.model_validate(j) for j in jobs],
        "total": total,
        "skip": skip,
        "limit": limit,
        "page": (skip // limit) + 1,
        "total_pages": (total + limit - 1) // limit,
    }


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
async def applications(
    token: str, 
    job_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = get_db_session()
) -> Dict[str, Any]:

    # Decode token and check role
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "recruiter":
        raise HTTPException(status_code=403, detail="Access denied: only recruiter can view applications")

    # Fetch user
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Fetch job
    job = get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if str(job.recruiter_id) != str(user.id):
        raise HTTPException(
            status_code=403, 
            detail="Access denied: only job's recruiter can see their job applications."
        )
    
    # Fetch applications
    applications = get_applications_by_job(db, job_id, skip, limit)
    results: List[Dict[str, Any]] = []

    for app in applications:
        resume = get_resume_by_user(db, cast(int, app.candidate_id))
        if not resume:
            continue

        # Read and encode resume as base64
        with open(str(resume.storage_path), "rb") as f:
            encoded_resume = base64.b64encode(f.read()).decode()

        results.append({
            "application_id": app.id,
            "applicant_name": app.candidate.name,
            "email": app.candidate.email,
            "resume_filename": resume.filename,
            "resume_data": encoded_resume,
            "similarity_score": app.similarity_score,
            "status": app.status,
        })
        
    total = get_total_applications_by_job(db, job_id)

    return {
        "data": results,
        "total": total,
        "skip": skip,
        "limit": limit,
        "page": (skip // limit) + 1,
        "total_pages": (total + limit - 1) // limit,
    }


@router.get("/update_application_status")
async def update_application_status(token: str, application_id: int, new_status: str, db: Session=get_db_session()) -> None:

    # Decode token and check role
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "recruiter":
        raise HTTPException(status_code=403, detail="Access denied: only recruiter can update application status")

    # Fetch user
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if new_status not in ["applied", "accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
    
    # Fetch application
    application = crud_update_application_status(db, application_id, new_status)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Verify that the recruiter owns the job related to the application
    job = get_job(db, cast(int, application.job_id))
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if str(job.recruiter_id) != str(user.id):
        raise HTTPException(
            status_code=403, 
            detail="Access denied: only job's recruiter can update application status."
        )
