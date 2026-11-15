# AstroHealth AI — Backend

AstroHealth AI is an integrated astronaut health monitoring and clinical decision-support platform engineered for long-duration space exploration (Moon, Mars, and Deep Space Transit).

> **System Nature:** Decision-support platform for Flight Surgeons and Astronauts. **Not** an autonomous diagnostic system. Does not prescribe medical treatment or replace mission medical protocols.

---

## Architecture Overview

```
backend/
├── app/
│   ├── main.py                  # FastAPI Application Entrypoint & Middleware
│   ├── core/
│   │   ├── config.py            # Environment & Directory Settings
│   │   └── constants.py         # NASA-STD-3001, PEL Standards & Traceable Citations
│   ├── database/
│   │   ├── base.py              # SQLAlchemy Declarative Base
│   │   └── connection.py        # SQLite Local Connection & Session Dependency
│   ├── models/                  # SQLAlchemy Database Models
│   │   ├── astronaut.py         # Astronaut Profile & Baselines
│   │   ├── health_record.py     # Telemetry with JSON metadata
│   │   ├── alert.py
│   │   └── recommendation.py
│   ├── schemas/                 # Pydantic Schemas & Validation
│   │   ├── astronaut.py
│   │   ├── health.py
│   │   ├── analysis.py          # Phase 3 Rich DomainAssessment & Recommendations
│   │   ├── ml.py                # Phase 4 ML Model Metadata, Inferences, Audits
│   │   └── alert.py
│   ├── api/                     # REST API Endpoints
│   │   ├── astronaut_routes.py  # Crew Management
│   │   ├── health_routes.py     # Telemetry Ingestion & Query
│   │   ├── analysis_routes.py   # Integrated Analysis & ML Inference APIs
│   │   └── alert_routes.py      # Explainable Alerts & Recommendations
│   ├── services/                # Business & Processing Services
│   │   ├── ingestion_service.py # Telemetry Ingestion & Boundary Checking
│   │   ├── trend_service.py     # Time-series Linear Regression & Sudden Shift
│   │   ├── anomaly_service.py   # Baseline & Threshold Anomaly Engine
│   │   ├── recommendation_service.py # Structured Evidence Recommendations
│   │   └── alert_service.py     # Persistent Alert Synchronization
│   ├── analyzers/               # Six Specialized Health Domain Analyzers
│   │   ├── base_analyzer.py     # Data Quality, Freshness, & Observation Base
│   │   ├── immune_analyzer.py   # WBC, CRP, Cortisol, EBV Viral Load
│   │   ├── bone_muscle_analyzer.py # Urinary NTX, Strength Loss, Calf Circumference
│   │   ├── cardiovascular_analyzer.py # HR, BP, SpO2, Autonomic HRV RMSSD
│   │   ├── behavioral_analyzer.py # Sleep Debt, PVT RT & Lapses
│   │   ├── radiation_analyzer.py # Dosimeter mSv/day, Career PEL, Particle Flux
│   │   └── environment_analyzer.py # Cabin CO2, O2, Pressure, Temperature, Humidity
│   ├── intelligence/            # Central Integrated Engine
│   │   ├── health_intelligence.py # 6-Domain Synthesis & Telemetry Freshness
│   │   ├── risk_engine.py       # Cross-Domain Compounding Associations
│   │   └── explanation_engine.py # Transparent Clinical Rationales
│   ├── ml/                      # Phase 4 Machine Learning Framework
│   │   ├── model_loader.py      # Offline Local Model Loader (.joblib, .pkl, companion .meta.json)
│   │   ├── model_registry.py    # Architectural Metadata Registry & Contracts
│   │   ├── predictor.py         # Feature validation, unit checks, & inference execution
│   │   ├── dataset_classifier.py # Biological domain classification & scientific workflow selector
│   │   ├── dataset_inspector.py # CSV Quality & Outlier Inspection Utility
│   │   └── provenance.py        # Dataset Provenance & Biological Lineage Manifests
│   ├── services/
│   │   └── analytics/           # Longitudinal & Cohort Research Services
│   │       ├── dataset_discovery_service.py # Autonomous recursive scan of datasets/raw/
│   │       └── baseline_trajectory_service.py # NASA OSD-575 trajectory & % change analyzer
│   └── utils/
│       ├── timestamps.py        # Standardized UTC Normalization
│       └── data_quality.py      # Biological & Physical Bounds
│
├── datasets/                    # Local Raw/Simulated Data & Provenance Manifests
│   └── templates/               # Standardized Dataset Provenance Templates
├── notebooks/                   # Google Colab Training Notebooks
│   ├── 01_cardiovascular_model_training.ipynb
│   ├── 02_behavioral_fatigue_model_training.ipynb
│   └── 03_environmental_anomaly_model_training.ipynb
├── trained_models/              # Exported ML Model Artifacts (.joblib & .meta.json)
├── tests/                       # Automated Test Suites
│   ├── test_astrohealth_backend.py # Phase 1 integration tests
│   ├── test_phase2_ingestion.py    # Phase 2 database & ingestion verification
│   ├── test_phase3_analysis.py     # Phase 3 health analysis engine verification
│   └── test_phase4_ml.py           # Phase 4 ML infrastructure & contract verification
├── requirements.txt
├── .env.example
└── README.md
```

