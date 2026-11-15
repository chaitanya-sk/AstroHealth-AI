import os
import glob
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.config import settings
from app.core.constants import HealthDomain, DataType
from app.models.health_record import HealthRecord


class OSDRDatasetService:
    """
    Dedicated Service for NASA Open Science Data Repository (OSDR) Numerical Datasets.
    Provides structured loading, trajectory analytics, domain mapping, and idempotent
    ingestion for OSD-569, OSD-570, OSD-571, and OSD-656.
    """

    DATASET_METADATA = {
        "NASA-OSD-569": {
            "dataset_id": "NASA-OSD-569",
            "study_accession": "OSD-569",
            "title": "Inspiration4 Whole Blood Complete Blood Count (CBC) Hematology Profile",
            "mission": "Inspiration4",
            "environment": "Short-Duration Spaceflight (Orbital Microgravity)",
            "organism": "Homo sapiens",
            "cohort_size": 4,
            "participants": ["C001", "C002", "C003", "C004"],
            "timepoints": ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82", "R+194"],
            "primary_file": "OSD-569_CBC_TRANSFORMED.csv",
            "status": "NUMERICAL_DATA_AVAILABLE",
            "integration_status": "PARTIALLY_INTEGRATED",
            "connected_domains": ["immune", "cardiovascular"],
            "supported_indicators": [
                {"indicator": "wbc", "label": "White Blood Cell Count", "unit": "10^3/uL", "domain": "immune"},
                {"indicator": "lymphocytes_pct", "label": "Lymphocytes Percentage", "unit": "%", "domain": "immune"},
                {"indicator": "neutrophils_pct", "label": "Neutrophils Percentage", "unit": "%", "domain": "immune"},
                {"indicator": "platelets", "label": "Platelet Count", "unit": "10^3/uL", "domain": "cardiovascular"},
                {"indicator": "hemoglobin", "label": "Hemoglobin Concentration", "unit": "g/dL", "domain": "cardiovascular"},
                {"indicator": "hematocrit", "label": "Hematocrit", "unit": "%", "domain": "cardiovascular"},
                {"indicator": "rbc", "label": "Red Blood Cell Count", "unit": "10^6/uL", "domain": "cardiovascular"}
            ]
        },
        "NASA-OSD-656": {
            "dataset_id": "NASA-OSD-656",
            "study_accession": "OSD-656",
            "title": "Inspiration4 Longitudinal Urine Immunoassay 200-Plex Biomarker Panel",
            "mission": "Inspiration4",
            "environment": "Short-Duration Spaceflight (Orbital Microgravity)",
            "organism": "Homo sapiens",
            "cohort_size": 4,
            "participants": ["C001", "C002", "C003", "C004"],
            "timepoints": ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82"],
            "primary_file": "OSD-656_urine_immune_TRANSFORMED.csv",
            "status": "NUMERICAL_DATA_AVAILABLE",
            "integration_status": "PARTIALLY_INTEGRATED",
            "connected_domains": ["immune"],
            "supported_indicators": [
                {"indicator": "il6", "label": "Interleukin-6 (IL-6)", "unit": "NPQ", "domain": "immune"},
                {"indicator": "il10", "label": "Interleukin-10 (IL-10)", "unit": "NPQ", "domain": "immune"},
                {"indicator": "tnf", "label": "Tumor Necrosis Factor (TNF-alpha)", "unit": "NPQ", "domain": "immune"},
                {"indicator": "cxcl8", "label": "CXCL8 / Interleukin-8", "unit": "NPQ", "domain": "immune"},
                {"indicator": "ager", "label": "Advanced Glycation End-Product Receptor (AGER)", "unit": "NPQ", "domain": "immune"},
                {"indicator": "agrp", "label": "Agouti-Related Protein (AGRP)", "unit": "NPQ", "domain": "immune"}
            ]
        },
        "NASA-OSD-571": {
            "dataset_id": "NASA-OSD-571",
            "study_accession": "OSD-571",
            "title": "Inspiration4 Blood Plasma Proteomics & Metabolomics Differential Profiling",
            "mission": "Inspiration4",
            "environment": "Short-Duration Spaceflight (Orbital Microgravity)",
            "organism": "Homo sapiens",
            "cohort_size": 4,
            "participants": ["C001", "C002", "C003", "C004"],
            "primary_file": "OSD-571_Plasma_Proteomics_Processed.xlsx",
            "status": "FORMAT_REQUIRES_SPECIAL_PROCESSING",
            "integration_status": "SUMMARY_STATISTICS_INTEGRATED",
            "connected_domains": ["immune", "cardiovascular"],
            "supported_indicators": [
                {"indicator": "plasma_proteomics_de", "label": "Plasma Proteomics Differential Abundance (limma logFC)", "domain": "immune"},
                {"indicator": "plasma_metabolomics_de", "label": "Plasma Metabolomics Differential Abundance (limma logFC)", "domain": "cardiovascular"}
            ]
        },
        "NASA-OSD-570": {
            "dataset_id": "NASA-OSD-570",
            "study_accession": "OSD-570",
            "title": "Inspiration4 PBMC Single-Cell RNA-seq Gene Expression Profiling",
            "mission": "Inspiration4",
            "environment": "Short-Duration Spaceflight (Orbital Microgravity)",
            "organism": "Homo sapiens",
            "cohort_size": 4,
            "participants": ["C001", "C002", "C003", "C004"],
            "primary_file": "OSD-570_snRNA_PBMC_Gene_Expression.xlsx",
            "status": "FORMAT_REQUIRES_SPECIAL_PROCESSING",
            "integration_status": "SUMMARY_STATISTICS_INTEGRATED",
            "connected_domains": ["immune"],
            "supported_indicators": [
                {"indicator": "snrna_gene_expression", "label": "PBMC Single-Nucleus Gene Expression (Seurat avg_log2FC)", "domain": "immune"}
            ]
        }
    }

    @classmethod
    def get_raw_path(cls, filename: str) -> str:
        return os.path.join(settings.DATASETS_DIR, "raw", filename)

    # ---------------------------------------------------------
    # 1. OSD-569 (Complete Blood Count) Processing
    # ---------------------------------------------------------
    @classmethod
    def load_osd569_cbc(cls) -> pd.DataFrame:
        path = cls.get_raw_path("OSD-569_CBC_TRANSFORMED.csv")
        if not os.path.exists(path):
            raise FileNotFoundError(f"OSD-569 CBC file not found at {path}")
        df = pd.read_csv(path)
        # Parse Participant and Timepoint from 'Sample Name', e.g. 'C001_whole-blood_L-3_cbc'
        df["Participant"] = df["Sample Name"].apply(lambda x: str(x).split("_")[0].strip().upper())
        df["Timepoint"] = df["Sample Name"].apply(lambda x: str(x).split("_")[2].strip())
        return df

    @classmethod
    def get_osd569_cohort_summary(cls) -> Dict[str, Any]:
        df = cls.load_osd569_cbc()
        participants = sorted(df["Participant"].unique().tolist())
        timepoints = df["Timepoint"].unique().tolist()

        pre_tp = ["L-92", "L-44", "L-3"]
        pre_df = df[df["Timepoint"].isin(pre_tp)]
        r1_df = df[df["Timepoint"] == "R+1"]

        col_map = {
            "wbc": ("white_blood_cell_count_value_thousand_per_microliter", "10^3/uL"),
            "lymphocytes_pct": ("lymphocytes_value_percent", "%"),
            "neutrophils_pct": ("neutrophils_value_percent", "%"),
            "platelets": ("platelet_count_value_thousand_per_microliter", "10^3/uL"),
            "hemoglobin": ("hemoglobin_value_percent", "g/dL"),
            "hematocrit": ("hematocrit_value_percent", "%"),
            "rbc": ("red_blood_cell_count_value_million_per_microliter", "10^6/uL")
        }

        shifts = {}
        for short_name, (col, unit) in col_map.items():
            pre_mean = pre_df[col].mean()
            r1_mean = r1_df[col].mean()
            shift_pct = ((r1_mean - pre_mean) / pre_mean * 100) if pre_mean and not pd.isna(pre_mean) else 0.0
            shifts[short_name] = {
                "pre_flight_mean": round(float(pre_mean), 2) if not pd.isna(pre_mean) else None,
                "r1_post_flight_mean": round(float(r1_mean), 2) if not pd.isna(r1_mean) else None,
                "shift_percent": round(float(shift_pct), 2),
                "unit": unit
            }

        return {
            "study_accession": "OSD-569",
            "study_title": "Inspiration4 Complete Blood Count (CBC)",
            "participants": participants,
            "sample_count": len(df),
            "timepoints": timepoints,
            "acute_r1_mean_shifts": shifts
        }

    @classmethod
    def get_osd569_participant_trajectory(cls, participant_id: str) -> Dict[str, Any]:
        df = cls.load_osd569_cbc()
        pid = participant_id.strip().upper()
        sub_df = df[df["Participant"] == pid]
        if sub_df.empty:
            return {"error": f"Participant '{participant_id}' not found in OSD-569."}

        tp_order = ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82", "R+194"]
        sub_df = sub_df.copy()
        sub_df["sort_order"] = sub_df["Timepoint"].map(lambda t: tp_order.index(t) if t in tp_order else 99)
        sub_df = sub_df.sort_values("sort_order")

        indicators = {
            "wbc": ("white_blood_cell_count_value_thousand_per_microliter", "10^3/uL"),
            "platelets": ("platelet_count_value_thousand_per_microliter", "10^3/uL"),
            "lymphocytes_pct": ("lymphocytes_value_percent", "%"),
            "neutrophils_pct": ("neutrophils_value_percent", "%"),
            "hemoglobin": ("hemoglobin_value_percent", "g/dL")
        }

        trajectories = {}
        for ind, (col, unit) in indicators.items():
            points = []
            for _, r in sub_df.iterrows():
                val = r[col]
                points.append({
                    "timepoint": r["Timepoint"],
                    "value": round(float(val), 2) if not pd.isna(val) else None,
                    "unit": unit
                })
            trajectories[ind] = points

        return {
            "study_accession": "OSD-569",
            "participant": pid,
            "timepoints_recorded": sub_df["Timepoint"].tolist(),
            "trajectories": trajectories
        }

    # ---------------------------------------------------------
    # 2. OSD-656 (Longitudinal Urine Immune Panel) Processing
    # ---------------------------------------------------------
    @classmethod
    def load_osd656_urine(cls) -> pd.DataFrame:
        path = cls.get_raw_path("OSD-656_urine_immune_TRANSFORMED.csv")
        if not os.path.exists(path):
            raise FileNotFoundError(f"OSD-656 Urine file not found at {path}")
        df = pd.read_csv(path)
        # Parse Participant and Timepoint from 'Sample Name', e.g. 'C001_urine_L-92'
        df["Participant"] = df["Sample Name"].apply(lambda x: str(x).split("_")[0].strip().upper())
        df["Timepoint"] = df["Sample Name"].apply(lambda x: str(x).split("_")[2].strip())
        return df

    @classmethod
    def get_osd656_cohort_summary(cls) -> Dict[str, Any]:
        df = cls.load_osd656_urine()
        participants = sorted(df["Participant"].unique().tolist())
        timepoints = df["Timepoint"].unique().tolist()

        pre_tp = ["L-92", "L-44", "L-3"]
        pre_df = df[df["Timepoint"].isin(pre_tp)]
        r1_df = df[df["Timepoint"] == "R+1"]

        key_biomarkers = [
            ("il6", "il6_concentration_npq", "Interleukin-6"),
            ("il10", "il10_concentration_npq", "Interleukin-10"),
            ("tnf", "tnf_concentration_npq", "Tumor Necrosis Factor"),
            ("cxcl8", "cxcl8_concentration_npq", "CXCL8 / IL-8"),
            ("ager", "ager_concentration_npq", "Receptor for Advanced Glycation Endproducts"),
            ("agrp", "agrp_concentration_npq", "Agouti-Related Protein")
        ]

        shifts = {}
        for short_name, col, label in key_biomarkers:
            if col in df.columns:
                pre_mean = pre_df[col].mean()
                r1_mean = r1_df[col].mean()
                shift_pct = ((r1_mean - pre_mean) / pre_mean * 100) if pre_mean and not pd.isna(pre_mean) else 0.0
                shifts[short_name] = {
                    "label": label,
                    "unit": "NPQ",
                    "pre_flight_mean": round(float(pre_mean), 2) if not pd.isna(pre_mean) else None,
                    "r1_post_flight_mean": round(float(r1_mean), 2) if not pd.isna(r1_mean) else None,
                    "shift_percent": round(float(shift_pct), 2)
                }

        return {
            "study_accession": "OSD-656",
            "study_title": "Inspiration4 Urine 200-Plex Immune Panel",
            "participants": participants,
            "sample_count": len(df),
            "total_biomarkers": 202,
            "timepoints": timepoints,
            "acute_r1_mean_shifts": shifts
        }

    @classmethod
    def get_osd656_participant_trajectory(cls, participant_id: str) -> Dict[str, Any]:
        df = cls.load_osd656_urine()
        pid = participant_id.strip().upper()
        sub_df = df[df["Participant"] == pid]
        if sub_df.empty:
            return {"error": f"Participant '{participant_id}' not found in OSD-656."}

        tp_order = ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82"]
        sub_df = sub_df.copy()
        sub_df["sort_order"] = sub_df["Timepoint"].map(lambda t: tp_order.index(t) if t in tp_order else 99)
        sub_df = sub_df.sort_values("sort_order")

        key_biomarkers = [
            ("il6", "il6_concentration_npq"),
            ("cxcl8", "cxcl8_concentration_npq"),
            ("il10", "il10_concentration_npq"),
            ("tnf", "tnf_concentration_npq")
        ]

        trajectories = {}
        for short_name, col in key_biomarkers:
            if col in sub_df.columns:
                points = []
                for _, r in sub_df.iterrows():
                    val = r[col]
                    points.append({
                        "timepoint": r["Timepoint"],
                        "value": round(float(val), 2) if not pd.isna(val) else None,
                        "unit": "NPQ"
                    })
                trajectories[short_name] = points

        return {
            "study_accession": "OSD-656",
            "participant": pid,
            "timepoints_recorded": sub_df["Timepoint"].tolist(),
            "trajectories": trajectories
        }

    # ---------------------------------------------------------
    # 3. OSD-571 & OSD-570 (High-Dimensional Omics Summaries)
    # ---------------------------------------------------------
    @classmethod
    def get_osd571_summary(cls) -> Dict[str, Any]:
        prot_path = cls.get_raw_path("OSD-571_Plasma_Proteomics_Processed.xlsx")
        met_path = cls.get_raw_path("OSD-571_Plasma_Metabolomics_Processed.xlsx")

        top_proteins = []
        if os.path.exists(prot_path):
            df_p = pd.read_excel(prot_path, sheet_name="I4-FP1", skiprows=6)
            if "adj.P.Val" in df_p.columns:
                top_p = df_p.sort_values(by="adj.P.Val").head(5)
                for _, r in top_p.iterrows():
                    top_proteins.append({
                        "gene": str(r.get("Gene")),
                        "logFC": round(float(r.get("logFC", 0.0)), 4),
                        "adj_p_val": float(r.get("adj.P.Val", 1.0))
                    })

        top_metabolites = []
        if os.path.exists(met_path):
            df_m = pd.read_excel(met_path, sheet_name="I4-FP1", skiprows=6)
            if "adj.P.Val" in df_m.columns:
                top_m = df_m.sort_values(by="adj.P.Val").head(5)
                for _, r in top_m.iterrows():
                    top_metabolites.append({
                        "metabolite_id": str(r.get("ID")),
                        "logFC": round(float(r.get("logFC", 0.0)), 4),
                        "adj_p_val": float(r.get("adj.P.Val", 1.0))
                    })

        return {
            "study_accession": "OSD-571",
            "study_title": "Inspiration4 Plasma Proteomics & Metabolomics Profiling",
            "comparison": "(R+1) vs Pre-flight Baseline",
            "top_differentially_abundant_proteins": top_proteins,
            "top_differentially_abundant_metabolites": top_metabolites,
            "scientific_significance": "Confirms systemic multi-organ re-entry stress; elevated PF4 and TGFB1 concordant with OSD-575 serum findings."
        }

    @classmethod
    def get_osd570_summary(cls) -> Dict[str, Any]:
        sn_path = cls.get_raw_path("OSD-570_snRNA_PBMC_Gene_Expression.xlsx")
        top_markers = []
        if os.path.exists(sn_path):
            df_sn = pd.read_excel(sn_path, sheet_name="I4-FP1", skiprows=7)
            if "avg_log2FC" in df_sn.columns and "Cell Type" in df_sn.columns:
                top_sn = df_sn.head(6)
                for _, r in top_sn.iterrows():
                    top_markers.append({
                        "gene": str(r.get("Gene")),
                        "cell_type": str(r.get("Cell Type")),
                        "avg_log2FC": round(float(r.get("avg_log2FC", 0.0)), 4),
                        "p_val_adj": float(r.get("p_val_adj", 0.0))
                    })

        return {
            "study_accession": "OSD-570",
            "study_title": "Inspiration4 PBMC Single-Nucleus RNA-seq Profiling",
            "comparison": "(R+1) vs Pre-flight Baseline",
            "top_cell_type_markers": top_markers,
            "scientific_significance": "Demonstrates cell-type specific transcriptional activation in circulating immune cells immediately following orbital flight."
        }

    # ---------------------------------------------------------
    # 4. Idempotent Ingestion into Database
    # ---------------------------------------------------------
    @classmethod
    def ingest_osd569_and_osd656(cls, db: Session) -> Dict[str, Any]:
        """
        Idempotently ingest core CBC and urine cytokine indicators for research subjects C001-C004.
        Strictly quarantined as DataType.RESEARCH.
        """
        ingested_count = 0

        # Ingest OSD-569
        df_cbc = cls.load_osd569_cbc()
        indicators_cbc = [
            ("white_blood_cell_count_value_thousand_per_microliter", "wbc", "10^3/uL", HealthDomain.IMMUNE.value),
            ("platelet_count_value_thousand_per_microliter", "platelets", "10^3/uL", HealthDomain.CARDIOVASCULAR.value),
            ("hemoglobin_value_percent", "hemoglobin", "g/dL", HealthDomain.CARDIOVASCULAR.value),
            ("lymphocytes_value_percent", "lymphocytes_pct", "%", HealthDomain.IMMUNE.value),
            ("neutrophils_value_percent", "neutrophils_pct", "%", HealthDomain.IMMUNE.value)
        ]

        # Use fixed reference base date for chronological sorting
        base_date = datetime(2021, 9, 1)

        for _, row in df_cbc.iterrows():
            pid = row["Participant"]
            tp = row["Timepoint"]
            for col, ind, unit, dom in indicators_cbc:
                val = row[col]
                if pd.isna(val):
                    continue

                source_tag = f"NASA_OSD569_{tp}"
                existing = db.query(HealthRecord).filter(
                    HealthRecord.astronaut_id == pid,
                    HealthRecord.indicator == ind,
                    HealthRecord.source == source_tag,
                    HealthRecord.data_type == DataType.RESEARCH.value
                ).first()

                if not existing:
                    rec = HealthRecord(
                        astronaut_id=pid,
                        timestamp=base_date,
                        domain=dom,
                        indicator=ind,
                        value=float(val),
                        unit=unit,
                        source=source_tag,
                        data_type=DataType.RESEARCH.value,
                        confidence=0.99
                    )
                    db.add(rec)
                    ingested_count += 1

        # Ingest OSD-656 Key Urine Cytokines
        df_u = cls.load_osd656_urine()
        indicators_u = [
            ("il6_concentration_npq", "urine_il6", "NPQ", HealthDomain.IMMUNE.value),
            ("cxcl8_concentration_npq", "urine_cxcl8", "NPQ", HealthDomain.IMMUNE.value),
            ("il10_concentration_npq", "urine_il10", "NPQ", HealthDomain.IMMUNE.value),
            ("tnf_concentration_npq", "urine_tnf", "NPQ", HealthDomain.IMMUNE.value)
        ]

        for _, row in df_u.iterrows():
            pid = row["Participant"]
            tp = row["Timepoint"]
            for col, ind, unit, dom in indicators_u:
                val = row[col]
                if pd.isna(val):
                    continue

                source_tag = f"NASA_OSD656_{tp}"
                existing = db.query(HealthRecord).filter(
                    HealthRecord.astronaut_id == pid,
                    HealthRecord.indicator == ind,
                    HealthRecord.source == source_tag,
                    HealthRecord.data_type == DataType.RESEARCH.value
                ).first()

                if not existing:
                    rec = HealthRecord(
                        astronaut_id=pid,
                        timestamp=base_date,
                        domain=dom,
                        indicator=ind,
                        value=float(val),
                        unit=unit,
                        source=source_tag,
                        data_type=DataType.RESEARCH.value,
                        confidence=0.99
                    )
                    db.add(rec)
                    ingested_count += 1

        db.commit()
        return {
            "status": "SUCCESS",
            "new_records_ingested": ingested_count
        }

