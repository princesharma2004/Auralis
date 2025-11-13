from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import List

from core.config import settings
from models.token import Token

def create_refresh_token(db: Session, user_id: int, refresh_token_hash: str) -> Token:
    expires = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = Token(
        user_id=user_id,
        refresh_token_hash=refresh_token_hash,
        expires_at=expires
    )
    db.add(token)
    db.commit()
    db.refresh(token)
    return token


def get_tokens_for_user(db: Session, user_id: int) -> List[Token]:
    return db.query(Token).filter(Token.user_id == user_id).all()

def revoke_tokens_for_user(db: Session, user_id: int) -> None:
    db.query(Token).filter(Token.user_id == user_id).delete(synchronize_session=False)
    db.commit()
