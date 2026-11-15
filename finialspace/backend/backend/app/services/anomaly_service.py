from typing import List, Dict, Any, Optional
import numpy as np
from app.models.health_record import HealthRecord
from app.core.constants import REFERENCE_RANGES, SystemStatus


class AnomalyService:
    @staticmethod
    def evaluate_threshold(indicator: str, value: float) -> Dict[str, Any]:
        """
        Evaluate single value against aerospace reference standards (NASA-STD-3001).
        Maps to REVIEW_REQUIRED, MONITOR, or NORMAL.
        """
        rules = REFERENCE_RANGES.get(indicator)
        if not rules:
            return {
                "status": SystemStatus.NORMAL,
                "reason": "Indicator monitored without established mission boundary violation.",
                "reference_interval": "Aerospace observational range",
            }

        unit = rules.get("unit", "")
        # Check review high / low (Action thresholds)
        review_h = rules.get("review_high", rules.get("action_high"))
        if review_h is not None and value >= review_h:
            return {
                "status": SystemStatus.REVIEW_REQUIRED,
                "reason": f"Value {value} {unit} reaches clinical REVIEW threshold (>= {review_h} {unit})",
                "reference_interval": f"{rules.get('min_normal')} - {rules.get('max_normal')} {unit}",
            }

        review_l = rules.get("review_low", rules.get("action_low"))
        if review_l is not None and value <= review_l:
            return {
                "status": SystemStatus.REVIEW_REQUIRED,
                "reason": f"Value {value} {unit} drops below clinical REVIEW threshold (<= {review_l} {unit})",
                "reference_interval": f"{rules.get('min_normal')} - {rules.get('max_normal')} {unit}",
            }

        # Check monitor high / low (Watch thresholds)
        mon_h = rules.get("monitor_high", rules.get("watch_high"))
        if mon_h is not None and value >= mon_h:
            return {
                "status": SystemStatus.MONITOR,
                "reason": f"Value {value} {unit} exceeds nominal boundary into MONITOR window (>= {mon_h} {unit})",
                "reference_interval": f"{rules.get('min_normal')} - {rules.get('max_normal')} {unit}",
            }

        mon_l = rules.get("monitor_low", rules.get("watch_low"))
        if mon_l is not None and value <= mon_l:
            return {
                "status": SystemStatus.MONITOR,
                "reason": f"Value {value} {unit} drops below nominal boundary into MONITOR window (<= {mon_l} {unit})",
                "reference_interval": f"{rules.get('min_normal')} - {rules.get('max_normal')} {unit}",
            }

        # Check normal floor and ceiling
        min_n = rules.get("min_normal")
        max_n = rules.get("max_normal")
        if min_n is not None and value < min_n:
            return {
                "status": SystemStatus.MONITOR,
                "reason": f"Value {value} {unit} is slightly below normal floor ({min_n} {unit})",
                "reference_interval": f"{min_n} - {max_n} {unit}",
            }
        if max_n is not None and value > max_n:
            return {
                "status": SystemStatus.MONITOR,
                "reason": f"Value {value} {unit} is slightly elevated above normal ceiling ({max_n} {unit})",
                "reference_interval": f"{min_n} - {max_n} {unit}",
            }

        return {
            "status": SystemStatus.NORMAL,
            "reason": f"Measurement {value} {unit} aligns with nominal spaceflight intervals.",
            "reference_interval": f"{min_n} - {max_n} {unit}",
        }

    @staticmethod
    def detect_statistical_outliers(
        records: List[HealthRecord],
        z_threshold: float = 2.5
    ) -> List[Dict[str, Any]]:
        """Flag historical records that deviate strongly from personal telemetry distribution."""
        if len(records) < 5:
            return []
        values = np.array([r.value for r in records])
        mean = float(np.mean(values))
        std = float(np.std(values))
        if std == 0:
            return []

        outliers = []
        for r in records:
            z = abs((r.value - mean) / std)
            if z >= z_threshold:
                outliers.append({
                    "record_id": r.id,
                    "indicator": r.indicator,
                    "value": r.value,
                    "unit": r.unit,
                    "z_score": round(float(z), 2),
                    "timestamp": r.timestamp,
                    "description": f"Z-score outlier (|z| = {round(z, 2)} >= {z_threshold}) relative to crew member personal history."
                })
        return outliers
