from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime
)
from sqlalchemy.orm import relationship, mapped_column
from sqlalchemy.sql import func

from database.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(20), nullable=False)
    name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = mapped_column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    resumes = relationship("Resume", back_populates="user", cascade="all, delete")
    jobs = relationship("Job", back_populates="recruiter", cascade="all, delete")
    applications = relationship("Application", back_populates="candidate", cascade="all, delete")
    tokens = relationship("Token", back_populates="user", cascade="all, delete-orphan", uselist=False)
