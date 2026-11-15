import os
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np


class DatasetClassifier:
    """
    Automatic domain classifier and workflow decision engine for incoming datasets.
    Maps actual column headers, bio-ontologies, and experimental contexts to
    the 6 AstroHealth AI health domains, and scientifically selects the appropriate workflow.
    """
    DOMAIN_KEYWORD_MAP = {
        "IMMUNE": [
            "crp", "c_reactive_protein", "cytokine", "macroglobulin", "agp", "fetuin",
            "fibrinogen", "haptoglobin", "selectin", "interleukin", "chemokine", "wbc",
            "leukocyte", "cortisol", "viral", "ebv", "antibody", "serum", "plasma"
        ],
        "CARDIOVASCULAR": [
            "heart_rate", "pulse", "systolic", "diastolic", "bp", "hrv", "rmssd", "spo2",
            "ecg", "cardiac", "stroke_volume", "pf4", "platelet"
        ],
        "BONE_MUSCLE": [
            "ntx", "bone", "calcium", "osteocalcin", "muscle", "strength", "circumference",
            "calf", "atrophy", "ared", "bmd"
        ],
        "BEHAVIORAL": [
            "sleep", "actigraphy", "pvt", "reaction_time", "lapse", "fatigue", "mood",
            "circadian", "cognitive"
        ],
        "RADIATION": [
            "dose", "radiation", "msv", "flux", "particle", "gy", "dosimeter", "cosmic"
        ],
        "ENVIRONMENT": [
            "co2", "o2", "pressure", "temperature", "humidity", "cabin", "eclss", "air"
        ],
    }

    @classmethod
    def classify_columns(cls, columns: List[str]) -> Dict[str, Any]:
        matched_domains = {d: [] for d in cls.DOMAIN_KEYWORD_MAP}
        normalized_cols = [c.lower() for c in columns]

        for orig_col, norm_col in zip(columns, normalized_cols):
            for domain, keywords in cls.DOMAIN_KEYWORD_MAP.items():
                if any(kw in norm_col for kw in keywords):
                    matched_domains[domain].append(orig_col)

        # Filter to domains with at least 1 match
        active_matches = {d: cols for d, cols in matched_domains.items() if len(cols) > 0}
        primary_domain = max(active_matches.keys(), key=lambda k: len(active_matches[k])) if active_matches else "UNKNOWN"

        return {
            "primary_domain": primary_domain,
            "matched_domains": active_matches,
            "feature_counts_per_domain": {d: len(cols) for d, cols in active_matches.items()}
        }

    @classmethod
    def select_workflow(
        cls,
        row_count: int,
        subject_count: int,
        has_timepoints: bool,
        has_baseline_columns: bool,
        has_target_label: bool
    ) -> Dict[str, Any]:
        """
        Scientifically determines whether a dataset supports:
        - Supervised ML
        - Unsupervised Anomaly Detection
        - Baseline Comparison & Longitudinal Trend Analysis (Small-N cohort)
        - Research Visualization
        """
        # Rule 1: Large time-series without labels (e.g. continuous spacecraft habitat / ECLSS sensor telemetry)
        if not has_target_label and row_count >= 500:
            return {
                "selected_workflow": "UNSUPERVISED_ANOMALY_DETECTION",
                "ml_approved": True,
                "reason": "Large unlabeled dataset suitable for unsupervised anomaly modeling (Isolation Forest / One-Class SVM).",
                "supported_analyses": ["Multivariate anomaly scoring", "Telemetry boundary drift"]
            }

        # Rule 2: Small astronaut biological cohort (e.g. N=4, rows=28)
        if (subject_count is not None and subject_count < 10) or row_count < 100:
            return {
                "selected_workflow": "BASELINE_COMPARISON_AND_LONGITUDINAL_TREND",
                "ml_approved": False,
                "reason": (
                    f"Sample size (N={subject_count} subjects, {row_count} total rows) is insufficient for "
                    "supervised or unsupervised machine learning. Training an ML model on small cohorts would "
                    "cause catastrophic overfitting and severe subject-level data leakage. "
                    "Approved workflow: Longitudinal Repeated-Measures Trend & Baseline Shift Analysis."
                ),
                "supported_analyses": [
                    "Individual subject baseline delta (% change)",
                    "Pre-flight vs In-flight vs Post-flight paired statistical contrast",
                    "Temporal trajectory visualization",
                    "Outlier biomarker flare detection"
                ]
            }

        # Rule 3: Sufficient subjects and labeled outcome
        if has_target_label and subject_count >= 20 and row_count >= 200:
            return {
                "selected_workflow": "SUPERVISED_MACHINE_LEARNING",
                "ml_approved": True,
                "reason": "Adequate sample size and target labels support cross-validated supervised model training.",
                "supported_analyses": ["Classification", "Regression", "Feature Importance"]
            }

        return {
            "selected_workflow": "STATISTICAL_ANALYSIS_AND_VISUALIZATION",
            "ml_approved": False,
            "reason": "Dataset provides exploratory observational value without meeting ML training criteria.",
            "supported_analyses": ["Descriptive statistics", "Correlation matrix"]
        }
