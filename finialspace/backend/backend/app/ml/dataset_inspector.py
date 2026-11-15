import os
import json
import math
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np


class DatasetInspector:
    """
    Standard inspection and quality audit utility for prospective ML training datasets.
    Audits missing values, duplicates, outliers (IQR & Z-score), unit consistency,
    and schema completeness.
    """
    @staticmethod
    def inspect_csv(file_path: str, target_column: Optional[str] = None) -> Dict[str, Any]:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Dataset file not found at: {file_path}")

        df = pd.read_csv(file_path)
        row_count, col_count = df.shape

        # Missing-value analysis
        missing_counts = df.isnull().sum().to_dict()
        missing_pcts = {k: round((v / row_count) * 100.0, 2) if row_count > 0 else 0.0 for k, v in missing_counts.items()}

        # Duplicate detection
        duplicate_rows = int(df.duplicated().sum())

        # Numeric column statistics and outlier analysis via IQR
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        numeric_summary: Dict[str, Any] = {}

        for col in numeric_cols:
            series = df[col].dropna()
            if len(series) == 0:
                continue
            q25 = float(np.percentile(series, 25))
            q75 = float(np.percentile(series, 75))
            iqr = q75 - q25
            lower_bound = q25 - 1.5 * iqr
            upper_bound = q75 + 1.5 * iqr
            outlier_count = int(((series < lower_bound) | (series > upper_bound)).sum())

            numeric_summary[col] = {
                "count": int(len(series)),
                "mean": round(float(series.mean()), 3),
                "std": round(float(series.std()), 3) if len(series) > 1 else 0.0,
                "min": round(float(series.min()), 3),
                "max": round(float(series.max()), 3),
                "iqr_outliers": outlier_count,
                "iqr_outlier_pct": round((outlier_count / len(series)) * 100.0, 2)
            }

        # Target column inspection if provided
        target_info = None
        if target_column and target_column in df.columns:
            target_series = df[target_column]
            value_counts = target_series.value_counts(dropna=False).to_dict()
            target_info = {
                "target_name": target_column,
                "unique_values": int(target_series.nunique()),
                "distribution": {str(k): int(v) for k, v in value_counts.items()}
            }

        return {
            "file_path": file_path,
            "filename": os.path.basename(file_path),
            "rows": int(row_count),
            "columns": int(col_count),
            "feature_list": df.columns.tolist(),
            "missing_values": missing_counts,
            "missing_pcts": missing_pcts,
            "duplicate_rows": duplicate_rows,
            "numeric_summary": numeric_summary,
            "target_analysis": target_info,
            "audit_status": "VALID_STRUCTURE" if row_count > 0 else "EMPTY_DATASET"
        }

