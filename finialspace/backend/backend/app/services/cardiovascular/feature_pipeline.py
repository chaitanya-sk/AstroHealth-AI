import os
import json
from typing import Dict, Any, List, Optional, Tuple
import pandas as pd
import numpy as np

from app.core.config import settings


class CardiovascularFeaturePipeline:
    """
    Reusable Preprocessing and Feature Extraction Pipeline for Continuous ECG RR Intervals.
    Converts raw beat-to-beat intervals into standard 5-minute sliding or non-overlapping
    HRV windows with strict recording gap detection and quality audits.
    """

    PROCESSING_VERSION = "1.0.0"
    DEFAULT_MIN_INTERVAL_SEC = 0.30  # Candidate threshold (200 bpm equivalent)
    DEFAULT_MAX_INTERVAL_SEC = 2.00  # Candidate threshold (30 bpm equivalent)
    DEFAULT_WINDOW_SEC = 300         # 5 minutes in seconds
    DEFAULT_STEP_SEC = 60            # 60-second sliding step (or 300 for non-overlapping)
    DEFAULT_MIN_INTERVALS_PER_WINDOW = 100  # Minimum beat count for reliable short-term HRV
    DEFAULT_MAX_GAP_SEC = 5.0        # Recording gap threshold causing window split/rejection

    @classmethod
    def filter_and_audit_rr(
        cls,
        df_rr: pd.DataFrame,
        min_sec: float = DEFAULT_MIN_INTERVAL_SEC,
        max_sec: float = DEFAULT_MAX_INTERVAL_SEC,
        max_gap_sec: float = DEFAULT_MAX_GAP_SEC
    ) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """
        Filters raw RR intervals based on candidate physiological plausibility criteria.
        Records every rejected interval with its reason, distinguishing physiological outliers from recording gaps.
        Preserves original records without silently interpolating.
        """
        raw_count = len(df_rr)
        if raw_count == 0:
            return pd.DataFrame(), {
                "total_raw": 0,
                "retained_count": 0,
                "retained_pct": 0.0,
                "rejected_count": 0,
                "rejected_pct": 0.0,
                "rejection_reasons": {}
            }

        ibi = df_rr["ibi_s"].values
        reasons = []
        valid_mask = np.ones(raw_count, dtype=bool)

        too_short_count = 0
        too_long_count = 0
        gap_count = 0
        invalid_num_count = 0

        for i, val in enumerate(ibi):
            if pd.isna(val) or np.isinf(val) or val <= 0:
                valid_mask[i] = False
                invalid_num_count += 1
                reasons.append("NON_NUMERIC_OR_NON_POSITIVE")
            elif val > max_gap_sec:
                valid_mask[i] = False
                gap_count += 1
                reasons.append(f"RECORDING_GAP_EXCEEDS_{max_gap_sec}S")
            elif val > max_sec:
                valid_mask[i] = False
                too_long_count += 1
                reasons.append(f"PHYSIOLOGICAL_UPPER_BOUND_EXCEEDED_{max_sec}S")
            elif val < min_sec:
                valid_mask[i] = False
                too_short_count += 1
                reasons.append(f"PHYSIOLOGICAL_LOWER_BOUND_SUB_{min_sec}S")
            else:
                reasons.append("VALID")

        df_audited = df_rr.copy()
        df_audited["audit_status"] = reasons
        df_audited["is_valid"] = valid_mask

        # Cumulative elapsed seconds based on all physical beats
        df_audited["elapsed_sec"] = df_audited["ibi_s"].cumsum()
        # Convert valid ibi to milliseconds for HRV calculation
        df_audited["rr_ms"] = df_audited["ibi_s"] * 1000.0

        retained_count = int(valid_mask.sum())
        rejected_count = raw_count - retained_count

        audit_summary = {
            "total_raw": raw_count,
            "retained_count": retained_count,
            "retained_pct": round((retained_count / raw_count) * 100, 2),
            "rejected_count": rejected_count,
            "rejected_pct": round((rejected_count / raw_count) * 100, 2),
            "rejection_reasons": {
                "too_short_sub_0_30s": too_short_count,
                "too_long_above_2_00s": too_long_count,
                "recording_gap_above_5_00s": gap_count,
                "non_numeric_or_non_positive": invalid_num_count
            }
        }

        return df_audited, audit_summary

    @classmethod
    def calculate_window_hrv(cls, rr_intervals_ms: np.ndarray) -> Dict[str, float]:
        """
        Calculates standard time-domain HRV metrics for a collection of valid RR intervals (in ms).
        - heart_rate: 60,000 / mean_nn (bpm)
        - mean_nn: mean of normal-to-normal intervals (ms)
        - hrv_rmssd: sqrt(mean(diff(RR)^2)) (ms)
        - hrv_sdnn: standard deviation of RR intervals (ms)
        - pnn50: percentage of successive RR interval differences exceeding 50ms (%)
        """
        if len(rr_intervals_ms) < 2:
            return {
                "heart_rate": np.nan,
                "mean_nn": np.nan,
                "hrv_rmssd": np.nan,
                "hrv_sdnn": np.nan,
                "pnn50": np.nan
            }

        mean_nn = float(np.mean(rr_intervals_ms))
        heart_rate = float(60000.0 / mean_nn) if mean_nn > 0 else np.nan
        sdnn = float(np.std(rr_intervals_ms, ddof=1)) if len(rr_intervals_ms) > 1 else 0.0

        diffs = np.diff(rr_intervals_ms)
        rmssd = float(np.sqrt(np.mean(diffs ** 2)))
        pnn50 = float((np.sum(np.abs(diffs) > 50.0) / len(diffs)) * 100.0)

        return {
            "heart_rate": round(heart_rate, 2),
            "mean_nn": round(mean_nn, 2),
            "hrv_rmssd": round(rmssd, 2),
            "hrv_sdnn": round(sdnn, 2),
            "pnn50": round(pnn50, 2)
        }

    @classmethod
    def extract_windows_for_participant(
        cls,
        participant_id: str,
        df_rr: pd.DataFrame,
        window_sec: float = DEFAULT_WINDOW_SEC,
        step_sec: float = DEFAULT_STEP_SEC,
        min_intervals: int = DEFAULT_MIN_INTERVALS_PER_WINDOW,
        max_gap_sec: float = DEFAULT_MAX_GAP_SEC
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], Dict[str, Any]]:
        """
        Extracts 5-minute HRV windows for a single participant.
        Evaluates signal quality, tracks recording gaps, and separates valid from rejected windows.
        """
        df_audited, audit_summary = cls.filter_and_audit_rr(df_rr, max_gap_sec=max_gap_sec)

        valid_windows = []
        rejected_windows = []

        if df_audited.empty:
            return valid_windows, rejected_windows, audit_summary

        total_elapsed = float(df_audited["elapsed_sec"].iloc[-1])
        start_sec = 0.0

        # Base timestamp from Day 1 / Time column if available
        base_time_str = str(df_rr["time"].iloc[0]) if "time" in df_rr.columns else "00:00:00"

        while start_sec + window_sec <= total_elapsed:
            end_sec = start_sec + window_sec

            # Slice window by continuous cumulative elapsed time
            window_slice = df_audited[
                (df_audited["elapsed_sec"] >= start_sec) &
                (df_audited["elapsed_sec"] < end_sec)
            ]

            total_in_window = len(window_slice)
            valid_slice = window_slice[window_slice["is_valid"]]
            valid_count = len(valid_slice)
            rejected_count = total_in_window - valid_count

            # Check if any large recording gap occurred in this window
            gaps_in_window = int((window_slice["ibi_s"] > max_gap_sec).sum())

            # Evaluate rejection conditions
            is_rejected = False
            rejection_reason = None

            if total_in_window == 0:
                is_rejected = True
                rejection_reason = "NO_INTERVALS_IN_WINDOW"
            elif gaps_in_window > 0:
                is_rejected = True
                rejection_reason = f"RECORDING_GAP_DETECTED_({gaps_in_window}_GAPS_EXCEEDING_{max_gap_sec}S)"
            elif valid_count < min_intervals:
                is_rejected = True
                rejection_reason = f"INSUFFICIENT_VALID_INTERVALS_({valid_count}_<_CRITERIA_{min_intervals})"
            elif (valid_count / total_in_window) < 0.85:
                is_rejected = True
                rejection_reason = f"POOR_SIGNAL_QUALITY_HIGH_REJECTION_RATE_({rejected_count}_REJECTED)"

            if is_rejected:
                rejected_windows.append({
                    "participant_id": participant_id,
                    "window_start_sec": round(start_sec, 2),
                    "window_end_sec": round(end_sec, 2),
                    "total_intervals": total_in_window,
                    "valid_intervals": valid_count,
                    "rejected_intervals": rejected_count,
                    "rejection_reason": rejection_reason,
                    "source_dataset": "MMASH",
                    "processing_version": cls.PROCESSING_VERSION
                })
            else:
                # Compute valid HRV features
                rr_ms = valid_slice["rr_ms"].values
                hrv_metrics = cls.calculate_window_hrv(rr_ms)

                # Signal quality classification
                if rejected_count == 0:
                    quality = "EXCELLENT"
                elif (valid_count / total_in_window) >= 0.95:
                    quality = "GOOD"
                else:
                    quality = "ACCEPTABLE"

                valid_windows.append({
                    "participant_id": participant_id,
                    "window_start_sec": round(start_sec, 2),
                    "window_end_sec": round(end_sec, 2),
                    "heart_rate": hrv_metrics["heart_rate"],
                    "mean_nn": hrv_metrics["mean_nn"],
                    "hrv_rmssd": hrv_metrics["hrv_rmssd"],
                    "hrv_sdnn": hrv_metrics["hrv_sdnn"],
                    "pnn50": hrv_metrics["pnn50"],
                    "valid_interval_count": valid_count,
                    "rejected_interval_count": rejected_count,
                    "signal_quality": quality,
                    "source_dataset": "MMASH",
                    "processing_version": cls.PROCESSING_VERSION
                })

            start_sec += step_sec

        return valid_windows, rejected_windows, audit_summary

