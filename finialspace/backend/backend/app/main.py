from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.connection import engine
from app.models import Base
from app.api import astronaut_router, health_router, analysis_router, alert_router

# Initialize SQLite database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for local development and future React/TypeScript dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(astronaut_router)
app.include_router(health_router)
app.include_router(analysis_router)
app.include_router(alert_router)


@app.get("/", tags=["System"])
def root():
    return {
        "project": settings.PROJECT_NAME,
        "description": settings.PROJECT_DESCRIPTION,
        "status": "online",
        "version": settings.VERSION,
        "decision_support_role": "Decision support for flight surgeons and astronauts; not autonomous medical diagnosis.",
        "docs_url": "/docs"
    }


@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "AstroHealth AI Backend",
        "database": "connected",
        "environment": settings.ENVIRONMENT
    }
