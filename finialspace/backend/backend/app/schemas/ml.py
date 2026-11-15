from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ModelInfoResponse(BaseModel):
    model_key: str
    domain: str
    model_name: str
    filename: str
    description: str
    expected_features: List[str]
    expected_units: Dict[str, str]
    model_version: str
    task_type: str
    dataset_requirements: Optional[str] = None
    target_description: Optional[str] = None
    is_available: bool
    status: str  # "READY", "NOT_DEPLOYED"


class ModelPredictRequest(BaseModel):
    features: Dict[str, float]
    units: Optional[Dict[str, str]] = None


class ModelPredictResponse(BaseModel):
    available: bool
    model_key: str
    status: str
    model_name: Optional[str] = None
    model_version: Optional[str] = None
    prediction: Optional[Any] = None
    probabilities: Optional[Any] = None
    score: Optional[Any] = None
    message: Optional[str] = None
    error: Optional[str] = None
    expected_features: Optional[List[str]] = None
    expected_units: Optional[Dict[str, str]] = None
    training_metadata: Optional[Dict[str, Any]] = None


class DatasetAuditResponse(BaseModel):
    file_path: str
    filename: str
    rows: int
    columns: int
    feature_list: List[str]
    missing_values: Dict[str, int]
    missing_pcts: Dict[str, float]
    duplicate_rows: int
    numeric_summary: Dict[str, Any]
    target_analysis: Optional[Dict[str, Any]] = None
    audit_status: str

