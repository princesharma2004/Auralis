from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session

from crud.user import create_user, get_user_by_email
from api.dependencies import get_db_session
from schemas.user import UserCreate


router = APIRouter()


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: Session = get_db_session()) -> None :
    """Register a new recruiter user."""
    existing = get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    create_user(db, user, role="recruiter")
