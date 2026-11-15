from typing import List, Dict, Optional, Any
from datetime import datetime
from app.models.health_record import HealthRecord
from app.models.astronaut import Astronaut
from app.schemas.analysis import (
    DomainAnalysisResult,
    IntegratedHealthSummary,
    StructuredRecommendation,
    MLDomainAnomalyInsight,
)
from app.core.constants import HealthDomain, SystemStatus
from app.analyzers import (
    ImmuneAnalyzer,
    BoneMuscleAnalyzer,
    CardiovascularAnalyzer,
    BehavioralAnalyzer,
    RadiationAnalyzer,
    EnvironmentAnalyzer,
)
from app.intelligence.risk_engine import RiskEngine
from app.intelligence.explanation_engine import ExplanationEngine
from app.services.recommendation_service import RecommendationService
from app.ml.predictor import Predictor
from app.ml.model_registry import ModelRegistry


class HealthIntelligenceEngine:
    def __init__(self):
        self.analyzers = {
            HealthDomain.IMMUNE: ImmuneAnalyzer(),
            HealthDomain.BONE_MUSCLE: BoneMuscleAnalyzer(),
            HealthDomain.CARDIOVASCULAR: CardiovascularAnalyzer(),
            HealthDomain.BEHAVIORAL: BehavioralAnalyzer(),
            HealthDomain.RADIATION: RadiationAnalyzer(),
            HealthDomain.ENVIRONMENT: EnvironmentAnalyzer(),
        }

    def analyze_domain(
        self,
        domain: HealthDomain,
        astronaut_id: str,
        records: List[HealthRecord],
        astronaut: Optional[Astronaut] = None,
        data_type_filter: Optional[str] = None
    ) -> DomainAnalysisResult:
        analyzer = self.analyzers.get(domain)
        if not analyzer:
            raise ValueError(f"Unknown domain: {domain}")
        return analyzer.analyze(astronaut_id, records, astronaut=astronaut, data_type_filter=data_type_filter)

    def generate_integrated_overview(
        self,
        astronaut_id: str,
        records: List[HealthRecord],
        astronaut: Optional[Astronaut] = None,
        data_type_filter: Optional[str] = None
    ) -> IntegratedHealthSummary:
        now = datetime.utcnow()
        domain_results: Dict[HealthDomain, DomainAnalysisResult] = {}
        domain_assessments_str_keyed: Dict[str, DomainAnalysisResult] = {}
        domain_statuses: Dict[HealthDomain, SystemStatus] = {}
        domain_summaries: Dict[HealthDomain, str] = {}
        structured_recs: List[StructuredRecommendation] = []
        all_recommendations_text: List[str] = []
        all_evidence_refs: List[str] = []
        stale_indicators: List[str] = []
        insufficient_domains: List[str] = []
        data_types_present: set = set()

        # 1. Run each specialized domain analyzer
        for domain, analyzer in self.analyzers.items():
            result = analyzer.analyze(
                astronaut_id,
                records,
                astronaut=astronaut,
                data_type_filter=data_type_filter
            )
            domain_results[domain] = result
            domain_assessments_str_keyed[domain.value] = result
            domain_statuses[domain] = result.status
            domain_summaries[domain] = result.explanation
            all_recommendations_text.extend(result.recommendations)

            if result.evidence:
                all_evidence_refs.extend(result.evidence)

            if result.status == SystemStatus.INSUFFICIENT_DATA:
                insufficient_domains.append(domain.value)

            if result.data_quality:
                if result.data_quality.freshness_status in ("STALE", "CRITICALLY_STALE"):
                    for obs in result.observations:
                        stale_indicators.append(f"{domain.value}:{obs.indicator}")
                for dt in result.data_quality.data_types_present:
                    data_types_present.add(dt)

            # Generate structured recommendation if domain is not NORMAL
            if result.status != SystemStatus.NORMAL:
                abnormal_inds = [obs.indicator for obs in result.observations if obs.status != SystemStatus.NORMAL]
                obs_summary = [f"{obs.indicator}: {obs.measured_value} {obs.unit}" for obs in result.observations if obs.status != SystemStatus.NORMAL]
                structured_recs.extend(
                    RecommendationService.get_structured_recommendations(
                        domain, result.status, abnormal_inds, obs_summary
                    )
                )

        # 2. Risk Engine synthesis & cross-domain interactions
        overall_status, risk_findings, interactions = RiskEngine.evaluate_multi_system_compounding(domain_statuses, domain_results)

        # 3. Assess overall telemetry freshness
        valid_freshness = [
            res.data_quality.freshness_hours for res in domain_results.values()
            if res.data_quality and res.data_quality.freshness_hours is not None
        ]
        if not valid_freshness:
            freshness_status = "No valid bio-telemetry on record."
        else:
            avg_freshness = sum(valid_freshness) / len(valid_freshness)
            if avg_freshness <= 12.0:
                freshness_status = f"Telemetry current (average age: {avg_freshness:.1f} hours)"
            elif avg_freshness <= 48.0:
                freshness_status = f"Telemetry moderately fresh (average age: {avg_freshness:.1f} hours)"
            else:
                freshness_status = f"Telemetry stale (average age: {avg_freshness:.1f} hours)"

        # 4. Machine Learning Integration (Cardiovascular Isolation Forest MVP)
        ml_insights: List[MLDomainAnomalyInsight] = []
        cardio_records = [
            r for r in records
            if r.domain == HealthDomain.CARDIOVASCULAR.value
            and (data_type_filter is None or r.data_type.lower() == data_type_filter.lower())
        ]

        if cardio_records:
            # Extract latest finite values for required 4 features
            hr_rec = next((r for r in sorted(cardio_records, key=lambda x: x.timestamp, reverse=True) if r.indicator == "heart_rate"), None)
            rmssd_rec = next((r for r in sorted(cardio_records, key=lambda x: x.timestamp, reverse=True) if r.indicator == "hrv_rmssd"), None)
            sdnn_rec = next((r for r in sorted(cardio_records, key=lambda x: x.timestamp, reverse=True) if r.indicator == "hrv_sdnn"), None)
            pnn50_rec = next((r for r in sorted(cardio_records, key=lambda x: x.timestamp, reverse=True) if r.indicator == "pnn50"), None)

            if hr_rec and rmssd_rec and sdnn_rec and pnn50_rec:
                feat_dict = {
                    "heart_rate": float(hr_rec.value),
                    "hrv_rmssd": float(rmssd_rec.value),
                    "hrv_sdnn": float(sdnn_rec.value),
                    "pnn50": float(pnn50_rec.value)
                }
                units_dict = {
                    "heart_rate": hr_rec.unit,
                    "hrv_rmssd": rmssd_rec.unit,
                    "hrv_sdnn": sdnn_rec.unit,
                    "pnn50": pnn50_rec.unit
                }

                pred_res = Predictor.predict("cardiovascular_hrv_anomaly", feat_dict, units_dict=units_dict)
                if pred_res.get("available") and pred_res.get("status") == "SUCCESS":
                    pred_val = pred_res.get("prediction")
                    is_anom = (pred_val == [-1] or pred_val == -1)
                    score_val = pred_res.get("score")[0] if pred_res.get("score") else None

                    ml_insights.append(
                        MLDomainAnomalyInsight(
                            model_key="cardiovascular_hrv_anomaly",
                            domain=HealthDomain.CARDIOVASCULAR,
                            model_name=pred_res.get("model_name", "Autonomic HRV Anomaly Detector (MVP)"),
                            model_version=pred_res.get("model_version", "1.0.0"),
                            is_anomaly=is_anom,
                            anomaly_score=score_val,
                            interpretation=(
                                "Statistical anomaly relative to terrestrial MMASH 1g baseline distribution."
                                if is_anom else
                                "Within learned statistical bounds of terrestrial MMASH 1g baseline distribution."
                            ),
                            features_evaluated=feat_dict,
                            provenance_disclaimer=(
                                "Trained exclusively on MMASH healthy terrestrial volunteers (1g). "
                                "Represents an unsupervised statistical anomaly detection model, NOT a clinical diagnosis or spaceflight validation."
                            )
                        )
                    )

                    if is_anom:
                        risk_findings.append(
                            f"CARDIOVASCULAR ML ANOMALY: Telemetry patterns (HR: {feat_dict['heart_rate']} bpm, "
                            f"RMSSD: {feat_dict['hrv_rmssd']} ms, SDNN: {feat_dict['hrv_sdnn']} ms, pNN50: {feat_dict['pnn50']}%) "
                            f"exhibit statistical isolation (score: {score_val}) relative to terrestrial ground distributions."
                        )
                        if overall_status == SystemStatus.NORMAL:
                            overall_status = SystemStatus.MONITOR

        # 5. Synthesize active concerns
        active_concerns_count = sum(
            1 for s in domain_statuses.values()
            if s in (SystemStatus.MONITOR, SystemStatus.REVIEW_REQUIRED)
        )
        if any(ins.is_anomaly for ins in ml_insights):
            active_concerns_count += 1

        evidence_notes = ExplanationEngine.generate_executive_rationale(
            overall_status, risk_findings, domain_results
        )

        # Fallback recommendations if no specific domain concerns were triggered
        if not structured_recs:
            if insufficient_domains:
                structured_recs = [
                    StructuredRecommendation(
                        observed=f"Telemetry unavailable or insufficient for {len(insufficient_domains)} of 6 domains: {', '.join(insufficient_domains)}.",
                        supporting_measurements=[f"Domains pending downlink: {', '.join(insufficient_domains)}"],
                        why_followup="Active telemetry synchronization required to satisfy crew health surveillance standards.",
                        responsible_reviewer="Biomedical Engineer (BME) / Flight Surgeon",
                        evidence_reference="NASA-STD-3001 Vol 1: Telemetry Synchronization Requirements"
                    )
                ]
                all_recommendations_text = [
                    f"[Flight Surgeon] Awaiting telemetry synchronization for missing domains: {', '.join(insufficient_domains)}."
                ]
            else:
                structured_recs = [
                    StructuredRecommendation(
                        observed="All 6 evaluated bio-parameters and life support domains are within nominal boundaries.",
                        supporting_measurements=["6 domains verified with active telemetry"],
                        why_followup="Maintain prescribed daily countermeasure schedule (ARED resistive exercise + T2 treadmill).",
                        responsible_reviewer="Flight Surgeon / Crew Medical Officer",
                        evidence_reference="NASA-STD-3001 Vol 1: Routine Countermeasure Protocols"
                    )
                ]
                all_recommendations_text = [
                    "[Flight Surgeon] Maintain prescribed daily physical countermeasure regimen and mission nutrition."
                ]

        return IntegratedHealthSummary(
            astronaut_id=astronaut_id,
            overall_status=overall_status,
            generated_at=now,
            domain_statuses=domain_statuses,
            domain_summaries=domain_summaries,
            key_findings=risk_findings if risk_findings else ["All monitored systems are within nominal boundaries."],
            cross_domain_interactions=interactions,
            active_concerns_count=active_concerns_count,
            data_freshness_status=freshness_status,
            structured_recommendations=structured_recs,
            integrated_recommendations=list(dict.fromkeys(all_recommendations_text)),
            evidence_notes=evidence_notes,
            domain_assessments=domain_assessments_str_keyed,
            ml_insights=ml_insights,
            stale_indicators=list(dict.fromkeys(stale_indicators)),
            insufficient_domains=insufficient_domains,
            data_types_included=sorted(list(data_types_present)),
            supporting_evidence_references=list(dict.fromkeys(all_evidence_refs)),
        )


health_intelligence_engine = HealthIntelligenceEngine()
