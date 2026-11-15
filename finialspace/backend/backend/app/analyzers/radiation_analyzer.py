from typing import List, Optional
from datetime import datetime
from app.analyzers.base_analyzer import BaseAnalyzer
from app.models.health_record import HealthRecord
from app.models.astronaut import Astronaut
from app.schemas.analysis import DomainAnalysisResult
from app.core.constants import HealthDomain, SystemStatus
from app.services.recommendation_service import RecommendationService


class RadiationAnalyzer(BaseAnalyzer):
    domain = HealthDomain.RADIATION

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
            "NASA Permissible Exposure Limits (PEL) for Ionizing Radiation",
            "NCRP Report No. 132: Radiation Protection Guidance for Activities in Low-Earth Orbit",
            "Cucinotta et al.: 'Space radiation cancer risk projections for exploration missions', Life Sci Space Res (2014)"
        ]

        if not valid_records:
            return DomainAnalysisResult(
                astronaut_id=astronaut_id,
                domain=self.domain,
                status=SystemStatus.INSUFFICIENT_DATA,
                findings=["No active dosimeter readings or vehicle charged-particle flux telemetry logged."],
                indicators_analysed=[],
                trend=[],
                anomalies=[],
                data_quality=quality,
                freshness=quality.freshness_hours,
                confidence=0.0,
                evidence=evidence,
                explanation="Radiation monitoring requires active dosimeter (mSv/day) or particle flux telemetry.",
                assessment_timestamp=now,
                summary="Insufficient radiation dosimeter telemetry.",
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

        # Check cumulative dose trajectory
        career_recs = [r for r in valid_records if r.indicator == "cumulative_dose_career"]
        if career_recs:
            latest_career = max(career_recs, key=lambda x: x.timestamp).value
            findings.append(f"Cumulative career exposure on record: {latest_career} mSv (NASA PEL: 600 mSv).")

        if quality.freshness_status in ("STALE", "CRITICALLY_STALE"):
            findings.append(f"Telemetry warning: Dosimeter logs are {quality.freshness_hours}h old. Real-time space weather tracking requires daily dosimeter telemetry sync.")

        if not any(obs.status != SystemStatus.NORMAL for obs in observations):
            findings.append("Galactic Cosmic Ray (GCR) exposure rate and cumulative dosimeter readings remain within nominal deep-space bounds.")

        abnormal_inds = [obs.indicator for obs in observations if obs.status != SystemStatus.NORMAL]
        avg_confidence = sum(obs.confidence for obs in observations) / len(observations) if observations else 1.0

        explanation = (
            f"Evaluated {len(valid_records)} radiation telemetry readings across {len(trends)} indicators. "
            f"Radiation exposure status: {status.value}. "
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
            summary=f"Radiation exposure status: {status.value}.",
            observations=observations,
            recommendations=RecommendationService.get_domain_recommendations(self.domain, status, abnormal_inds),
            supporting_evidence=evidence,
            timestamp=now,
            data_freshness_hours=quality.freshness_hours,
            records_analyzed=len(valid_records),
        )
