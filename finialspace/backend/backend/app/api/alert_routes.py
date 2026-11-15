from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.alert import AlertResponse, RecommendationResponse
from app.services.alert_service import AlertService

router = APIRouter(
    prefix="/api",
    tags=["Alerts & Recommendations"]
)


@router.get("/alerts/{astronaut_id}", response_model=List[AlertResponse])
def get_astronaut_alerts(
    astronaut_id: str,
    status: Optional[str] = None,
    domain: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve active or filtered alerts with explanations and clinical references."""
    clean_id = astronaut_id.strip().upper()
    alerts = AlertService.get_alerts_by_astronaut(db, clean_id, status=status)
    if domain:
        dom_clean = domain.strip().lower()
        alerts = [a for a in alerts if getattr(a.domain, "value", str(a.domain)).lower() == dom_clean]
    return alerts


@router.get("/recommendations/{astronaut_id}", response_model=List[RecommendationResponse])
def get_astronaut_recommendations(
    astronaut_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve evidence-backed operational countermeasures and medical recommendations."""
    clean_id = astronaut_id.strip().upper()
    return AlertService.get_recommendations_by_astronaut(db, clean_id)

