import os
import json
import glob
from typing import Dict, Any, List
import pandas as pd
import numpy as np

from app.core.config import settings
from app.services.research.mmash_loader_service import MMASHLoaderService
from app.services.cardiovascular.feature_pipeline import CardiovascularFeaturePipeline


def run_cardiovascular_feature_extraction() -> Dict[str, Any]:
    """
    Executes Phase 7.2 processing across all 22 MMASH participants.
    Generates:
    - mmash_hrv_windows.csv
    - mmash_hrv_metadata.json
    - mmash_hrv_quality_report.json
    - mmash_participant_summary.csv
    - mmash_rejected_windows.csv
    """
    mmash_dir = MMASHLoaderService.resolve_mmash_dir()
    participants = sorted(
        [d for d in os.listdir(mmash_dir) if d.lower().startswith("user_") and os.path.isdir(os.path.join(mmash_dir, d))],
        key=lambda x: int(x.split("_")[1])
    )

    out_dir = os.path.join(settings.DATASETS_DIR, "processed", "cardiovascular")
    os.makedirs(out_dir, exist_ok=True)

    all_valid_windows: List[Dict[str, Any]] = []
    all_rejected_windows: List[Dict[str, Any]] = []
    participant_summaries: List[Dict[str, Any]] = []

    total_raw_intervals = 0
    total_retained_intervals = 0
    total_rejected_intervals = 0

    print(f"Starting cardiovascular feature extraction for {len(participants)} participants...")

    for p in participants:
        p_num = int(p.split("_")[1])
        normalized_pid = f"MMASH_USER_{p_num}"
        p_dir = os.path.join(mmash_dir, p)
        rr_file = os.path.join(p_dir, "RR.csv")

        if not os.path.exists(rr_file):
            print(f"Warning: RR.csv not found for {p}")
            continue

        df_rr = pd.read_csv(rr_file)
        valid_w, rej_w, audit = CardiovascularFeaturePipeline.extract_windows_for_participant(
            participant_id=normalized_pid,
            df_rr=df_rr
        )

        all_valid_windows.extend(valid_w)
        all_rejected_windows.extend(rej_w)

        total_raw_intervals += audit["total_raw"]
        total_retained_intervals += audit["retained_count"]
        total_rejected_intervals += audit["rejected_count"]

        # Duration in hours based on raw sum of ibi
        recording_hours = round(float(df_rr["ibi_s"].sum() / 3600.0), 2)

        # Average window statistics for this participant
        p_valid_df = pd.DataFrame(valid_w)
        mean_hr = round(float(p_valid_df["heart_rate"].mean()), 2) if not p_valid_df.empty else None
        mean_rmssd = round(float(p_valid_df["hrv_rmssd"].mean()), 2) if not p_valid_df.empty else None
        mean_sdnn = round(float(p_valid_df["hrv_sdnn"].mean()), 2) if not p_valid_df.empty else None

        participant_summaries.append({
            "participant_id": normalized_pid,
            "raw_user_folder": p,
            "raw_interval_count": audit["total_raw"],
            "retained_interval_count": audit["retained_count"],
            "retained_pct": audit["retained_pct"],
            "rejected_interval_count": audit["rejected_count"],
            "rejected_pct": audit["rejected_pct"],
            "recording_duration_hours": recording_hours,
            "valid_5min_windows_count": len(valid_w),
            "rejected_windows_count": len(rej_w),
            "mean_heart_rate_bpm": mean_hr,
            "mean_hrv_rmssd_ms": mean_rmssd,
            "mean_hrv_sdnn_ms": mean_sdnn,
            "rejection_reasons": audit["rejection_reasons"]
        })

        print(f"Processed {normalized_pid}: {audit['total_raw']} intervals -> {len(valid_w)} valid windows, {len(rej_w)} rejected windows.")

    # 1. Export mmash_hrv_windows.csv
    df_valid_windows = pd.DataFrame(all_valid_windows)
    windows_path = os.path.join(out_dir, "mmash_hrv_windows.csv")
    df_valid_windows.to_csv(windows_path, index=False)
    print(f"Exported {windows_path} with {len(df_valid_windows)} rows.")

    # 2. Export mmash_rejected_windows.csv
    df_rejected_windows = pd.DataFrame(all_rejected_windows)
    rejected_path = os.path.join(out_dir, "mmash_rejected_windows.csv")
    df_rejected_windows.to_csv(rejected_path, index=False)
    print(f"Exported {rejected_path} with {len(df_rejected_windows)} rows.")

    # 3. Export mmash_participant_summary.csv
    df_summary = pd.DataFrame(participant_summaries)
    summary_path = os.path.join(out_dir, "mmash_participant_summary.csv")
    df_summary.to_csv(summary_path, index=False)
    print(f"Exported {summary_path} with {len(df_summary)} rows.")

    # 4. Export mmash_hrv_quality_report.json
    quality_report = {
        "report_title": "AstroHealth AI Phase 7.2 MMASH Cardiovascular Quality Report",
        "processing_version": CardiovascularFeaturePipeline.PROCESSING_VERSION,
        "cohort_summary": {
            "participants_processed": len(participant_summaries),
            "total_raw_intervals": total_raw_intervals,
            "total_retained_intervals": total_retained_intervals,
            "retained_pct_cohort": round((total_retained_intervals / total_raw_intervals) * 100, 2) if total_raw_intervals else 0.0,
            "total_rejected_intervals": total_rejected_intervals,
            "rejected_pct_cohort": round((total_rejected_intervals / total_raw_intervals) * 100, 2) if total_raw_intervals else 0.0,
            "total_valid_windows": len(df_valid_windows),
            "total_rejected_windows": len(df_rejected_windows),
            "window_duration_seconds": CardiovascularFeaturePipeline.DEFAULT_WINDOW_SEC,
            "sliding_step_seconds": CardiovascularFeaturePipeline.DEFAULT_STEP_SEC,
            "quality_criterion_min_intervals": CardiovascularFeaturePipeline.DEFAULT_MIN_INTERVALS_PER_WINDOW,
            "gap_rejection_threshold_seconds": CardiovascularFeaturePipeline.DEFAULT_MAX_GAP_SEC
        },
        "participant_details": participant_summaries
    }
    quality_path = os.path.join(out_dir, "mmash_hrv_quality_report.json")
    with open(quality_path, "w", encoding="utf-8") as f:
        json.dump(quality_report, f, indent=2)
    print(f"Exported {quality_path}.")

    # 5. Export mmash_hrv_metadata.json
    metadata = {
        "dataset_name": "MMASH Windowed Cardiovascular HRV Features",
        "dataset_version": "1.0.0",
        "source_dataset": "Multilevel Monitoring of Activity and Sleep in Healthy people (MMASH)",
        "source_license": "PhysioNet Open Access (ODC-BY)",
        "environment": "Terrestrial 1g Daily Living Ground Cohort",
        "cohort_size": len(participant_summaries),
        "target_task": "Unsupervised Autonomic Anomaly and Deviation Modeling",
        "features": [
            {"name": "heart_rate", "unit": "bpm", "description": "Mean heart rate in 5-minute window derived from RR intervals (60,000 / mean_nn)"},
            {"name": "mean_nn", "unit": "ms", "description": "Average normal-to-normal beat interval"},
            {"name": "hrv_rmssd", "unit": "ms", "description": "Root mean square of successive RR interval differences (parasympathetic modulation)"},
            {"name": "hrv_sdnn", "unit": "ms", "description": "Standard deviation of normal-to-normal intervals (overall autonomic tone)"},
            {"name": "pnn50", "unit": "%", "description": "Percentage of adjacent intervals differing by > 50 ms"}
        ],
        "provenance_and_quality": {
            "min_valid_interval_sec": CardiovascularFeaturePipeline.DEFAULT_MIN_INTERVAL_SEC,
            "max_valid_interval_sec": CardiovascularFeaturePipeline.DEFAULT_MAX_INTERVAL_SEC,
            "window_sec": CardiovascularFeaturePipeline.DEFAULT_WINDOW_SEC,
            "step_sec": CardiovascularFeaturePipeline.DEFAULT_STEP_SEC,
            "recording_gap_handling": "Windows spanning intervals > 5.0 seconds are flagged and quarantined in mmash_rejected_windows.csv",
            "clinical_disclaimer": "These windows represent healthy terrestrial 1g autonomic variability. They are not clinical diagnostic thresholds and must not be pooled with microgravity astronaut omics."
        }
    }
    metadata_path = os.path.join(out_dir, "mmash_hrv_metadata.json")
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Exported {metadata_path}.")

    return quality_report


if __name__ == "__main__":
    run_cardiovascular_feature_extraction()

