import os
import json

def make_cell(cell_type, text):
    lines = [line + "\n" for line in text.split("\n")]
    if lines and lines[-1] == "\n":
        lines[-1] = ""
    # Ensure standard line endings for ipynb
    source = [l if idx == len(lines)-1 and not l.endswith("\n") else l for idx, l in enumerate(lines)]
    if cell_type == "markdown":
        return {
            "cell_type": "markdown",
            "metadata": {},
            "source": lines
        }
    else:
        return {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": lines
        }

m0 = """# AstroHealth AI — Cardiovascular HRV Anomaly Detection Model Training (MVP)
**Candidate Algorithm:** `IsolationForest`  
**Registered Model Key:** `cardiovascular_hrv_anomaly`  
**Target Artifacts:** `hrv_anomaly_model.joblib` & `hrv_anomaly_model.meta.json`  
**Dataset Source:** MMASH Research Dataset (22 Terrestrial Subjects, 5-Minute Sliding Windows)  
**Task Type:** Unsupervised Autonomic Outlier / Telemetry Anomaly Detection  

---

### Scientific & Operational Disclaimers:
1. **Unsupervised Anomaly Detection:** Anomaly scores represent statistical distance/rarity relative to the terrestrial training distribution. **They are NOT disease probabilities or clinical diagnoses.**
2. **Terrestrial Ground Cohort:** MMASH participants are young, healthy terrestrial volunteers (1g environment). **No astronaut microgravity clinical validation is claimed.**
3. **Participant-Grouped Evaluation:** All cross-validation and hyperparameter tuning MUST partition by participant (`GroupKFold` / Leave-One-Participant-Out) to prevent temporal data leakage from overlapping 5-minute sliding windows."""

c1 = """# Cell 1: Environment & Dependencies
import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.preprocessing import RobustScaler, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GroupKFold, LeaveOneGroupOut

# Plotting settings
sns.set_theme(style="whitegrid")
plt.rcParams["figure.figsize"] = (10, 6)
print("Environment initialized successfully.")"""

m2 = """### 1. Load Processed Cardiovascular HRV Dataset
Upload `mmash_hrv_windows.csv` from your local AstroHealth AI repository (`datasets/processed/cardiovascular/`) into Google Colab.
- **Expected Total Windows:** 22,492
- **Features:** `heart_rate`, `hrv_rmssd`, `hrv_sdnn`, `pnn50`
- **Grouping Column:** `participant_id` (22 unique subjects)"""

c3 = """# Cell 2: Data Loading & Verification
data_path = "mmash_hrv_windows.csv"

# In Google Colab, you can upload directly via:
# from google.colab import files
# uploaded = files.upload()

if not os.path.exists(data_path):
    print(f"[!] '{data_path}' not found. Please upload 'mmash_hrv_windows.csv' to the Colab working directory.")
else:
    df = pd.read_csv(data_path)
    print(f"Loaded dataset: {len(df)} rows, {len(df.columns)} columns.")
    print("Unique participants:", df["participant_id"].nunique())
    print("Participant IDs:", sorted(df["participant_id"].unique().tolist()))
    print("\\nFirst 3 rows:")
    display(df.head(3))"""

m4 = """### 2. Feature Distributions & Correlation Analysis
Inspect the distributions of the 4 core time-domain HRV features:
- `heart_rate` (bpm) — $60000 / \\text{Mean NN}$
- `hrv_rmssd` (ms) — root mean square of successive RR differences
- `hrv_sdnn` (ms) — standard deviation of normal RR intervals
- `pnn50` (%) — percentage of successive interval differences exceeding 50ms"""

c5 = """# Cell 3: Distribution Summary & Correlation
features = ["heart_rate", "hrv_rmssd", "hrv_sdnn", "pnn50"]

print("--- Summary Statistics ---")
display(df[features].describe().round(2))

# Check for non-finite values
print("\\nMissing/Non-finite counts:")
print(df[features].isna().sum())

# Plot Correlation Matrix and Boxplots
fig, ax = plt.subplots(1, 2, figsize=(14, 5))
corr = df[features].corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", vmin=-1, vmax=1, fmt=".2f", ax=ax[0])
ax[0].set_title("Feature Correlation Matrix")

df[features].boxplot(ax=ax[1])
ax[1].set_title("Feature Distributions (Raw Scale)")
plt.tight_layout()
plt.show()"""

m6 = """### 3. Subject-Stratified / Participant-Grouped Validation Strategy
**Why random k-fold is scientifically invalid:**
- Overlapping 5-minute sliding windows (300s window, 60s step) from the same participant share 80% of beat intervals with adjacent windows.
- Random splitting leaks identical autonomic states into the test fold, producing artificially stable scores.
- **Protocol:** `GroupKFold(n_splits=5)` with `groups=df['participant_id']`. Preprocessing (`RobustScaler`) is fitted strictly on the training participants within each fold."""

