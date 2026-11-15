import os
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np
from app.core.config import settings


class BaselineTrajectoryAnalyzer:
    """
    Dedicated analytical service for astronaut longitudinal cohort studies (e.g. NASA OSD-575).
    Evaluates individual astronaut baseline deltas, longitudinal return-to-baseline trajectories,
    and multi-marker inflammatory/cardiac stress patterns across mission phases.
    """
    @classmethod
    def load_dataset(cls, file_path: str = None) -> pd.DataFrame:
        if file_path is None:
            file_path = os.path.join(settings.DATASETS_DIR, "raw", "NASA_OSD575_baseline_comparison.csv")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"OSD-575 dataset not found at {file_path}")
        return pd.read_csv(file_path)

    @classmethod
    def get_subject_trajectory(cls, participant_id: str, file_path: str = None) -> Dict[str, Any]:
        df = cls.load_dataset(file_path)
        sub_df = df[df["Participant"].str.upper() == participant_id.strip().upper()]
        if sub_df.empty:
            return {"error": f"Participant '{participant_id}' not found in study."}

        # Key acute phase / inflammatory markers
        markers = [
            ("crp", "CRP (C-Reactive Protein)", "crp_concentration_picogram_per_milliliter"),
            ("agp", "Alpha-1-Acid Glycoprotein", "agp_concentration_nanogram_per_milliliter"),
            ("haptoglobin", "Haptoglobin", "haptoglobin_concentration_nanogram_per_milliliter"),
            ("fibrinogen", "Fibrinogen", "fibrinogen_concentration_nanogram_per_milliliter"),
            ("pf4", "Platelet Factor 4", "pf4_concentration_nanogram_per_milliliter"),
            ("sap", "Serum Amyloid P", "sap_concentration_picogram_per_milliliter")
        ]

        # Chronological order of timepoints
        timepoint_order = ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82", "R+194"]
        sub_df = sub_df.copy()
        sub_df["sort_order"] = sub_df["Timepoint"].map(lambda t: timepoint_order.index(t) if t in timepoint_order else 99)
        sub_df = sub_df.sort_values("sort_order")

        trajectories = {}
        for short_name, label, col in markers:
            change_col = f"{col}_change_percent"
            base_col = f"{col}_baseline"

            if col in sub_df.columns:
                points = []
                for _, row in sub_df.iterrows():
                    points.append({
                        "timepoint": row["Timepoint"],
                        "measured_value": float(row[col]),
                        "baseline_value": float(row[base_col]) if base_col in row else None,
                        "change_percent": round(float(row[change_col]), 2) if change_col in row else None
                    })
                trajectories[short_name] = {
                    "marker_label": label,
                    "raw_column": col,
                    "points": points
                }

        # Acute Return Post-Flight Impact (R+1 vs Pre-flight Baseline)
        r1_row = sub_df[sub_df["Timepoint"] == "R+1"]
        acute_shifts = {}
        if not r1_row.empty:
            for short_name, label, col in markers:
                change_col = f"{col}_change_percent"
                if change_col in r1_row:
                    acute_shifts[short_name] = round(float(r1_row[change_col].values[0]), 2)

        return {
            "participant": participant_id.upper(),
            "timepoints_recorded": sub_df["Timepoint"].tolist(),
            "acute_post_flight_shifts_pct": acute_shifts,
            "trajectories": trajectories
        }

    @classmethod
    def get_cohort_summary(cls, file_path: str = None) -> Dict[str, Any]:
        df = cls.load_dataset(file_path)
        participants = df["Participant"].unique().tolist()
        timepoints = df["Timepoint"].unique().tolist()

        # Mean change percent at R+1 across all crew members
        r1_df = df[df["Timepoint"] == "R+1"]
        change_cols = [c for c in df.columns if c.endswith("_change_percent")]

        cohort_r1_mean_shift = {}
        for c in change_cols:
            marker_name = c.replace("_concentration_nanogram_per_milliliter_change_percent", "").replace("_concentration_picogram_per_milliliter_change_percent", "")
            cohort_r1_mean_shift[marker_name] = round(float(r1_df[c].mean()), 2)

        return {
            "study_name": "NASA OSD-575 / Inspiration4 Serum Proteomic Profile",
            "participant_count": len(participants),
            "participants": participants,
            "timepoints_covered": timepoints,
            "cohort_r1_mean_shift_percent": cohort_r1_mean_shift,
            "scientific_significance": (
                "Tracks acute physiological recovery and systemic inflammatory response "
                "from Launch minus 92 days through Return plus 194 days."
            )
        }

