import os
import pytest
from app.database.connection import SessionLocal
from app.models.astronaut import Astronaut
from app.models.health_record import HealthRecord
from app.core.constants import DataType
from app.services.research.mmash_loader_service import MMASHLoaderService


@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    yield db
    # Ensure all participants remain preserved in the persistent database
    MMASHLoaderService.ingest_participant(db, "user_2")
    MMASHLoaderService.ingest_participant(db, "user_3")
    db.close()


def test_resolve_mmash_dir_and_list_participants():
    """Verify MMASH root folder resolution and numeric participant sorting."""
    mmash_dir = MMASHLoaderService.resolve_mmash_dir()
    assert os.path.exists(mmash_dir)
    assert os.path.basename(mmash_dir) == "DataPaper"

    participants = MMASHLoaderService.list_participants()
    assert len(participants) == 22
    assert participants[0] == "user_1"
    assert participants[1] == "user_2"
    assert participants[-1] == "user_22"


def test_parse_demographics():
    """Verify demographics extraction and field types."""
    base_dir = MMASHLoaderService.resolve_mmash_dir()
    user1_dir = os.path.join(base_dir, "user_1")
    demo = MMASHLoaderService.parse_demographics(user1_dir)
    assert demo is not None
    assert demo["gender"] == "M"
    assert demo["weight_kg"] == 65.0
    assert demo["height_cm"] == 169.0
    assert demo["age_years"] == 29
    assert demo["source_file"] == "user_info.csv"


def test_parse_sleep():
    """Verify sleep metrics parsing and unit safety."""
    base_dir = MMASHLoaderService.resolve_mmash_dir()
    user1_dir = os.path.join(base_dir, "user_1")
    sleep_records = MMASHLoaderService.parse_sleep(user1_dir)
    assert len(sleep_records) == 2
    for s in sleep_records:
        assert "total_sleep_time_min" in s
        assert "sleep_efficiency_pct" in s
        assert s["total_sleep_time_min"] > 0
        assert 0 <= s["sleep_efficiency_pct"] <= 100


def test_parse_saliva():
    """Verify saliva parsing for waking and bed cortisol & melatonin."""
    base_dir = MMASHLoaderService.resolve_mmash_dir()
    user1_dir = os.path.join(base_dir, "user_1")
    sal_records = MMASHLoaderService.parse_saliva(user1_dir)
    assert len(sal_records) == 2
    types = [s["sample_type"] for s in sal_records]
    assert "before sleep" in types
    assert "wake up" in types
    assert sal_records[0]["cortisol_norm"] is not None


def test_compute_hrv_from_rr():
    """Verify aggregate HRV metrics computation from raw RR beat intervals."""
    base_dir = MMASHLoaderService.resolve_mmash_dir()
    user1_dir = os.path.join(base_dir, "user_1")
    hrv = MMASHLoaderService.compute_hrv_from_rr(user1_dir)
    assert hrv is not None
    assert hrv["rmssd_ms"] > 0
    assert hrv["sdnn_ms"] > 0
    assert 40 <= hrv["mean_hr_bpm"] <= 150
    assert hrv["valid_intervals"] > 1000
    assert hrv["source_file"] == "RR.csv"


def test_missing_values_and_files_handled_gracefully():
    """Verify missing files or empty directories do not raise unhandled exceptions."""
    import tempfile
    with tempfile.TemporaryDirectory() as empty_dir:
        assert MMASHLoaderService.parse_demographics(empty_dir) is None
        assert MMASHLoaderService.parse_sleep(empty_dir) == []
        assert MMASHLoaderService.parse_saliva(empty_dir) == []
        assert MMASHLoaderService.parse_questionnaire(empty_dir) is None
        assert MMASHLoaderService.compute_hrv_from_rr(empty_dir) is None
        assert MMASHLoaderService.parse_actigraph_summary(empty_dir) is None


def test_participant_ingestion_and_id_preservation(db_session):
    """
    Verify participant ingestion into the database:
    - ID preservation with distinct MMASH prefix (MMASH_USER_2)
    - Records stored under DataType.RESEARCH
    - Modalities span cardiovascular, behavioral, immune
    """
    res = MMASHLoaderService.ingest_participant(db_session, "user_2")
    assert res["participant_id"] == "MMASH_USER_2"
    assert res["raw_participant"] == "user_2"
    assert (res["inserted_records"] > 0) or (res["skipped_duplicates"] > 0)

    # Verify participant is in astronauts table
    astro = db_session.query(Astronaut).filter(Astronaut.astronaut_id == "MMASH_USER_2").first()
    assert astro is not None
    assert "MMASH" in astro.name
    assert astro.mission_id == "MMASH_TERRESTRIAL_RESEARCH"

    # Verify health records are labeled as 'research'
    records = db_session.query(HealthRecord).filter(HealthRecord.astronaut_id == "MMASH_USER_2").all()
    assert len(records) > 0
    for r in records:
        assert r.data_type == DataType.RESEARCH.value
        assert r.extra_metadata is not None
        assert r.extra_metadata.get("origin") == "MMASH_EARTH_RESEARCH"
        assert r.extra_metadata.get("environment") == "Terrestrial 1g ground study"


def test_repeated_import_and_duplicate_prevention(db_session):
    """Verify re-ingesting the same participant is strictly idempotent."""
    res_repeat = MMASHLoaderService.ingest_participant(db_session, "user_2")
    assert res_repeat["inserted_records"] == 0
    assert res_repeat["skipped_duplicates"] >= 10


def test_research_data_separation_from_astronaut_clinical_queries(db_session):
    """
    Verify that clinical queries filtering for DataType.REAL or astronaut missions
    never include MMASH research records.
    """
    # Count real records for user_2 (must be 0)
    real_records = db_session.query(HealthRecord).filter(
        HealthRecord.astronaut_id == "MMASH_USER_2",
        HealthRecord.data_type == DataType.REAL.value
    ).all()
    assert len(real_records) == 0

    # Verify research records exist
    research_records = db_session.query(HealthRecord).filter(
        HealthRecord.astronaut_id == "MMASH_USER_2",
        HealthRecord.data_type == DataType.RESEARCH.value
    ).all()
    assert len(research_records) > 0


if __name__ == "__main__":
    pytest.main(["-v", __file__])
