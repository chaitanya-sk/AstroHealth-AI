from typing import Dict, List, Tuple, Optional, Any
from app.core.constants import HealthDomain, SystemStatus


class RiskEngine:
    """
    Evaluates multi-system compounding health risks and cross-domain interactions.
    Important:
    - Never calculates arbitrary composite numbers or averages unrelated health scores.
    - Describes cross-domain relationships as evidence-supported possible associations, not proven causation.
    - Preserves measurement provenance, timestamps, and data sources.
    """
    @staticmethod
    def evaluate_multi_system_compounding(
        domain_statuses: Dict[HealthDomain, SystemStatus],
        domain_results: Optional[Dict[Any, Any]] = None
    ) -> Tuple[SystemStatus, List[str], List[str]]:
        findings = []
        interactions = []

        review_count = sum(1 for s in domain_statuses.values() if s == SystemStatus.REVIEW_REQUIRED)
        monitor_count = sum(1 for s in domain_statuses.values() if s == SystemStatus.MONITOR)
        insufficient_count = sum(1 for s in domain_statuses.values() if s == SystemStatus.INSUFFICIENT_DATA)

        # Cross-Domain Interaction 1: Environment & Cardiovascular
        if (
            domain_statuses.get(HealthDomain.ENVIRONMENT) in (SystemStatus.MONITOR, SystemStatus.REVIEW_REQUIRED)
            and domain_statuses.get(HealthDomain.CARDIOVASCULAR) in (SystemStatus.MONITOR, SystemStatus.REVIEW_REQUIRED)
        ):
            interaction_note = (
                "Possible association (not proven causation): Concurrent cabin atmospheric deviation (e.g. elevated cabin CO2 or thermal shift) "
                "occurring alongside cardiovascular hemodynamic alterations (elevated heart rate / blood pressure). "
                "Per aerospace literature (Law et al., 2014), microgravity hypercapnia may correlate with compensatory autonomic responses."
            )
            findings.append(interaction_note)
            interactions.append(interaction_note)

        # Cross-Domain Interaction 2: Radiation & Immune
        if (
            domain_statuses.get(HealthDomain.RADIATION) in (SystemStatus.MONITOR, SystemStatus.REVIEW_REQUIRED)
            and domain_statuses.get(HealthDomain.IMMUNE) in (SystemStatus.MONITOR, SystemStatus.REVIEW_REQUIRED)
        ):
            interaction_note = (
                "Possible association (not proven causation): Elevated ionizing radiation exposure occurring concurrently with immunological marker changes. "
                "Spaceflight bio-dosimetry evidence suggests heightened biological sensitivity to opportunistic viral reactivation during elevated radiation flux."
            )
            findings.append(interaction_note)
            interactions.append(interaction_note)

        # Cross-Domain Interaction 3: Behavioral & Cardiovascular (Fatigue & Autonomic Tone)
        if (
            domain_statuses.get(HealthDomain.BEHAVIORAL) in (SystemStatus.MONITOR, SystemStatus.REVIEW_REQUIRED)
            and domain_statuses.get(HealthDomain.CARDIOVASCULAR) in (SystemStatus.MONITOR, SystemStatus.REVIEW_REQUIRED)
        ):
            interaction_note = (
                "Possible association (not proven causation): Sleep debt or cognitive vigilance lapses coinciding with autonomic HRV reduction. "
                "Operational spaceflight data correlates cumulative sleep loss with sympathetic autonomic predominance and cardiovascular deconditioning."
            )
            findings.append(interaction_note)
            interactions.append(interaction_note)

        # Integrated overall status determination without arbitrary averaging:
        if review_count >= 1:
            overall = SystemStatus.REVIEW_REQUIRED
        elif monitor_count >= 2:
            overall = SystemStatus.REVIEW_REQUIRED
            findings.append("Escalation rule: Co-occurrence of multiple (2+) domains under MONITOR warrants consolidated REVIEW_REQUIRED status.")
        elif monitor_count == 1:
            overall = SystemStatus.MONITOR
        elif insufficient_count > (len(domain_statuses) / 2):  # Strictly > 3 out of 6 (i.e. 4, 5, or 6)
            overall = SystemStatus.INSUFFICIENT_DATA
            findings.append("Data completeness notice: More than half of monitored mission domains lack adequate valid telemetry.")
        elif insufficient_count > 0:
            overall = SystemStatus.MONITOR
            findings.append(f"Incomplete mission telemetry: {insufficient_count} domain(s) have INSUFFICIENT_DATA. Overall posture set to MONITOR.")
        else:
            overall = SystemStatus.NORMAL

        return overall, findings, interactions
