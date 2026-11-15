import { apiRequest } from './apiClient';
import { ModelInfoResponse, ModelPredictRequest, ModelPredictResponse } from '../../types/api';

// Verified candidate models registry directly from backend app/ml/model_registry.py
export const FALLBACK_MODELS_CATALOG: ModelInfoResponse[] = [
  {
    model_key: "cardiovascular_hrv_anomaly",
    domain: "cardiovascular",
    model_name: "Autonomic HRV Anomaly Detector (MVP)",
    filename: "hrv_anomaly_model.joblib",
    description: "Identifies autonomic dysregulation and cardiac interval anomalies from windowed HRV and heart rate",
    expected_features: ["heart_rate", "hrv_rmssd", "hrv_sdnn", "pnn50"],
    expected_units: {
      heart_rate: "bpm",
      hrv_rmssd: "ms",
      hrv_sdnn: "ms",
      pnn50: "%"
    },
    model_version: "1.0.0",
    task_type: "anomaly_detection",
    dataset_requirements: "Trained on MMASH continuous 5-minute windowed ECG beat-to-beat intervals partitioned strictly by participant ID.",
    target_description: "1: Nominal Autonomic Tone, -1: Autonomic Outlier / Telemetry Anomaly",
    is_available: true,
    status: "READY"
  },
  {
    model_key: "cardiovascular_risk",
    domain: "cardiovascular",
    model_name: "Cardiovascular Autonomic Regulation Predictor",
    filename: "cardio_model.joblib",
    description: "Predicts autonomic deconditioning and orthostatic intolerance risk from vitals & HRV",
    expected_features: ["heart_rate", "systolic_bp", "diastolic_bp", "hrv_rmssd"],
    expected_units: {
      heart_rate: "bpm",
      systolic_bp: "mmHg",
      diastolic_bp: "mmHg",
      hrv_rmssd: "ms"
    },
    model_version: "1.0.0",
    task_type: "classification",
    dataset_requirements: "Human resting ECG/BP telemetry from spaceflight or head-down bed rest analogues (e.g. NASA LSDA / PhysioNet)",
    target_description: "0: Stable Autonomic Tone, 1: Autonomic Deconditioning / Orthostatic Risk",
    is_available: false,
    status: "NOT_DEPLOYED"
  },
  {
    model_key: "behavioral_fatigue",
    domain: "behavioral",
    model_name: "Cognitive Fatigue and Sleep Disruption Predictor",
    filename: "behavioral_model.joblib",
    description: "Estimates cognitive performance lapse likelihood from sleep duration actigraphy and PVT metrics",
    expected_features: ["sleep_duration_hours", "pvt_mean_rt", "pvt_lapses"],
    expected_units: {
      sleep_duration_hours: "hours",
      pvt_mean_rt: "ms",
      pvt_lapses: "count"
    },
    model_version: "1.0.0",
    task_type: "classification",
    dataset_requirements: "Human actigraphy and Psychomotor Vigilance Task (PVT) logs across mission days",
    target_description: "0: Adequate Readiness, 1: Elevated Fatigue Risk",
    is_available: false,
    status: "NOT_DEPLOYED"
  },
  {
    model_key: "environmental_anomaly",
    domain: "environment",
    model_name: "Cabin Atmospheric Anomaly Detector",
    filename: "env_anomaly_model.joblib",
    description: "Detects multi-gas excursions and air scrubber efficiency degradation from cabin environmental sensors",
    expected_features: ["co2_percent", "o2_percent", "cabin_pressure_kpa", "cabin_temp_c"],
    expected_units: {
      co2_percent: "%",
      o2_percent: "%",
      cabin_pressure_kpa: "kPa",
      cabin_temp_c: "degC"
    },
    model_version: "1.0.0",
    task_type: "anomaly_detection",
    dataset_requirements: "ECLSS atmospheric life support sensor series",
    target_description: "1: Normal Environmental Envelope, -1: Gas Excursion Anomaly",
    is_available: false,
    status: "NOT_DEPLOYED"
  }
];

export const mlService = {
  async listModels(token?: string | null): Promise<ModelInfoResponse[]> {
    try {
      const models = await apiRequest<ModelInfoResponse[]>('/api/analysis/ml/models', {}, token);
      if (Array.isArray(models) && models.length > 0) return models;
      return FALLBACK_MODELS_CATALOG;
    } catch (e) {
      // Backend route precedence fallback (documented in API_INTEGRATION_SPEC.md)
      return FALLBACK_MODELS_CATALOG;
    }
  },

  async predict(modelKey: string, payload: ModelPredictRequest, token?: string | null): Promise<ModelPredictResponse> {
    return apiRequest<ModelPredictResponse>(
      `/api/analysis/ml/predict/${encodeURIComponent(modelKey)}`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token
    );
  }
};
