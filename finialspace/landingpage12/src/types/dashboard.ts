export type HealthStatus = 
  | 'NORMAL' 
  | 'MONITOR' 
  | 'REVIEW REQUIRED' 
  | 'REVIEW_REQUIRED' 
  | 'CRITICAL' 
  | 'AVAILABLE' 
  | 'INSUFFICIENT DATA' 
  | 'INSUFFICIENT_DATA'
  | 'RESEARCH DATA'
  | 'SIMULATED DATA'
  | 'MODEL UNAVAILABLE';

export type DataTier = 'REAL' | 'RESEARCH' | 'SIMULATED' | 'AI PREDICTION' | 'AI_PREDICTION';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface MetricItem {
  label: string;
  value: string;
  unit?: string;
  status?: 'normal' | 'warning' | 'alert' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
}

export interface HealthDomain {
  id: string;
  name: string;
  shortName: string;
  status: HealthStatus;
  description: string;
  icon: string;
  tier: DataTier;
  dataAvailability: string;
  metrics: MetricItem[];
  findingsSummary: string;
  detailedFindings: string[];
  recommendation: string;
  lastUpdated: string;
}

export interface SummaryStat {
  id: string;
  label: string;
  value: string | number;
  sublabel: string;
  tier: DataTier;
  icon: string;
  trend?: string;
  isPositive?: boolean;
}

export interface AlertItem {
  id: string;
  title: string;
  severity: AlertSeverity;
  domain: string;
  timestamp: string;
  status: AlertStatus;
  description: string;
  tier: DataTier;
  astronautName: string;
  recommendedAction?: string;
}

export interface AstronautProfile {
  id: string;
  name: string;
  role: string;
  callsign: string;
  mission: string;
  spacecraft: string;
  flightDay: number;
  totalDaysInSpace: number;
  avatarUrl: string;
  status: HealthStatus;
  heartRateCurrent?: number;
  hrvCurrent?: number;
  sleepHours?: number;
  recoveryPercentage?: number;
  workCapacity?: number;
  tier: DataTier;
}

export interface IntelligenceOverview {
  overallAssessment: HealthStatus;
  lastAssessmentTimestamp: string;
  assessmentCycle: string;
  systemReadinessScore: number;
  explainableSummary: string;
  domainStatuses: {
    domain: string;
    status: HealthStatus;
    badgeCount?: number;
  }[];
  criticalObservations: {
    id: string;
    domain: string;
    observation: string;
    clinicalRationale: string;
    actionItem: string;
    severity: AlertSeverity;
    tier: DataTier;
  }[];
}

export interface TrendDataPoint {
  time: string;
  heartRate: number;
  hrv: number;
  baselineHR: number;
  baselineHRV: number;
  workload: number;
  sleepStage?: string;
}

export interface DataProvenanceItem {
  id: string;
  name: string;
  category: string;
  tier: DataTier;
  sourceDataset: string;
  collectionMethod: string;
  complianceNote: string;
  latency: string;
}

