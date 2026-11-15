from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from app.core.constants import HealthDomain


class ModelMetadata:
    def __init__(
        self,
        domain: HealthDomain,
        model_name: str,
        filename: str,
        description: str,
        expected_features: List[str],
        expected_units: Dict[str, str],
        model_version: str = "1.0.0",
        task_type: str = "classification",  # classification or regression or anomaly_detection
        dataset_requirements: Optional[str] = None,
        target_description: Optional[str] = None,
    ):
        self.domain = domain
        self.model_name = model_name
        self.filename = filename
        self.description = description
        self.expected_features = expected_features
        self.expected_units = expected_units
        self.model_version = model_version
        self.task_type = task_type
        self.dataset_requirements = dataset_requirements
        self.target_description = target_description


class ModelRegistry:
    """
    Registry documenting approved candidate ML models in AstroHealth AI.
    Models are loaded offline from trained_models/ and evaluated with verifiable contracts.
    """
    _registry: Dict[str, ModelMetadata] = {
        # MVP Model: Autonomic HRV Anomaly Detector
        "cardiovascular_hrv_anomaly": ModelMetadata(
            domain=HealthDomain.CARDIOVASCULAR,
            model_name="Autonomic HRV Anomaly Detector (MVP)",
            filename="hrv_anomaly_model.joblib",
            description="Identifies autonomic dysregulation and cardiac interval anomalies from windowed HRV and heart rate",
            expected_features=["heart_rate", "hrv_rmssd", "hrv_sdnn", "pnn50"],
            expected_units={"heart_rate": "bpm", "hrv_rmssd": "ms", "hrv_sdnn": "ms", "pnn50": "%"},
            model_version="1.0.0",
            task_type="anomaly_detection",
            dataset_requirements="Trained on MMASH continuous 5-minute windowed ECG beat-to-beat intervals partitioned strictly by participant ID.",
            target_description="1: Nominal Autonomic Tone, -1: Autonomic Outlier / Telemetry Anomaly"
        ),
        # Model 1: Cardiovascular
        "cardiovascular_risk": ModelMetadata(
            domain=HealthDomain.CARDIOVASCULAR,
            model_name="Cardiovascular Autonomic Regulation Predictor",
            filename="cardio_model.joblib",
            description="Predicts autonomic deconditioning and orthostatic intolerance risk from vitals & HRV",
            expected_features=["heart_rate", "systolic_bp", "diastolic_bp", "hrv_rmssd"],
            expected_units={"heart_rate": "bpm", "systolic_bp": "mmHg", "diastolic_bp": "mmHg", "hrv_rmssd": "ms"},
            model_version="1.0.0",
            task_type="classification",
            dataset_requirements="Human resting ECG/BP telemetry from spaceflight or head-down bed rest analogues (e.g. NASA LSDA / PhysioNet)",
            target_description="0: Stable Autonomic Tone, 1: Autonomic Deconditioning / Orthostatic Risk"
        ),
        # Model 2: Behavioral Health
        "behavioral_fatigue": ModelMetadata(
            domain=HealthDomain.BEHAVIORAL,
            model_name="Cognitive Fatigue and Sleep Disruption Predictor",
            filename="behavioral_model.joblib",
            description="Estimates cognitive performance lapse likelihood from sleep duration actigraphy and PVT metrics",
            expected_features=["sleep_duration_hours", "pvt_mean_rt", "pvt_lapses"],
            expected_units={"sleep_duration_hours": "hours", "pvt_mean_rt": "ms", "pvt_lapses": "count"},
            model_version="1.0.0",
            task_type="classification",
            dataset_requirements="Human actigraphy and Psychomotor Vigilance Task (PVT) logs across mission days (e.g. ISS Reaction Self-Test study)",
            target_description="0: Adequate Readiness, 1: Elevated Fatigue Risk"
        ),
        # Model 3: Environmental Anomaly Detection
        "environmental_anomaly": ModelMetadata(
            domain=HealthDomain.ENVIRONMENT,
            model_name="Cabin Atmospheric Anomaly Detector",
            filename="environment_model.joblib",
            description="Identifies multi-parameter habitat atmospheric drifts (hypercapnia, depressurization, thermal runaway)",
            expected_features=["cabin_co2_pp", "cabin_o2_pp", "cabin_pressure", "cabin_temperature", "cabin_humidity"],
            expected_units={"cabin_co2_pp": "mmHg", "cabin_o2_pp": "mmHg", "cabin_pressure": "kPa", "cabin_temperature": "C", "cabin_humidity": "%"},
            model_version="1.0.0",
            task_type="anomaly_detection",
            dataset_requirements="Vehicle Environmental Control and Life Support System (ECLSS) sensor telemetry",
            target_description="0: Nominal Habitat Atmosphere, 1: Atmospheric Anomaly / Scrubber Drift"
        ),
        # Model 4: Space Radiation Risk
        "radiation_risk": ModelMetadata(
            domain=HealthDomain.RADIATION,
            model_name="Cumulative Space Radiation Risk Estimator",
            filename="radiation_model.joblib",
            description="Estimates biological risk indices from daily dose equivalent and active flux rates",
            expected_features=["daily_dose_equivalent", "active_flux_rate", "cumulative_dose_career"],
            expected_units={"daily_dose_equivalent": "mSv/day", "active_flux_rate": "particles/cm2/s", "cumulative_dose_career": "mSv"},
            model_version="1.0.0",
            task_type="regression",
            dataset_requirements="Dosimeter telemetry (e.g. Rad-G, TEPC) paired with solar weather and charged particle flux rates",
            target_description="Predicted excess relative biological risk index"
        ),
    }

    @classmethod
    def get_metadata(cls, key: str) -> Optional[ModelMetadata]:
        return cls._registry.get(key)

    @classmethod
    def list_models(cls) -> Dict[str, Dict[str, Any]]:
        return {
            k: {
                "domain": v.domain.value,
                "model_name": v.model_name,
                "filename": v.filename,
                "description": v.description,
                "expected_features": v.expected_features,
                "expected_units": v.expected_units,
                "model_version": v.model_version,
                "task_type": v.task_type,
                "dataset_requirements": v.dataset_requirements,
                "target_description": v.target_description,
            }
            for k, v in cls._registry.items()
        }
