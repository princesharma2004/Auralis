from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class JobBase(BaseModel):
    title: str
    description: Optional[str]
    location: str
    employment_type: Optional[str]


class JobCreate(JobBase):
    pass


class JobResponse(JobBase):
    id: int
    recruiter_id: int
    created_at: datetime

    class Config:
        from_attributes = True
