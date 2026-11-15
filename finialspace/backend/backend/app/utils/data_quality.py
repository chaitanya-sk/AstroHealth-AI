from typing import Tuple, Dict, Any, Optional
import math
from datetime import datetime, timezone
from app.core.constants import REFERENCE_RANGES, HealthDomain, DataType


def validate_measurement_value(indicator: str, value: float) -> Tuple[bool, Optional[str]]:
    """
    Validate that a measurement is a finite number and check if biological limit is violated.
    Does NOT impose arbitrary restrictions across indicators that lack explicit bounds.
    """
    if math.isnan(value) or math.isinf(value):
        return False, "Measurement value must be a finite number (NaN or Infinity rejected)."

    # Basic physical / physiological boundary limits where well-established
    plausibility_limits = {
        "heart_rate": (20.0, 240.0),
        "systolic_bp": (40.0, 260.0),
        "diastolic_bp": (20.0, 160.0),
        "spo2": (50.0, 100.0),
        "hrv_rmssd": (1.0, 300.0),
        "cabin_co2_pp": (0.0, 30.0),
        "cabin_o2_pp": (50.0, 300.0),
        "cabin_pressure": (50.0, 150.0),
        "cabin_temperature": (5.0, 45.0),
        "cabin_humidity": (0.0, 100.0),
        "sleep_duration_hours": (0.0, 24.0),
        "daily_dose_equivalent": (0.0, 100.0),
        "cumulative_dose_career": (0.0, 2000.0),
    }

    if indicator in plausibility_limits:
        low, high = plausibility_limits[indicator]
        if value < low or value > high:
            return False, f"Value {value} out of plausible physical range ({low} - {high})"
    return True, None


def assess_freshness_hours(timestamp_dt, now_dt=None) -> float:
    """Calculate age of measurement in hours."""
    if now_dt is None:
        now_dt = datetime.utcnow()
    # Normalize naive/aware
    if timestamp_dt.tzinfo is not None:
        timestamp_dt = timestamp_dt.astimezone(timezone.utc).replace(tzinfo=None)
    if now_dt.tzinfo is not None:
        now_dt = now_dt.astimezone(timezone.utc).replace(tzinfo=None)
    delta = now_dt - timestamp_dt
    return max(0.0, delta.total_seconds() / 3600.0)
