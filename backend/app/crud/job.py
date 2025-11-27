from sqlalchemy.orm import Session
from typing import Optional, List
from sqlalchemy import func

from core.security import settings
from models.job import Job
from models.application import Application
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


def candidate_jobs(db: Session, candidate_id: int, skip: int, limit: int):
    applied_job_ids = (
        db.query(Application.job_id)
        .filter(Application.candidate_id == candidate_id)
    )

    return db.query(Job).filter(Job.id.notin_(applied_job_ids)).offset(skip).limit(limit).all()


def get_total_candidate_jobs(db: Session, candidate_id: int) -> int:
    applied_job_ids = (
        db.query(Application.job_id)
        .filter(Application.candidate_id == candidate_id)
    )

    return db.query(func.count(Job.id)).filter(Job.id.notin_(applied_job_ids)).scalar()


def get_total_recruiter_jobs(db: Session, recruiter_id: int) -> int:
    return db.query(func.count(Job.id)).filter(Job.recruiter_id == recruiter_id).scalar()


def get_jobs(db: Session, skip: int = 0, limit: int = 10) -> List[Job]:
    return db.query(Job).offset(skip).limit(limit).all()


def get_job(db: Session, job_id: int) -> Optional[Job]:
    return db.query(Job).filter(Job.id == job_id).first()

def get_total_jobs(db: Session) -> int:
    return db.query(func.count(Job.id)).scalar()
