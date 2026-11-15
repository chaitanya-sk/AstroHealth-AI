import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# SQLite connection string
DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    """FastAPI dependency to yield database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
