import uuid
import json
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.alert import Alert
from app.models.recommendation import Recommendation
from app.models.health_record import HealthRecord
from app.models.astronaut import Astronaut
from app.core.constants import HealthDomain, SystemStatus, AlertSeverity, AlertStatus
from app.intelligence.health_intelligence import health_intelligence_engine
from app.intelligence.explanation_engine import ExplanationEngine


class AlertService:
    @staticmethod
    def sync_alerts_for_astronaut(
        db: Session,
        astronaut_id: str,
        data_type_filter: Optional[str] = None
    ) -> List[Alert]:
        """
        Analyze recent records and automatically generate or update persistent alerts
        and recommendations for an astronaut.
        """
        clean_id = astronaut_id.strip().upper()
        astro = db.query(Astronaut).filter(Astronaut.astronaut_id == clean_id).first()
        if not astro:
            raise HTTPException(status_code=404, detail=f"Astronaut '{clean_id}' not found.")

        query = db.query(HealthRecord).filter(HealthRecord.astronaut_id == clean_id)
        if data_type_filter:
            query = query.filter(HealthRecord.data_type == data_type_filter.lower())
        records = query.all()

        summary = health_intelligence_engine.generate_integrated_overview(
            clean_id, records, astronaut=astro, data_type_filter=data_type_filter
        )

        created_alerts = []

        for domain, status in summary.domain_statuses.items():
            if status in (SystemStatus.MONITOR, SystemStatus.REVIEW_REQUIRED):
                severity = (
                    AlertSeverity.HIGH if status == SystemStatus.REVIEW_REQUIRED else AlertSeverity.MEDIUM
                )
                domain_res = health_intelligence_engine.analyze_domain(
                    domain, clean_id, records, astronaut=astro, data_type_filter=data_type_filter
                )
                explanation = ExplanationEngine.explain_domain_status(domain_res)

                measurements_summary = json.dumps([
                    {
                        "indicator": obs.indicator,
                        "value": obs.measured_value,
                        "unit": obs.unit,
                        "status": obs.status.value,
                    }
                    for obs in domain_res.observations
                ])

                existing = db.query(Alert).filter(
                    Alert.astronaut_id == clean_id,
                    Alert.domain == domain.value,
                    Alert.status == AlertStatus.ACTIVE.value
                ).first()

                if existing:
                    existing.severity = severity.value
                    existing.explanation = explanation
                    existing.supporting_measurements = measurements_summary
                    existing.recommended_action = "; ".join(domain_res.recommendations)
                    db.commit()
                    created_alerts.append(existing)
                else:
                    new_alert = Alert(
                        alert_id=f"ALT-{uuid.uuid4().hex[:8].upper()}",
                        astronaut_id=clean_id,
                        domain=domain.value,
                        severity=severity.value,
                        title=f"{domain.value.upper()} Health Alert: {status.value}",
                        explanation=explanation,
                        supporting_measurements=measurements_summary,
                        timestamp=datetime.utcnow(),
                        status=AlertStatus.ACTIVE.value,
                        recommended_action="; ".join(domain_res.recommendations),
                        evidence="; ".join(domain_res.supporting_evidence),
                    )
                    db.add(new_alert)
                    db.commit()
                    db.refresh(new_alert)
                    created_alerts.append(new_alert)

                    # Also persist structured recommendation
                    new_rec = Recommendation(
                        recommendation_id=f"REC-{uuid.uuid4().hex[:8].upper()}",
                        astronaut_id=clean_id,
                        domain=domain.value,
                        summary=f"Clinical decision-support protocol for {domain.value}",
                        rationale=explanation,
                        suggested_actions="; ".join(domain_res.recommendations),
                        evidence_reference="; ".join(domain_res.supporting_evidence),
                        urgency="IMMEDIATE" if status == SystemStatus.REVIEW_REQUIRED else "PROMPT",
                        created_at=datetime.utcnow(),
                    )
                    db.add(new_rec)
                    db.commit()

        return created_alerts

    @staticmethod
    def get_alerts_by_astronaut(
        db: Session,
        astronaut_id: str,
        status: Optional[str] = None
    ) -> List[Alert]:
        clean_id = astronaut_id.strip().upper()
        # Verify astronaut existence first
        astro = db.query(Astronaut).filter(Astronaut.astronaut_id == clean_id).first()
        if not astro:
            raise HTTPException(status_code=404, detail=f"Astronaut '{clean_id}' not found.")

        AlertService.sync_alerts_for_astronaut(db, clean_id)

        query = db.query(Alert).filter(Alert.astronaut_id == clean_id)
        if status:
            query = query.filter(Alert.status == status)
        return query.order_by(Alert.timestamp.desc()).all()

    @staticmethod
    def get_recommendations_by_astronaut(
        db: Session,
        astronaut_id: str
    ) -> List[Recommendation]:
        clean_id = astronaut_id.strip().upper()
        astro = db.query(Astronaut).filter(Astronaut.astronaut_id == clean_id).first()
        if not astro:
            raise HTTPException(status_code=404, detail=f"Astronaut '{clean_id}' not found.")

        AlertService.sync_alerts_for_astronaut(db, clean_id)
        return (
            db.query(Recommendation)
            .filter(Recommendation.astronaut_id == clean_id)
            .order_by(Recommendation.created_at.desc())
            .all()
        )
