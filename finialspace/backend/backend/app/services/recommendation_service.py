from typing import List, Dict, Any
from app.core.constants import HealthDomain, SystemStatus
from app.schemas.analysis import StructuredRecommendation


class RecommendationService:
    @staticmethod
    def get_structured_recommendations(
        domain: HealthDomain,
        status: SystemStatus,
        abnormal_indicators: List[str],
        observations_summary: List[str]
    ) -> List[StructuredRecommendation]:
        """
        Generate cautious, evidence-linked follow-up suggestions for flight decision-support.
        Does not invent medical prescriptions, surgical advice, or unauthorized procedures.
        """
        if status == SystemStatus.INSUFFICIENT_DATA:
            return [
                StructuredRecommendation(
                    observed=f"Insufficient or critically stale telemetry for {domain.value}.",
                    supporting_measurements=abnormal_indicators or ["No current valid readings"],
                    why_followup="Crew health surveillance protocols require active telemetry to verify physiological readiness.",
                    responsible_reviewer="Biomedical Engineer (BME) / Crew Medical Officer",
                    evidence_reference="NASA-STD-3001 Vol 1: Telemetry Synchronization Requirements"
                )
            ]

        if status == SystemStatus.NORMAL:
            return [
                StructuredRecommendation(
                    observed=f"Nominal parameters maintained across {domain.value}.",
                    supporting_measurements=abnormal_indicators or ["All evaluated indicators within baseline"],
                    why_followup="Verify routine maintenance of prescribed physical countermeasures and nutrition.",
                    responsible_reviewer="Flight Surgeon / Astronaut",
                    evidence_reference="NASA Flight Medicine Clinical Protocols"
                )
            ]

        recs: List[StructuredRecommendation] = []

        if domain == HealthDomain.CARDIOVASCULAR:
            recs.append(
                StructuredRecommendation(
                    observed=f"Hemodynamic or autonomic deviation in: {', '.join(abnormal_indicators)}.",
                    supporting_measurements=observations_summary,
                    why_followup="Assess hydration status, microgravity cephalad fluid redistribution, and aerobic countermeasure load.",
                    responsible_reviewer="Flight Surgeon",
                    evidence_reference="NASA-STD-3001 Vol 1: Cardiovascular Health Protocols"
                )
            )

        elif domain == HealthDomain.RADIATION:
            recs.append(
                StructuredRecommendation(
                    observed=f"Ionizing radiation indicators elevated in: {', '.join(abnormal_indicators)}.",
                    supporting_measurements=observations_summary,
                    why_followup="Cross-reference personal dosimeter readings with vehicle charged-particle sensors and space weather telemetry.",
                    responsible_reviewer="Space Radiation Analysis Group (SRAG) / Flight Surgeon",
                    evidence_reference="NASA Space Permissible Exposure Limits (PEL)"
                )
            )

        elif domain == HealthDomain.ENVIRONMENT:
            recs.append(
                StructuredRecommendation(
                    observed=f"Cabin atmospheric threshold divergence in: {', '.join(abnormal_indicators)}.",
                    supporting_measurements=observations_summary,
                    why_followup="Inspect environmental control and life support system (ECLSS) scrubber efficiency and ventilation airflow.",
                    responsible_reviewer="Life Support Systems Officer / Flight Director",
                    evidence_reference="NASA-STD-3001 Vol 2 Rev C: Habitable Atmosphere Architecture"
                )
            )

        elif domain == HealthDomain.BEHAVIORAL:
            recs.append(
                StructuredRecommendation(
                    observed=f"Sleep deficiency or cognitive reaction-time changes in: {', '.join(abnormal_indicators)}.",
                    supporting_measurements=observations_summary,
                    why_followup="Evaluate cumulative sleep debt, circadian lighting protocol compliance, and operational shift scheduling.",
                    responsible_reviewer="Behavioral Health & Performance (BHP) Lead",
                    evidence_reference="Basner et al., Sleep (2014); NASA Human Research Program"
                )
            )

        elif domain == HealthDomain.IMMUNE:
            recs.append(
                StructuredRecommendation(
                    observed=f"Immunological biomarker shift in: {', '.join(abnormal_indicators)}.",
                    supporting_measurements=observations_summary,
                    why_followup="Schedule follow-up saliva or blood assay to monitor cytokine or opportunistic viral reactivation trends.",
                    responsible_reviewer="Immunology Specialist / Flight Surgeon",
                    evidence_reference="Crucian et al., Brain Behav Immun (2018)"
                )
            )

        elif domain == HealthDomain.BONE_MUSCLE:
            recs.append(
                StructuredRecommendation(
                    observed=f"Bone resorption or muscle perimeter changes in: {', '.join(abnormal_indicators)}.",
                    supporting_measurements=observations_summary,
                    why_followup="Review compliance and resistive loading progression on Advanced Resistive Exercise Device (ARED).",
                    responsible_reviewer="Astronaut Strength & Conditioning Coach (ASCR) / Flight Surgeon",
                    evidence_reference="NASA HRP: Musculoskeletal Countermeasures Protocols"
                )
            )

        return recs

    @staticmethod
    def get_domain_recommendations(
        domain: HealthDomain,
        status: SystemStatus,
        abnormal_indicators: List[str]
    ) -> List[str]:
        """Backward-compatible text list of recommendations."""
        structured = RecommendationService.get_structured_recommendations(
            domain, status, abnormal_indicators, [f"{ind} altered" for ind in abnormal_indicators]
        )
        return [
            f"[{r.responsible_reviewer}] {r.observed} Recommended action: {r.why_followup} Ref: {r.evidence_reference or 'Clinical Protocol'}"
            for r in structured
        ]
