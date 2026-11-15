import sys
import os
import math
from datetime import datetime, date, timedelta

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi import HTTPException
from pydantic import ValidationError

from app.database.base import Base
from app.database.connection import get_db
from app.api.astronaut_routes import create_astronaut, get_astronaut, list_astronauts
from app.api.health_routes import (
    ingest_record,
    ingest_batch,
    get_astronaut_data,
    get_domain_data,
)
from app.schemas.astronaut import AstronautCreate
from app.schemas.health import HealthData, BatchIngestRequest
from app.core.constants import HealthDomain, DataType, SystemStatus


def get_test_db():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return TestingSession()


# 1. Database connection test
def test_database_connection():
    db = get_test_db()
    assert db is not None
    # Verify tables can be queried
    from app.models.astronaut import Astronaut
    from app.models.health_record import HealthRecord
    count_astro = db.query(Astronaut).count()
    count_health = db.query(HealthRecord).count()
    assert count_astro == 0
    assert count_health == 0


# 2. Astronaut creation & retrieval test
def test_astronaut_creation_and_retrieval():
    db = get_test_db()
    payload = AstronautCreate(
        astronaut_id="ASTRO-P2-01",
        name="Dr. Jessica Meir",
        role="Flight Engineer",
        mission_id="EXPEDITION-72",
        mission_start_date=date(2026, 3, 15),
        resting_hr_baseline=58.0,
        resting_bp_sys_baseline=112.0,
        resting_bp_dia_baseline=74.0,
    )
    created = create_astronaut(payload, db)
    assert created.id is not None
    assert created.astronaut_id == "ASTRO-P2-01"
    assert created.name == "Dr. Jessica Meir"
    assert created.mission_start_date == date(2026, 3, 15)

    # Retrieval
    retrieved = get_astronaut("ASTRO-P2-01", db)
    assert retrieved.astronaut_id == "ASTRO-P2-01"

    # Listing
    all_astros = list_astronauts(skip=0, limit=10, mission_id=None, db=db)
    assert len(all_astros) == 1

    # Duplicate rejection (409)
    try:
        create_astronaut(payload, db)
        assert False, "Should have raised 409 Conflict"
    except HTTPException as e:
        assert e.status_code == 409


# 3. Health record ingestion test
def test_health_record_ingestion():
    db = get_test_db()
    # Register astronaut first
    create_astronaut(
        AstronautCreate(astronaut_id="ASTRO-P2-02", name="Commander Scott T."),
        db,
    )

    now = datetime.utcnow()
    record = HealthData(
        astronaut_id="ASTRO-P2-02",
        timestamp=now,
        domain=HealthDomain.CARDIOVASCULAR,
        indicator="heart_rate",
        value=74.5,
        unit="bpm",
        source="wearable_ecg_patch",
        data_type=DataType.SIMULATED,
        confidence=0.97,
        metadata={"device_id": "ECG-BIO-9", "battery_pct": 89},
    )

    saved = ingest_record(record, db)
    assert saved.id is not None
    assert saved.astronaut_id == "ASTRO-P2-02"
    assert saved.domain == "cardiovascular"
    assert saved.value == 74.5
    assert saved.data_type == "simulated"
    assert saved.extra_metadata == {"device_id": "ECG-BIO-9", "battery_pct": 89}


# 4. Retrieving all astronaut records
def test_retrieving_all_astronaut_records():
    db = get_test_db()
    create_astronaut(
        AstronautCreate(astronaut_id="ASTRO-P2-03", name="Pilot Mark V."),
        db,
    )

    # Ingest 3 records
    for i, ind in enumerate(["heart_rate", "systolic_bp", "diastolic_bp"]):
        ingest_record(
            HealthData(
                astronaut_id="ASTRO-P2-03",
                domain=HealthDomain.CARDIOVASCULAR,
                indicator=ind,
                value=70.0 + i * 10,
                unit="unit",
                source="test_sensor",
                data_type=DataType.SIMULATED,
            ),
            db,
        )

    records = get_astronaut_data("ASTRO-P2-03", db=db)
    assert len(records) == 3


