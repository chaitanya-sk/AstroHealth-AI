import sys
import os
import pandas as pd

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.analytics.dataset_discovery_service import DatasetDiscoveryService
from app.services.analytics.baseline_trajectory_service import BaselineTrajectoryAnalyzer
from app.ml.dataset_classifier import DatasetClassifier
from app.ml.dataset_inspector import DatasetInspector


def test_autonomous_dataset_discovery():
    results = DatasetDiscoveryService.discover_raw_datasets()
    assert len(results) >= 1
    osd575 = next((d for d in results if "OSD575" in d["filename"]), None)
    assert osd575 is not None
    assert osd575["row_count"] == 28
    assert osd575["column_count"] == 39
    assert osd575["subject_count"] == 4
    assert osd575["subject_identifier"] == "Participant"
    assert len(osd575["timepoints"]) == 7


def test_automatic_domain_classification():
    # Test on OSD-575 columns
    df = pd.read_csv("datasets/raw/NASA_OSD575_baseline_comparison.csv")
    classification = DatasetClassifier.classify_columns(df.columns.tolist())
    assert classification["primary_domain"] == "IMMUNE"
    assert "crp_concentration_picogram_per_milliliter" in classification["matched_domains"]["IMMUNE"]
    assert "CARDIOVASCULAR" in classification["matched_domains"]  # PF4/platelet matches


def test_scientific_workflow_selection_decision():
    # 1. Test small astronaut cohort (N=4) -> Must reject ML and select BASELINE_COMPARISON
    decision_small = DatasetClassifier.select_workflow(
        row_count=28,
        subject_count=4,
        has_timepoints=True,
        has_baseline_columns=True,
        has_target_label=False
    )
    assert decision_small["ml_approved"] is False
    assert decision_small["selected_workflow"] == "BASELINE_COMPARISON_AND_LONGITUDINAL_TREND"
    assert "overfitting" in decision_small["reason"].lower()

    # 2. Test large telemetry -> Unsupervised anomaly detection
    decision_large = DatasetClassifier.select_workflow(
        row_count=1000,
        subject_count=1,
        has_timepoints=True,
        has_baseline_columns=False,
        has_target_label=False
    )
    assert decision_large["ml_approved"] is True
    assert decision_large["selected_workflow"] == "UNSUPERVISED_ANOMALY_DETECTION"


def test_baseline_trajectory_service():
    # Test cohort summary
    summary = BaselineTrajectoryAnalyzer.get_cohort_summary()
    assert summary["participant_count"] == 4
    assert set(summary["participants"]) == {"C001", "C002", "C003", "C004"}
    assert "crp" in summary["cohort_r1_mean_shift_percent"]

    # Test individual subject trajectory
    sub_res = BaselineTrajectoryAnalyzer.get_subject_trajectory("C001")
    assert sub_res["participant"] == "C001"
    assert len(sub_res["timepoints_recorded"]) == 7
    assert "crp" in sub_res["trajectories"]
    assert len(sub_res["trajectories"]["crp"]["points"]) == 7
    # Verify non-existent subject handling
    bad_res = BaselineTrajectoryAnalyzer.get_subject_trajectory("NONEXISTENT")
    assert "error" in bad_res


def test_api_routes_for_dataset_intelligence():
    from app.api.analysis_routes import (
        discover_raw_datasets,
        get_osd575_cohort_summary,
        get_osd575_participant_trajectory,
    )

    # 1. GET /api/analysis/datasets/discover
    disc = discover_raw_datasets()
    assert len(disc) >= 1

    # 2. GET /api/analysis/research/osd575/cohort
    cohort = get_osd575_cohort_summary()
    assert cohort["participant_count"] == 4

    # 3. GET /api/analysis/research/osd575/participant/C001
    part = get_osd575_participant_trajectory("C001")
    assert part["participant"] == "C001"


if __name__ == "__main__":
    print("==================================================")
    print("ASTROHEALTH AI — AUTONOMOUS DATASET INTELLIGENCE TESTS")
    print("==================================================")
    test_autonomous_dataset_discovery()
    print("1. [PASS] Autonomous Dataset Discovery & Structural Audit")
    test_automatic_domain_classification()
    print("2. [PASS] Automatic Biological Domain Classification")
    test_scientific_workflow_selection_decision()
    print("3. [PASS] Scientific Workflow Selection Decision Engine")
    test_baseline_trajectory_service()
    print("4. [PASS] Baseline Trajectory Analytical Service")
    test_api_routes_for_dataset_intelligence()
    print("5. [PASS] Dataset Intelligence API Endpoints")
    print("==================================================")
    print("ALL 5 DATASET INTELLIGENCE TEST SUITES PASSED!")
    print("==================================================")

