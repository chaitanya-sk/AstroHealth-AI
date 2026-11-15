from typing import List, Dict
from app.core.constants import HealthDomain, SystemStatus
from app.schemas.analysis import DomainAnalysisResult


class ExplanationEngine:
    """
    Produces transparent, clinically explainable rationales linking observations
    directly to supporting measurements and literature.
    """
    @staticmethod
    def explain_domain_status(result: DomainAnalysisResult) -> str:
        if result.status == SystemStatus.INSUFFICIENT_DATA:
            return (
                f"Status: INSUFFICIENT_DATA for {result.domain.value.upper()}. "
                f"Reason: Inadequate valid or fresh measurements logged. Analysis requires scheduled data collection."
            )

        abnormal_obs = [obs for obs in result.observations if obs.status != SystemStatus.NORMAL]
        if not abnormal_obs:
            return (
                f"Status: NORMAL for {result.domain.value.upper()}. "
                f"All {len(result.observations)} evaluated indicators remain within nominal spaceflight boundaries."
            )

        bullet_points = []
        for obs in abnormal_obs:
            bullet_points.append(
                f"- {obs.indicator}: measured value {obs.measured_value} {obs.unit} "
                f"(Reference: {obs.reference_normal}). Clinical implication: {obs.observation_text}"
            )

        return f"Status: {result.status.value} for {result.domain.value.upper()}.\n" + "\n".join(bullet_points)

    @staticmethod
    def generate_executive_rationale(
        overall_status: SystemStatus,
        key_findings: List[str],
        domain_results: Dict[HealthDomain, DomainAnalysisResult]
    ) -> List[str]:
        notes = []
        if overall_status == SystemStatus.REVIEW_REQUIRED:
            notes.append("System Priority: Clinical review recommended to assess multi-system strain or mission operational limits.")
        elif overall_status == SystemStatus.MONITOR:
            notes.append("System Priority: Elevated monitoring cycle. Observe parameter trajectories and countermeasure adherence over the next 12-24 hours.")
        elif overall_status == SystemStatus.INSUFFICIENT_DATA:
            notes.append("System Priority: Establish bio-telemetry downlinks to satisfy crew health surveillance standards.")
        else:
            notes.append("System Status: All bio-parameters nominal across monitored mission domains.")

        notes.extend(key_findings)
        return notes
