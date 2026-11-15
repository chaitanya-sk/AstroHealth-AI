import os
from typing import Dict, Any, List, Optional
from datetime import datetime
import pandas as pd
from sqlalchemy.orm import Session

from app.core.constants import HealthDomain, DataType
from app.models.astronaut import Astronaut
from app.models.health_record import HealthRecord
from app.services.analytics.baseline_trajectory_service import BaselineTrajectoryAnalyzer
from app.services.research.mmash_loader_service import MMASHLoaderService
from app.services.research.osdr_dataset_service import OSDRDatasetService


class UnifiedResearchService:
    """
    Unified Research Data Layer for AstroHealth AI.

    Connects empirical research datasets (NASA OSD-575 spaceflight multi-omics and
    MMASH terrestrial multi-sensor tracking) to the 6 AstroHealth AI health domains.

    Enforces strict separation from operational astronaut telemetry, maintains dataset
    provenance, and exposes harmonized comparison and domain-readiness interfaces.
    """

    AVAILABLE_DATASETS = {
        "NASA-OSD-575": {
            "dataset_id": "NASA-OSD-575",
            "title": "NASA OSD-575 / Inspiration4 Serum Multi-Plex Proteomics & Cytokines",
            "environment": "Short-Duration Spaceflight (Orbital Microgravity)",
            "organism": "Homo sapiens",
            "cohort_size": 4,
            "participants": ["C001", "C002", "C003", "C004"],
            "timepoints": ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82", "R+194"],
            "connected_domains": ["immune", "cardiovascular"],
            "data_category": "spaceflight_research",
            "status": "FULLY_INTEGRATED"
        },
        "MMASH": {
            "dataset_id": "MMASH",
            "title": "Multilevel Monitoring of Activity and Sleep in Healthy people (MMASH)",
            "environment": "Terrestrial 1g Daily Living Ground Study",
            "organism": "Homo sapiens",
            "cohort_size": 22,
            "participants": [f"MMASH_USER_{i}" for i in range(1, 23)],
            "timepoints": ["24-Hour Continuous Monitoring"],
            "connected_domains": ["cardiovascular", "behavioral", "immune"],
            "data_category": "terrestrial_ground_research",
            "status": "FULLY_INTEGRATED"
        },
        "NASA-OSD-569": {
            "dataset_id": "NASA-OSD-569",
            "title": "Inspiration4 Whole Blood Complete Blood Count & Hematology Profile",
            "environment": "Short-Duration Spaceflight (Orbital Microgravity)",
            "organism": "Homo sapiens",
            "cohort_size": 4,
            "participants": ["C001", "C002", "C003", "C004"],
            "timepoints": ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82", "R+194"],
            "connected_domains": ["immune", "cardiovascular"],
            "status": "PARTIALLY_INTEGRATED",
            "primary_file": "OSD-569_CBC_TRANSFORMED.csv"
        },
        "NASA-OSD-570": {
            "dataset_id": "NASA-OSD-570",
            "title": "Inspiration4 PBMC Single-Cell RNA-seq & ATAC-seq Profiling",
            "environment": "Short-Duration Spaceflight (Orbital Microgravity)",
            "organism": "Homo sapiens",
            "cohort_size": 4,
            "participants": ["C001", "C002", "C003", "C004"],
            "connected_domains": ["immune"],
            "status": "SUMMARY_STATISTICS_INTEGRATED",
            "primary_file": "OSD-570_snRNA_PBMC_Gene_Expression.xlsx"
        },
        "NASA-OSD-571": {
            "dataset_id": "NASA-OSD-571",
            "title": "Inspiration4 Blood Plasma Proteomics & Metabolomics Profiling",
            "environment": "Short-Duration Spaceflight (Orbital Microgravity)",
            "organism": "Homo sapiens",
            "cohort_size": 4,
            "participants": ["C001", "C002", "C003", "C004"],
            "connected_domains": ["immune", "cardiovascular"],
            "status": "SUMMARY_STATISTICS_INTEGRATED",
            "primary_file": "OSD-571_Plasma_Proteomics_Processed.xlsx"
        },
        "NASA-OSD-656": {
            "dataset_id": "NASA-OSD-656",
            "title": "Inspiration4 Longitudinal Urine Immunoassay 200-Plex Panel",
            "environment": "Short-Duration Spaceflight (Orbital Microgravity)",
            "organism": "Homo sapiens",
            "cohort_size": 4,
            "participants": ["C001", "C002", "C003", "C004"],
            "timepoints": ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82"],
            "connected_domains": ["immune"],
            "status": "PARTIALLY_INTEGRATED",
            "primary_file": "OSD-656_urine_immune_TRANSFORMED.csv"
        }
    }

    @classmethod
    def list_research_datasets(cls) -> List[Dict[str, Any]]:
        """List all research datasets, their environment, and integration status."""
        return list(cls.AVAILABLE_DATASETS.values())

    @classmethod
    def get_dataset_details(cls, dataset_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve complete structural metadata and measurements for a specific research dataset."""
        clean_id = dataset_id.strip().upper()
        meta = cls.AVAILABLE_DATASETS.get(clean_id)
        if not meta:
            return None

        if clean_id == "NASA-OSD-575":
            cohort_data = BaselineTrajectoryAnalyzer.get_cohort_summary()
            return {
                **meta,
                "cohort_summary": cohort_data,
                "supported_markers": [
                    {"short_name": "crp", "label": "C-Reactive Protein", "unit": "pg/mL", "domain": "immune"},
                    {"short_name": "agp", "label": "Alpha-1-Acid Glycoprotein", "unit": "ng/mL", "domain": "immune"},
                    {"short_name": "haptoglobin", "label": "Haptoglobin", "unit": "ng/mL", "domain": "immune"},
                    {"short_name": "fibrinogen", "label": "Fibrinogen", "unit": "ng/mL", "domain": "immune"},
                    {"short_name": "pf4", "label": "Platelet Factor 4", "unit": "ng/mL", "domain": "cardiovascular (platelet activation)"},
                    {"short_name": "sap", "label": "Serum Amyloid P", "unit": "pg/mL", "domain": "immune"},
                    {"short_name": "a2_macroglobulin", "label": "Alpha-2-Macroglobulin", "unit": "ng/mL", "domain": "immune"},
                    {"short_name": "fetuin_a36", "label": "Fetuin-A", "unit": "ng/mL", "domain": "immune"},
                    {"short_name": "l_selectin", "label": "L-Selectin", "unit": "pg/mL", "domain": "immune"}
                ]
            }

        if clean_id == "MMASH":
            return {
                **meta,
                "total_time_series_rows": 3211973,
                "stored_database_records": 238,
                "supported_modalities": [
                    {"modality": "Beat-to-beat RR Intervals", "indicators": ["hrv_rmssd", "hrv_sdnn", "heart_rate", "pnn50"], "domain": "cardiovascular"},
                    {"modality": "Sleep Polysomnography/Actigraphy", "indicators": ["sleep_duration", "sleep_efficiency", "waso"], "domain": "behavioral"},
                    {"modality": "Triaxial Accelerometry", "indicators": ["daily_step_count"], "domain": "behavioral"},
                    {"modality": "Salivary Immunoassay", "indicators": ["salivary_cortisol_norm", "salivary_melatonin_norm"], "domain": "immune / behavioral"},
                    {"modality": "Psychometrics", "indicators": ["state_anxiety_stai1", "perceived_daily_stress"], "domain": "behavioral"}
                ]
            }

        if clean_id == "NASA-OSD-569":
            summary = OSDRDatasetService.get_osd569_cohort_summary()
            return {
                **meta,
                "cohort_summary": summary,
                "supported_markers": OSDRDatasetService.DATASET_METADATA["NASA-OSD-569"]["supported_indicators"]
            }

        if clean_id == "NASA-OSD-656":
            summary = OSDRDatasetService.get_osd656_cohort_summary()
            return {
                **meta,
                "cohort_summary": summary,
                "supported_markers": OSDRDatasetService.DATASET_METADATA["NASA-OSD-656"]["supported_indicators"]
            }

        if clean_id == "NASA-OSD-571":
            summary = OSDRDatasetService.get_osd571_summary()
            return {
                **meta,
                "cohort_summary": summary,
                "supported_markers": OSDRDatasetService.DATASET_METADATA["NASA-OSD-571"]["supported_indicators"]
            }

        if clean_id == "NASA-OSD-570":
            summary = OSDRDatasetService.get_osd570_summary()
            return {
                **meta,
                "cohort_summary": summary,
                "supported_markers": OSDRDatasetService.DATASET_METADATA["NASA-OSD-570"]["supported_indicators"]
            }

        return meta

    @classmethod
    def get_research_domain_summary(cls, domain: str, db: Session) -> Dict[str, Any]:
        """
        Retrieves all research telemetry and cohort evidence connected to a specific health domain.
        Handles domains with and without active research data.
        """
        clean_domain = domain.strip().lower()

        # Bone & Muscle, Radiation, Environment have no empirical research datasets in this release
        if clean_domain in ["bone_muscle", "radiation", "environment"]:
            domain_labels = {
                "bone_muscle": "Bone and Muscle Health",
                "radiation": "Space Radiation Exposure",
                "environment": "Cabin Life Support & Environment"
            }
            return {
                "domain": clean_domain,
                "domain_label": domain_labels.get(clean_domain, clean_domain),
                "research_data_availability": "NO_RESEARCH_DATASET_AVAILABLE",
                "message": (
                    f"No empirical research dataset is currently connected for {clean_domain}. "
                    "The operational dashboard evaluates deterministic spaceflight engineering limits and simulated training records."
                ),
                "available_research_records_count": 0,
                "connected_datasets": []
            }

        # 1. Cardiovascular Domain
        if clean_domain == "cardiovascular":
            # Retrieve MMASH records from DB
            mmash_records = db.query(HealthRecord).filter(
                HealthRecord.domain == HealthDomain.CARDIOVASCULAR.value,
                HealthRecord.data_type == DataType.RESEARCH.value
            ).all()

            # Retrieve OSD-575 PF4 vascular chemokine data
            osd_cohort = BaselineTrajectoryAnalyzer.get_cohort_summary()
            pf4_shift = osd_cohort.get("cohort_r1_mean_shift_percent", {}).get("pf4", 17.09)

            return {
                "domain": "cardiovascular",
                "domain_label": "Cardiovascular & Autonomic Health",
                "research_data_availability": "RESEARCH_DATA_AVAILABLE",
                "connected_datasets": [
                    {
                        "dataset_id": "MMASH",
                        "title": "MMASH Autonomic HRV & Heart Rate (22 Terrestrial Subjects)",
                        "record_count": len(mmash_records),
                        "indicators_supported": ["hrv_rmssd", "heart_rate"],
                        "source": "Polar H7 ECG Beat-to-Beat Chest Strap"
                    },
                    {
                        "dataset_id": "NASA-OSD-575",
                        "title": "NASA OSD-575 Inspiration4 Platelet Factor 4 (PF4)",
                        "record_count": 28,
                        "indicators_supported": ["pf4 (platelet activation / endothelial stress)"],
                        "cohort_r1_mean_shift_percent": pf4_shift,
                        "source": "Eve Technologies HDCVD9 Discovery Assay"
                    }
                ],
                "total_research_records": len(mmash_records) + 28,
                "scientific_distinction": "MMASH provides continuous 1g autonomic variability; OSD-575 provides spaceflight post-landing platelet endothelial response. They are evaluated as separate evidence streams."
            }

        # 2. Immune Domain
        if clean_domain == "immune":
            osd_cohort = BaselineTrajectoryAnalyzer.get_cohort_summary()
            mmash_cort = db.query(HealthRecord).filter(
                HealthRecord.domain == HealthDomain.IMMUNE.value,
                HealthRecord.indicator == "salivary_cortisol_norm",
                HealthRecord.data_type == DataType.RESEARCH.value
            ).all()

            return {
                "domain": "immune",
                "domain_label": "Immune System & Acute-Phase Reactants",
                "research_data_availability": "RESEARCH_DATA_AVAILABLE",
                "connected_datasets": [
                    {
                        "dataset_id": "NASA-OSD-575",
                        "title": "NASA OSD-575 Inspiration4 Serum Inflammatory Multi-Omics",
                        "record_count": 28,
                        "participants": 4,
                        "indicators_supported": ["crp", "agp", "haptoglobin", "fibrinogen", "sap", "a2_macroglobulin", "fetuin_a36", "l_selectin"],
                        "cohort_r1_mean_shift_percent": osd_cohort.get("cohort_r1_mean_shift_percent", {})
                    },
                    {
                        "dataset_id": "MMASH",
                        "title": "MMASH Salivary Cortisol Diurnal Response",
                        "record_count": len(mmash_cort),
                        "participants": 21,
                        "indicators_supported": ["salivary_cortisol_norm (awakening vs bedtime CAR response)"]
                    }
                ],
                "total_research_records": len(mmash_cort) + 28,
                "scientific_distinction": "OSD-575 evaluates systemic post-flight acute inflammation; MMASH evaluates circadian neuroendocrine cortisol variation."
            }

        # 3. Behavioral Domain
        if clean_domain == "behavioral":
            beh_records = db.query(HealthRecord).filter(
                HealthRecord.domain == HealthDomain.BEHAVIORAL.value,
                HealthRecord.data_type == DataType.RESEARCH.value
            ).all()

            return {
                "domain": "behavioral",
                "domain_label": "Behavioral & Mental Health",
                "research_data_availability": "RESEARCH_DATA_AVAILABLE",
                "connected_datasets": [
                    {
                        "dataset_id": "MMASH",
                        "title": "MMASH Sleep Architecture, Physical Activity & Stress Questionnaires",
                        "record_count": len(beh_records),
                        "participants": 22,
                        "indicators_supported": [
                            "sleep_duration", "sleep_efficiency", "salivary_melatonin_norm",
                            "daily_step_count", "state_anxiety_stai1", "perceived_daily_stress"
                        ]
                    }
                ],
                "total_research_records": len(beh_records),
                "scientific_distinction": "Terrestrial multi-modal behavioral baseline in healthy adults."
            }

        return {
            "domain": clean_domain,
            "research_data_availability": "UNKNOWN_DOMAIN"
        }

    @classmethod
    def get_research_participant_timeline(
        cls,
        participant_id: str,
        db: Session
    ) -> Dict[str, Any]:
        """
        Retrieves a complete research timeline for an individual research subject,
        whether from NASA OSD-575 (e.g. C001) or MMASH (e.g. MMASH_USER_1).
        """
        clean_id = participant_id.strip().upper()

        # Case A: NASA Inspiration4 Spaceflight Participant (C001 - C004)
        if clean_id in ["C001", "C002", "C003", "C004"]:
            res_osd575 = BaselineTrajectoryAnalyzer.get_subject_trajectory(clean_id)
            res_osd569 = OSDRDatasetService.get_osd569_participant_trajectory(clean_id)
            res_osd656 = OSDRDatasetService.get_osd656_participant_trajectory(clean_id)
            return {
                "dataset_id": "NASA-OSD-575",
                "connected_datasets": ["NASA-OSD-575", "NASA-OSD-569", "NASA-OSD-656"],
                "participant_id": clean_id,
                "environment": "Spaceflight (Orbital Microgravity)",
                "mission_name": "Inspiration4",
                "timeline_type": "Longitudinal Spaceflight Repeated Measures",
                "data_provenance": "NASA OSDR Studies OSD-575, OSD-569, OSD-656",
                "trajectory_data": res_osd575,
                "hematology_cbc_trajectory": res_osd569.get("trajectories", {}),
                "urine_immune_trajectory": res_osd656.get("trajectories", {})
            }

        # Case B: MMASH Terrestrial Research Participant (MMASH_USER_1 - MMASH_USER_22)
        target_pid = clean_id if clean_id.startswith("MMASH_") else f"MMASH_{clean_id}"
        records = db.query(HealthRecord).filter(
            HealthRecord.astronaut_id == target_pid,
            HealthRecord.data_type == DataType.RESEARCH.value
        ).all()

        if not records:
            return {
                "error": f"Research participant '{participant_id}' not found in any connected research dataset."
            }

        timeline_points = []
        for r in records:
            timeline_points.append({
                "timestamp": r.timestamp.isoformat() if r.timestamp else None,
                "domain": r.domain,
                "indicator": r.indicator,
                "value": r.value,
                "unit": r.unit,
                "source": r.source,
                "metadata": r.extra_metadata
            })

        return {
            "dataset_id": "MMASH",
            "participant_id": target_pid,
            "environment": "Terrestrial 1g Daily Living Ground Study",
            "timeline_type": "24-Hour Continuous Multi-Sensor Monitoring",
            "data_provenance": "PhysioNet MMASH Collection",
            "total_records": len(timeline_points),
            "records": timeline_points
        }

    @classmethod
    def compare_research_vs_operational(
        cls,
        astronaut_id: str,
        indicator: str,
        db: Session
    ) -> Dict[str, Any]:
        """
        Produces a side-by-side benchmark comparison between an operational astronaut's
        real/simulated indicator and the empirical research distribution (MMASH or OSD-575).
        Maintains strict separation: research records are never blended into operational stats.
        """
        clean_astro_id = astronaut_id.strip().upper()
        clean_ind = indicator.strip().lower()

        # 1. Operational Astronaut Telemetry
        astro_rec = db.query(HealthRecord).filter(
            HealthRecord.astronaut_id == clean_astro_id,
            HealthRecord.indicator == clean_ind,
            HealthRecord.data_type == DataType.REAL.value
        ).order_by(HealthRecord.timestamp.desc()).first()

        op_value = astro_rec.value if astro_rec else None
        op_unit = astro_rec.unit if astro_rec else None

        # 2. Benchmark against Research Datasets
        benchmark_info = {}
        if clean_ind in ["heart_rate", "hrv_rmssd", "sleep_duration", "daily_step_count"]:
            mmash_recs = db.query(HealthRecord.value).filter(
                HealthRecord.indicator == clean_ind,
                HealthRecord.data_type == DataType.RESEARCH.value
            ).all()

            if mmash_recs:
                vals = [r[0] for r in mmash_recs]
                benchmark_info = {
                    "benchmark_dataset": "MMASH (Terrestrial 1g, N=22)",
                    "research_mean": round(float(pd.Series(vals).mean()), 2),
                    "research_min": round(float(pd.Series(vals).min()), 2),
                    "research_max": round(float(pd.Series(vals).max()), 2),
                    "research_sample_size": len(vals)
                }

        elif clean_ind in ["crp", "pf4", "agp", "haptoglobin", "fibrinogen"]:
            osd_cohort = BaselineTrajectoryAnalyzer.get_cohort_summary()
            shift = osd_cohort.get("cohort_r1_mean_shift_percent", {}).get(clean_ind)
            benchmark_info = {
                "benchmark_dataset": "NASA OSD-575 (Inspiration4 Spaceflight, N=4)",
                "cohort_post_flight_r1_mean_shift_pct": shift,
                "research_sample_size": 4
            }

        return {
            "astronaut_id": clean_astro_id,
            "indicator": clean_ind,
            "operational_value": op_value,
            "operational_unit": op_unit,
            "operational_data_type": "REAL",
            "research_benchmark": benchmark_info,
            "methodology_note": "Research benchmark is displayed as an external population reference only. It is never used to alter or overwrite astronaut operational thresholds."
        }

    @classmethod
    def get_unified_domain_evidence_analysis(
        cls,
        domain: str,
        db: Session
    ) -> Dict[str, Any]:
        """
        Step 3 Unified Analysis Output:
        For each of the six domains, provides:
        - Domain name and label
        - Research availability status
        - Dataset and participant provenance
        - Available measurements, units, and distribution
        - Data quality, confidence, and freshness
        - Longitudinal trends (only when sufficient repeated measures exist)
        - Explainable observational findings
        - Evidence-supported aerospace recommendations
        - Explicit insufficient-data notices for unsupported domains
        """
        clean_domain = domain.strip().lower()
        now = datetime.utcnow()

        # Domains without research data: Bone & Muscle, Radiation, Environment
        if clean_domain in ["bone_muscle", "radiation", "environment"]:
            domain_meta = {
                "bone_muscle": ("Bone and Muscle Health", "NASA-STD-3001 Vol 1 Crew Health: Musculoskeletal Protocols"),
                "radiation": ("Space Radiation Exposure", "NASA Space Flight Human-System Standard: Radiation Protection"),
                "environment": ("Cabin Environment & Life Support", "NASA-STD-3001 Vol 2 Habitability: Atmospheric Standards")
            }
            label, ref = domain_meta.get(clean_domain, (clean_domain, "Aerospace Standards"))
            msg = (
                f"No empirical research dataset is currently connected for {clean_domain}. "
                "The operational dashboard evaluates deterministic spaceflight engineering limits and simulated training records."
            )
            return {
                "domain": clean_domain,
                "domain_label": label,
                "research_data_availability": "NO_RESEARCH_DATASET_AVAILABLE",
                "research_availability_status": "NO_RESEARCH_DATASET_AVAILABLE",
                "available_research_records_count": 0,
                "message": msg,
                "connected_datasets": [],
                "provenance": {
                    "source": "None",
                    "environment": "Operational Telemetry Only",
                    "participants": []
                },
                "available_measurements": [],
                "data_quality": {
                    "records_analyzed": 0,
                    "freshness_status": "NO_DATA",
                    "confidence_score": 0.0
                },
                "trends": [],
                "explainable_findings": [
                    f"No empirical research dataset is currently connected for {clean_domain}.",
                    "Operational flight surgeon monitoring relies on active vehicle sensor telemetry and simulated drills."
                ],
                "evidence_recommendations": [
                    f"Maintain active real-time telemetry streaming for {label}.",
                    "Ensure life-support and personal sensors undergo periodic calibration."
                ],
                "insufficient_data_notice": f"Empirical spaceflight or analogue research records are currently unavailable for {clean_domain}."
            }

        # Domain 1: Cardiovascular
        if clean_domain == "cardiovascular":
            # Retrieve MMASH records
            mmash_recs = db.query(HealthRecord).filter(
                HealthRecord.domain == HealthDomain.CARDIOVASCULAR.value,
                HealthRecord.data_type == DataType.RESEARCH.value
            ).all()

            hrv_vals = [r.value for r in mmash_recs if r.indicator == "hrv_rmssd"]
            hr_vals = [r.value for r in mmash_recs if r.indicator == "heart_rate"]

            osd_cohort = BaselineTrajectoryAnalyzer.get_cohort_summary()
            pf4_shift = osd_cohort.get("cohort_r1_mean_shift_percent", {}).get("pf4", 17.09)
            osd569_summary = OSDRDatasetService.get_osd569_cohort_summary()
            plt_shift = osd569_summary.get("acute_r1_mean_shifts", {}).get("platelets", {}).get("shift_percent", 10.27)

            measurements = [
                {
                    "indicator": "hrv_rmssd",
                    "label": "Root Mean Square of Successive RR Differences",
                    "unit": "ms",
                    "dataset_source": "MMASH (22 Terrestrial Subjects)",
                    "sample_size": len(hrv_vals),
                    "mean": round(float(pd.Series(hrv_vals).mean()), 2) if hrv_vals else None,
                    "min": round(float(pd.Series(hrv_vals).min()), 2) if hrv_vals else None,
                    "max": round(float(pd.Series(hrv_vals).max()), 2) if hrv_vals else None,
                    "physiological_context": "Vagal/parasympathetic autonomic modulation at 1g rest."
                },
                {
                    "indicator": "heart_rate",
                    "label": "Resting Heart Rate",
                    "unit": "bpm",
                    "dataset_source": "MMASH (22 Terrestrial Subjects)",
                    "sample_size": len(hr_vals),
                    "mean": round(float(pd.Series(hr_vals).mean()), 2) if hr_vals else None,
                    "min": round(float(pd.Series(hr_vals).min()), 2) if hr_vals else None,
                    "max": round(float(pd.Series(hr_vals).max()), 2) if hr_vals else None,
                    "physiological_context": "Continuous 24-hr chronotropic distribution."
                },
                {
                    "indicator": "pf4",
                    "label": "Platelet Factor 4 (CXCL4)",
                    "unit": "ng/mL",
                    "dataset_source": "NASA OSD-575 (Inspiration4 Spaceflight, N=4)",
                    "sample_size": 4,
                    "post_flight_r1_mean_shift_percent": pf4_shift,
                    "physiological_context": "Vascular endothelial stress and platelet activation following spaceflight orbital re-entry."
                },
                {
                    "indicator": "platelets",
                    "label": "Platelet Count (CBC)",
                    "unit": "10^3/uL",
                    "dataset_source": "NASA OSD-569 (Inspiration4 Spaceflight, N=4)",
                    "sample_size": 4,
                    "post_flight_r1_mean_shift_percent": plt_shift,
                    "physiological_context": "Whole blood platelet count confirming post-re-entry thrombocytosis."
                }
            ]

            findings = [
                f"MMASH cohort provides normative 1g ground baseline autonomic tone across {len(hrv_vals)} subjects (mean RMSSD {round(float(pd.Series(hrv_vals).mean()), 1) if hrv_vals else 0} ms).",
                f"NASA OSD-575 reflects acute spaceflight re-entry stress with mean post-flight PF4 shift of +{pf4_shift}% across 4 civilian astronauts.",
                f"NASA OSD-569 whole blood hematology corroborates post-flight thrombocytosis with mean platelet shift of +{plt_shift}% at R+1."
            ]

            recs = [
                "Utilize MMASH autonomic variability boundaries for baseline comparison against operational astronaut resting HRV.",
                "Monitor post-landing platelet and endothelial biomarkers alongside continuous orthostatic vitals."
            ]

            connected_ds = [
                {
                    "dataset_id": "MMASH",
                    "title": "MMASH Autonomic HRV & Heart Rate (22 Terrestrial Subjects)",
                    "record_count": len(mmash_recs),
                    "indicators_supported": ["hrv_rmssd", "heart_rate"],
                    "source": "Polar H7 ECG Beat-to-Beat Chest Strap"
                },
                {
                    "dataset_id": "NASA-OSD-575",
                    "title": "NASA OSD-575 Inspiration4 Platelet Factor 4 (PF4)",
                    "record_count": 28,
                    "indicators_supported": ["pf4"],
                    "cohort_r1_mean_shift_percent": pf4_shift,
                    "source": "Eve Technologies HDCVD9 Discovery Assay"
                },
                {
                    "dataset_id": "NASA-OSD-569",
                    "title": "NASA OSD-569 Inspiration4 Hematology & Platelet Count",
                    "record_count": 28,
                    "indicators_supported": ["platelets", "hemoglobin", "hematocrit", "rbc"],
                    "cohort_r1_mean_shift_percent": plt_shift,
                    "source": "NASA OSDR Whole Blood Sysmex Hematology"
                }
            ]

            return {
                "domain": "cardiovascular",
                "domain_label": "Cardiovascular & Autonomic Regulation",
                "research_data_availability": "RESEARCH_DATA_AVAILABLE",
                "research_availability_status": "RESEARCH_DATA_AVAILABLE",
                "connected_datasets": connected_ds,
                "provenance": {
                    "mmash": "PhysioNet MMASH Collection, Polar H7 ECG, Terrestrial 1g",
                    "nasa_osd575": "NASA OSDR OSD-575, Eve Technologies HDCVD9 Discovery Assay, Inspiration4 Orbital Spaceflight",
                    "participants": [f"MMASH_USER_{i}" for i in range(1, 23)] + ["C001", "C002", "C003", "C004"]
                },
                "available_measurements": measurements,
                "data_quality": {
                    "records_analyzed": len(mmash_recs) + 28,
                    "freshness_status": "HISTORICAL_RESEARCH_COHORT",
                    "confidence_score": 0.95
                },
                "trends": [
                    {"indicator": "pf4", "study": "NASA OSD-575", "trajectory": "Pre-flight baseline -> R+1 acute surge -> Recovery by R+82"}
                ],
                "explainable_findings": findings,
                "evidence_recommendations": recs,
                "insufficient_data_notice": None
            }

        # Domain 2: Immune
        if clean_domain == "immune":
            osd_cohort = BaselineTrajectoryAnalyzer.get_cohort_summary()
            shifts = osd_cohort.get("cohort_r1_mean_shift_percent", {})

            cort_recs = db.query(HealthRecord).filter(
                HealthRecord.domain == HealthDomain.IMMUNE.value,
                HealthRecord.indicator == "salivary_cortisol_norm",
                HealthRecord.data_type == DataType.RESEARCH.value
            ).all()
            cort_vals = [r.value for r in cort_recs]

            osd569_summary = OSDRDatasetService.get_osd569_cohort_summary()
            wbc_shift = osd569_summary.get("acute_r1_mean_shifts", {}).get("wbc", {}).get("shift_percent", -15.04)
            osd656_summary = OSDRDatasetService.get_osd656_cohort_summary()
            il6_shift = osd656_summary.get("acute_r1_mean_shifts", {}).get("il6", {}).get("shift_percent", 16.56)

            measurements = [
                {
                    "indicator": "crp",
                    "label": "C-Reactive Protein",
                    "unit": "pg/mL",
                    "dataset_source": "NASA OSD-575 (Inspiration4 Spaceflight, N=4)",
                    "cohort_r1_mean_shift_percent": shifts.get("crp", 47.59),
                    "physiological_context": "Hepatocyte acute-phase response to systemic inflammatory and landing stress."
                },
                {
                    "indicator": "agp",
                    "label": "Alpha-1-Acid Glycoprotein",
                    "unit": "ng/mL",
                    "dataset_source": "NASA OSD-575 (Inspiration4 Spaceflight, N=4)",
                    "cohort_r1_mean_shift_percent": shifts.get("agp", -17.78),
                    "physiological_context": "Acute-phase modulator of capillary permeability."
                },
                {
                    "indicator": "haptoglobin",
                    "label": "Haptoglobin",
                    "unit": "ng/mL",
                    "dataset_source": "NASA OSD-575 (Inspiration4 Spaceflight, N=4)",
                    "cohort_r1_mean_shift_percent": shifts.get("haptoglobin", -14.01),
                    "physiological_context": "Free hemoglobin-binding antioxidant protein during tissue stress."
                },
                {
                    "indicator": "wbc",
                    "label": "White Blood Cell Count",
                    "unit": "10^3/uL",
                    "dataset_source": "NASA OSD-569 (Inspiration4 Spaceflight, N=4)",
                    "cohort_r1_mean_shift_percent": wbc_shift,
                    "physiological_context": "Total peripheral circulating leukocytes post-flight."
                },
                {
                    "indicator": "urine_il6",
                    "label": "Urine Interleukin-6 (IL-6)",
                    "unit": "NPQ",
                    "dataset_source": "NASA OSD-656 (Inspiration4 Spaceflight, N=4)",
                    "cohort_r1_mean_shift_percent": il6_shift,
                    "physiological_context": "Non-invasive renal inflammatory cytokine excretion."
                },
                {
                    "indicator": "salivary_cortisol_norm",
                    "label": "Normalized Salivary Cortisol",
                    "unit": "norm_score",
                    "dataset_source": "MMASH (21 Terrestrial Subjects)",
                    "sample_size": len(cort_vals),
                    "mean": round(float(pd.Series(cort_vals).mean()), 4) if cort_vals else None,
                    "physiological_context": "Diurnal hypothalamic-pituitary-adrenal (HPA) axis rhythm."
                }
            ]

            findings = [
                f"NASA OSD-575 demonstrates uniform post-landing acute-phase reactant activation across all 4 astronauts (cohort mean CRP shift +{shifts.get('crp', 47.59)}% at R+1).",
                f"NASA OSD-569 reveals transient leukocyte redistribution with mean WBC shift of {wbc_shift}% at R+1.",
                f"NASA OSD-656 200-plex urine panel corroborates immune activation with mean urine IL-6 shift of +{il6_shift}% at R+1.",
                f"MMASH salivary cortisol measures physiological circadian CAR response across {len(cort_vals)} samples, serving as a non-invasive neuroendocrine stress reference."
            ]

            recs = [
                "Track intra-individual longitudinal delta shifts (% change from pre-flight baseline) rather than population averages for flight crew.",
                "Incorporate non-invasive urine cytokine and saliva sampling protocols for in-mission immune surveillance."
            ]

            connected_ds = [
                {
                    "dataset_id": "NASA-OSD-575",
                    "title": "NASA OSD-575 Inspiration4 Serum Inflammatory Multi-Omics",
                    "record_count": 28,
                    "participants": 4,
                    "indicators_supported": ["crp", "agp", "haptoglobin", "fibrinogen", "sap", "a2_macroglobulin", "fetuin_a36", "l_selectin"],
                    "cohort_r1_mean_shift_percent": shifts
                },
                {
                    "dataset_id": "NASA-OSD-569",
                    "title": "NASA OSD-569 Inspiration4 Complete Blood Count",
                    "record_count": 28,
                    "participants": 4,
                    "indicators_supported": ["wbc", "lymphocytes_pct", "neutrophils_pct"],
                    "cohort_r1_mean_shift_percent": wbc_shift
                },
                {
                    "dataset_id": "NASA-OSD-656",
                    "title": "NASA OSD-656 Inspiration4 Urine 200-Plex Immune Panel",
                    "record_count": 22,
                    "participants": 4,
                    "indicators_supported": ["il6", "il10", "tnf", "cxcl8", "ager"],
                    "cohort_r1_mean_shift_percent": il6_shift
                },
                {
                    "dataset_id": "MMASH",
                    "title": "MMASH Salivary Cortisol Diurnal Response",
                    "record_count": len(cort_recs),
                    "participants": 21,
                    "indicators_supported": ["salivary_cortisol_norm"]
                }
            ]

            return {
                "domain": "immune",
                "domain_label": "Immune System & Acute-Phase Reactants",
                "research_data_availability": "RESEARCH_DATA_AVAILABLE",
                "research_availability_status": "RESEARCH_DATA_AVAILABLE",
                "connected_datasets": connected_ds,
                "provenance": {
                    "nasa_osd575": "NASA OSDR Study OSD-575 (Serum Multi-Plex HDCVD9 Panel)",
                    "mmash": "PhysioNet MMASH Collection (Salivary Immunoassay)",
                    "participants": ["C001", "C002", "C003", "C004"] + [f"MMASH_USER_{i}" for i in range(1, 23)]
                },
                "available_measurements": measurements,
                "data_quality": {
                    "records_analyzed": len(cort_recs) + 28,
                    "freshness_status": "HISTORICAL_RESEARCH_COHORT",
                    "confidence_score": 0.95
                },
                "trends": [
                    {"indicator": "crp", "study": "NASA OSD-575", "trajectory": "Baseline -> Acute +47.59% surge at R+1 -> Progressive return toward baseline"}
                ],
                "explainable_findings": findings,
                "evidence_recommendations": recs,
                "insufficient_data_notice": None
            }

        # Domain 3: Behavioral
        if clean_domain == "behavioral":
            beh_recs = db.query(HealthRecord).filter(
                HealthRecord.domain == HealthDomain.BEHAVIORAL.value,
                HealthRecord.data_type == DataType.RESEARCH.value
            ).all()

            sleep_vals = [r.value for r in beh_recs if r.indicator == "sleep_duration"]
            eff_vals = [r.value for r in beh_recs if r.indicator == "sleep_efficiency"]
            step_vals = [r.value for r in beh_recs if r.indicator == "daily_step_count"]
            stress_vals = [r.value for r in beh_recs if r.indicator == "perceived_daily_stress"]

            measurements = [
                {
                    "indicator": "sleep_duration",
                    "label": "Total Sleep Duration",
                    "unit": "hours",
                    "dataset_source": "MMASH Actigraph/Polysomnography",
                    "sample_size": len(sleep_vals),
                    "mean": round(float(pd.Series(sleep_vals).mean()), 2) if sleep_vals else None,
                    "min": round(float(pd.Series(sleep_vals).min()), 2) if sleep_vals else None,
                    "max": round(float(pd.Series(sleep_vals).max()), 2) if sleep_vals else None,
                    "physiological_context": "Daily objective sleep quantity in healthy adults."
                },
                {
                    "indicator": "sleep_efficiency",
                    "label": "Sleep Efficiency",
                    "unit": "%",
                    "dataset_source": "MMASH Actigraph/Polysomnography",
                    "sample_size": len(eff_vals),
                    "mean": round(float(pd.Series(eff_vals).mean()), 2) if eff_vals else None,
                    "physiological_context": "Percentage of time in bed spent asleep."
                },
                {
                    "indicator": "daily_step_count",
                    "label": "24-Hour Cumulative Steps",
                    "unit": "steps",
                    "dataset_source": "MMASH Triaxial Accelerometer",
                    "sample_size": len(step_vals),
                    "mean": round(float(pd.Series(step_vals).mean()), 1) if step_vals else None,
                    "physiological_context": "Ground ambulatory physical activity index."
                },
                {
                    "indicator": "perceived_daily_stress",
                    "label": "Perceived Stress Questionnaire Score",
                    "unit": "score",
                    "dataset_source": "MMASH Daily Survey",
                    "sample_size": len(stress_vals),
                    "mean": round(float(pd.Series(stress_vals).mean()), 1) if stress_vals else None,
                    "physiological_context": "Self-reported daily psychological strain."
                }
            ]

            findings = [
                f"MMASH cohort provides multi-modal behavioral baseline tracking sleep architecture ({round(float(pd.Series(sleep_vals).mean()), 1) if sleep_vals else 0}h mean sleep) and physical activity across 22 participants.",
                "Terrestrial sleep fragmentation and actigraphy indices establish normative diurnal distributions without requiring in-flight invasive monitoring."
            ]

            recs = [
                "Utilize actigraphy-derived sleep efficiency metrics as non-invasive behavioral monitors for spaceflight circadian alignment.",
                "Maintain scheduled rest periods of >= 8.0 hours in compliance with NASA-STD-3001 behavioral sleep hygiene guidelines."
            ]

            connected_ds = [
                {
                    "dataset_id": "MMASH",
                    "title": "MMASH Sleep Architecture, Physical Activity & Stress Questionnaires",
                    "record_count": len(beh_recs),
                    "participants": 22,
                    "indicators_supported": [
                        "sleep_duration", "sleep_efficiency", "salivary_melatonin_norm",
                        "daily_step_count", "state_anxiety_stai1", "perceived_daily_stress"
                    ]
                }
            ]

            return {
                "domain": "behavioral",
                "domain_label": "Behavioral Health & Sleep Architecture",
                "research_data_availability": "RESEARCH_DATA_AVAILABLE",
                "research_availability_status": "RESEARCH_DATA_AVAILABLE",
                "connected_datasets": connected_ds,
                "provenance": {
                    "source": "PhysioNet MMASH Collection, ActiGraph GT3X+ Accelerometer and Validated Surveys",
                    "environment": "Terrestrial 1g Daily Living Ground Study",
                    "participants": [f"MMASH_USER_{i}" for i in range(1, 23)]
                },
                "available_measurements": measurements,
                "data_quality": {
                    "records_analyzed": len(beh_recs),
                    "freshness_status": "HISTORICAL_RESEARCH_COHORT",
                    "confidence_score": 0.95
                },
                "trends": [],
                "explainable_findings": findings,
                "evidence_recommendations": recs,
                "insufficient_data_notice": None
            }

        return {
            "domain": clean_domain,
            "research_availability_status": "UNKNOWN_DOMAIN"
        }

