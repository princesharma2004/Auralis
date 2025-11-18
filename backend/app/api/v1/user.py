from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timezone
from typing import Dict, cast
from sqlalchemy.orm import Session

from core.security import verify_password, create_access_token, decode_token
from crud.user import get_user_by_email, get_user, activate_user, deactivate_user
from crud.token import create_refresh_token, revoke_tokens_for_user
from api.dependencies import get_db_session
from schemas.user import UserLogin, UserResponse
from models.user import User


router = APIRouter()


@router.post('/login')
def login(user: UserLogin, db: Session = get_db_session()) -> Dict[str, str]:
    """Authenticate user and return JWT access + refresh token."""
    existing = get_user_by_email(db, user.email)

    if not existing:
        raise HTTPException(status_code=404, detail='User not found')

    if not verify_password(user.password, str(existing.password_hash)):
        raise HTTPException(status_code=401, detail='Wrong password')
    
    activate_user(db, cast(int, existing.id))
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
        user_id=cast(int, existing.id),
        refresh_token_hash=access_token,
    )

    return {"token": str(refresh_entry.refresh_token_hash), "role": str(existing.role)}


@router.post('/refresh')
async def refresh_token(token: str, db: Session = get_db_session()) -> Dict[str, str]:
    """Refresh JWT access token using refresh token."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')
    
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    new_access_token = create_access_token(
        data={
            "sub": str(user_id),
            "email": payload.get("email"),
            "role": payload.get("role"),
            "iat": datetime.now(timezone.utc),
        }
    )

    refresh_entry = create_refresh_token(
        db,
        user_id=int(user_id),
        refresh_token_hash=new_access_token,
    )

    return {"token": str(refresh_entry.refresh_token_hash)}


@router.get('/me', response_model=UserResponse)
async def get_current_user(token: str, db: Session = get_db_session()) -> User:
    """Get current user information."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    return user


@router.delete('/deactivate_account', status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_account(token: str, db: Session = get_db_session()) -> None:
    """Deactivate current user's account."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')

    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    deactivate_user(db, user_id)
    revoke_tokens_for_user(db, user_id)


@router.delete('/logout', status_code=status.HTTP_204_NO_CONTENT)
async def logout(token: str, db: Session = get_db_session()) -> None:
    """Log out user and revoke tokens."""
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail='Invalid token')
    
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    revoke_tokens_for_user(db, user_id)
