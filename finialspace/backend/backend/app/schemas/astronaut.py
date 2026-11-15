from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, field_validator, ConfigDict


class AstronautBase(BaseModel):
    astronaut_id: str = Field(..., description="Unique ID e.g. ASTRO-01")
    name: str = Field(..., description="Full name or display_name")
    mission_id: Optional[str] = Field(None, description="Mission designation e.g. ARTEMIS-V")
    mission_start_date: Optional[date] = Field(None, description="Start date of mission")
    role: Optional[str] = Field(None, description="Commander, Flight Engineer, Science Specialist, Medical Officer")
    mission_day: Optional[int] = Field(1, description="Day into long-duration mission")
    blood_type: Optional[str] = Field(None, description="Blood type e.g. O+, A-")
    resting_hr_baseline: Optional[float] = Field(None, description="Pre-flight baseline resting heart rate (bpm)")
    resting_bp_sys_baseline: Optional[float] = Field(None, description="Pre-flight baseline resting systolic BP (mmHg)")
    resting_bp_dia_baseline: Optional[float] = Field(None, description="Pre-flight baseline resting diastolic BP (mmHg)")

    @field_validator("astronaut_id")
    @classmethod
    def validate_astronaut_id(cls, v: str) -> str:
        clean = v.strip().upper()
        if not clean:
            raise ValueError("astronaut_id cannot be empty")
        return clean

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("name cannot be empty")
        return clean


class AstronautCreate(AstronautBase):
    pass


class AstronautUpdate(BaseModel):
    name: Optional[str] = None
    mission_id: Optional[str] = None
    mission_start_date: Optional[date] = None
    role: Optional[str] = None
    mission_day: Optional[int] = None
    blood_type: Optional[str] = None
    resting_hr_baseline: Optional[float] = None
    resting_bp_sys_baseline: Optional[float] = None
    resting_bp_dia_baseline: Optional[float] = None


class AstronautResponse(AstronautBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
