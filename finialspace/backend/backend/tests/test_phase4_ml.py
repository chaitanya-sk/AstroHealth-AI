import sys
import os
import json
import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.ml.model_registry import ModelRegistry
from app.ml.model_loader import ModelLoader
from app.ml.predictor import Predictor
from app.ml.dataset_inspector import DatasetInspector
from app.ml.provenance import DatasetProvenance
from app.core.config import settings
from app.schemas.ml import ModelPredictRequest
from app.core.constants import HealthDomain


def test_model_registry_integrity():
    models = ModelRegistry.list_models()
    assert "cardiovascular_risk" in models
    assert "behavioral_fatigue" in models
    assert "environmental_anomaly" in models
    assert "radiation_risk" in models

    # Check each registered metadata has expected properties
    for k, info in models.items():
        assert len(info["expected_features"]) > 0
        assert len(info["expected_units"]) == len(info["expected_features"])
        assert info["model_version"] is not None
        assert info["dataset_requirements"] is not None


def test_missing_model_graceful_handling():
    ModelLoader.clear_cache()
    # Predict with missing model
    res = Predictor.predict(
        "cardiovascular_risk",
        {"heart_rate": 75.0, "systolic_bp": 120.0, "diastolic_bp": 80.0, "hrv_rmssd": 50.0}
    )
    assert res["available"] is False
    assert res["status"] in ("MODEL_FILE_NOT_FOUND", "MODEL_LOAD_ERROR")
    assert "trained_models" in res["message"] or "not found" in res["message"]


def test_invalid_and_missing_features():
    # 1. Missing feature
    res_missing = Predictor.predict(
        "cardiovascular_risk",
        {"heart_rate": 75.0, "systolic_bp": 120.0}  # missing diastolic_bp & hrv_rmssd
    )
    # Even when file is missing, Predictor reports missing file first.
    # Now let's test input validation with an in-memory trained mock test model:
    test_dir = os.path.join(settings.TRAINED_MODELS_DIR, "cardiovascular")
    os.makedirs(test_dir, exist_ok=True)
    test_model_file = os.path.join(test_dir, "test_cardio_model.joblib")

    # Fit a simple model for testing the inference pipeline
    X = np.array([[60, 110, 70, 50], [120, 150, 95, 15]])
    y = np.array([0, 1])
    clf = LogisticRegression()
    clf.fit(X, y)
    joblib.dump(clf, test_model_file)

    # Temporarily override registry filename
    orig_meta = ModelRegistry.get_metadata("cardiovascular_risk")
    orig_filename = orig_meta.filename
    orig_meta.filename = "test_cardio_model.joblib"
    ModelLoader.clear_cache()

    try:
        # Test missing feature validation
        res_feat_missing = Predictor.predict(
            "cardiovascular_risk",
            {"heart_rate": 75.0, "systolic_bp": 120.0}  # missing 2 features
        )
        assert res_feat_missing["status"] == "VALIDATION_ERROR"
        assert "Missing expected input features" in res_feat_missing["error"]

        # Test NaN numeric validation
        res_nan = Predictor.predict(
            "cardiovascular_risk",
            {"heart_rate": float("nan"), "systolic_bp": 120.0, "diastolic_bp": 80.0, "hrv_rmssd": 45.0}
        )
        assert res_nan["status"] == "VALIDATION_ERROR"
        assert "Non-finite or invalid" in res_nan["error"]

        # Test unit validation
        res_unit = Predictor.predict(
            "cardiovascular_risk",
            {"heart_rate": 75.0, "systolic_bp": 120.0, "diastolic_bp": 80.0, "hrv_rmssd": 45.0},
            units_dict={"heart_rate": "invalid_unit", "systolic_bp": "mmHg"}
        )
        assert res_unit["status"] == "UNIT_MISMATCH"

        # Test successful prediction
        res_valid = Predictor.predict(
            "cardiovascular_risk",
            {"heart_rate": 72.0, "systolic_bp": 118.0, "diastolic_bp": 76.0, "hrv_rmssd": 52.0},
            units_dict={"heart_rate": "bpm", "systolic_bp": "mmHg", "diastolic_bp": "mmHg", "hrv_rmssd": "ms"}
        )
        assert res_valid["available"] is True
        assert res_valid["status"] == "SUCCESS"
        assert res_valid["prediction"] is not None

    finally:
        orig_meta.filename = orig_filename
        ModelLoader.clear_cache()
        if os.path.exists(test_model_file):
            os.remove(test_model_file)
        if os.path.exists(test_dir):
            try:
                os.rmdir(test_dir)
            except Exception:
                pass


