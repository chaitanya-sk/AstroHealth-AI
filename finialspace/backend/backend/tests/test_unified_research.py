import pytest
from fastapi import HTTPException
from app.database.connection import SessionLocal
from app.services.research.unified_research_service import UnifiedResearchService
from app.api.analysis_routes import (
    list_unified_research_datasets,
    get_research_dataset_details,
    get_research_domain_data,
    get_research_participant_timeline,
    compare_astronaut_with_research
)


@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    yield db
    db.close()


def test_list_unified_research_datasets():
    """Verify all 6 research datasets (OSD series + MMASH) are listed with correct statuses."""
    datasets = list_unified_research_datasets()
    assert len(datasets) == 6
    dataset_ids = [d["dataset_id"] for d in datasets]
    assert "NASA-OSD-575" in dataset_ids
    assert "MMASH" in dataset_ids
    assert "NASA-OSD-569" in dataset_ids

    # Verify status distinctions
    osd575 = next(d for d in datasets if d["dataset_id"] == "NASA-OSD-575")
    assert osd575["status"] == "FULLY_INTEGRATED"
    osd569 = next(d for d in datasets if d["dataset_id"] == "NASA-OSD-569")
    assert osd569["status"] in ["METADATA_ONLY", "FULLY_INTEGRATED", "PARTIALLY_INTEGRATED"]


def test_get_research_dataset_details():
    """Verify detailed measurements and indicators for integrated datasets."""
    # OSD-575
    osd = get_research_dataset_details("NASA-OSD-575")
    assert osd["dataset_id"] == "NASA-OSD-575"
    assert len(osd["supported_markers"]) == 9
    assert any(m["short_name"] == "crp" for m in osd["supported_markers"])
    assert any(m["short_name"] == "pf4" for m in osd["supported_markers"])

    # MMASH
    mmash = get_research_dataset_details("MMASH")
    assert mmash["dataset_id"] == "MMASH"
    assert mmash["cohort_size"] == 22
    assert len(mmash["supported_modalities"]) == 5

    # Nonexistent
    with pytest.raises(HTTPException) as exc_info:
        get_research_dataset_details("UNKNOWN-DATASET-999")
    assert exc_info.value.status_code == 404


def test_get_research_domain_data_connected_domains(db_session):
    """Verify empirical research connection to Cardiovascular, Immune, and Behavioral domains."""
    # 1. Cardiovascular (Connects MMASH HRV + OSD-575 PF4 + OSD-569 Hematology)
    cardio = get_research_domain_data("cardiovascular", db=db_session)
    assert cardio["research_data_availability"] == "RESEARCH_DATA_AVAILABLE"
    assert len(cardio["connected_datasets"]) >= 2
    ds_ids = [d["dataset_id"] for d in cardio["connected_datasets"]]
    assert "MMASH" in ds_ids
    assert "NASA-OSD-575" in ds_ids

    # 2. Immune (Connects OSD-575 inflammatory proteins + MMASH salivary cortisol + OSD-569/656)
    immune = get_research_domain_data("immune", db=db_session)
    assert immune["research_data_availability"] == "RESEARCH_DATA_AVAILABLE"
    assert len(immune["connected_datasets"]) >= 2

    # 3. Behavioral (Connects MMASH sleep, activity, questionnaires)
    beh = get_research_domain_data("behavioral", db=db_session)
    assert beh["research_data_availability"] == "RESEARCH_DATA_AVAILABLE"
    assert len(beh["connected_datasets"]) == 1
    assert beh["connected_datasets"][0]["dataset_id"] == "MMASH"


def test_get_research_domain_data_unsupported_domains(db_session):
    """Verify Bone & Muscle, Radiation, and Environment return proper availability states without fabricating data."""
    for dom in ["bone_muscle", "radiation", "environment"]:
        res = get_research_domain_data(dom, db=db_session)
        assert res["research_data_availability"] == "NO_RESEARCH_DATASET_AVAILABLE"
        assert res["available_research_records_count"] == 0
        assert "No empirical research dataset is currently connected" in res["message"]


def test_get_research_participant_timeline(db_session):
    """Verify individual timeline retrieval for spaceflight (C001) and terrestrial (MMASH_USER_1) subjects."""
    # NASA OSD-575 participant
    c001 = get_research_participant_timeline("C001", db=db_session)
    assert c001["dataset_id"] == "NASA-OSD-575"
    assert c001["participant_id"] == "C001"
    assert "trajectory_data" in c001

    # MMASH participant
    u1 = get_research_participant_timeline("user_1", db=db_session)
    assert u1["dataset_id"] == "MMASH"
    assert u1["participant_id"] == "MMASH_USER_1"
    assert u1["total_records"] > 0

    # Nonexistent participant
    with pytest.raises(HTTPException) as exc_info:
        get_research_participant_timeline("NONEXISTENT_PARTICIPANT_999", db=db_session)
    assert exc_info.value.status_code == 404


def test_compare_astronaut_with_research(db_session):
    """Verify side-by-side benchmark comparison preserving strict isolation."""
    comp = compare_astronaut_with_research("ASTRO-01", "heart_rate", db=db_session)
    assert comp["astronaut_id"] == "ASTRO-01"
    assert comp["indicator"] == "heart_rate"
    assert comp["operational_data_type"] == "REAL"
    assert "research_benchmark" in comp
    assert comp["research_benchmark"]["benchmark_dataset"] == "MMASH (Terrestrial 1g, N=22)"
    assert "never used to alter or overwrite astronaut operational thresholds" in comp["methodology_note"]


if __name__ == "__main__":
    pytest.main(["-v", __file__])

