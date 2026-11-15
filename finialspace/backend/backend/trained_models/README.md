# AstroHealth AI — Trained Machine Learning Models

Place trained and exported Scikit-learn or model artifacts here (e.g. `.joblib`, `.pkl`).

## Directory Organization

- `immune/`: Pre-trained models for immunological risk indicators (e.g., cytokine flare predictions).
- `bone_muscle/`: Predictors for bone mineral density loss or muscle atrophy rates.
- `cardiovascular/`: Autonomic regulation, orthostatic intolerance, or arrhythmia predictors.
- `behavioral/`: Cognitive workload and sleep/circadian disruption predictors.
- `radiation/`: Cumulative dose trajectory and biodosimetry risk estimators.
- `environment/`: Cabin air quality & environmental anomaly predictors.

## Model Contract

1. Models are loaded dynamically via `app.ml.model_loader.ModelLoader`.
2. Missing models are handled gracefully — the backend defaults to deterministic baseline rule checks and explains that ML inference is unavailable.
3. No fake accuracies or mock weights are committed.

