from typing import List, Optional
from datetime import datetime
from app.analyzers.base_analyzer import BaseAnalyzer
from app.models.health_record import HealthRecord
from app.models.astronaut import Astronaut
from app.schemas.analysis import DomainAnalysisResult
from app.core.constants import HealthDomain, SystemStatus
from app.services.recommendation_service import RecommendationService


class BehavioralAnalyzer(BaseAnalyzer):
    domain = HealthDomain.BEHAVIORAL

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
            "NASA-STD-3001 Vol 1: Sleep, Circadian Rhythms, and Fatigue Management Standards",
            "Basner et al.: 'Psychomotor Vigilance Task (PVT) on the International Space Station', Sleep (2014)"
        ]

        if not valid_records:
            return DomainAnalysisResult(
                astronaut_id=astronaut_id,
                domain=self.domain,
                status=SystemStatus.INSUFFICIENT_DATA,
                findings=["Insufficient behavioral telemetry, sleep actigraphy, or PVT cognitive vigilance testing logs."],
                indicators_analysed=[],
                trend=[],
                anomalies=[],
                data_quality=quality,
                freshness=quality.freshness_hours,
                confidence=0.0,
                evidence=evidence,
                explanation="Behavioral and cognitive readiness assessment requires sleep actigraphy and Psychomotor Vigilance Task (PVT) session records.",
                assessment_timestamp=now,
                summary="Insufficient behavioral/sleep telemetry.",
                observations=[],
                recommendations=RecommendationService.get_domain_recommendations(self.domain, SystemStatus.INSUFFICIENT_DATA, []),
                supporting_evidence=evidence,
                timestamp=now,
                data_freshness_hours=quality.freshness_hours,
                records_analyzed=0,
            )

        trends, anomalies, observations = self._compute_indicator_trends_and_anomalies(valid_records, {})
        status = self._determine_aggregate_status(observations, quality)

        # Longitudinal sleep debt calculation if sleep records exist
        sleep_records = [r for r in valid_records if r.indicator == "sleep_duration_hours"]
        if sleep_records:
            recent_sleep = [r.value for r in sorted(sleep_records, key=lambda x: x.timestamp)[-7:]]
            avg_sleep = sum(recent_sleep) / len(recent_sleep)
            if avg_sleep < 6.0 and status == SystemStatus.NORMAL:
                status = SystemStatus.MONITOR

        findings = []
        for anom in anomalies:
            findings.append(f"{anom.indicator.upper()}: {anom.description}")

        # Explicit distinction: missing measurements are NOT treated as healthy
        if quality.freshness_status in ("STALE", "CRITICALLY_STALE"):
            findings.append(f"Notice: Behavioral/actigraphy logs are {quality.freshness_hours}h old. Active operational fatigue assessment requires daily sleep tracking.")

        if not any(obs.status != SystemStatus.NORMAL for obs in observations):
            findings.append("Sleep duration, PVT mean reaction times, and subjective alertness metrics demonstrate maintained cognitive readiness.")

        abnormal_inds = [obs.indicator for obs in observations if obs.status != SystemStatus.NORMAL]
        avg_confidence = sum(obs.confidence for obs in observations) / len(observations) if observations else 1.0

        explanation = (
            f"Evaluated {len(valid_records)} behavioral and cognitive performance records. "
            f"Domain readiness is assessed as {status.value}. "
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
            summary=f"Behavioral & Cognitive Readiness: {status.value}.",
            observations=observations,
            recommendations=RecommendationService.get_domain_recommendations(self.domain, status, abnormal_inds),
            supporting_evidence=evidence,
            timestamp=now,
            data_freshness_hours=quality.freshness_hours,
            records_analyzed=len(valid_records),
        )