---

## Phase 4: Machine Learning Infrastructure & Training Pipeline

Phase 4 establishes local, offline machine learning execution capabilities. Models are trained independently in **Google Colab** on approved datasets and deployed to `trained_models/`.

### 1. Approved Model Development Targets

1. **Cardiovascular Autonomic Regulation (`cardiovascular_risk`)**:
   - Predicts autonomic deconditioning and orthostatic intolerance risk from resting vitals and HRV RMSSD.
   - **Dataset Target:** Human resting ECG & arterial pressure from flight crew or $-6^\circ$ Head-Down Tilt (HDT) bed-rest analogues (e.g. NASA LSDA / PhysioNet).
   - **Contract Features:** `heart_rate` (bpm), `systolic_bp` (mmHg), `diastolic_bp` (mmHg), `hrv_rmssd` (ms).

2. **Cognitive Fatigue & Sleep Disruption (`behavioral_fatigue`)**:
   - Estimates performance lapse likelihood from sleep actigraphy and Psychomotor Vigilance Task (PVT) logs.
   - **Dataset Target:** NASA ISS Reaction Self-Test experiment records.
   - **Contract Features:** `sleep_duration_hours` (hours), `pvt_mean_rt` (ms), `pvt_lapses` (count).

3. **Cabin Atmospheric Anomaly (`environmental_anomaly`)**:
   - Detects multi-parameter habitat atmospheric drifts (hypercapnia, depressurization, thermal runaway).
   - **Dataset Target:** Spacecraft Environmental Control and Life Support System (ECLSS) sensor telemetry.
   - **Contract Features:** `cabin_co2_pp` (mmHg), `cabin_o2_pp` (mmHg), `cabin_pressure` (kPa), `cabin_temperature` (C), `cabin_humidity` (%).

4. **Space Radiation Risk (`radiation_risk`)**:
   - Estimates excess biological risk from active dosimeters and space weather telemetry.
   - **Dataset Target:** Vehicle active dosimeter logs paired with charged particle flux rates.
   - **Contract Features:** `daily_dose_equivalent` (mSv/day), `active_flux_rate` (particles/cm2/s), `cumulative_dose_career` (mSv).

*(Note: Immune and Bone/Muscle domains rely primarily on periodic clinical laboratory assays. Models for these domains will only be introduced when validated human spaceflight cohorts are established, avoiding arbitrary labels).*

---

## Dataset Provenance & Quality Inspection

To prevent data leakage and ensure biological validity, datasets are tracked using `DatasetProvenance` and verified using `DatasetInspector`:

```python
from app.ml.provenance import DatasetProvenance
from app.ml.dataset_inspector import DatasetInspector

# Inspect CSV quality, duplicates, and outliers
audit = DatasetInspector.inspect_csv("my_dataset.csv", target_column="target")

# Create and save provenance manifest
prov = DatasetProvenance(
    dataset_name="ISS Crew ECG Analogue",
    original_source="NASA Life Sciences Data Archive (LSDA)",
    download_date="2026-11-14",
    organism_or_population="Human (Flight Crew)",
    mission_or_experiment="Expeditions 50-60",
    number_of_records=1200,
    features=["heart_rate", "systolic_bp", "diastolic_bp", "hrv_rmssd"],
    target_labels=["autonomic_deconditioning_risk"],
    usage_and_access_restrictions="Research Only",
    data_type="RESEARCH"
)
prov.save_manifest("datasets/cardiovascular/")
```

---

## Google Colab Training Workflow

Colab notebooks in `backend/notebooks/`:
- `01_cardiovascular_model_training.ipynb`
- `02_behavioral_fatigue_model_training.ipynb`
- `03_environmental_anomaly_model_training.ipynb`

