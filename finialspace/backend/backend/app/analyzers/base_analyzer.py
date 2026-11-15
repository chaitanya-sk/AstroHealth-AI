from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import math

from app.models.health_record import HealthRecord
from app.models.astronaut import Astronaut
from app.schemas.analysis import (
    DomainAnalysisResult,
    Observation,
    DataQualitySummary,
    IndicatorTrend,
    AnomalyItem,
)
from app.core.constants import HealthDomain, SystemStatus, REFERENCE_RANGES
from app.services.anomaly_service import AnomalyService
from app.services.trend_service import TrendService
from app.services.recommendation_service import RecommendationService
from app.utils.data_quality import assess_freshness_hours


class BaseAnalyzer(ABC):
    domain: HealthDomain

    @abstractmethod
    def analyze(
        self,
        astronaut_id: str,
        records: List[HealthRecord],
        astronaut: Optional[Astronaut] = None,
        data_type_filter: Optional[str] = None
    ) -> DomainAnalysisResult:
        """Analyze health records for this domain and return explainable DomainAnalysisResult."""
        pass

    def _filter_and_validate_records(
        self,
        records: List[HealthRecord],
        data_type_filter: Optional[str] = None
    ) -> Tuple[List[HealthRecord], DataQualitySummary]:
        """
        Filters domain records, validates finite numbers, checks unit consistency,
        tracks data types, and computes indicator-specific freshness.
        """
        now = datetime.utcnow()
        raw_domain_records = [r for r in records if r.domain == self.domain.value]

        if data_type_filter:
            raw_domain_records = [
                r for r in raw_domain_records if r.data_type.lower() == data_type_filter.lower()
            ]

        total_count = len(raw_domain_records)
        valid_records: List[HealthRecord] = []
        non_finite_dropped = 0
        inconsistent_units_dropped = 0
        data_types_set = set()

        for r in raw_domain_records:
            data_types_set.add(r.data_type)
            # 1. Finite check (NaN, Infinity)
            if math.isnan(r.value) or math.isinf(r.value):
                non_finite_dropped += 1
                continue

            # 2. Unit consistency check
            ref_info = REFERENCE_RANGES.get(r.indicator)
            if ref_info and "expected_units" in ref_info:
                clean_unit = r.unit.strip().lower()
                if clean_unit not in ref_info["expected_units"]:
                    inconsistent_units_dropped += 1
                    continue

            valid_records.append(r)

        freshness_hours = None
        freshness_status = "NO_DATA"

        if valid_records:
            latest_ts = max(r.timestamp for r in valid_records)
            freshness_hours = round(assess_freshness_hours(latest_ts, now), 2)

            # Determine freshness against indicator-specific thresholds
            # Default maximum threshold if indicator is unspecified
            max_allowed = 48.0
            for r in valid_records:
                ref = REFERENCE_RANGES.get(r.indicator)
                if ref and "max_freshness_hours" in ref:
                    max_allowed = max(max_allowed, ref["max_freshness_hours"])

            if freshness_hours <= max_allowed:
                freshness_status = "FRESH"
            elif freshness_hours <= (max_allowed * 2.5):
                freshness_status = "STALE"
            else:
                freshness_status = "CRITICALLY_STALE"

        quality_summary = DataQualitySummary(
            is_valid=(len(valid_records) > 0),
            total_records=total_count,
            valid_records=len(valid_records),
            non_finite_dropped=non_finite_dropped,
            inconsistent_units_dropped=inconsistent_units_dropped,
            data_types_present=sorted(list(data_types_set)),
            freshness_hours=freshness_hours,
            freshness_status=freshness_status,
        )

        return valid_records, quality_summary

    def _compute_indicator_trends_and_anomalies(
        self,
        records: List[HealthRecord],
        baselines: Dict[str, float]
    ) -> Tuple[List[IndicatorTrend], List[AnomalyItem], List[Observation]]:
        """
        Groups valid records by indicator, computes trends, detects baseline/threshold anomalies,
        and generates observations.
        """
        by_indicator: Dict[str, List[HealthRecord]] = {}
        for r in sorted(records, key=lambda x: x.timestamp):
            by_indicator.setdefault(r.indicator, []).append(r)

        trends: List[IndicatorTrend] = []
        anomalies: List[AnomalyItem] = []
        observations: List[Observation] = []

        for ind, ind_records in by_indicator.items():
            baseline_val = baselines.get(ind)
            trend_data = TrendService.calculate_trend(ind_records, baseline_value=baseline_val)
            trends.append(
                IndicatorTrend(
                    indicator=ind,
                    direction=trend_data["direction"],
                    slope=trend_data["slope"],
                    sample_count=trend_data["sample_count"],
                    baseline_value=baseline_val,
                    baseline_deviation_pct=trend_data.get("baseline_deviation_pct"),
                    mean=trend_data.get("mean"),
                    std=trend_data.get("std"),
                )
            )

            # Check sudden rate shift
            shift = TrendService.detect_sudden_shift(ind_records, threshold_pct=25.0)
            if shift:
                anomalies.append(
                    AnomalyItem(
                        indicator=ind,
                        anomaly_type="sudden_rate_change",
                        severity="MONITOR",
                        description=f"Sudden {shift['direction']} of {shift['shift_pct']}% from moving average ({shift['previous_mean']} -> {shift['latest_value']}).",
                        value=shift["latest_value"],
                        unit=ind_records[-1].unit,
                    )
                )

            # Check threshold against latest record
            latest_rec = ind_records[-1]
            eval_res = AnomalyService.evaluate_threshold(ind, latest_rec.value)

            if eval_res["status"] in (SystemStatus.MONITOR, SystemStatus.REVIEW_REQUIRED):
                anomalies.append(
                    AnomalyItem(
                        indicator=ind,
                        anomaly_type="threshold_breach",
                        severity=eval_res["status"].value,
                        description=eval_res["reason"],
                        value=latest_rec.value,
                        unit=latest_rec.unit,
                        threshold_reference=eval_res.get("reference_interval"),
                    )
                )

            # Check baseline deviation anomaly (> 25% shift)
            if baseline_val and trend_data.get("baseline_deviation_pct") is not None:
                dev = abs(trend_data["baseline_deviation_pct"])
                if dev >= 25.0:
                    anomalies.append(
                        AnomalyItem(
                            indicator=ind,
                            anomaly_type="baseline_shift",
                            severity="REVIEW_REQUIRED" if dev >= 40.0 else "MONITOR",
                            description=f"Significant baseline deviation ({trend_data['baseline_deviation_pct']}%) relative to pre-flight baseline ({baseline_val}).",
                            value=latest_rec.value,
                            unit=latest_rec.unit,
                            threshold_reference=f"Baseline: {baseline_val}",
                        )
                    )

            observations.append(
                Observation(
                    indicator=ind,
                    measured_value=latest_rec.value,
                    unit=latest_rec.unit,
                    status=eval_res["status"],
                    reference_normal=eval_res.get("reference_interval"),
                    observation_text=eval_res["reason"],
                    confidence=latest_rec.confidence or 1.0,
                )
            )

        return trends, anomalies, observations

    def _determine_aggregate_status(
        self,
        observations: List[Observation],
        quality: DataQualitySummary
    ) -> SystemStatus:
        if not observations or not quality.is_valid:
            return SystemStatus.INSUFFICIENT_DATA

        # If data is critically stale for its indicator class, cannot affirm normal
        if quality.freshness_status == "CRITICALLY_STALE":
            return SystemStatus.INSUFFICIENT_DATA

        statuses = [obs.status for obs in observations]
        if SystemStatus.REVIEW_REQUIRED in statuses:
            return SystemStatus.REVIEW_REQUIRED
        if SystemStatus.MONITOR in statuses:
            return SystemStatus.MONITOR

        # If telemetry is moderately stale, elevate status from NORMAL to MONITOR for verification
        if quality.freshness_status == "STALE":
            return SystemStatus.MONITOR

        return SystemStatus.NORMAL
