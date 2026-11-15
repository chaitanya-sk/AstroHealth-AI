import os
import json
import joblib
from typing import Dict, Any, Optional, Tuple
from app.core.config import settings


class ModelLoader:
    """
    Offline local model artifact and metadata loader.
    Supports .joblib and .pkl files alongside companion .meta.json contracts.
    Never fabricates models, mock weights, or accuracies.
    """
    _cached_models: Dict[str, Any] = {}
    _cached_metadata: Dict[str, Dict[str, Any]] = {}

    @classmethod
    def resolve_model_path(cls, domain: str, model_filename: str) -> Optional[str]:
        # Check domain-specific subdirectory e.g. trained_models/cardiovascular/cardio_model.joblib
        primary_path = os.path.join(settings.TRAINED_MODELS_DIR, domain, model_filename)
        if os.path.exists(primary_path):
            return primary_path

        # Check root trained_models directory e.g. trained_models/cardio_model.joblib
        root_path = os.path.join(settings.TRAINED_MODELS_DIR, model_filename)
        if os.path.exists(root_path):
            return root_path

        return None

    @classmethod
    def load_model(cls, domain: str, model_filename: str) -> Tuple[Optional[Any], Optional[Dict[str, Any]], Optional[str]]:
        """
        Loads local model artifact and optional companion metadata (.meta.json).
        Returns (model_object, metadata_dict, error_message).
        """
        key = f"{domain}/{model_filename}"
        if key in cls._cached_models:
            return cls._cached_models[key], cls._cached_metadata.get(key), None

        model_path = cls.resolve_model_path(domain, model_filename)
        if not model_path:
            return None, None, f"Artifact '{model_filename}' not found in '{settings.TRAINED_MODELS_DIR}'."

        try:
            model = joblib.load(model_path)
            cls._cached_models[key] = model

            # Check for companion metadata JSON file
            meta_path = f"{os.path.splitext(model_path)[0]}.meta.json"
            meta_dict = None
            if os.path.exists(meta_path):
                try:
                    with open(meta_path, "r", encoding="utf-8") as f:
                        meta_dict = json.load(f)
                        cls._cached_metadata[key] = meta_dict
                except Exception as meta_err:
                    print(f"Warning: Failed to parse companion metadata {meta_path}: {meta_err}")

            return model, meta_dict, None
        except Exception as e:
            return None, None, f"Corrupted or invalid model artifact at '{model_path}': {str(e)}"

    @classmethod
    def is_model_available(cls, domain: str, model_filename: str) -> bool:
        return cls.resolve_model_path(domain, model_filename) is not None

    @classmethod
    def clear_cache(cls):
        cls._cached_models.clear()
        cls._cached_metadata.clear()
