from fastapi import APIRouter, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from datetime import datetime, timezone
from typing import List, cast
from os import makedirs, path, remove
import aiofiles
from sqlalchemy.orm import Session

from core.security import decode_token
from crud.user import create_user, get_user, get_user_by_email
from crud.resume import create_resume
from crud.job import get_jobs, get_job
from crud.application import apply_for_job, delete_applications_by_id
from api.dependencies import get_db_session
from schemas.user import UserCreate
from schemas.job import JobResponse
from schemas.application import ApplicationResponse
from models.resume import Resume
from models.job import Job
from models.application import Application


router = APIRouter()

UPLOAD_DIR = "../uploads/resumes"
makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: Session = get_db_session()) -> None :
    """Register a new candidate user."""
    existing = get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    create_user(db, user, role="candidate")


@router.post("/upload_resume", status_code=status.HTTP_201_CREATED)
async def upload_resume(token: str, file: UploadFile = File(...), db: Session = get_db_session()) -> FileResponse:
    """Upload or replace a candidate's resume and return the uploaded file."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "candidate":
        raise HTTPException(status_code=403, detail="Access denied: only candidates can upload there resumes")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="File not provided")

    if not file.filename.lower().endswith((".pdf", ".doc", ".docx")):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF/DOC/DOCX allowed.")

    old_resume = db.query(Resume).filter(Resume.user_id == user_id).first()
    if old_resume:
        try:
            if path.exists(str(old_resume.storage_path)):
                remove(str(old_resume.storage_path))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting old resume: {e}")
        db.delete(old_resume)
        db.commit()

    filename = f"{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}_{file.filename}"
    storage_path = path.join(UPLOAD_DIR, filename)

    async with aiofiles.open(storage_path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            await buffer.write(chunk)

    create_resume(
        db=db,
        user_id=user_id,
        filename=file.filename,
        storage_path=storage_path,
    )

    return FileResponse(
        path=storage_path,
        filename=file.filename,
        media_type=file.content_type
    )


@router.get("/my_resume")
async def my_resume(token: str, db: Session = get_db_session()) -> FileResponse:
    """Return the candidate's uploaded resume file."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "candidate":
        raise HTTPException(status_code=403, detail="Access denied: only candidates can view there resumes")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    resume = db.query(Resume).filter(Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found for this user")

    if not path.exists(str(resume.storage_path)):
        raise HTTPException(status_code=404, detail="Resume file missing on server")

    return FileResponse(
        path=str(resume.storage_path),
        filename=str(resume.filename),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={resume.filename}"}
    )


@router.delete("/delete_my_resume", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_resume(token: str, db: Session = get_db_session()) -> None:
    """Delete the candidate's uploaded resume (file + database record)."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token")

    if role != "candidate":
        raise HTTPException(status_code=403, detail="Access denied: only candidates can delete there resumes")

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    resume = db.query(Resume).filter(Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found for this user")

    try:
        if path.exists(str(resume.storage_path)):
            remove(str(resume.storage_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting file: {e}")

    db.delete(resume)
    db.commit()


@router.get('/jobs', response_model=list[JobResponse])
async def list_jobs(token: str, skip: int = 0, limit: int = 100, db: Session = get_db_session()) -> List[Job]:
    """List jobs with pagination."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')
    
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    user_role = payload.get("role")
    if user_role != "candidate":
        raise HTTPException(status_code=403, detail="Access denied: only candidates can see jobs.")

    jobs = get_jobs(db, skip=skip, limit=limit)
    return jobs


@router.post("/apply_job", response_model=ApplicationResponse)
async def apply_job(token: str, job_id: int, db: Session = get_db_session()) -> Application:
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')
    
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    user_role = payload.get("role")
    if user_role != "candidate":
        raise HTTPException(status_code=403, detail="Access denied: only candidates can apply for job.")
    
    resume = db.query(Resume).filter(Resume.user_id == user_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found for this user")
    
    job = get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return apply_for_job(db, user_id, job_id, cast(int, resume.id))


@router.delete("/delete_application", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application(token: str, app_id: int, db: Session = get_db_session()) -> None:
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')
    
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    user_role = payload.get("role")
    if user_role != "candidate":
        raise HTTPException(status_code=403, detail="Access denied: only candidates can delete application.")
    
    application = db.query(Application).filter(Application.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Application not found.')
    
    delete_applications_by_id(db, app_id)
