export type HealthDomain = 
  | 'immune' 
  | 'bone_muscle' 
  | 'cardiovascular' 
  | 'behavioral' 
  | 'radiation' 
  | 'environment';

export type DataType = 'real' | 'simulated' | 'research';

export type SystemStatus = 
  | 'NORMAL' 
  | 'MONITOR' 
  | 'REVIEW_REQUIRED' 
  | 'INSUFFICIENT_DATA';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';

export interface AstronautResponse {
  id: number;
  astronaut_id: string;
  name: string;
  mission_id?: string | null;
  mission_start_date?: string | null;
  role?: string | null;
  mission_day?: number | null;
  blood_type?: string | null;
  resting_hr_baseline?: number | null;
  resting_bp_sys_baseline?: number | null;
  resting_bp_dia_baseline?: number | null;
  created_at: string;
}

export interface AstronautCreate {
  astronaut_id: string;
  name: string;
  mission_id?: string;
  mission_start_date?: string;
  role?: string;
  mission_day?: number;
  blood_type?: string;
  resting_hr_baseline?: number;
  resting_bp_sys_baseline?: number;
  resting_bp_dia_baseline?: number;
}

export interface AstronautUpdate {
  name?: string;
  mission_id?: string;
  mission_start_date?: string;
  role?: string;
  mission_day?: number;
  blood_type?: string;
  resting_hr_baseline?: number;
  resting_bp_sys_baseline?: number;
  resting_bp_dia_baseline?: number;
}

export interface HealthRecordResponse {
  id: number;
  astronaut_id: string;
  timestamp: string;
  domain: HealthDomain;
  indicator: string;
  value: number;
  unit: string;
  source: string;
  data_type: DataType;
  confidence?: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Observation {
  indicator: string;
  measured_value: number;
  unit: string;
  status: SystemStatus;
  reference_normal?: string;
  observation_text: string;
  confidence: number;
}

export interface DataQualitySummary {
  is_valid: boolean;
  total_records: number;
  valid_records: number;
  non_finite_dropped: number;
  inconsistent_units_dropped: number;
  data_types_present: string[];
  freshness_hours?: number;
  freshness_status: string; // FRESH, STALE, CRITICALLY_STALE, NO_DATA
}

export interface IndicatorTrend {
  indicator: string;
  direction: 'increasing' | 'decreasing' | 'stable' | 'insufficient_history' | string;
  slope: number;
  sample_count: number;
  baseline_value?: number;
  baseline_deviation_pct?: number;
  mean?: number;
  std?: number;
}

export interface AnomalyItem {
  indicator: string;
  anomaly_type: string;
  severity: 'MONITOR' | 'REVIEW_REQUIRED' | string;
  description: string;
  value: number;
  unit: string;
  threshold_reference?: string;
}

export interface DomainAnalysisResult {
  astronaut_id: string;
  domain: HealthDomain;
  status: SystemStatus;
  findings: string[];
  indicators_analysed: string[];
  trend: IndicatorTrend[];
  anomalies: AnomalyItem[];
  data_quality: DataQualitySummary;
  freshness?: number;
  confidence: number;
  evidence: string[];
  explanation: string;
  assessment_timestamp: string;
  summary?: string;
  observations?: Observation[];
  recommendations?: string[];
  supporting_evidence?: string[];
}

export interface StructuredRecommendation {
  observed: string;
  supporting_measurements: string[];
  why_followup: string;
  responsible_reviewer: string;
  evidence_reference?: string;
}

export interface MLDomainAnomalyInsight {
  model_key: string;
  domain: HealthDomain;
  model_name: string;
  model_version: string;
  is_anomaly: boolean;
  anomaly_score?: number;
  interpretation: string;
  features_evaluated: Record<string, number>;
  provenance_disclaimer: string;
}

export interface IntegratedHealthSummary {
  astronaut_id: string;
  overall_status: SystemStatus;
  generated_at: string;
  domain_statuses: Record<string, SystemStatus>;
  domain_summaries: Record<string, string>;
  key_findings: string[];
  cross_domain_interactions: string[];
  active_concerns_count: number;
  data_freshness_status: string;
  structured_recommendations: StructuredRecommendation[];
  integrated_recommendations: string[];
  evidence_notes: string[];
  domain_assessments?: Record<string, DomainAnalysisResult>;
  ml_insights?: MLDomainAnomalyInsight[];
  stale_indicators?: string[];
  insufficient_domains?: string[];
  data_types_included?: string[];
  supporting_evidence_references?: string[];
}

export interface ModelInfoResponse {
  model_key: string;
  domain: string;
  model_name: string;
  filename: string;
  description: string;
  expected_features: string[];
  expected_units: Record<string, string>;
  model_version: string;
  task_type: string;
  dataset_requirements?: string;
  target_description?: string;
  is_available: boolean;
  status: 'READY' | 'NOT_DEPLOYED' | string;
}

export interface ModelPredictRequest {
  features: Record<string, number>;
  units?: Record<string, string>;
}

export interface ModelPredictResponse {
  available: boolean;
  model_key: string;
  status: string;
  model_name?: string;
  model_version?: string;
  prediction?: any;
  probabilities?: any;
  score?: any;
  message?: string;
  error?: string;
  expected_features?: string[];
  expected_units?: Record<string, string>;
  training_metadata?: Record<string, any>;
}

export interface AlertResponse {
  id: number;
  alert_id: string;
  astronaut_id: string;
  domain: HealthDomain;
  severity: AlertSeverity;
  title: string;
  explanation: string;
  supporting_measurements?: string;
  status: AlertStatus;
  recommended_action: string;
  evidence?: string;
  timestamp: string;
  data_source?: string;
  data_tier?: string;
}

export interface RecommendationResponse {
  id: number;
  recommendation_id: string;
  astronaut_id: string;
  domain: HealthDomain;
  summary: string;
  rationale: string;
  suggested_actions: string;
  evidence_reference?: string;
  urgency: string;
  created_at: string;
}

export interface ResearchDatasetMeta {
  dataset_id: string;
  title: string;
  domain: string;
  origin: string; // 'NASA GeneLab' | 'PhysioNet' | 'Spaceflight Analogue'
  tier: DataType;
  participants_count: number;
  specimen_type?: string;
  description: string;
  access_status: string;
  publications?: string[];
}
