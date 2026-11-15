import pytest
import pandas as pd
from app.database.connection import SessionLocal
from app.models.health_record import HealthRecord
from app.core.constants import DataType
from app.services.research.mmash_loader_service import MMASHLoaderService
from app.services.research.osdr_dataset_service import OSDRDatasetService
from app.services.analytics.baseline_trajectory_service import BaselineTrajectoryAnalyzer


@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    yield db
    db.close()


def test_mmash_reconciliation_22_participants(db_session):
    """Verify all 22 MMASH participants are in database and total exactly 238 records."""
    mmash_recs = db_session.query(HealthRecord).filter(
        HealthRecord.data_type == DataType.RESEARCH.value,
        HealthRecord.astronaut_id.like("MMASH_%")
    ).all()
    participants = sorted(list(set(r.astronaut_id for r in mmash_recs)))

    assert len(participants) == 22
    assert "MMASH_USER_2" in participants
    assert "MMASH_USER_3" in participants
    assert len(mmash_recs) == 238


def test_osd575_unit_and_scaling_preservation():
    """Verify OSD-575 preserves assay units (pg/mL, ng/mL) and percentage calculations."""
    df = BaselineTrajectoryAnalyzer.load_dataset()

    # Raw units in column headers
    assert "crp_concentration_picogram_per_milliliter" in df.columns
    assert "pf4_concentration_nanogram_per_milliliter" in df.columns

    # Verify recalculation of CRP shift (+47.59%)
    r1_df = df[df["Timepoint"] == "R+1"]
    crp_shifts = r1_df["crp_concentration_picogram_per_milliliter_change_percent"].tolist()
    mean_crp_shift = round(float(pd.Series(crp_shifts).mean()), 2)
    assert mean_crp_shift == 47.59

    # Verify recalculation of PF4 shift (+17.09%)
    pf4_shifts = r1_df["pf4_concentration_nanogram_per_milliliter_change_percent"].tolist()
    mean_pf4_shift = round(float(pd.Series(pf4_shifts).mean()), 2)
    assert mean_pf4_shift == 17.09


def test_cbc_indicators_coverage_and_null_preservation():
    """Verify 20 numerical CBC indicators and null preservation in red-cell indices."""
    df_cbc = OSDRDatasetService.load_osd569_cbc()
    val_cols = [c for c in df_cbc.columns if "_value_" in c]
    assert len(val_cols) == 20

    # Ensure null values in red blood cell indices remain null
    assert df_cbc["mchc_value_grams_per_deciliter"].isna().sum() == 4
    assert df_cbc["mch_value_picogram"].isna().sum() == 2
    assert df_cbc["mcv_value_femtoliter"].isna().sum() == 1


def test_urine_immune_npq_nature():
    """Verify OSD-656 202 biomarkers are Normalized Protein Quantification (NPQ) units."""
    df_u = OSDRDatasetService.load_osd656_urine()
    npq_cols = [c for c in df_u.columns if c.endswith("_concentration_npq")]
    assert len(npq_cols) == 202
    assert len(df_u) == 22


def test_research_vs_operational_isolation(db_session):
    """Verify total segregation between RESEARCH, REAL, and SIMULATED data."""
    real_cnt = db_session.query(HealthRecord).filter(HealthRecord.data_type == DataType.REAL.value).count()
    sim_cnt = db_session.query(HealthRecord).filter(HealthRecord.data_type == DataType.SIMULATED.value).count()
    res_cnt = db_session.query(HealthRecord).filter(HealthRecord.data_type == DataType.RESEARCH.value).count()

    # REAL must be 0 (unpolluted operational astronaut channel)
    assert real_cnt == 0
    # SIMULATED has exactly 1 demo record
    assert sim_cnt == 1
    # RESEARCH has 466 records (238 MMASH + 140 OSD-569 + 88 OSD-656)
    assert res_cnt == 466

    # Verify no research subjects appear as live operational astronauts
    research_subjects = db_session.query(HealthRecord.astronaut_id).filter(
        HealthRecord.data_type == DataType.RESEARCH.value
    ).distinct().all()
    subject_ids = [s[0] for s in research_subjects]
    assert all(sid.startswith("MMASH_") or sid in ["C001", "C002", "C003", "C004"] for sid in subject_ids)

