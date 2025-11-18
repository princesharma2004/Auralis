from sqlalchemy.orm import Session
from typing import List, Optional

from models.resume import Resume

def create_resume(db: Session, user_id: int, filename: str, storage_path: str, parsed_skills: Optional[List[str]] = None) -> Resume:
    db_resume = Resume(
        user_id=user_id,
        filename=filename,
        storage_path=storage_path
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume


def get_resumes_by_user(db: Session, user_id: int) -> List[Resume]:
    return db.query(Resume).filter(Resume.user_id == user_id).all()
