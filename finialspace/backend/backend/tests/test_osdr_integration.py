import pytest
from fastapi import HTTPException
from app.database.connection import SessionLocal
from app.services.research.osdr_dataset_service import OSDRDatasetService
from app.services.research.unified_research_service import UnifiedResearchService
from app.api.analysis_routes import (
    list_unified_research_datasets,
    get_research_dataset_details,
    get_research_domain_data,
    get_research_participant_timeline,
    get_osd_cohort_summary,
    trigger_osdr_ingestion
)
from app.models.health_record import HealthRecord
from app.core.constants import DataType


@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    yield db
    db.close()


def test_osdr_file_discovery_and_metadata():
    """Verify official NASA OSD datasets are classified properly with correct status."""
    datasets = list_unified_research_datasets()
    ds_map = {d["dataset_id"]: d for d in datasets}

    # OSD-569 and OSD-656 are PARTIALLY_INTEGRATED (selected core indicators ingested)
    assert "NASA-OSD-569" in ds_map
    assert ds_map["NASA-OSD-569"]["status"] == "PARTIALLY_INTEGRATED"

    assert "NASA-OSD-656" in ds_map
    assert ds_map["NASA-OSD-656"]["status"] == "PARTIALLY_INTEGRATED"

    # OSD-570 and OSD-571 are SUMMARY_STATISTICS_INTEGRATED
    assert "NASA-OSD-570" in ds_map
    assert ds_map["NASA-OSD-570"]["status"] == "SUMMARY_STATISTICS_INTEGRATED"

    assert "NASA-OSD-571" in ds_map
    assert ds_map["NASA-OSD-571"]["status"] == "SUMMARY_STATISTICS_INTEGRATED"


def test_osd569_cbc_parsing_and_trajectory():
    """Verify OSD-569 Complete Blood Count parsing, participants, timepoints, and trajectories."""
    summary = OSDRDatasetService.get_osd569_cohort_summary()
    assert summary["study_accession"] == "OSD-569"
    assert summary["participants"] == ["C001", "C002", "C003", "C004"]
    assert summary["sample_count"] == 28
    assert "acute_r1_mean_shifts" in summary
    assert "wbc" in summary["acute_r1_mean_shifts"]
    assert "platelets" in summary["acute_r1_mean_shifts"]

    # Trajectory for C001
    traj = OSDRDatasetService.get_osd569_participant_trajectory("C001")
    assert traj["participant"] == "C001"
    assert "wbc" in traj["trajectories"]
    assert len(traj["trajectories"]["wbc"]) == 7


def test_osd656_urine_immune_parsing_and_trajectory():
    """Verify OSD-656 200-plex urine immune biomarker parsing and shift calculations."""
    summary = OSDRDatasetService.get_osd656_cohort_summary()
    assert summary["study_accession"] == "OSD-656"
    assert summary["participants"] == ["C001", "C002", "C003", "C004"]
    assert summary["sample_count"] == 22
    assert summary["total_biomarkers"] == 202
    assert "il6" in summary["acute_r1_mean_shifts"]
    assert "cxcl8" in summary["acute_r1_mean_shifts"]

    # Trajectory for C002
    traj = OSDRDatasetService.get_osd656_participant_trajectory("C002")
    assert traj["participant"] == "C002"
    assert "il6" in traj["trajectories"]
    assert len(traj["trajectories"]["il6"]) == 6


def test_osd571_and_osd570_high_dim_summaries():
    """Verify high-dimensional proteomics, metabolomics, and single-nucleus RNA differential summaries."""
    # OSD-571
    p_sum = OSDRDatasetService.get_osd571_summary()
    assert p_sum["study_accession"] == "OSD-571"
    assert len(p_sum["top_differentially_abundant_proteins"]) > 0
    assert len(p_sum["top_differentially_abundant_metabolites"]) > 0

    # OSD-570
    sn_sum = OSDRDatasetService.get_osd570_summary()
    assert sn_sum["study_accession"] == "OSD-570"
    assert len(sn_sum["top_cell_type_markers"]) > 0


def test_osdr_idempotent_ingestion(db_session):
    """Verify idempotent database ingestion without duplicate records or astronaut data corruption."""
    res1 = OSDRDatasetService.ingest_osd569_and_osd656(db_session)
    assert res1["status"] == "SUCCESS"

    # Second run should insert 0 new records
    res2 = OSDRDatasetService.ingest_osd569_and_osd656(db_session)
    assert res2["status"] == "SUCCESS"
    assert res2["new_records_ingested"] == 0

    # Ensure all ingested records are quarantined as DataType.RESEARCH
    recs = db_session.query(HealthRecord).filter(
        HealthRecord.astronaut_id.in_(["C001", "C002", "C003", "C004"])
    ).all()
    assert len(recs) > 0
    assert all(r.data_type == DataType.RESEARCH.value for r in recs)


def test_osdr_api_endpoints(db_session):
    """Verify new and updated API endpoints."""
    # 1. Dataset Details
    details_569 = get_research_dataset_details("NASA-OSD-569")
    assert details_569["status"] == "PARTIALLY_INTEGRATED"
    assert "cohort_summary" in details_569

    details_656 = get_research_dataset_details("NASA-OSD-656")
    assert details_656["status"] == "PARTIALLY_INTEGRATED"

    # 2. Cohort Summary Endpoint
    cohort = get_osd_cohort_summary("OSD-569")
    assert cohort["study_accession"] == "OSD-569"

    # 3. Domain Analysis Integration
    cardio = get_research_domain_data("cardiovascular", db=db_session)
    cardio_ds_ids = [d["dataset_id"] for d in cardio["connected_datasets"]]
    assert "NASA-OSD-569" in cardio_ds_ids

    immune = get_research_domain_data("immune", db=db_session)
    immune_ds_ids = [d["dataset_id"] for d in immune["connected_datasets"]]
    assert "NASA-OSD-569" in immune_ds_ids
    assert "NASA-OSD-656" in immune_ds_ids

    # 4. Multi-Omics Participant Timeline
    tl = get_research_participant_timeline("C001", db=db_session)
    assert "hematology_cbc_trajectory" in tl
    assert "urine_immune_trajectory" in tl