# 5. Filtering records by domain
def test_filtering_records_by_domain():
    db = get_test_db()
    create_astronaut(
        AstronautCreate(astronaut_id="ASTRO-P2-04", name="Science Specialist Suni"),
        db,
    )

    # Ingest 1 cardiovascular and 1 radiation record
    ingest_record(
        HealthData(
            astronaut_id="ASTRO-P2-04",
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=68.0,
            unit="bpm",
            source="sensor",
            data_type=DataType.SIMULATED,
        ),
        db,
    )
    ingest_record(
        HealthData(
            astronaut_id="ASTRO-P2-04",
            domain=HealthDomain.RADIATION,
            indicator="daily_dose_equivalent",
            value=0.45,
            unit="mSv/day",
            source="dosimeter",
            data_type=DataType.SIMULATED,
        ),
        db,
    )

    # Filter via query param
    cardio_only = get_astronaut_data(
        "ASTRO-P2-04", domain=HealthDomain.CARDIOVASCULAR, db=db
    )
    assert len(cardio_only) == 1
    assert cardio_only[0].indicator == "heart_rate"

    # Filter via domain path endpoint
    radiation_only = get_domain_data(
        "ASTRO-P2-04", domain=HealthDomain.RADIATION, db=db
    )
    assert len(radiation_only) == 1
    assert radiation_only[0].indicator == "daily_dose_equivalent"


# 6. Filtering by data type (real, simulated, research)
def test_filtering_by_data_type():
    db = get_test_db()
    create_astronaut(
        AstronautCreate(astronaut_id="ASTRO-P2-05", name="Astro Elena"),
        db,
    )

    ingest_record(
        HealthData(
            astronaut_id="ASTRO-P2-05",
            domain=HealthDomain.ENVIRONMENT,
            indicator="cabin_co2_pp",
            value=2.1,
            unit="mmHg",
            source="cabin_telemetry",
            data_type=DataType.REAL,
        ),
        db,
    )
    ingest_record(
        HealthData(
            astronaut_id="ASTRO-P2-05",
            domain=HealthDomain.ENVIRONMENT,
            indicator="cabin_co2_pp",
            value=2.8,
            unit="mmHg",
            source="simulated_generator",
            data_type=DataType.SIMULATED,
        ),
        db,
    )

    real_records = get_astronaut_data(
        "ASTRO-P2-05", data_type=DataType.REAL, db=db
    )
    assert len(real_records) == 1
    assert real_records[0].data_type == DataType.REAL

    sim_records = get_astronaut_data(
        "ASTRO-P2-05", data_type=DataType.SIMULATED, db=db
    )
    assert len(sim_records) == 1
    assert sim_records[0].data_type == DataType.SIMULATED


# 7. Invalid domain rejection
def test_invalid_domain_rejection():
    try:
        HealthData(
            astronaut_id="ASTRO-P2-06",
            domain="invalid_domain_name",  # Invalid
            indicator="heart_rate",
            value=70.0,
            unit="bpm",
            source="sensor",
            data_type=DataType.SIMULATED,
        )
        assert False, "Should have raised Pydantic ValidationError for invalid domain"
    except ValidationError as e:
        assert "domain" in str(e)


# 8. Unknown astronaut rejection (404)
def test_unknown_astronaut_rejection():
    db = get_test_db()
    # Astronaut ASTRO-UNKNOWN not registered
    record = HealthData(
        astronaut_id="ASTRO-UNKNOWN",
        domain=HealthDomain.BEHAVIORAL,
        indicator="sleep_duration_hours",
        value=7.5,
        unit="hours",
        source="actigraphy",
        data_type=DataType.SIMULATED,
    )
    try:
        ingest_record(record, db)
        assert False, "Should have returned 404 for unknown astronaut"
    except HTTPException as e:
        assert e.status_code == 404
        assert "Unknown astronaut" in e.detail

    # Testing retrieval for unknown astronaut
    try:
        get_astronaut_data("ASTRO-UNKNOWN", db=db)
        assert False, "Should have returned 404 for unknown astronaut retrieval"
    except HTTPException as e:
        assert e.status_code == 404


# 9. Missing required fields validation
def test_missing_required_fields():
    # Empty astronaut_id
    try:
        HealthData(
            astronaut_id="   ",
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=70.0,
            unit="bpm",
            source="sensor",
        )
        assert False, "Should have rejected empty astronaut_id"
    except ValidationError:
        pass

    # Empty indicator
    try:
        HealthData(
            astronaut_id="ASTRO-01",
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="   ",
            value=70.0,
            unit="bpm",
            source="sensor",
        )
        assert False, "Should have rejected empty indicator"
    except ValidationError:
        pass

    # Non-finite values (NaN / Inf)
    try:
        HealthData(
            astronaut_id="ASTRO-01",
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=float("nan"),
            unit="bpm",
            source="sensor",
        )
        assert False, "Should have rejected NaN value"
    except ValidationError:
        pass


# 10. Invalid confidence values
def test_invalid_confidence_values():
    # Negative confidence
    try:
        HealthData(
            astronaut_id="ASTRO-01",
            domain=HealthDomain.IMMUNE,
            indicator="c_reactive_protein",
            value=1.5,
            unit="mg/L",
            source="lab_panel",
            confidence=-0.1,
        )
        assert False, "Should have rejected negative confidence"
    except ValidationError:
        pass

    # Confidence > 1.0
    try:
        HealthData(
            astronaut_id="ASTRO-01",
            domain=HealthDomain.IMMUNE,
            indicator="c_reactive_protein",
            value=1.5,
            unit="mg/L",
            source="lab_panel",
            confidence=1.5,
        )
        assert False, "Should have rejected confidence > 1.0"
    except ValidationError:
        pass


