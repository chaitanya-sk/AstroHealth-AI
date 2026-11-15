from typing import List, Optional
from datetime import datetime
from app.analyzers.base_analyzer import BaseAnalyzer
from app.models.health_record import HealthRecord
from app.models.astronaut import Astronaut
from app.schemas.analysis import DomainAnalysisResult
from app.core.constants import HealthDomain, SystemStatus
from app.services.recommendation_service import RecommendationService


class BoneMuscleAnalyzer(BaseAnalyzer):
    domain = HealthDomain.BONE_MUSCLE

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
            "NASA HRP Evidence Report: Risk of Early Onset Osteoporosis and Muscle Atrophy in Microgravity",
            "Sibonga et al., 'Recovery of Spaceflight-Induced Bone Loss', J Bone Miner Res (2019)"
        ]

        if not valid_records:
            return DomainAnalysisResult(
                astronaut_id=astronaut_id,
                domain=self.domain,
                status=SystemStatus.INSUFFICIENT_DATA,
                findings=["No bone turnover biochemical assays or functional muscle perimeter records logged."],
                indicators_analysed=[],
                trend=[],
                anomalies=[],
                data_quality=quality,
                freshness=quality.freshness_hours,
                confidence=0.0,
                evidence=evidence,
                explanation="Musculoskeletal health evaluation requires periodic bone resorption biomarkers and strength measurements.",
                assessment_timestamp=now,
                summary="Insufficient musculoskeletal records.",
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

        # Explicit scientific clarification: wearable sensors do not directly measure bone mineral density
        findings.append(
            "Diagnostic boundary: Wearable sensors cannot measure bone mineral density directly. "
            "Analysis relies on biochemical resorption markers (e.g. urinary NTX) and functional muscle circumference tests."
        )

        if not any(obs.status != SystemStatus.NORMAL for obs in observations):
            findings.append("Bone resorption markers and limb circumference measurements indicate nominal countermeasure preservation.")

        abnormal_inds = [obs.indicator for obs in observations if obs.status != SystemStatus.NORMAL]
        avg_confidence = sum(obs.confidence for obs in observations) / len(observations) if observations else 1.0

        explanation = (
            f"Analysed {len(valid_records)} musculoskeletal health observations. "
            f"Aggregate status: {status.value}. "
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
            summary=f"Musculoskeletal status: {status.value}.",
            observations=observations,
            recommendations=RecommendationService.get_domain_recommendations(self.domain, status, abnormal_inds),
            supporting_evidence=evidence,
            timestamp=now,
            data_freshness_hours=quality.freshness_hours,
            records_analyzed=len(valid_records),
        )
