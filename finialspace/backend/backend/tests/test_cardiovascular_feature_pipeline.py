import os
import pytest
import pandas as pd
import numpy as np

from app.services.cardiovascular.feature_pipeline import CardiovascularFeaturePipeline
from app.core.config import settings


@pytest.fixture(scope="module")
def sample_rr_data():
    """Generates synthetic RR test series with known values, an invalid beat, and a gap."""
    # 200 normal intervals of 800 ms (0.8s, 75 bpm)
    # interval diffs are 0, so RMSSD = 0, SDNN = 0, pNN50 = 0
    intervals = [0.8] * 120
    # Add an alternating pattern to create non-zero RMSSD/SDNN
    # 0.8s, 0.9s, 0.8s, 0.9s (diffs = 100 ms)
    for i in range(40):
        intervals.append(0.8 if i % 2 == 0 else 0.9)
    # Add an invalid short interval (< 0.30s)
    intervals.append(0.25)
    # Add an invalid long interval (> 2.00s)
    intervals.append(2.50)
    # Add a gap (> 5.00s)
    intervals.append(6.00)
    # Add 50 more valid intervals
    intervals.extend([0.85] * 50)

    df = pd.DataFrame({
        "Unnamed: 0": range(1, len(intervals) + 1),
        "ibi_s": intervals,
        "day": [1] * len(intervals),
        "time": ["10:00:00"] * len(intervals)
    })
    return df


def test_rr_filtering_and_unit_conversion(sample_rr_data):
    """Verify filtering logic, unit conversion to ms, and rejection reason tracking."""
    df_audited, audit = CardiovascularFeaturePipeline.filter_and_audit_rr(sample_rr_data)

    assert "rr_ms" in df_audited.columns
    assert "audit_status" in df_audited.columns
    assert "is_valid" in df_audited.columns

    # Valid beats must equal raw - 3 invalid
    assert audit["total_raw"] == len(sample_rr_data)
    assert audit["rejected_count"] == 3
    assert audit["rejection_reasons"]["too_short_sub_0_30s"] == 1
    assert audit["rejection_reasons"]["too_long_above_2_00s"] == 1
    assert audit["rejection_reasons"]["recording_gap_above_5_00s"] == 1


def test_hrv_metric_calculations():
    """Verify exact mathematical formulas for HR, Mean NN, RMSSD, SDNN, and pNN50."""
    # Constant RR of 800 ms (75 bpm)
    rr_constant = np.array([800.0] * 100)
    res_c = CardiovascularFeaturePipeline.calculate_window_hrv(rr_constant)
    assert res_c["heart_rate"] == 75.0
    assert res_c["mean_nn"] == 800.0
    assert res_c["hrv_rmssd"] == 0.0
    assert res_c["hrv_sdnn"] == 0.0
    assert res_c["pnn50"] == 0.0

    # Alternating RR: 800 ms, 900 ms -> successive differences = 100 ms
    rr_alt = np.array([800.0, 900.0] * 50)
    res_a = CardiovascularFeaturePipeline.calculate_window_hrv(rr_alt)
    assert res_a["mean_nn"] == 850.0
    assert round(res_a["heart_rate"], 2) == 70.59
    assert res_a["hrv_rmssd"] == 100.0
    assert res_a["pnn50"] == 100.0  # all diffs are 100 ms > 50 ms


def test_recording_gap_detection_and_window_rejection(sample_rr_data):
    """Verify that windows spanning recording gaps (>5.0s) are quarantined and rejected."""
    valid_w, rej_w, audit = CardiovascularFeaturePipeline.extract_windows_for_participant(
        participant_id="TEST_USER",
        df_rr=sample_rr_data,
        window_sec=100.0,  # Short window to isolate the gap
        step_sec=50.0,
        min_intervals=10
    )

    assert len(rej_w) > 0
    # At least one rejected window must explicitly mention gap detection
    assert any("RECORDING_GAP_DETECTED" in w["rejection_reason"] for w in rej_w)


def test_processed_output_files_exist_and_finite():
    """Verify that all 5 required Phase 7.2 files exist and contain valid finite numbers."""
    out_dir = os.path.join(settings.DATASETS_DIR, "processed", "cardiovascular")

    windows_path = os.path.join(out_dir, "mmash_hrv_windows.csv")
    meta_path = os.path.join(out_dir, "mmash_hrv_metadata.json")
    quality_path = os.path.join(out_dir, "mmash_hrv_quality_report.json")
    summary_path = os.path.join(out_dir, "mmash_participant_summary.csv")
    rejected_path = os.path.join(out_dir, "mmash_rejected_windows.csv")

    assert os.path.exists(windows_path)
    assert os.path.exists(meta_path)
    assert os.path.exists(quality_path)
    assert os.path.exists(summary_path)
    assert os.path.exists(rejected_path)

    df_w = pd.read_csv(windows_path)
    assert len(df_w) > 20000  # Over 20,000 valid 5-min windows across 22 participants
    assert df_w["participant_id"].nunique() == 22
    assert df_w.isna().sum().sum() == 0  # Zero null values in processed windows

    # Check finite numbers and expected physiological ranges
    assert (df_w["heart_rate"] > 30).all() and (df_w["heart_rate"] < 220).all()
    assert (df_w["hrv_rmssd"] >= 0).all()
    assert (df_w["hrv_sdnn"] >= 0).all()
    assert (df_w["pnn50"] >= 0).all() and (df_w["pnn50"] <= 100).all()

