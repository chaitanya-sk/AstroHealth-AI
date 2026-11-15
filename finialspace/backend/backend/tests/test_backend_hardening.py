import uuid
import pytest
from datetime import datetime
from pydantic import ValidationError
from fastapi import HTTPException

from app.database.connection import SessionLocal
from app.models.astronaut import Astronaut
from app.models.health_record import HealthRecord
from app.schemas.astronaut import AstronautCreate
from app.schemas.health import HealthData, BatchIngestRequest
from app.core.constants import HealthDomain, DataType, SystemStatus
from app.api.astronaut_routes import create_astronaut, get_astronaut, list_astronauts
from app.api.health_routes import ingest_record, ingest_batch, get_astronaut_data, get_domain_data
from app.api.analysis_routes import get_integrated_analysis, get_domain_analysis
from app.ml.predictor import Predictor
from app.services.research.mmash_loader_service import MMASHLoaderService


@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    yield db
    db.close()


# =========================================================================
# PHASE 2: ASTRONAUT MANAGEMENT HARDENING
# =========================================================================

def test_astronaut_empty_and_invalid_inputs(db_session):
    """Verify empty strings, missing fields, and whitespace IDs are blocked."""
    # 1. Empty string astronaut_id
    with pytest.raises(ValidationError):
        AstronautCreate(astronaut_id="   ", name="Valid Name")

    # 2. Empty string name
    with pytest.raises(ValidationError):
        AstronautCreate(astronaut_id="VALID-ID", name="   ")

    # 3. Missing name
    with pytest.raises(ValidationError):
        AstronautCreate(astronaut_id="VALID-ID")


def test_astronaut_duplicate_registration_handling(db_session):
    """Verify duplicate astronaut registrations raise HTTP 409 Conflict."""
    unique_id = f"HARDEN-ASTRO-{uuid.uuid4().hex[:6].upper()}"
    try:
        a1 = create_astronaut(AstronautCreate(astronaut_id=unique_id, name="Original Name"), db=db_session)
        assert a1.astronaut_id == unique_id

        # Duplicate attempt: must raise HTTP 409 Conflict
        with pytest.raises(HTTPException) as exc_info:
            create_astronaut(AstronautCreate(astronaut_id=unique_id, name="Duplicate Attempt"), db=db_session)
        assert exc_info.value.status_code == 409
        assert "already registered" in exc_info.value.detail.lower()
    finally:
        db_session.query(Astronaut).filter(Astronaut.astronaut_id == unique_id).delete()
        db_session.commit()


def test_astronaut_nonexistent_retrieval(db_session):
    """Verify nonexistent astronaut retrieval raises structured 404."""
    with pytest.raises(HTTPException) as exc_info:
        get_astronaut("NONEXISTENT_CREW_ID_9999", db=db_session)
    assert exc_info.value.status_code == 404
    assert "not found" in exc_info.value.detail.lower()


# =========================================================================
# PHASE 3: TELEMETRY INGESTION & BOUNDARY HARDENING
# =========================================================================

def test_telemetry_nan_inf_validation():
    """Verify NaN and Infinity floating point values are rejected."""
    with pytest.raises(ValidationError):
        HealthData(
            astronaut_id="ASTRO-01",
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=float("nan"),
            unit="bpm",
            source="wearable"
        )

    with pytest.raises(ValidationError):
        HealthData(
            astronaut_id="ASTRO-01",
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=float("inf"),
            unit="bpm",
            source="wearable"
        )


def test_telemetry_unknown_astronaut_rejection(db_session):
    """Verify telemetry ingestion for un-registered astronaut raises 404."""
    h = HealthData(
        astronaut_id="UNKNOWN_SUBJECT_404",
        domain=HealthDomain.CARDIOVASCULAR,
        indicator="heart_rate",
        value=72.0,
        unit="bpm",
        source="sensor"
    )
    with pytest.raises(HTTPException) as exc_info:
        ingest_record(h, db=db_session)
    assert exc_info.value.status_code == 404
    assert "Register astronaut" in exc_info.value.detail


def test_empty_batch_ingestion(db_session):
    """Verify empty batch payloads are rejected gracefully with 400."""
    with pytest.raises(HTTPException) as exc_info:
        ingest_batch(BatchIngestRequest(records=[]), db=db_session)
    assert exc_info.value.status_code == 400


# =========================================================================
# PHASE 4: ABSOLUTE THREE-TIER DATA ISOLATION REGRESSION
# =========================================================================

