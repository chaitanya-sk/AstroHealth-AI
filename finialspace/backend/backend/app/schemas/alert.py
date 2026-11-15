from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.core.constants import AlertSeverity, AlertStatus, HealthDomain


class AlertBase(BaseModel):
    alert_id: str
    astronaut_id: str
    domain: HealthDomain
    severity: AlertSeverity
    title: str
    explanation: str
    supporting_measurements: Optional[str] = None
    status: AlertStatus = AlertStatus.ACTIVE
    recommended_action: str
    evidence: Optional[str] = None


class AlertCreate(AlertBase):
    timestamp: Optional[datetime] = None


class AlertResponse(AlertBase):
    id: int
    timestamp: datetime
    data_source: Optional[str] = "sensor"
    data_tier: Optional[str] = "real"

    model_config = ConfigDict(from_attributes=True)


class RecommendationResponse(BaseModel):
    id: int
    recommendation_id: str
    astronaut_id: str
    domain: HealthDomain
    summary: str
    rationale: str
    suggested_actions: str
    evidence_reference: Optional[str] = None
    urgency: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