# 11. Pagination test (skip and limit)
def test_pagination():
    db = get_test_db()
    create_astronaut(
        AstronautCreate(astronaut_id="ASTRO-P2-07", name="Astro Alex"),
        db,
    )

    # Ingest 15 records
    base_time = datetime(2026, 11, 14, 10, 0, 0)
    for i in range(15):
        ingest_record(
            HealthData(
                astronaut_id="ASTRO-P2-07",
                timestamp=base_time + timedelta(minutes=i),
                domain=HealthDomain.CARDIOVASCULAR,
                indicator="heart_rate",
                value=60.0 + i,
                unit="bpm",
                source="wearable",
                data_type=DataType.SIMULATED,
            ),
            db,
        )

    # Page 1: limit 5, skip 0
    page1 = get_astronaut_data("ASTRO-P2-07", skip=0, limit=5, db=db)
    assert len(page1) == 5

    # Page 2: limit 5, skip 5
    page2 = get_astronaut_data("ASTRO-P2-07", skip=5, limit=5, db=db)
    assert len(page2) == 5

    # Page 3: limit 5, skip 10
    page3 = get_astronaut_data("ASTRO-P2-07", skip=10, limit=5, db=db)
    assert len(page3) == 5

    # Ensure records don't overlap between page 1 and page 2
    ids_p1 = {r.id for r in page1}
    ids_p2 = {r.id for r in page2}
    assert ids_p1.isdisjoint(ids_p2)


# 12. Duplicate measurement handling test
def test_duplicate_measurement_handling():
    db = get_test_db()
    create_astronaut(
        AstronautCreate(astronaut_id="ASTRO-P2-08", name="Astro Dave"),
        db,
    )

    exact_ts = datetime(2026, 11, 14, 12, 0, 0)
    rec1 = HealthData(
        astronaut_id="ASTRO-P2-08",
        timestamp=exact_ts,
        domain=HealthDomain.BEHAVIORAL,
        indicator="pvt_mean_rt",
        value=240.0,
        unit="ms",
        source="pvt_tablet_app",
        data_type=DataType.SIMULATED,
        confidence=0.9,
    )
    saved1 = ingest_record(rec1, db)

    # Re-ingest duplicate measurement from same source at same timestamp
    rec2 = HealthData(
        astronaut_id="ASTRO-P2-08",
        timestamp=exact_ts,
        domain=HealthDomain.BEHAVIORAL,
        indicator="pvt_mean_rt",
        value=242.0,  # Updated reading
        unit="ms",
        source="pvt_tablet_app",
        data_type=DataType.SIMULATED,
        confidence=0.95,
    )
    saved2 = ingest_record(rec2, db)

    # Re-use same record ID without duplicating rows in the database
    assert saved1.id == saved2.id
    assert saved2.value == 242.0

    all_records = get_astronaut_data("ASTRO-P2-08", db=db)
    assert len(all_records) == 1


if __name__ == "__main__":
    print("==================================================")
    print("ASTROHEALTH AI — PHASE 2 VERIFICATION TEST SUITE")
    print("==================================================")
    test_database_connection()
    print("1. [PASS] Database connection and table verification")
    test_astronaut_creation_and_retrieval()
    print("2. [PASS] Astronaut registration and retrieval")
    test_health_record_ingestion()
    print("3. [PASS] Health data ingestion with JSON metadata")
    test_retrieving_all_astronaut_records()
    print("4. [PASS] Retrieving all astronaut records")
    test_filtering_records_by_domain()
    print("5. [PASS] Filtering records by domain (query & path)")
    test_filtering_by_data_type()
    print("6. [PASS] Filtering records by data type (real, simulated, research)")
    test_invalid_domain_rejection()
    print("7. [PASS] Invalid domain rejection")
    test_unknown_astronaut_rejection()
    print("8. [PASS] Unknown astronaut rejection (404)")
    test_missing_required_fields()
    print("9. [PASS] Missing required fields & non-finite numeric checks")
    test_invalid_confidence_values()
    print("10. [PASS] Invalid confidence validation")
    test_pagination()
    print("11. [PASS] Pagination (limit & skip offset)")
    test_duplicate_measurement_handling()
    print("12. [PASS] Duplicate telemetry measurement handling")
    print("==================================================")
    print("ALL 12 PHASE 2 TEST CASES PASSED SUCCESSFULLY!")
    print("==================================================")
