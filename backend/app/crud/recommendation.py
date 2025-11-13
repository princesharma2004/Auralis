from sqlalchemy.orm import Session
from typing import List

from models.recommendation import Recommendation

def create_recommendation(db: Session, job_id: int, candidate_id: int, resume_id: int, score: float) -> Recommendation:
    db_rec = Recommendation(
        job_id=job_id,
        candidate_id=candidate_id,
        resume_id=resume_id,
        similarity_score=score
    )
    db.add(db_rec)
    db.commit()
    db.refresh(db_rec)
    return db_rec


def get_top_candidates_for_job(db: Session, job_id: int, limit: int = 10) -> List[Recommendation]:
    return (
        db.query(Recommendation)
        .filter(Recommendation.job_id == job_id)
        .order_by(Recommendation.similarity_score.desc())
        .limit(limit)
        .all()
    )


def get_recommended_jobs_for_candidate(db: Session, candidate_id: int, limit: int = 10) -> List[Recommendation]:
    return (
        db.query(Recommendation)
        .filter(Recommendation.candidate_id == candidate_id)
        .order_by(Recommendation.similarity_score.desc())
        .limit(limit)
        .all()
    )
