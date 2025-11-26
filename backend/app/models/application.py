from sqlalchemy import (
    Column, Integer, String, DateTime, Text, ForeignKey, Float
)
from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy.sql import func

from database.base import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"))
    candidate_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="SET NULL"))
    cover_letter = Column(Text)
    similarity_score: Mapped[float] = mapped_column(Float, nullable=False)
    status = Column(String(50), default="applied")
    applied_at = Column(DateTime(timezone=True), server_default=func.now())

    job = relationship("Job", back_populates="applications")
    candidate = relationship("User", back_populates="applications")
