import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.database.connection import get_db
from app.api.astronaut_routes import create_astronaut, get_astronaut, list_astronauts
from app.api.health_routes import ingest_record, ingest_batch, get_astronaut_data, get_domain_data
from app.api.analysis_routes import get_integrated_analysis, get_domain_analysis, list_registered_models, run_model_prediction
from app.api.alert_routes import get_astronaut_alerts, get_astronaut_recommendations
from app.schemas.astronaut import AstronautCreate
from app.schemas.health import HealthData, BatchIngestRequest
from app.core.constants import HealthDomain, DataType, SystemStatus
from fastapi import HTTPException


def get_test_db():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return TestingSession()


def test_astronaut_management():
    db = get_test_db()
    payload = AstronautCreate(
        astronaut_id="ASTRO-TEST-01",
        name="Mark Watney",
        role="Botanist / Mechanical Engineer",
        mission_id="ARES-III",
        mission_day=18,
        blood_type="O+",
        resting_hr_baseline=60.0,
        resting_bp_sys_baseline=115.0,
        resting_bp_dia_baseline=75.0,
    )
    created = create_astronaut(payload, db)
    assert created.astronaut_id == "ASTRO-TEST-01"
    assert created.name == "Mark Watney"

    fetched = get_astronaut("ASTRO-TEST-01", db)
    assert fetched.astronaut_id == "ASTRO-TEST-01"

    # Test duplicate conflict
    try:
        create_astronaut(payload, db)
        assert False, "Should have raised 409 Conflict"
    except HTTPException as e:
        assert e.status_code == 409


def test_data_ingestion_and_quality_checks():
    db = get_test_db()
    # Register astronaut first
    create_astronaut(
        AstronautCreate(astronaut_id="ASTRO-TEST-02", name="Commander Lewis"),
        db
    )

    # Normal telemetry
    rec = ingest_record(
        HealthData(
            astronaut_id="ASTRO-TEST-02",
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=72.0,
            unit="bpm",
            source="wearable_ecg",
            data_type=DataType.SIMULATED,
        ),
        db,
    )
    assert rec.id is not None
    assert rec.value == 72.0

    # Plausibility violation check
    try:
        ingest_record(
            HealthData(
                astronaut_id="ASTRO-TEST-02",
                domain=HealthDomain.CARDIOVASCULAR,
                indicator="heart_rate",
                value=999.0,  # Impossible
                unit="bpm",
                source="wearable_ecg",
                data_type=DataType.SIMULATED,
            ),
            db,
        )
        assert False, "Should have raised 422 Unprocessable Entity"
    except HTTPException as e:
        assert e.status_code == 422


def test_batch_ingestion_isolation():
    db = get_test_db()
    create_astronaut(
        AstronautCreate(astronaut_id="ASTRO-TEST-03", name="Dr. Chris Beck"),
        db
    )
    # Mixed data types rejected
    mixed_records = [
        HealthData(
            astronaut_id="ASTRO-TEST-03",
            domain=HealthDomain.RADIATION,
            indicator="daily_dose_equivalent",
            value=0.4,
            unit="mSv/day",
            source="dosimeter",
            data_type=DataType.REAL,
        ),
        HealthData(
            astronaut_id="ASTRO-TEST-03",
            domain=HealthDomain.RADIATION,
            indicator="daily_dose_equivalent",
            value=0.4,
            unit="mSv/day",
            source="dosimeter",
            data_type=DataType.SIMULATED,
        ),
    ]
    try:
        ingest_batch(BatchIngestRequest(records=mixed_records), db)
        assert False, "Should have rejected mixed batch"
    except HTTPException as e:
        assert e.status_code == 400


def test_six_domain_analyzers_and_missing_data():
    db = get_test_db()
    create_astronaut(
        AstronautCreate(astronaut_id="ASTRO-TEST-04", name="Beth Johanssen"),
        db
    )
    astro_id = "ASTRO-TEST-04"
    for domain in HealthDomain:
        res = get_domain_analysis(astro_id, domain, data_type=None, db=db)
        assert res.status == SystemStatus.INSUFFICIENT_DATA
        assert res.records_analyzed == 0

    # Ingest cabin CO2 spike
    ingest_record(
        HealthData(
            astronaut_id=astro_id,
            domain=HealthDomain.ENVIRONMENT,
            indicator="cabin_co2_pp",
            value=4.8,  # > 4.0 Watch, approaching 5.0 Action
            unit="mmHg",
            source="cabin_sensor",
            data_type=DataType.SIMULATED,
        ),
        db,
    )
    env_res = get_domain_analysis(astro_id, HealthDomain.ENVIRONMENT, data_type=None, db=db)
    assert env_res.status in (SystemStatus.MONITOR, SystemStatus.REVIEW_REQUIRED)
    assert env_res.records_analyzed == 1


