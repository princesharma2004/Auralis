from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler

# Import routers (you can add these files later)
# from api.v1 import candidates, recruiters, jobs, admin, match
from api.v1 import candidates
from api.v1 import recruiters
from api.v1 import admin
from api.v1 import user
from database.base import Base, engine
from database.session import get_sync_session

# Create all tables
from models.application import Application
from models.job import Job
from models.recommendation import Recommendation
from models.resume import Resume
from models.token import Token
from models.user import User

from schemas.user import UserCreate

from core.config import settings
from crud.user import create_user

from listeners.user_listeners import delete_deactivated_users
from listeners.token_listeners import delete_expired_tokens

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Auralis Job Portal API's",
    version="1.0.0",
    description="FastAPI backend for the Job Portal with Smart Resume–Job Matching",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include routers ---
app.include_router(user.router, prefix="/api/v1/user", tags=["Candidates", "Recruiters", "Admin"])
app.include_router(candidates.router, prefix="/api/v1/candidates", tags=["Candidates"])
app.include_router(recruiters.router, prefix="/api/v1/recruiters", tags=["Recruiters"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
# app.include_router(jobs.router, prefix="/api/v1/jobs", tags=["Jobs"])
# app.include_router(match.router, prefix="/api/v1/match", tags=["AI Matching"])

def sync_admins():
    """Synchronize single admin from settings.ADMIN with database."""

    with get_sync_session() as db:
        admin_data = settings.ADMIN
        email = str(admin_data["email"])
        name = str(admin_data["name"])
        password = str(admin_data["password"])

        existing_admin = db.query(User).filter(User.role == "admin", User.email == email).first()

        if not existing_admin:
            create_user(
                db=db,
                user=UserCreate(name=name, email=email, password=password),
                role="admin",
            )
            db.commit()

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_expired_tokens, "interval", minutes=30)
    scheduler.add_job(delete_deactivated_users, "interval", days=1)
    scheduler.start()
    return scheduler

sync_admins()
scheduler = start_scheduler()

if __name__ == "__main__":
    import uvicorn

    try:
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    finally:
        scheduler.shutdown()
