from datetime import datetime, timezone
from sqlalchemy import event
from sqlalchemy.orm import Session
from sqlalchemy.engine import Connection
from sqlalchemy.orm.mapper import Mapper

from database.session import get_sync_session
from models.token import Token


def delete_expired_tokens() -> None:
    """Delete expired tokens every 30 minutes."""
    with get_sync_session() as db:
        db.query(Token).filter(Token.expires_at < datetime.now(timezone.utc)).delete(synchronize_session=False)
        db.commit()

@event.listens_for(Token, "before_insert")
def ensure_single_token(mapper: Mapper[Token], connection: Connection, target: Token) -> None:
    """Ensure each user has only one active token — delete old one if exists."""
    session = Session.object_session(target)
    if session:
        session.query(Token).filter(Token.user_id == target.user_id).delete(synchronize_session=False)
