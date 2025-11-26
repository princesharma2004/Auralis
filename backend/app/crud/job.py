from sqlalchemy.orm import Session
from typing import Optional, List

from core.security import settings
from models.job import Job
from schemas.job import JobCreate

def create_job(db: Session, recruiter_id: int, job: JobCreate) -> Job:
    db_job = Job(
        recruiter_id=recruiter_id,
        title=settings.JOBS[job.title_id],
        description=job.description,
        location=job.location,
        employment_type=job.employment_type,
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


def delete_job(db: Session, job_id: int) -> None:
    db.query(Job).filter(Job.id == job_id).delete(synchronize_session=False)
    db.commit()


def recruiter_jobs(db: Session, recruiter_id: int) -> List[Job]:
    return db.query(Job).filter(Job.recruiter_id == recruiter_id).all()


def get_jobs(db: Session, skip: int = 0, limit: int = 10) -> List[Job]:
    return db.query(Job).offset(skip).limit(limit).all()


def get_job(db: Session, job_id: int) -> Optional[Job]:
    return db.query(Job).filter(Job.id == job_id).first()