### Key Steps in Notebooks:
1. **Data Leakage Prevention:** Data is partitioned by `subject_id` (astronaut) rather than random row shuffling.
2. **Evaluation Metrics:** Confusion matrix, Precision, Recall, F1-Score, and ROC-AUC.
3. **Artifact Export:** Models are dumped via `joblib.dump(model, "<model_key>.joblib")` alongside a companion `<model_key>.meta.json` containing verifiable metadata and evaluation scores.

---

## Model Artifact Contract

Every model artifact in `trained_models/` follows this contract:

```json
{
  "model_key": "cardiovascular_risk",
  "model_name": "Cardiovascular Autonomic Regulation Predictor",
  "model_version": "1.0.0",
  "feature_names": ["heart_rate", "systolic_bp", "diastolic_bp", "hrv_rmssd"],
  "expected_units": {
    "heart_rate": "bpm",
    "systolic_bp": "mmHg",
    "diastolic_bp": "mmHg",
    "hrv_rmssd": "ms"
  },
  "training_dataset_source": "NASA LSDA Spaceflight Analogue",
  "training_date": "2026-11-14",
  "algorithm": "GradientBoostingClassifier",
  "evaluation_metrics": {
    "test_f1_score": 0.88,
    "test_roc_auc": 0.92
  },
  "known_limitations": [
    "Ground analogue bed-rest cohort; flight validation recommended.",
    "Requires seated/resting baseline conditions."
  ]
}
```

---

## ML REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analysis/ml/models` | List all registered candidate models, required features, units, and deployment status (`READY` vs `NOT_DEPLOYED`) |
| `GET` | `/api/analysis/ml/models/{model_key}` | Detailed model metadata and input schema contract |
| `POST` | `/api/analysis/ml/predict/{model_key}` | Run offline inference with input feature and unit validation |

### Safe Missing-Model Behavior
If a model artifact has not yet been placed in `trained_models/`, `POST /api/analysis/ml/predict/{model_key}` returns:
```json
{
  "available": false,
  "model_key": "cardiovascular_risk",
  "status": "MODEL_FILE_NOT_FOUND",
  "message": "Artifact 'cardio_model.joblib' not found in '.../trained_models'. Backend continues operating reliably via deterministic aerospace clinical rules."
}
```
*No fake predictions or mocked confidence scores are ever returned.*

---

## Verification & Test Execution

Run the complete test suite from the `backend` directory:

```powershell
# Autonomous Dataset Intelligence & Cohort Verification (Phase 4.5):
python tests/test_dataset_intelligence.py

# Phase 4 ML Infrastructure & Contract Verification:
python tests/test_phase4_ml.py

# Phase 3 Health Analysis Engine Verification:
python tests/test_phase3_analysis.py

# Phase 2 Database & Ingestion Verification:
python tests/test_phase2_ingestion.py

# Phase 1 Integration & Vitals Processing:
python tests/test_astrohealth_backend.py
```

---

## Autonomous Dataset Intelligence & NASA OSD-575 Research Workflow

The backend contains autonomous discovery and classification intelligence for raw scientific research files placed in `datasets/raw/`.

### Scientific Decision Rule: ML Training vs. Baseline Comparison
When a biological dataset is discovered, AstroHealth AI autonomously evaluates sample size ($N$), longitudinal timepoints, and subject metadata:
- **Small Astronaut Cohorts ($N < 10$ subjects, e.g., NASA OSD-575 Inspiration4 with $N=4$):**
  - **Machine Learning Training: REJECTED.** Training supervised or unsupervised models on $N=4$ individuals causes catastrophic overfitting, severe subject-level data leakage, and yields statistically ungeneralizable weights.
  - **Approved Workflow: BASELINE_COMPARISON_AND_LONGITUDINAL_TREND.** Evaluates repeated measures across pre-flight baseline (`L-92`, `L-44`, `L-3`), acute post-flight elevation (`R+1`), and recovery (`R+45`, `R+82`, `R+194`) calculating intra-individual delta shifts ($\Delta\%$) without fabricating training labels.
- **Large Sensor Telemetry Streams ($\ge 500$ observations):**
  - **Machine Learning Training: APPROVED.** Unsupervised Anomaly Detection (`IsolationForest`, `OneClassSVM`) for cabin telemetry and life-support drift.

### Research Endpoints
- `GET /api/analysis/datasets/discover`: Autonomously discovers, classifies domains, and determines scientific workflows for all raw datasets in `datasets/raw/`.
- `GET /api/analysis/research/osd575/cohort`: Returns cohort-wide baseline and recovery shifts (e.g., acute inflammatory flares).
- `GET /api/analysis/research/osd575/participant/{id}`: Returns individual astronaut trajectory across mission timepoints.