def test_strict_three_tier_data_isolation(db_session):
    """
    Ensure Real, Simulated, and Research records NEVER mix in analysis pipelines.
    - Real astronaut analysis: strictly ignores Simulated and Research records.
    - Simulated astronaut analysis: strictly ignores Real and Research records.
    - Research analysis: strictly ignores Real and Simulated records.
    """
    iso_id = f"HARDEN-ISO-{uuid.uuid4().hex[:6].upper()}"
    try:
        create_astronaut(AstronautCreate(astronaut_id=iso_id, name="Data Isolation Subject"), db=db_session)

        # 1. Real: HR = 70.0 (Normal)
        ingest_record(HealthData(
            astronaut_id=iso_id,
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=70.0,
            unit="bpm",
            source="sensor",
            data_type=DataType.REAL
        ), db=db_session)

        # 2. Simulated: HR = 195.0 (Critical)
        ingest_record(HealthData(
            astronaut_id=iso_id,
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=195.0,
            unit="bpm",
            source="sim_engine",
            data_type=DataType.SIMULATED
        ), db=db_session)

        # 3. Research: HR = 40.0 (Bradycardia study)
        ingest_record(HealthData(
            astronaut_id=iso_id,
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=40.0,
            unit="bpm",
            source="terrestrial_study",
            data_type=DataType.RESEARCH
        ), db=db_session)

        # Evaluate REAL pipeline
        res_real = get_domain_analysis(iso_id, domain="cardiovascular", data_type=DataType.REAL, db=db_session)
        assert res_real.status == SystemStatus.NORMAL
        assert res_real.records_analyzed == 1

        # Evaluate SIMULATED pipeline
        res_sim = get_domain_analysis(iso_id, domain="cardiovascular", data_type=DataType.SIMULATED, db=db_session)
        assert res_sim.status == SystemStatus.REVIEW_REQUIRED
        assert res_sim.records_analyzed == 1

        # Evaluate RESEARCH pipeline
        res_res = get_domain_analysis(iso_id, domain="cardiovascular", data_type=DataType.RESEARCH, db=db_session)
        assert res_res.status == SystemStatus.REVIEW_REQUIRED
        assert res_res.records_analyzed == 1

    finally:
        db_session.query(HealthRecord).filter(HealthRecord.astronaut_id == iso_id).delete()
        db_session.query(Astronaut).filter(Astronaut.astronaut_id == iso_id).delete()
        db_session.commit()


# =========================================================================
# PHASE 8: ML HRV ANOMALY DETECTION INTEGRITY
# =========================================================================

def test_ml_anomaly_detection_boundaries():
    """Verify nominal vs outlier predictions on trained MVP Isolation Forest with 4-feature contract."""
    # Nominal inputs
    res_nom = Predictor.predict(
        "cardiovascular_hrv_anomaly",
        feature_dict={"heart_rate": 72.0, "hrv_rmssd": 45.0, "hrv_sdnn": 65.0, "pnn50": 20.0},
        units_dict={"heart_rate": "bpm", "hrv_rmssd": "ms", "hrv_sdnn": "ms", "pnn50": "%"}
    )
    assert res_nom["status"] == "SUCCESS"
    assert res_nom["prediction"] == [1]
    assert res_nom["score"] is not None
    assert isinstance(res_nom["score"][0], float)

    # Second valid input with different physiological characteristics
    res_nom2 = Predictor.predict(
        "cardiovascular_hrv_anomaly",
        feature_dict={"heart_rate": 62.0, "hrv_rmssd": 55.0, "hrv_sdnn": 75.0, "pnn50": 35.0},
        units_dict={"heart_rate": "bpm", "hrv_rmssd": "ms", "hrv_sdnn": "ms", "pnn50": "%"}
    )
    assert res_nom2["status"] == "SUCCESS"
    assert res_nom2["prediction"] == [1]

    # Extreme statistical outlier input
    res_out = Predictor.predict(
        "cardiovascular_hrv_anomaly",
        feature_dict={"heart_rate": 195.0, "hrv_rmssd": 3.0, "hrv_sdnn": 4.0, "pnn50": 0.0},
        units_dict={"heart_rate": "bpm", "hrv_rmssd": "ms", "hrv_sdnn": "ms", "pnn50": "%"}
    )
    assert res_out["status"] == "SUCCESS"
    assert res_out["prediction"] == [-1]
    assert res_out["score"][0] < res_nom["score"][0]

    # Missing pnn50 rejection
    res_missing = Predictor.predict(
        "cardiovascular_hrv_anomaly",
        feature_dict={"heart_rate": 72.0, "hrv_rmssd": 45.0, "hrv_sdnn": 65.0}
    )
    assert res_missing["status"] == "VALIDATION_ERROR"
    assert "pnn50" in res_missing["error"]

    # Non-finite values rejection
    res_nan = Predictor.predict(
        "cardiovascular_hrv_anomaly",
        feature_dict={"heart_rate": 72.0, "hrv_rmssd": float("nan"), "hrv_sdnn": 65.0, "pnn50": 20.0}
    )
    assert res_nan["status"] == "VALIDATION_ERROR"
    assert "Non-finite" in res_nan["error"]


def test_ml_unit_mismatch_blocking():
    """Verify mismatched units fail gracefully without generating false predictions."""
    # Incorrect heart_rate unit
    res_hr = Predictor.predict(
        "cardiovascular_hrv_anomaly",
        feature_dict={"heart_rate": 72.0, "hrv_rmssd": 45.0, "hrv_sdnn": 65.0, "pnn50": 20.0},
        units_dict={"heart_rate": "Hz", "hrv_rmssd": "ms", "hrv_sdnn": "ms", "pnn50": "%"}
    )
    assert res_hr["status"] == "UNIT_MISMATCH"
    assert res_hr["prediction"] is None

    # Incorrect pnn50 unit
    res_pnn50 = Predictor.predict(
        "cardiovascular_hrv_anomaly",
        feature_dict={"heart_rate": 72.0, "hrv_rmssd": 45.0, "hrv_sdnn": 65.0, "pnn50": 20.0},
        units_dict={"heart_rate": "bpm", "hrv_rmssd": "ms", "hrv_sdnn": "ms", "pnn50": "bpm"}
    )
    assert res_pnn50["status"] == "UNIT_MISMATCH"
    assert res_pnn50["prediction"] is None
    assert "pnn50" in res_pnn50["error"]


if __name__ == "__main__":
    pytest.main(["-v", __file__])
