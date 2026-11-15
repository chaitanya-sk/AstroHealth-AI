from typing import List, Dict, Any, Optional, Tuple
import numpy as np
from app.models.health_record import HealthRecord


class TrendService:
    @staticmethod
    def calculate_trend(
        records: List[HealthRecord],
        baseline_value: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Analyze temporal trend across sequential measurements of an indicator.
        Returns: direction ('increasing', 'decreasing', 'stable', 'insufficient_history'),
        slope, mean, std, sample_count, baseline_value, and baseline_deviation_pct.
        """
        if not records:
            return {
                "sample_count": 0,
                "direction": "insufficient_data",
                "slope": 0.0,
                "mean": None,
                "min": None,
                "max": None,
                "std": None,
                "baseline_value": baseline_value,
                "baseline_deviation_pct": None,
            }

        # Sort ascending by timestamp
        sorted_records = sorted(records, key=lambda x: x.timestamp)
        values = [r.value for r in sorted_records]
        n = len(values)

        mean_val = float(np.mean(values))
        std_val = float(np.std(values)) if n > 1 else 0.0
        min_val = float(np.min(values))
        max_val = float(np.max(values))

        # Baseline comparison if baseline provided
        baseline_deviation_pct = None
        if baseline_value is not None and baseline_value > 0:
            latest_val = values[-1]
            baseline_deviation_pct = round(((latest_val - baseline_value) / baseline_value) * 100.0, 2)

        if n < 3:
            return {
                "sample_count": n,
                "direction": "insufficient_history",
                "slope": 0.0,
                "mean": round(mean_val, 3),
                "min": round(min_val, 3),
                "max": round(max_val, 3),
                "std": round(std_val, 3),
                "baseline_value": baseline_value,
                "baseline_deviation_pct": baseline_deviation_pct,
            }

        # Linear regression slope over sample sequence indices
        x = np.arange(n)
        slope, _ = np.polyfit(x, values, 1)

        # Classify slope relative to variability
        threshold = (std_val * 0.1) if std_val > 0 else 0.01
        if slope > threshold:
            direction = "increasing"
        elif slope < -threshold:
            direction = "decreasing"
        else:
            direction = "stable"

        return {
            "sample_count": n,
            "direction": direction,
            "slope": round(float(slope), 4),
            "mean": round(mean_val, 3),
            "min": round(min_val, 3),
            "max": round(max_val, 3),
            "std": round(std_val, 3),
            "baseline_value": baseline_value,
            "baseline_deviation_pct": baseline_deviation_pct,
        }

    @staticmethod
    def detect_sudden_shift(records: List[HealthRecord], threshold_pct: float = 20.0) -> Optional[Dict[str, Any]]:
        """
        Detect sudden acute shift between recent moving average and last reading.
        """
        if len(records) < 4:
            return None

        sorted_records = sorted(records, key=lambda x: x.timestamp)
        past_values = [r.value for r in sorted_records[:-1]]
        latest_value = sorted_records[-1].value

        baseline_mean = float(np.mean(past_values[-5:]))  # last 5 moving window
        if baseline_mean == 0:
            return None

        shift_pct = ((latest_value - baseline_mean) / abs(baseline_mean)) * 100.0
        if abs(shift_pct) >= threshold_pct:
            return {
                "detected": True,
                "shift_pct": round(shift_pct, 2),
                "previous_mean": round(baseline_mean, 2),
                "latest_value": round(latest_value, 2),
                "direction": "spike" if shift_pct > 0 else "drop"
            }
        return None
