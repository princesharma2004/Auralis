from sqlalchemy.orm import Session
from typing import Optional, List

from models.job import Job
from schemas.job import JobCreate

def create_job(db: Session, recruiter_id: int, job: JobCreate) -> Job:
    db_job = Job(
        recruiter_id=recruiter_id,
        title=job.title,
        description=job.description,
        required_skills=job.required_skills,
        location=job.location,
        employment_type=job.employment_type,
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


def get_jobs(db: Session, skip: int = 0, limit: int = 10) -> List[Job]:
    return db.query(Job).offset(skip).limit(limit).all()


def get_job(db: Session, job_id: int) -> Optional[Job]:
    return db.query(Job).filter(Job.id == job_id).first()
