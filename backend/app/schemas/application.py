from pydantic import BaseModel
from datetime import datetime

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    status: str
    similarity_score: float
    applied_at: datetime

    class Config:
        from_attributes = True
