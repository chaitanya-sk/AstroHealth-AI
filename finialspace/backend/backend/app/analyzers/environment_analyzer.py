from typing import List, Optional
from datetime import datetime
from app.analyzers.base_analyzer import BaseAnalyzer
from app.models.health_record import HealthRecord
from app.models.astronaut import Astronaut
from app.schemas.analysis import DomainAnalysisResult
from app.core.constants import HealthDomain, SystemStatus
from app.services.recommendation_service import RecommendationService


class EnvironmentAnalyzer(BaseAnalyzer):
    domain = HealthDomain.ENVIRONMENT

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
            "NASA-STD-3001 Vol 2 Rev C: Human Factors, Habitation, and Environmental Quality Standards",
            "Law et al.: 'Relationship between Carbon Dioxide Levels and In-flight Headaches in Astronauts', J Occup Environ Med (2014)"
        ]

        if not valid_records:
            return DomainAnalysisResult(
                astronaut_id=astronaut_id,
                domain=self.domain,
                status=SystemStatus.INSUFFICIENT_DATA,
                findings=["No cabin atmospheric telemetry (CO2, O2, atmospheric pressure, temperature, humidity) logged."],
                indicators_analysed=[],
                trend=[],
                anomalies=[],
                data_quality=quality,
                freshness=quality.freshness_hours,
                confidence=0.0,
                evidence=evidence,
                explanation="Environmental safety analysis requires active Life Support Systems (ECLSS) cabin atmospheric telemetry.",
                assessment_timestamp=now,
                summary="No cabin environmental telemetry.",
                observations=[],
                recommendations=RecommendationService.get_domain_recommendations(self.domain, SystemStatus.INSUFFICIENT_DATA, []),
                supporting_evidence=evidence,
                timestamp=now,
                data_freshness_hours=quality.freshness_hours,
                records_analyzed=0,
            )

        trends, anomalies, observations = self._compute_indicator_trends_and_anomalies(valid_records, {})
        status = self._determine_aggregate_status(observations, quality)

        findings = []
        for anom in anomalies:
            findings.append(f"{anom.indicator.upper()}: {anom.description}")

        # Check cabin CO2 partial pressure level
        co2_recs = [r for r in valid_records if r.indicator == "cabin_co2_pp"]
        if co2_recs:
            latest_co2 = max(co2_recs, key=lambda x: x.timestamp).value
            if latest_co2 >= 3.0:
                findings.append(
                    f"Environmental review: Cabin CO2 partial pressure measured at {latest_co2} mmHg. "
                    "Microgravity hypercapnia thresholds (NASA-STD-3001 Vol 2) recommend maintaining CO2 below 3.0 mmHg to reduce in-flight headache incidence."
                )

        if quality.freshness_status in ("STALE", "CRITICALLY_STALE"):
            findings.append(f"Notice: Environmental telemetry is {quality.freshness_hours}h old. Continuous ECLSS habitat monitoring requires real-time telemetry downlink.")

        if not any(obs.status != SystemStatus.NORMAL for obs in observations):
            findings.append("Atmospheric partial pressures (O2/CO2), total cabin pressure, temperature, and relative humidity remain within nominal habitat limits.")

        abnormal_inds = [obs.indicator for obs in observations if obs.status != SystemStatus.NORMAL]
        avg_confidence = sum(obs.confidence for obs in observations) / len(observations) if observations else 1.0

        explanation = (
            f"Analysed {len(valid_records)} cabin environmental measurements across {len(trends)} atmospheric indicators. "
            f"Habitat status: {status.value}. "
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
            summary=f"Habitat environment status: {status.value}.",
            observations=observations,
            recommendations=RecommendationService.get_domain_recommendations(self.domain, status, abnormal_inds),
            supporting_evidence=evidence,
            timestamp=now,
            data_freshness_hours=quality.freshness_hours,
            records_analyzed=len(valid_records),
        )
