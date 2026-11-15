import math
from datetime import datetime
from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field, field_validator, ConfigDict
from app.core.constants import HealthDomain, DataType


class HealthData(BaseModel):
    astronaut_id: str = Field(..., description="Unique alphanumeric identifier of astronaut")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC measurement timestamp")
    domain: HealthDomain = Field(..., description="One of: immune, bone_muscle, cardiovascular, behavioral, radiation, environment")
    indicator: str = Field(..., description="Indicator or biomarker name, e.g. heart_rate, daily_dose_equivalent")
    value: float = Field(..., description="Finite numerical measured value (non-NaN, non-infinite)")
    unit: str = Field(..., description="Measurement unit, e.g. bpm, mSv/day, mmHg")
    source: str = Field(..., description="Source system: wearable, blood_panel, cabin_telemetry, pvt_test")
    data_type: DataType = Field(default=DataType.REAL, description="real, simulated, or research")
    confidence: Optional[float] = Field(default=1.0, ge=0.0, le=1.0, description="Measurement reliability score (0.0 to 1.0)")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Optional structured JSON metadata annotations")

    @field_validator("astronaut_id")
    @classmethod
    def validate_astronaut_id(cls, v: str) -> str:
        clean = v.strip().upper()
        if not clean:
            raise ValueError("astronaut_id cannot be empty")
        return clean

    @field_validator("indicator")
    @classmethod
    def validate_indicator(cls, v: str) -> str:
        clean = v.strip().lower()
        if not clean:
            raise ValueError("indicator cannot be empty")
        return clean

    @field_validator("source")
    @classmethod
    def validate_source(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("source cannot be empty")
        return clean

    @field_validator("unit")
    @classmethod
    def validate_unit(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("unit cannot be empty")
        return clean

    @field_validator("value")
    @classmethod
    def validate_value(cls, v: float) -> float:
        if math.isnan(v) or math.isinf(v):
            raise ValueError("Measurement value must be a finite numeric value (NaN and infinity are rejected)")
        return v

    @field_validator("confidence")
    @classmethod
    def validate_confidence(cls, v: Optional[float]) -> Optional[float]:
        if v is not None:
            if math.isnan(v) or math.isinf(v) or v < 0.0 or v > 1.0:
                raise ValueError("confidence must be between 0.0 and 1.0")
        return v

    model_config = ConfigDict(from_attributes=True)


class HealthRecordResponse(BaseModel):
    id: int
    astronaut_id: str
    timestamp: datetime
    domain: HealthDomain
    indicator: str
    value: float
    unit: str
    source: str
    data_type: DataType
    confidence: Optional[float] = 1.0
    metadata: Optional[Dict[str, Any]] = Field(default=None, validation_alias="extra_metadata")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class BatchIngestRequest(BaseModel):
    records: List[HealthData]


class BatchIngestResponse(BaseModel):
    inserted_count: int
    data_type: DataType
    message: str


class ValidationErrorDetail(BaseModel):
    loc: List[Union[str, int]]
    msg: str
    type: str


class HTTPValidationErrorResponse(BaseModel):
    detail: List[ValidationErrorDetail]
