from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Dict
from dotenv import load_dotenv
from os import getenv
import json


load_dotenv()


class Settings(BaseSettings):
    """Application configuration settings."""

    CORS_ORIGIN: str = Field(
        default_factory=lambda: getenv("CORS_ORIGINS", "http://localhost:5173")
    )

    DATABASE_URL: str = Field(
        default_factory=lambda: getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
    )

    SECRET_KEY: str = Field(
        default_factory=lambda: getenv("SECRET_KEY", "your-default-secret-key")
    )

    ALGORITHM: str = Field(default_factory=lambda: getenv("ALGORITHM", "HS256"))

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default_factory=lambda: int(getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    )

    ADMIN: Dict[str, str] = Field(
        default_factory=lambda: json.loads(getenv("ADMIN", '{"name": "admin", "email": "admin@example.com", "password": "admin"}'))
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
