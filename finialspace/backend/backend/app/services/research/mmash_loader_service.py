import os
import math
from datetime import datetime
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.constants import HealthDomain, DataType
from app.models.astronaut import Astronaut
from app.models.health_record import HealthRecord


class MMASHLoaderService:
    """
    Dedicated ingestion and preprocessing service for the MMASH dataset
    (Multilevel Monitoring of Activity and Sleep in Healthy people).

    Imports Earth-based terrestrial research data into AstroHealth AI under the
    'research' data type without altering astronaut clinical data or existing models.
    """

    DEFAULT_SUBPATHS = [
        os.path.join(settings.DATASETS_DIR, "raw", "AI astro", "MMASH"),
        os.path.join(settings.DATASETS_DIR, "raw", "AI astro", "AI astro", "MMASH"),
    ]

    @classmethod
    def resolve_mmash_dir(cls, custom_path: Optional[str] = None) -> str:
        """Resolve the MMASH directory location supporting single and nested extractions."""
        if custom_path and os.path.exists(custom_path):
            # Check if DataPaper is immediately inside
            if os.path.exists(os.path.join(custom_path, "DataPaper")):
                return os.path.join(custom_path, "DataPaper")
            return custom_path

        for p in cls.DEFAULT_SUBPATHS:
            dp = os.path.join(p, "DataPaper")
            if os.path.exists(dp):
                return dp
            if os.path.exists(p):
                return p

        raise FileNotFoundError(
            f"MMASH dataset directory not found in candidate paths: {cls.DEFAULT_SUBPATHS}"
        )

    @classmethod
    def list_participants(cls, mmash_dir: Optional[str] = None) -> List[str]:
        """List all valid MMASH user folders (e.g. user_1 to user_22) sorted numerically."""
        base_dir = cls.resolve_mmash_dir(mmash_dir)
        candidates = [
            d for d in os.listdir(base_dir)
            if os.path.isdir(os.path.join(base_dir, d)) and d.lower().startswith("user_")
        ]
        # Sort numerically by participant number
        def sort_key(name: str):
            try:
                return int(name.split("_")[1])
            except Exception:
                return 9999
        return sorted(candidates, key=sort_key)

    @classmethod
    def parse_demographics(cls, user_folder: str) -> Optional[Dict[str, Any]]:
        """Parse user_info.csv demographics."""
        fp = os.path.join(user_folder, "user_info.csv")
        if not os.path.exists(fp):
            return None
        df = pd.read_csv(fp)
        if df.empty:
            return None
        row = df.iloc[0].to_dict()
        return {
            "gender": str(row.get("Gender", "")).strip(),
            "weight_kg": float(row["Weight"]) if pd.notnull(row.get("Weight")) else None,
            "height_cm": float(row["Height"]) if pd.notnull(row.get("Height")) else None,
            "age_years": int(row["Age"]) if pd.notnull(row.get("Age")) else None,
            "source_file": "user_info.csv"
        }

    @classmethod
    def parse_sleep(cls, user_folder: str) -> List[Dict[str, Any]]:
        """
        Parse sleep.csv metrics (TST, Efficiency, WASO, Latency, Sleep Fragmentation).
        Rejects invalid or non-finite records.
        """
        fp = os.path.join(user_folder, "sleep.csv")
        if not os.path.exists(fp):
            return []
        df = pd.read_csv(fp)
        if df.empty:
            return []

        results = []
        for idx, row in df.iterrows():
            tst = row.get("Total Sleep Time (TST)")
            eff = row.get("Efficiency")
            waso = row.get("Wake After Sleep Onset (WASO)")
            latency = row.get("Latency")
            frag = row.get("Sleep Fragmentation Index")

            item = {"record_index": idx, "source_file": "sleep.csv"}
            if pd.notnull(tst) and not math.isnan(float(tst)):
                item["total_sleep_time_min"] = float(tst)
            if pd.notnull(eff) and not math.isnan(float(eff)):
                item["sleep_efficiency_pct"] = float(eff)
            if pd.notnull(waso) and not math.isnan(float(waso)):
                item["waso_min"] = float(waso)
            if pd.notnull(latency) and not math.isnan(float(latency)):
                item["sleep_latency_min"] = float(latency)
            if pd.notnull(frag) and not math.isnan(float(frag)):
                item["sleep_fragmentation_index"] = float(frag)

            results.append(item)
        return results

    @classmethod
    def parse_saliva(cls, user_folder: str) -> List[Dict[str, Any]]:
        """
        Parse saliva.csv for awakening and pre-bed normalized cortisol & melatonin.
        """
        fp = os.path.join(user_folder, "saliva.csv")
        if not os.path.exists(fp):
            return []
        df = pd.read_csv(fp)
        if df.empty:
            return []

        results = []
        for idx, row in df.iterrows():
            sample_type = str(row.get("SAMPLES", f"sample_{idx}")).strip().lower()
            cort = row.get("Cortisol NORM")
            mel = row.get("Melatonin NORM")

            item = {
                "sample_type": sample_type,
                "source_file": "saliva.csv",
                "cortisol_norm": float(cort) if pd.notnull(cort) and not math.isnan(float(cort)) else None,
                "melatonin_norm": float(mel) if pd.notnull(mel) and not math.isnan(float(mel)) else None
            }
            results.append(item)
        return results

    @classmethod
    def parse_questionnaire(cls, user_folder: str) -> Optional[Dict[str, Any]]:
        """Parse questionnaire.csv for psychological and anxiety scores."""
        fp = os.path.join(user_folder, "questionnaire.csv")
        if not os.path.exists(fp):
            return None
        df = pd.read_csv(fp)
        if df.empty:
            return None
        row = df.iloc[0].to_dict()
        return {
            "source_file": "questionnaire.csv",
            "meq_score": float(row["MEQ"]) if pd.notnull(row.get("MEQ")) else None,
            "stai1_score": float(row["STAI1"]) if pd.notnull(row.get("STAI1")) else None,
            "stai2_score": float(row["STAI2"]) if pd.notnull(row.get("STAI2")) else None,
            "daily_stress": float(row["Daily_stress"]) if pd.notnull(row.get("Daily_stress")) else None
        }

    @classmethod
    def compute_hrv_from_rr(cls, user_folder: str) -> Optional[Dict[str, Any]]:
        """
        Calculates standard aggregate time-domain HRV metrics from raw beat-to-beat RR.csv:
        - RMSSD: Root Mean Square of Successive Differences (ms)
        - SDNN: Standard Deviation of NN intervals (ms)
        - Mean Heart Rate: 60,000 / Mean(NN) (bpm)
        - NN50 / pNN50: Count and percentage of interval differences > 50ms

        Applies standard physiological filtering (300ms to 2000ms / 30 to 200 bpm).
        """
        fp = os.path.join(user_folder, "RR.csv")
        if not os.path.exists(fp):
            return None
        df = pd.read_csv(fp)
        if df.empty or "ibi_s" not in df.columns:
            return None

        # Convert seconds to milliseconds
        ibi_ms = df["ibi_s"].dropna().astype(float) * 1000.0

        # Filter physiological window
        valid_ibi = ibi_ms[(ibi_ms >= 300.0) & (ibi_ms <= 2000.0)].values
        if len(valid_ibi) < 10:
            return None

        diffs = np.diff(valid_ibi)
        rmssd = float(np.sqrt(np.mean(diffs ** 2)))
        sdnn = float(np.std(valid_ibi, ddof=1))
        mean_nn = float(np.mean(valid_ibi))
        mean_hr = float(60000.0 / mean_nn) if mean_nn > 0 else 0.0

        nn50 = int(np.sum(np.abs(diffs) > 50.0))
        pnn50 = float((nn50 / len(diffs)) * 100.0) if len(diffs) > 0 else 0.0

        return {
            "source_file": "RR.csv",
            "total_intervals": int(len(df)),
            "valid_intervals": int(len(valid_ibi)),
            "rmssd_ms": round(rmssd, 2),
            "sdnn_ms": round(sdnn, 2),
            "mean_hr_bpm": round(mean_hr, 2),
            "pnn50_pct": round(pnn50, 2)
        }

    @classmethod
    def parse_actigraph_summary(cls, user_folder: str) -> Optional[Dict[str, Any]]:
        """Parse Actigraph.csv for aggregate 24-hr steps and mean wearable HR."""
        fp = os.path.join(user_folder, "Actigraph.csv")
        if not os.path.exists(fp):
            return None
        df = pd.read_csv(fp)
        if df.empty:
            return None

        total_steps = float(df["Steps"].sum()) if "Steps" in df.columns else 0.0
        hr_valid = df[df["HR"] > 0]["HR"] if "HR" in df.columns else pd.Series()
        mean_hr = float(hr_valid.mean()) if not hr_valid.empty else None

        return {
            "source_file": "Actigraph.csv",
            "total_records": len(df),
            "total_steps": round(total_steps, 1),
            "wearable_mean_hr_bpm": round(mean_hr, 2) if mean_hr is not None else None
        }

    @classmethod
    def ingest_participant(
        cls,
        db: Session,
        participant_id: str,
        mmash_dir: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Ingests all available parsed research modalities for a given participant.
        Ensures participant exists as an Earth-based research subject in the database.
        Idempotent: skips duplicate records by matching (astronaut_id, indicator, timestamp, data_type).
        """
        base_dir = cls.resolve_mmash_dir(mmash_dir)
        user_folder = os.path.join(base_dir, participant_id.lower())
        if not os.path.exists(user_folder):
            # Try case-insensitive matching
            matches = [
                d for d in os.listdir(base_dir)
                if d.lower() == participant_id.lower()
            ]
            if not matches:
                raise FileNotFoundError(f"Participant folder for '{participant_id}' not found in {base_dir}")
            user_folder = os.path.join(base_dir, matches[0])

        normalized_pid = f"MMASH_{participant_id.upper()}"
        demo = cls.parse_demographics(user_folder)

        # 1. Ensure Research Participant exists in astronauts table
        astro = db.query(Astronaut).filter(Astronaut.astronaut_id == normalized_pid).first()
        if not astro:
            astro = Astronaut(
                astronaut_id=normalized_pid,
                name=f"MMASH Earth Research Subject {participant_id.upper()}",
                mission_id="MMASH_TERRESTRIAL_RESEARCH",
                role="Earth Research Subject",
                mission_day=1,
                blood_type=None,
                created_at=datetime.utcnow()
            )
            db.add(astro)
            db.flush()

        records_to_insert = []
        provenance_base = {
            "origin": "MMASH_EARTH_RESEARCH",
            "participant_id": participant_id,
            "environment": "Terrestrial 1g ground study",
            "import_timestamp": datetime.utcnow().isoformat()
        }

        # Timestamp strategy: Assign deterministic synthetic timestamps within study window
        # to preserve temporal order without overwriting
        base_ts = datetime(2020, 1, 1, 8, 0, 0)

        # 2. HRV (Cardiovascular Domain)
        hrv = cls.compute_hrv_from_rr(user_folder)
        if hrv and hrv.get("rmssd_ms") is not None:
            records_to_insert.append({
                "domain": HealthDomain.CARDIOVASCULAR.value,
                "indicator": "hrv_rmssd",
                "value": hrv["rmssd_ms"],
                "unit": "ms",
                "source": "MMASH_Polar_H7_RR",
                "timestamp": base_ts,
                "metadata": {**provenance_base, **hrv}
            })
            records_to_insert.append({
                "domain": HealthDomain.CARDIOVASCULAR.value,
                "indicator": "heart_rate",
                "value": hrv["mean_hr_bpm"],
                "unit": "bpm",
                "source": "MMASH_Polar_H7_RR",
                "timestamp": base_ts,
                "metadata": {**provenance_base, **hrv}
            })

        # 3. Sleep (Behavioral Domain)
        sleep_records = cls.parse_sleep(user_folder)
        for idx, sl in enumerate(sleep_records):
            sleep_ts = datetime(2020, 1, 2, 7, 0, 0)
            if "total_sleep_time_min" in sl:
                records_to_insert.append({
                    "domain": HealthDomain.BEHAVIORAL.value,
                    "indicator": "sleep_duration",
                    "value": round(sl["total_sleep_time_min"] / 60.0, 2),  # hours
                    "unit": "hours",
                    "source": "MMASH_Actigraph_Sleep",
                    "timestamp": sleep_ts,
                    "metadata": {**provenance_base, **sl}
                })
            if "sleep_efficiency_pct" in sl:
                records_to_insert.append({
                    "domain": HealthDomain.BEHAVIORAL.value,
                    "indicator": "sleep_efficiency",
                    "value": sl["sleep_efficiency_pct"],
                    "unit": "%",
                    "source": "MMASH_Actigraph_Sleep",
                    "timestamp": sleep_ts,
                    "metadata": {**provenance_base, **sl}
                })

        # 4. Saliva (Immune & Neuroendocrine Domain)
        saliva_records = cls.parse_saliva(user_folder)
        for sal in saliva_records:
            st = sal["sample_type"]
            sal_ts = datetime(2020, 1, 2, 7, 30, 0) if "wake" in st else datetime(2020, 1, 1, 22, 30, 0)
            if sal.get("cortisol_norm") is not None:
                records_to_insert.append({
                    "domain": HealthDomain.IMMUNE.value,
                    "indicator": "salivary_cortisol_norm",
                    "value": sal["cortisol_norm"],
                    "unit": "norm_score",
                    "source": "MMASH_Saliva_Assay",
                    "timestamp": sal_ts,
                    "metadata": {**provenance_base, **sal}
                })
            if sal.get("melatonin_norm") is not None:
                records_to_insert.append({
                    "domain": HealthDomain.BEHAVIORAL.value,
                    "indicator": "salivary_melatonin_norm",
                    "value": sal["melatonin_norm"],
                    "unit": "norm_score",
                    "source": "MMASH_Saliva_Assay",
                    "timestamp": sal_ts,
                    "metadata": {**provenance_base, **sal}
                })

        # 5. Questionnaire (Behavioral / Stress Domain)
        q = cls.parse_questionnaire(user_folder)
        if q:
            q_ts = datetime(2020, 1, 1, 20, 0, 0)
            if q.get("daily_stress") is not None:
                records_to_insert.append({
                    "domain": HealthDomain.BEHAVIORAL.value,
                    "indicator": "perceived_daily_stress",
                    "value": q["daily_stress"],
                    "unit": "score",
                    "source": "MMASH_Questionnaire",
                    "timestamp": q_ts,
                    "metadata": {**provenance_base, **q}
                })
            if q.get("stai1_score") is not None:
                records_to_insert.append({
                    "domain": HealthDomain.BEHAVIORAL.value,
                    "indicator": "state_anxiety_stai1",
                    "value": q["stai1_score"],
                    "unit": "score",
                    "source": "MMASH_Questionnaire",
                    "timestamp": q_ts,
                    "metadata": {**provenance_base, **q}
                })

        # 6. Actigraph physical activity (Bone & Muscle / Behavioral)
        act = cls.parse_actigraph_summary(user_folder)
        if act and act.get("total_steps") is not None:
            act_ts = datetime(2020, 1, 1, 23, 59, 0)
            records_to_insert.append({
                "domain": HealthDomain.BEHAVIORAL.value,
                "indicator": "daily_step_count",
                "value": act["total_steps"],
                "unit": "steps",
                "source": "MMASH_Actigraph_GT3X",
                "timestamp": act_ts,
                "metadata": {**provenance_base, **act}
            })

        # Insert records idempotently
        inserted_count = 0
        skipped_count = 0

        for r in records_to_insert:
            # Duplicate check: check if (astronaut_id, indicator, timestamp, data_type) exists
            existing = db.query(HealthRecord).filter(
                HealthRecord.astronaut_id == normalized_pid,
                HealthRecord.indicator == r["indicator"],
                HealthRecord.timestamp == r["timestamp"],
                HealthRecord.data_type == DataType.RESEARCH.value
            ).first()

            if existing:
                skipped_count += 1
                continue

            rec = HealthRecord(
                astronaut_id=normalized_pid,
                timestamp=r["timestamp"],
                domain=r["domain"],
                indicator=r["indicator"],
                value=r["value"],
                unit=r["unit"],
                source=r["source"],
                data_type=DataType.RESEARCH.value,
                confidence=1.0,
                extra_metadata=r["metadata"]
            )
            db.add(rec)
            inserted_count += 1

        db.commit()

        return {
            "participant_id": normalized_pid,
            "raw_participant": participant_id,
            "demographics": demo,
            "inserted_records": inserted_count,
            "skipped_duplicates": skipped_count,
            "total_modalities_processed": len(records_to_insert)
        }

    @classmethod
    def ingest_all(
        cls,
        db: Session,
        mmash_dir: Optional[str] = None
    ) -> Dict[str, Any]:
        """Ingest all discovered MMASH participants in sequence."""
        participants = cls.list_participants(mmash_dir)
        results = []
        total_inserted = 0
        total_skipped = 0

        for p in participants:
            res = cls.ingest_participant(db, p, mmash_dir=mmash_dir)
            total_inserted += res["inserted_records"]
            total_skipped += res["skipped_duplicates"]
            results.append(res)

        return {
            "study_name": "MMASH (Multilevel Monitoring of Activity and Sleep in Healthy people)",
            "participants_processed": len(results),
            "total_records_inserted": total_inserted,
            "total_duplicates_skipped": total_skipped,
            "participant_results": results
        }