def test_dataset_inspector_and_provenance():
    # Create temporary CSV
    tmp_csv = "temp_test_dataset.csv"
    with open(tmp_csv, "w", encoding="utf-8") as f:
        f.write("subject_id,heart_rate,systolic_bp,risk_label\n")
        f.write("S1,70,115,0\n")
        f.write("S2,85,130,0\n")
        f.write("S3,125,160,1\n")
        f.write("S3,125,160,1\n")  # duplicate

    try:
        audit = DatasetInspector.inspect_csv(tmp_csv, target_column="risk_label")
        assert audit["rows"] == 4
        assert audit["columns"] == 4
        assert audit["duplicate_rows"] == 1
        assert "heart_rate" in audit["numeric_summary"]
        assert audit["target_analysis"]["unique_values"] == 2

        # Test Provenance manifest save/load
        prov = DatasetProvenance(
            dataset_name="Test Dataset",
            original_source="NASA Test Source",
            download_date="2026-11-14",
            organism_or_population="Human",
            mission_or_experiment="Expedition Test",
            number_of_records=4,
            features=["heart_rate", "systolic_bp"],
            target_labels=["risk_label"],
            usage_and_access_restrictions="Open Test",
            data_type="RESEARCH"
        )
        manifest_path = prov.save_manifest(".", "temp_manifest.json")
        loaded_prov = DatasetProvenance.load_manifest(manifest_path)
        assert loaded_prov.dataset_name == "Test Dataset"

    finally:
        if os.path.exists(tmp_csv):
            os.remove(tmp_csv)
        if os.path.exists("temp_manifest.json"):
            os.remove("temp_manifest.json")


def test_ml_api_routes():
    from app.api.analysis_routes import list_registered_models, get_model_metadata, run_model_prediction

    # 1. List models
    models = list_registered_models()
    assert len(models) >= 4
    keys = [m.model_key for m in models]
    assert "cardiovascular_risk" in keys
    assert "environmental_anomaly" in keys

    # 2. Get specific model metadata
    cardio_meta = get_model_metadata("cardiovascular_risk")
    assert cardio_meta.model_name == "Cardiovascular Autonomic Regulation Predictor"
    assert "heart_rate" in cardio_meta.expected_features

    # 3. Predict via route (model missing -> graceful diagnosis)
    pred_res = run_model_prediction(
        "cardiovascular_risk",
        ModelPredictRequest(
            features={"heart_rate": 72.0, "systolic_bp": 115.0, "diastolic_bp": 75.0, "hrv_rmssd": 45.0}
        )
    )
    assert pred_res.available is False
    assert pred_res.status == "MODEL_FILE_NOT_FOUND"


if __name__ == "__main__":
    print("==================================================")
    print("ASTROHEALTH AI — PHASE 4: ML INFRASTRUCTURE TESTS")
    print("==================================================")
    test_model_registry_integrity()
    print("1. [PASS] Model Registry Completeness & Feature Contracts")
    test_missing_model_graceful_handling()
    print("2. [PASS] Missing Model Graceful Degradation")
    test_invalid_and_missing_features()
    print("3. [PASS] Feature Completeness, Finite Check, and Unit Validation")
    test_dataset_inspector_and_provenance()
    print("4. [PASS] Dataset Quality Inspector & Provenance Manifest")
    test_ml_api_routes()
    print("5. [PASS] ML API Routes & Schema Contracts")
    print("==================================================")
    print("ALL 5 PHASE 4 ML TEST SUITES PASSED SUCCESSFULLY!")
    print("==================================================")
