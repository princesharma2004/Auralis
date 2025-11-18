from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.security import decode_token
from crud.user import get_user, get_users
from crud.job import get_jobs
from api.dependencies import get_db_session
from schemas.user import UserResponse
from schemas.job import JobResponse
from models.user import User
from models.job import Job


router = APIRouter()


@router.get('/users', response_model=list[UserResponse])
async def list_users(token: str, skip: int = 0, limit: int = 100, db: Session = get_db_session()) -> List[User]:
    """List users with pagination."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')
    
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    user_role = payload.get("role")
    if user_role != "admin":
        raise HTTPException(status_code=403, detail='Not authorized to access this resource')

    users = get_users(db, skip=skip, limit=limit)
    return users


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
    if user_role != "admin":
        raise HTTPException(status_code=403, detail='Not authorized to access this resource')

    jobs = get_jobs(db, skip=skip, limit=limit)
    return jobs
