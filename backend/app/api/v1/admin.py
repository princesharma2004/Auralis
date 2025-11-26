from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from core.security import decode_token
from crud.user import get_user, get_users, get_total_active_users, get_total_recruiters, get_total_users, get_total_candidates
from crud.job import get_jobs, get_total_jobs
from api.dependencies import get_db_session
from schemas.user import UserResponse
from schemas.job import JobResponse


router = APIRouter()


@router.get('/users')
async def list_users(token: str, skip: int = 0, limit: int = 100, db: Session = get_db_session()) -> Dict[str, Any]:
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
    total = get_total_users(db)

    return {
        "data": [UserResponse.model_validate(u) for u in users],
        "total": total,
        "skip": skip,
        "limit": limit,
        "page": (skip // limit) + 1,
        "total_pages": (total + limit - 1) // limit,
    }


@router.get('/jobs')
async def list_jobs(token: str, skip: int = 0, limit: int = 100, db: Session = get_db_session()) -> Dict[str, Any]:
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
    total = get_total_jobs(db)

    return {
        "data": [JobResponse.model_validate(j) for j in jobs],
        "total": total,
        "skip": skip,
        "limit": limit,
        "page": (skip // limit) + 1,
        "total_pages": (total + limit - 1) // limit,
    }


@router.get('/overview')
async def overview(token: str, db: Session = get_db_session()) -> Dict[str, int]:
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

    return {"totalUsers": get_total_users(db),
    "totalJobs": get_total_jobs(db),
    "activeUsers": get_total_active_users(db),
    "candidates": get_total_candidates(db),
    "recruiters": get_total_recruiters(db),}
