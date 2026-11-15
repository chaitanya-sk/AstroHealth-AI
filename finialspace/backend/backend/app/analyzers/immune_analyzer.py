from typing import List, Optional
from datetime import datetime
from app.analyzers.base_analyzer import BaseAnalyzer
from app.models.health_record import HealthRecord
from app.models.astronaut import Astronaut
from app.schemas.analysis import DomainAnalysisResult
from app.core.constants import HealthDomain, SystemStatus
from app.services.recommendation_service import RecommendationService


class ImmuneAnalyzer(BaseAnalyzer):
    domain = HealthDomain.IMMUNE

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
            "NASA HRP Evidence Report: Human Immune System Alterations During Spaceflight",
            "Crucian et al., 'Immune system dysregulation during spaceflight', Brain Behav Immun (2018)"
        ]

        if not valid_records:
            return DomainAnalysisResult(
                astronaut_id=astronaut_id,
                domain=self.domain,
                status=SystemStatus.INSUFFICIENT_DATA,
                findings=["Insufficient periodic blood panel or salivary assay data logged."],
                indicators_analysed=[],
                trend=[],
                anomalies=[],
                data_quality=quality,
                freshness=quality.freshness_hours,
                confidence=0.0,
                evidence=evidence,
                explanation="Immunological evaluation requires periodic laboratory assays (WBC, CRP, cortisol, viral reactivation).",
                assessment_timestamp=now,
                summary="Insufficient immunological records.",
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

        # Note about periodic laboratory requirement
        findings.append("Laboratory note: Immune biomarkers represent scheduled blood/salivary assays rather than continuous telemetry.")

        if quality.freshness_status in ("STALE", "CRITICALLY_STALE"):
            findings.append(f"Notice: Most recent immune panel is {quality.freshness_hours}h old. Follow-up assay cycle recommended.")

        if not any(obs.status != SystemStatus.NORMAL for obs in observations):
            findings.append("Differential leukocyte counts, acute phase reactants, and cortisol concentrations align with nominal microgravity baseline.")

        abnormal_inds = [obs.indicator for obs in observations if obs.status != SystemStatus.NORMAL]
        avg_confidence = sum(obs.confidence for obs in observations) / len(observations) if observations else 1.0

        explanation = (
            f"Evaluated {len(valid_records)} immunological assay records. "
            f"Status determined as {status.value}. "
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
            summary=f"Immunological status: {status.value}.",
            observations=observations,
            recommendations=RecommendationService.get_domain_recommendations(self.domain, status, abnormal_inds),
            supporting_evidence=evidence,
            timestamp=now,
            data_freshness_hours=quality.freshness_hours,
            records_analyzed=len(valid_records),
        )
