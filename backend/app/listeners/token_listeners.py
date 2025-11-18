from datetime import datetime, timezone

from database.session import get_sync_session
from models.token import Token


def delete_expired_tokens() -> None:
    """Delete expired tokens every 30 minutes."""
    with get_sync_session() as db:
        db.query(Token).filter(Token.expires_at < datetime.now(timezone.utc)).delete(synchronize_session=False)
        db.commit()