c7 = """# Cell 4: GroupKFold Evaluation of IsolationForest
X = df[features].copy()
groups = df["participant_id"].values

# Candidate hyperparameters to evaluate
n_estimators_list = [100, 200]
contamination_candidates = [0.01, 0.02, 0.05]  # Experimental threshold settings
gkf = GroupKFold(n_splits=5)

results = []

for contamination in contamination_candidates:
    for n_est in n_estimators_list:
        fold_anomaly_pcts = []
        score_std_list = []
        
        for fold, (train_idx, val_idx) in enumerate(gkf.split(X, groups=groups)):
            X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
            
            # Preprocessing fitted strictly on train fold
            scaler = RobustScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_val_scaled = scaler.transform(X_val)
            
            # Fit IsolationForest on training participants
            iso = IsolationForest(
                n_estimators=n_est,
                max_samples="auto",
                contamination=contamination,
                random_state=42 + fold,
                n_jobs=-1
            )
            iso.fit(X_train_scaled)
            
            # Evaluate on held-out validation participants
            val_preds = iso.predict(X_val_scaled)  # 1 for nominal, -1 for anomaly
            val_scores = iso.score_samples(X_val_scaled)
            
            anomaly_pct = (val_preds == -1).mean() * 100.0
            fold_anomaly_pcts.append(anomaly_pct)
            score_std_list.append(val_scores.std())
            
        results.append({
            "n_estimators": n_est,
            "contamination": contamination,
            "mean_val_anomaly_pct": round(float(np.mean(fold_anomaly_pcts)), 2),
            "std_val_anomaly_pct": round(float(np.std(fold_anomaly_pcts)), 2),
            "mean_score_std": round(float(np.mean(score_std_list)), 4)
        })

df_cv = pd.DataFrame(results)
print("=== GroupKFold (5-Fold Participant-Level) Cross-Validation Results ===")
display(df_cv)"""

m8 = """### 4. Comparison with Local Outlier Factor (LOF)
To ensure algorithmic stability, we compare IsolationForest against an alternative density-based unsupervised detector: `LocalOutlierFactor` with `novelty=True`."""

c9 = """# Cell 5: Benchmark IsolationForest vs. LocalOutlierFactor
scaler = RobustScaler()
X_scaled = scaler.fit_transform(X)

# Fit candidate IsolationForest
iso_full = IsolationForest(n_estimators=200, contamination=0.02, random_state=42, n_jobs=-1)
iso_preds = iso_full.fit_predict(X_scaled)

# Fit candidate LOF
lof_full = LocalOutlierFactor(n_neighbors=30, contamination=0.02, novelty=True)
lof_full.fit(X_scaled)
lof_preds = lof_full.predict(X_scaled)

agreement = (iso_preds == lof_preds).mean() * 100.0
print(f"Agreement between IsolationForest and LocalOutlierFactor: {agreement:.2f}%")

contingency = pd.crosstab(
    pd.Series(iso_preds, name="IsolationForest"),
    pd.Series(lof_preds, name="LocalOutlierFactor")
)
print("\\nContingency Table (1: Nominal, -1: Outlier):")
display(contingency)"""

m10 = """### 5. Train Final Production Pipeline & Export Artifacts
We train the final pipeline using a scikit-learn `Pipeline([('scaler', RobustScaler()), ('detector', IsolationForest(...))])`.
This packages feature scaling directly inside the estimator artifact to guarantee deterministic preprocessing at inference time.

**Expected Export Artifacts:**
1. `hrv_anomaly_model.joblib`: The serialized scikit-learn Pipeline.
2. `hrv_anomaly_model.meta.json`: The companion metadata matching AstroHealth AI `ModelRegistry`."""

