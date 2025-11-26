from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from core.security import get_password_hash
from models.user import User
from schemas.user import UserCreate

def create_user(db: Session, user: UserCreate, role: str) -> User:
    hashed_pw = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_pw,
        role=role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    return db.query(User).filter(User.role != "admin").offset(skip).limit(limit).all()


def activate_user(db: Session, user_id: int) -> None:
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.is_active = True
        db.commit()


def deactivate_user(db: Session, user_id: int) -> None:
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.is_active = False
        db.commit()

def get_total_users(db: Session) -> int:
    return db.query(func.count(User.id)).filter(User.role != "admin").scalar()

def get_total_active_users(db: Session) -> int:
    return db.query(func.count(User.id)).filter(User.role != "admin").filter(User.is_active == True).scalar()

def get_total_candidates(db: Session) -> int:
    return db.query(func.count(User.id)).filter(User.role == "candidate").scalar()

def get_total_recruiters(db: Session) -> int:
    return db.query(func.count(User.id)).filter(User.role == "recruiter").scalar()
