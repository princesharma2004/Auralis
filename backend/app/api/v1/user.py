from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone

from core.security import verify_password, create_access_token

from crud.user import get_user_by_email, activate_user
from crud.token import create_refresh_token

from api.dependencies import get_db_session

from schemas.user import UserLogin


router = APIRouter()


@router.post('/login')
def login(user: UserLogin=UserLogin(email="user1@gmail.com", password="user1"), db=get_db_session()):
    """Authenticate user and return JWT access + refresh token."""
    existing = get_user_by_email(db, user.email)

    if not existing:
        raise HTTPException(status_code=404, detail='User not found')

    if not verify_password(user.password, str(existing.password_hash)):
        raise HTTPException(status_code=401, detail='Wrong password')
    
    activate_user(db, existing.id)
    access_token = create_access_token(
        data={
            "sub": str(existing.id),
            "email": existing.email,
            "role": existing.role,
            "iat": datetime.now(timezone.utc),
        }
    )

    refresh_entry = create_refresh_token(
        db,
        user_id=int(existing.id),
        refresh_token_hash=access_token,
    )

    return {"token": refresh_entry.refresh_token_hash}
