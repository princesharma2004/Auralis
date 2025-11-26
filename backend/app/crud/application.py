from sqlalchemy.orm import Session
from typing import Optional, List

from models.application import Application

def apply_for_job(db: Session, candidate_id: int, job_id: int, resume_id: int, cover_letter: Optional[List[str]] = None) -> Application:
    db_app = Application(
        candidate_id=candidate_id,
        job_id=job_id,
        resume_id=resume_id,
        cover_letter=cover_letter,
        status="applied",
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app


def get_applications_by_candidate(db: Session, candidate_id: int) -> List[Application]:
    return db.query(Application).filter(Application.candidate_id == candidate_id).all()


def delete_applications_by_id(db: Session, application_id: int) -> None:
    db.query(Application).filter(Application.id == application_id).delete(synchronize_session=False)
    db.commit()


def get_applications_by_job(db: Session, job_id: int) -> List[Application]:
    return db.query(Application).filter(Application.job_id == job_id).all()


def update_application_status(db: Session, application_id: int, new_status: str) -> Optional[Application]:
    app = db.query(Application).filter(Application.id == application_id).first()
    if app:
        setattr(app, "status", new_status)
        db.commit()
        db.refresh(app)
    return app