c11 = """# Cell 6: Train Production Pipeline and Export
final_contamination = 0.02  # Experimental baseline threshold
final_n_estimators = 200

final_pipeline = Pipeline([
    ("scaler", RobustScaler()),
    ("detector", IsolationForest(
        n_estimators=final_n_estimators,
        max_samples="auto",
        contamination=final_contamination,
        random_state=42,
        n_jobs=-1
    ))
])

# Fit on the full verified 22-participant dataset
final_pipeline.fit(df[features])
print("Final Pipeline fitted successfully on full MMASH feature dataset.")

# Test prediction contract
test_sample = pd.DataFrame([{
    "heart_rate": 72.0,
    "hrv_rmssd": 45.0,
    "hrv_sdnn": 60.0,
    "pnn50": 20.0
}])
sample_pred = final_pipeline.predict(test_sample)[0]
sample_score = final_pipeline.named_steps["detector"].score_samples(
    final_pipeline.named_steps["scaler"].transform(test_sample)
)[0]
print(f"Verification Test: Sample Prediction={sample_pred} (1=Nominal, -1=Outlier), Raw Score={sample_score:.4f}")

# Export model artifact
export_model_path = "hrv_anomaly_model.joblib"
joblib.dump(final_pipeline, export_model_path)
print(f"[OK] Exported model artifact: {export_model_path}")

# Export companion metadata contract matching backend ModelRegistry
metadata_contract = {
    "model_key": "cardiovascular_hrv_anomaly",
    "model_name": "Autonomic HRV Anomaly Detector (MVP)",
    "model_version": "1.0.0",
    "filename": "hrv_anomaly_model.joblib",
    "task_type": "anomaly_detection",
    "domain": "cardiovascular",
    "feature_names": features,
    "expected_units": {
        "heart_rate": "bpm",
        "hrv_rmssd": "ms",
        "hrv_sdnn": "ms",
        "pnn50": "%"
    },
    "training_dataset_source": "MMASH (Multilevel Monitoring of Activity and Sleep in Healthy people)",
    "training_cohort": {
        "cohort_type": "terrestrial_healthy_volunteers",
        "participants_count": int(df["participant_id"].nunique()),
        "total_windows": int(len(df)),
        "environment": "Earth 1g",
        "window_length_sec": 300,
        "window_step_sec": 60
    },
    "algorithm": "IsolationForest",
    "hyperparameters": {
        "n_estimators": final_n_estimators,
        "max_samples": "auto",
        "contamination": final_contamination,
        "preprocessing": "RobustScaler",
        "random_state": 42
    },
    "evaluation_strategy": {
        "method": "GroupKFold (5 splits grouped by participant_id)",
        "mean_validation_anomaly_rate": f"{df_cv.loc[df_cv['contamination'] == final_contamination, 'mean_val_anomaly_pct'].values[0]}%",
        "std_validation_anomaly_rate": f"{df_cv.loc[df_cv['contamination'] == final_contamination, 'std_val_anomaly_pct'].values[0]}%"
    },
    "target_description": "1: Nominal Autonomic Tone, -1: Autonomic Outlier / Telemetry Anomaly",
    "known_limitations": [
        "Trained exclusively on 22 young healthy terrestrial subjects in 1g.",
        "Not validated against microgravity fluid shifts or inflight spaceflight cardiovascular telemetry.",
        "Unsupervised anomaly score represents statistical distance from terrestrial baseline, NOT disease diagnosis or clinical etiology.",
        "Contamination parameter is an experimental threshold, not a verified clinical incidence rate."
    ]
}

export_meta_path = "hrv_anomaly_model.meta.json"
with open(export_meta_path, "w", encoding="utf-8") as f:
    json.dump(metadata_contract, f, indent=2)
print(f"[OK] Exported companion metadata: {export_meta_path}")"""

m12 = """### 6. Deployment Instructions into AstroHealth AI Backend
Once the notebook completes in Google Colab:
1. Download `hrv_anomaly_model.joblib` and `hrv_anomaly_model.meta.json`.
2. Place both files in your local backend repository at:
   `D:\\nasa\\backend\\trained_models\\cardiovascular\\` (or `trained_models\\`).
3. Verify backend integration:
   ```bash
   cd D:\\nasa\\backend
   python -m pytest tests/test_phase4_ml.py -v
   python -m pytest tests/ -v
   ```
4. The AstroHealth AI `Predictor.predict('cardiovascular_hrv_anomaly', ...)` endpoint will automatically discover, load, and validate the model artifact without mock fallbacks!"""

cells = [
    make_cell("markdown", m0),
    make_cell("code", c1),
    make_cell("markdown", m2),
    make_cell("code", c3),
    make_cell("markdown", m4),
    make_cell("code", c5),
    make_cell("markdown", m6),
    make_cell("code", c7),
    make_cell("markdown", m8),
    make_cell("code", c9),
    make_cell("markdown", m10),
    make_cell("code", c11),
    make_cell("markdown", m12)
]

notebook_json = {
    "cells": cells,
    "metadata": {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "codemirror_mode": {"name": "ipython", "version": 3},
            "file_extension": ".py",
            "mimetype": "text/x-python",
            "name": "python",
            "nbconvert_exporter": "python",
            "pygments_lexer": "ipython3",
            "version": "3.10.0"
        }
    },
    "nbformat": 4,
    "nbformat_minor": 2
}

target_path = os.path.join("notebooks", "01_cardiovascular_model_training.ipynb")
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(notebook_json, f, indent=2)

print(f"Successfully generated {target_path} with {len(cells)} cells.")
