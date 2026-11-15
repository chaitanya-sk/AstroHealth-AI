from typing import Dict, Any, Optional
import numpy as np
import pandas as pd
import math
from app.ml.model_loader import ModelLoader
from app.ml.model_registry import ModelRegistry


class Predictor:
    """
    Robust ML inference pipeline:
    - Input feature and finite numeric validation.
    - Expected unit validation.
    - Safe execution without fabricating mock predictions or fake accuracies.
    - Outputs model version, evaluation metrics, and clear warnings when offline models are missing.
    """
    @staticmethod
    def predict(
        model_key: str,
        feature_dict: Dict[str, float],
        units_dict: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        metadata = ModelRegistry.get_metadata(model_key)
        if not metadata:
            return {
                "available": False,
                "model_key": model_key,
                "status": "UNREGISTERED_MODEL",
                "message": f"Model key '{model_key}' is not registered in ModelRegistry.",
                "prediction": None,
                "probabilities": None,
            }

        domain_str = metadata.domain.value.lower()
        model, companion_meta, err_msg = ModelLoader.load_model(domain_str, metadata.filename)

        if model is None:
            return {
                "available": False,
                "model_key": model_key,
                "model_name": metadata.model_name,
                "model_version": metadata.model_version,
                "filename": metadata.filename,
                "status": "MODEL_FILE_NOT_FOUND" if "not found" in (err_msg or "") else "MODEL_LOAD_ERROR",
                "message": err_msg or f"ML artifact '{metadata.filename}' is not deployed. Backend continues operating reliably via deterministic aerospace clinical rules.",
                "expected_features": metadata.expected_features,
                "expected_units": metadata.expected_units,
                "prediction": None,
                "probabilities": None,
            }

        # 1. Missing feature validation
        missing_features = [f for f in metadata.expected_features if f not in feature_dict]
        if missing_features:
            return {
                "available": True,
                "model_key": model_key,
                "status": "VALIDATION_ERROR",
                "error": f"Missing expected input features: {missing_features}",
                "expected_features": metadata.expected_features,
                "prediction": None,
            }

        # 2. Finite value validation (reject NaN or Inf)
        non_finite_features = {}
        for f in metadata.expected_features:
            val = feature_dict[f]
            if not isinstance(val, (int, float)) or math.isnan(val) or math.isinf(val):
                non_finite_features[f] = str(val)

        if non_finite_features:
            return {
                "available": True,
                "model_key": model_key,
                "status": "VALIDATION_ERROR",
                "error": f"Non-finite or invalid numeric values provided for features: {non_finite_features}",
                "prediction": None,
            }

        # 3. Unit validation if units provided
        if units_dict:
            mismatched_units = {}
            for f, expected_unit in metadata.expected_units.items():
                if f in units_dict:
                    provided = units_dict[f].strip().lower()
                    if provided != expected_unit.strip().lower():
                        mismatched_units[f] = f"Provided: '{units_dict[f]}', Expected: '{expected_unit}'"
            if mismatched_units:
                return {
                    "available": True,
                    "model_key": model_key,
                    "status": "UNIT_MISMATCH",
                    "error": f"Unit mismatches detected: {mismatched_units}",
                    "expected_units": metadata.expected_units,
                    "prediction": None,
                }

        # 4. Form canonical feature DataFrame with names to match fitted model
        feature_df = pd.DataFrame([{f: float(feature_dict[f]) for f in metadata.expected_features}])

        # 5. Execute inference
        try:
            prediction_raw = model.predict(feature_df)
            probabilities = None
            if hasattr(model, "predict_proba"):
                try:
                    prob_raw = model.predict_proba(feature_df)
                    probabilities = prob_raw.tolist()
                except Exception:
                    probabilities = None

            score = None
            if hasattr(model, "score_samples"):
                try:
                    scores_raw = model.score_samples(feature_df)
                    score = [round(float(s), 4) for s in scores_raw]
                except Exception:
                    score = None
            elif hasattr(model, "decision_function"):
                try:
                    dfunc_raw = model.decision_function(feature_df)
                    score = [round(float(s), 4) for s in dfunc_raw]
                except Exception:
                    score = None

            pred_val = prediction_raw.tolist() if hasattr(prediction_raw, "tolist") else prediction_raw

            return {
                "available": True,
                "model_key": model_key,
                "model_name": metadata.model_name,
                "model_version": companion_meta.get("model_version", metadata.model_version) if companion_meta else metadata.model_version,
                "status": "SUCCESS",
                "prediction": pred_val,
                "probabilities": probabilities,
                "score": score,
                "training_metadata": companion_meta,
                "message": "Prediction generated successfully using trained offline model artifact.",
            }
        except Exception as e:
            return {
                "available": True,
                "model_key": model_key,
                "status": "INFERENCE_FAILURE",
                "error": f"Model inference execution failed: {str(e)}",
                "prediction": None,
                "score": None,
            }
