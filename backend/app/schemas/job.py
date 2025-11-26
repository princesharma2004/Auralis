from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class JobBase(BaseModel):
    description: Optional[str]
    location: str
    employment_type: Optional[str]


class JobCreate(JobBase):
    title_id: int


class JobResponse(JobBase):
    id: int
    title: str
    recruiter_id: int
    created_at: datetime

    class Config:
        from_attributes = True
