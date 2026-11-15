import os
import glob
from typing import Dict, Any, List
import pandas as pd
from app.ml.dataset_inspector import DatasetInspector
from app.ml.dataset_classifier import DatasetClassifier
from app.core.config import settings


class DatasetDiscoveryService:
    """
    Recursively scans the datasets directory, inspects file structures,
    classifies biological domains, and selects appropriate scientific workflows.
    """
    @classmethod
    def discover_raw_datasets(cls, raw_dir: str = None) -> List[Dict[str, Any]]:
        if raw_dir is None:
            raw_dir = os.path.join(settings.DATASETS_DIR, "raw")

        if not os.path.exists(raw_dir):
            return []

        pattern = os.path.join(raw_dir, "**", "*.*")
        matched_files = [f for f in glob.glob(pattern, recursive=True) if f.endswith((".csv", ".tsv", ".xlsx", ".json"))]

        results = []
        for file_path in matched_files:
            try:
                # Basic inspection via DatasetInspector
                inspection = DatasetInspector.inspect_csv(file_path) if file_path.endswith((".csv", ".tsv")) else {"rows": 0, "columns": 0, "feature_list": []}

                df = pd.read_csv(file_path) if file_path.endswith((".csv", ".tsv")) else pd.DataFrame()

                # Detect subject identifier
                subject_col = None
                for col in ["Participant", "Subject", "subject_id", "participant_id", "crew_id", "Sample Name"]:
                    if col in df.columns:
                        subject_col = col
                        break

                subject_count = int(df[subject_col].nunique()) if subject_col else 1

                # Detect longitudinal timepoint column
                timepoint_col = None
                for col in ["Timepoint", "timepoint", "mission_day", "Day", "time"]:
                    if col in df.columns:
                        timepoint_col = col
                        break

                timepoints = df[timepoint_col].unique().tolist() if timepoint_col else []

                # Domain classification
                domain_classification = DatasetClassifier.classify_columns(df.columns.tolist())

                # Workflow selection
                has_baselines = any("baseline" in c.lower() for c in df.columns)
                has_target = any(c.lower() in ("label", "target", "risk", "anomaly") for c in df.columns)

                workflow_decision = DatasetClassifier.select_workflow(
                    row_count=len(df),
                    subject_count=subject_count,
                    has_timepoints=(timepoint_col is not None),
                    has_baseline_columns=has_baselines,
                    has_target_label=has_target
                )

                results.append({
                    "file_path": file_path,
                    "filename": os.path.basename(file_path),
                    "row_count": len(df),
                    "column_count": len(df.columns),
                    "subject_identifier": subject_col,
                    "subject_count": subject_count,
                    "timepoint_column": timepoint_col,
                    "timepoints": timepoints,
                    "domain_classification": domain_classification,
                    "workflow_decision": workflow_decision,
                    "inspection_summary": inspection
                })

            except Exception as e:
                results.append({
                    "file_path": file_path,
                    "filename": os.path.basename(file_path),
                    "error": str(e)
                })

        return results

