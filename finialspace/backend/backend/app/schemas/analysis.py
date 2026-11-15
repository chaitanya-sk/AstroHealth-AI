from datetime import datetime
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field, ConfigDict
from app.core.constants import HealthDomain, SystemStatus, DataType


class Observation(BaseModel):
    indicator: str
    measured_value: float
    unit: str
    status: SystemStatus
    reference_normal: Optional[str] = None
    observation_text: str
    confidence: float = 1.0


class DataQualitySummary(BaseModel):
    is_valid: bool = True
    total_records: int = 0
    valid_records: int = 0
    non_finite_dropped: int = 0
    inconsistent_units_dropped: int = 0
    data_types_present: List[str] = Field(default_factory=list)
    freshness_hours: Optional[float] = None
    freshness_status: str = "NO_DATA"  # FRESH (<=24h), STALE (>24h), CRITICALLY_STALE (>72h), NO_DATA


class IndicatorTrend(BaseModel):
    indicator: str
    direction: str  # "increasing", "decreasing", "stable", "insufficient_history"
    slope: float = 0.0
    sample_count: int = 0
    baseline_value: Optional[float] = None
    baseline_deviation_pct: Optional[float] = None
    mean: Optional[float] = None
    std: Optional[float] = None


class AnomalyItem(BaseModel):
    indicator: str
    anomaly_type: str  # "threshold_breach", "baseline_shift", "sudden_rate_change", "z_score_outlier"
    severity: str  # "MONITOR", "REVIEW_REQUIRED"
    description: str
    value: float
    unit: str
    threshold_reference: Optional[str] = None


class DomainAnalysisResult(BaseModel):
    astronaut_id: str
    domain: HealthDomain
    status: SystemStatus  # NORMAL, MONITOR, REVIEW_REQUIRED, INSUFFICIENT_DATA
    findings: List[str]
    indicators_analysed: List[str]
    trend: List[IndicatorTrend]
    anomalies: List[AnomalyItem]
    data_quality: DataQualitySummary
    freshness: Optional[float] = None  # in hours
    confidence: float = 1.0
    evidence: List[str]
    explanation: str
    assessment_timestamp: datetime
    # Retain backward-compatible fields
    summary: Optional[str] = None
    observations: List[Observation] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    supporting_evidence: List[str] = Field(default_factory=list)
    timestamp: Optional[datetime] = None
    data_freshness_hours: Optional[float] = None
    records_analyzed: int = 0

    model_config = ConfigDict(from_attributes=True)


class StructuredRecommendation(BaseModel):
    observed: str
    supporting_measurements: List[str]
    why_followup: str
    responsible_reviewer: str  # e.g., "Flight Surgeon", "Crew Medical Officer", "Biomedical Engineer"
    evidence_reference: Optional[str] = None


class MLDomainAnomalyInsight(BaseModel):
    model_key: str
    domain: HealthDomain
    model_name: str
    model_version: str
    is_anomaly: bool  # True if prediction == -1, False if prediction == 1
    anomaly_score: Optional[float] = None
    interpretation: str
    features_evaluated: Dict[str, float]
    provenance_disclaimer: str


class IntegratedHealthSummary(BaseModel):
    astronaut_id: str
    overall_status: SystemStatus
    generated_at: datetime
    domain_statuses: Dict[HealthDomain, SystemStatus]
    domain_summaries: Dict[HealthDomain, str]
    key_findings: List[str]
    cross_domain_interactions: List[str]
    active_concerns_count: int
    data_freshness_status: str
    structured_recommendations: List[StructuredRecommendation]
    integrated_recommendations: List[str]  # text bullets for backward compatibility
    evidence_notes: List[str]
    # Phase 8 extended intelligence fields (with safe defaults for backward compatibility)
    domain_assessments: Optional[Dict[str, DomainAnalysisResult]] = None
    ml_insights: List[MLDomainAnomalyInsight] = Field(default_factory=list)
    stale_indicators: List[str] = Field(default_factory=list)
    insufficient_domains: List[str] = Field(default_factory=list)
    data_types_included: List[str] = Field(default_factory=list)
    supporting_evidence_references: List[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
