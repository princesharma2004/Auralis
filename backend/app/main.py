from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler # pyright: ignore[reportMissingTypeStubs]

from api.v1 import candidate
from api.v1 import recruiter
from api.v1 import admin
from api.v1 import user
from database.base import Base, engine
from database.session import get_sync_session

from models.application import Application # pyright: ignore[reportUnusedImport]
from models.job import Job # pyright: ignore[reportUnusedImport]
from models.resume import Resume # pyright: ignore[reportUnusedImport]
from models.token import Token # pyright: ignore[reportUnusedImport]
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

app.include_router(user.router, prefix="/api/v1/user", tags=["User"])
app.include_router(candidate.router, prefix="/api/v1/candidate", tags=["Candidate"])
app.include_router(recruiter.router, prefix="/api/v1/recruiter", tags=["Recruiter"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

def sync_admins():
    """Synchronize single admin from settings.ADMIN with database."""

    with get_sync_session() as db:
        for admin_data in settings.ADMINS:
            email = str(admin_data["email"])
            name = str(admin_data["name"])
            password = str(admin_data["password"])

            existing_admin = (
                db.query(User)
                .filter(User.role == "admin", User.email == email)
                .first()
            )

            if not existing_admin:
                create_user(
                    db=db,
                    user=UserCreate(name=name, email=email, password=password),
                    role="admin",
                )
        db.commit()

def start_scheduler() -> BackgroundScheduler:
    scheduler = BackgroundScheduler()
    if not scheduler:
        scheduler.add_job(delete_expired_tokens, "interval", minutes=30)
        scheduler.add_job(delete_deactivated_users, "interval", days=1)
        scheduler.start()
    return scheduler

sync_admins()
scheduler: BackgroundScheduler = start_scheduler()

if __name__ == "__main__":
    import uvicorn

    try:
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    finally:
        if not scheduler:
            scheduler.shutdown()
