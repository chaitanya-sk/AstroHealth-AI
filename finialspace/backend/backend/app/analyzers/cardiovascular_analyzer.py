from typing import List, Optional
from datetime import datetime
from app.analyzers.base_analyzer import BaseAnalyzer
from app.models.health_record import HealthRecord
from app.models.astronaut import Astronaut
from app.schemas.analysis import DomainAnalysisResult
from app.core.constants import HealthDomain, SystemStatus
from app.services.recommendation_service import RecommendationService


class CardiovascularAnalyzer(BaseAnalyzer):
    domain = HealthDomain.CARDIOVASCULAR

    def analyze(
        self,
        astronaut_id: str,
        records: List[HealthRecord],
        astronaut: Optional[Astronaut] = None,
        data_type_filter: Optional[str] = None
    ) -> DomainAnalysisResult:
        now = datetime.utcnow()
        valid_records, quality = self._filter_and_validate_records(records, data_type_filter)

        evidence = [
            "NASA-STD-3001, Vol 1, Crew Health Standards: Cardiovascular Protocols",
            "Hughson et al., 'Cardiovascular Deconditioning During Spaceflight', J Appl Physiol"
        ]

        if not valid_records:
            return DomainAnalysisResult(
                astronaut_id=astronaut_id,
                domain=self.domain,
                status=SystemStatus.INSUFFICIENT_DATA,
                findings=["No valid cardiovascular telemetry on record or all measurements filtered out."],
                indicators_analysed=[],
                trend=[],
                anomalies=[],
                data_quality=quality,
                freshness=quality.freshness_hours,
                confidence=0.0,
                evidence=evidence,
                explanation="Cardiovascular evaluation cannot proceed without valid heart rate, blood pressure, or HRV telemetry.",
                assessment_timestamp=now,
                summary="Insufficient cardiovascular telemetry records.",
                observations=[],
                recommendations=RecommendationService.get_domain_recommendations(self.domain, SystemStatus.INSUFFICIENT_DATA, []),
                supporting_evidence=evidence,
                timestamp=now,
                data_freshness_hours=quality.freshness_hours,
                records_analyzed=0,
            )

        # Baselines from astronaut profile
        baselines = {}
        if astronaut:
            if astronaut.resting_hr_baseline:
                baselines["heart_rate"] = astronaut.resting_hr_baseline
            if astronaut.resting_bp_sys_baseline:
                baselines["systolic_bp"] = astronaut.resting_bp_sys_baseline
            if astronaut.resting_bp_dia_baseline:
                baselines["diastolic_bp"] = astronaut.resting_bp_dia_baseline

        trends, anomalies, observations = self._compute_indicator_trends_and_anomalies(valid_records, baselines)
        status = self._determine_aggregate_status(observations, quality)

        # Check HRV RMSSD trend specifically for parasympathetic decline
        hrv_trend = next((t for t in trends if t.indicator == "hrv_rmssd"), None)
        if hrv_trend and hrv_trend.direction == "decreasing" and status == SystemStatus.NORMAL:
            status = SystemStatus.MONITOR

        findings = []
        for anom in anomalies:
            findings.append(f"{anom.indicator.upper()}: {anom.description}")

        if quality.freshness_status == "STALE":
            findings.append(f"Caution: Cardiovascular telemetry is stale ({quality.freshness_hours}h old).")
            if status == SystemStatus.NORMAL:
                status = SystemStatus.MONITOR

        if not findings:
            findings.append("Continuous vitals, arterial blood pressure, and autonomic HRV tone remain within nominal baseline limits.")

        abnormal_inds = [obs.indicator for obs in observations if obs.status != SystemStatus.NORMAL]
        avg_confidence = sum(obs.confidence for obs in observations) / len(observations) if observations else 1.0

        explanation = (
            f"Analysed {len(valid_records)} cardiovascular measurements across {len(trends)} indicators. "
            f"Overall cardiovascular tone is classified as {status.value}. "
            + (" ".join(findings))
        )

        return DomainAnalysisResult(
            astronaut_id=astronaut_id,
            domain=self.domain,
            status=status,
            findings=findings,
            indicators_analysed=[t.indicator for t in trends],
            trend=trends,
            anomalies=anomalies,
            data_quality=quality,
            freshness=quality.freshness_hours,
            confidence=round(avg_confidence, 2),
            evidence=evidence,
            explanation=explanation,
            assessment_timestamp=now,
            summary=f"Cardiovascular tone: {status.value}.",
            observations=observations,
            recommendations=RecommendationService.get_domain_recommendations(self.domain, status, abnormal_inds),
            supporting_evidence=evidence,
            timestamp=now,
            data_freshness_hours=quality.freshness_hours,
            records_analyzed=len(valid_records),
        )
