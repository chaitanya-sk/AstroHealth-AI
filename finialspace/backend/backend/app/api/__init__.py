from app.api.astronaut_routes import router as astronaut_router
from app.api.health_routes import router as health_router
from app.api.analysis_routes import router as analysis_router
from app.api.alert_routes import router as alert_router

__all__ = [
    "astronaut_router",
    "health_router",
    "analysis_router",
    "alert_router",
]