def test_central_intelligence_and_multi_system_compounding():
    db = get_test_db()
    astro_id = "ASTRO-TEST-05"
    create_astronaut(
        AstronautCreate(astronaut_id=astro_id, name="Rick Martinez"),
        db
    )

    # Ingest two WATCH conditions (e.g. cabin CO2 + heart rate elevation)
    ingest_record(
        HealthData(
            astronaut_id=astro_id,
            domain=HealthDomain.ENVIRONMENT,
            indicator="cabin_co2_pp",
            value=4.2,  # WATCH
            unit="mmHg",
            source="cabin_sensor",
            data_type=DataType.SIMULATED,
        ),
        db,
    )
    ingest_record(
        HealthData(
            astronaut_id=astro_id,
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=112.0,  # WATCH (>= 110)
            unit="bpm",
            source="wearable",
            data_type=DataType.SIMULATED,
        ),
        db,
    )

    overview = get_integrated_analysis(astro_id, data_type=None, db=db)
    # 2 WATCH conditions trigger escalation rule to ACTION_REQUIRED (REVIEW_REQUIRED)
    assert overview.overall_status in (SystemStatus.REVIEW_REQUIRED, SystemStatus.ACTION_REQUIRED)
    assert overview.active_concerns_count == 2
    # Multi-system compound finding should be generated
    assert any("cardiovascular" in f.lower() for f in overview.key_findings)


def test_alerts_and_recommendations():
    db = get_test_db()
    astro_id = "ASTRO-TEST-06"
    create_astronaut(
        AstronautCreate(astronaut_id=astro_id, name="Alex Vogel"),
        db
    )
    # Severe radiation flare
    ingest_record(
        HealthData(
            astronaut_id=astro_id,
            domain=HealthDomain.RADIATION,
            indicator="daily_dose_equivalent",
            value=3.2,  # ACTION_REQUIRED
            unit="mSv/day",
            source="dosimeter",
            data_type=DataType.SIMULATED,
        ),
        db,
    )

    alerts = get_astronaut_alerts(astro_id, db=db)
    assert len(alerts) >= 1
    assert alerts[0].domain == HealthDomain.RADIATION.value
    assert alerts[0].severity == "HIGH"
    assert "space radiation analysis group" in alerts[0].recommended_action.lower() or "flight surgeon" in alerts[0].recommended_action.lower()

    recs = get_astronaut_recommendations(astro_id, db=db)
    assert len(recs) >= 1
    assert recs[0].urgency == "IMMEDIATE"


def test_ml_registry_and_missing_model_handling():
    models_res = list_registered_models()
    # list_registered_models returns List[ModelInfoResponse]
    model_keys = [m.model_key for m in models_res]
    assert "cardiovascular_risk" in model_keys
    assert "radiation_risk" in model_keys
    assert "behavioral_fatigue" in model_keys

    from app.schemas.ml import ModelPredictRequest
    pred = run_model_prediction(
        "cardiovascular_risk",
        ModelPredictRequest(features={"heart_rate": 80.0, "systolic_bp": 120.0, "diastolic_bp": 80.0, "hrv_rmssd": 45.0})
    )
    assert pred.available is False
    assert "not found" in pred.message.lower() or "not deployed" in pred.message.lower() or "trained_models" in pred.message.lower()


if __name__ == "__main__":
    print("Executing AstroHealth AI Backend Test Suite...")
    test_astronaut_management()
    print("✓ Astronaut Management Passed")
    test_data_ingestion_and_quality_checks()
    print("✓ Data Ingestion & Quality Validation Passed")
    test_batch_ingestion_isolation()
    print("✓ Batch Isolation (Real vs Simulated) Passed")
    test_six_domain_analyzers_and_missing_data()
    print("✓ Six Domain Analyzers & Missing Data Handling Passed")
    test_central_intelligence_and_multi_system_compounding()
    print("✓ Central Health Intelligence & Multi-system Compounding Passed")
    test_alerts_and_recommendations()
    print("✓ Explainable Alerts & Recommendations Passed")
    test_ml_registry_and_missing_model_handling()
    print("✓ ML Model Registry & Missing-Model Graceful Degradation Passed")
    print("\nALL 7 TEST SUITES PASSED FLAWLESSLY!")
