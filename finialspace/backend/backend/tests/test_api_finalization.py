import pytest
from datetime import datetime, date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi import HTTPException

from app.database.base import Base
from app.database.connection import get_db
from app.main import app
from app.models.astronaut import Astronaut
from app.models.health_record import HealthRecord
from app.models.alert import Alert
from app.core.constants import HealthDomain, SystemStatus, DataType, AlertSeverity, AlertStatus
from app.schemas.astronaut import AstronautCreate, AstronautUpdate
from app.schemas.health import HealthData, BatchIngestRequest
from app.api.astronaut_routes import create_astronaut, get_astronaut, list_astronauts, update_astronaut
from app.api.health_routes import ingest_record, ingest_batch, get_astronaut_data, get_domain_data
from app.api.analysis_routes import (
    get_integrated_analysis,
    get_domain_analysis,
    list_registered_models,
    run_model_prediction,
    list_unified_research_datasets,
)
from app.api.alert_routes import get_astronaut_alerts, get_astronaut_recommendations


@pytest.fixture(scope="module")
def db_session():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSession()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)


def test_1_astronaut_registration(db_session):
    payload = AstronautCreate(
        astronaut_id="ASTRO-API-101",
        name="Commander John Glenn",
        mission_id="MERCURY-FRIENDSHIP-7",
        role="Commander"
    )
    result = create_astronaut(payload, db_session)
    assert result.astronaut_id == "ASTRO-API-101"
    assert result.name == "Commander John Glenn"
    assert result.role == "Commander"


def test_2_astronaut_retrieval(db_session):
    result = get_astronaut("ASTRO-API-101", db_session)
    assert result.astronaut_id == "ASTRO-API-101"
    assert result.name == "Commander John Glenn"


def test_3_duplicate_astronaut_registration(db_session):
    payload = AstronautCreate(
        astronaut_id="ASTRO-API-101",
        name="Duplicate Entry",
        mission_id="MERCURY-FRIENDSHIP-7"
    )
    with pytest.raises(HTTPException) as exc_info:
        create_astronaut(payload, db_session)
    assert exc_info.value.status_code == 409
    assert "already registered" in exc_info.value.detail


def test_4_update_astronaut_profile(db_session):
    payload = AstronautUpdate(
        mission_day=42,
        resting_hr_baseline=62.0
    )
    updated = update_astronaut("ASTRO-API-101", payload, db_session)
    assert updated.astronaut_id == "ASTRO-API-101"
    assert updated.mission_day == 42
    assert updated.resting_hr_baseline == 62.0


def test_5_health_record_ingestion_and_retrieval(db_session):
    payload = HealthData(
        astronaut_id="ASTRO-API-101",
        domain=HealthDomain.CARDIOVASCULAR,
        indicator="heart_rate",
        value=75.0,
        unit="bpm",
        source="wearable",
        data_type=DataType.REAL
    )
    ingested = ingest_record(payload, db_session)
    assert ingested.indicator == "heart_rate"
    assert ingested.value == 75.0

    records = get_astronaut_data(
        astronaut_id="ASTRO-API-101",
        limit=50,
        data_type=None,
        db=db_session
    )
    assert len(records) >= 1
    assert any(r.indicator == "heart_rate" for r in records)


def test_6_all_six_domain_endpoints(db_session):
    domains = [
        HealthDomain.CARDIOVASCULAR,
        HealthDomain.IMMUNE,
        HealthDomain.BONE_MUSCLE,
        HealthDomain.BEHAVIORAL,
        HealthDomain.RADIATION,
        HealthDomain.ENVIRONMENT
    ]
    for dom in domains:
        assessment = get_domain_analysis(
            astronaut_id="ASTRO-API-101",
            domain=dom,
            data_type=None,
            db=db_session
        )
        assert assessment.astronaut_id == "ASTRO-API-101"
        assert assessment.domain == dom.value
        assert assessment.status in [SystemStatus.NORMAL, SystemStatus.MONITOR, SystemStatus.REVIEW_REQUIRED, SystemStatus.INSUFFICIENT_DATA]


def test_7_unified_intelligence_endpoint(db_session):
    analysis = get_integrated_analysis(
        astronaut_id="ASTRO-API-101",
        data_type=None,
        db=db_session
    )
    assert analysis.astronaut_id == "ASTRO-API-101"
    assert analysis.domain_statuses is not None
    assert analysis.domain_assessments is not None
    assert analysis.ml_insights is not None
    assert analysis.insufficient_domains is not None


def test_8_data_tier_filtering_isolation(db_session):
    # Ingest research and simulated records
    ingest_record(HealthData(
        astronaut_id="ASTRO-API-101",
        domain=HealthDomain.CARDIOVASCULAR,
        indicator="heart_rate",
        value=60.0,
        unit="bpm",
        source="terrestrial_sensor",
        data_type=DataType.RESEARCH
    ), db_session)

    ingest_record(HealthData(
        astronaut_id="ASTRO-API-101",
        domain=HealthDomain.CARDIOVASCULAR,
        indicator="heart_rate",
        value=110.0,
        unit="bpm",
        source="simulator",
        data_type=DataType.SIMULATED
    ), db_session)

    # Filter REAL
    real_records = get_astronaut_data("ASTRO-API-101", limit=50, data_type=DataType.REAL, db=db_session)
    for r in real_records:
        assert r.data_type == DataType.REAL

    # Filter RESEARCH
    res_records = get_astronaut_data("ASTRO-API-101", limit=50, data_type=DataType.RESEARCH, db=db_session)
    for r in res_records:
        assert r.data_type == DataType.RESEARCH

    # Filter SIMULATED
    sim_records = get_astronaut_data("ASTRO-API-101", limit=50, data_type=DataType.SIMULATED, db=db_session)
    for r in sim_records:
        assert r.data_type == DataType.SIMULATED


def test_9_alert_retrieval_and_filtering(db_session):
    al = Alert(
        alert_id="ALT-API-001",
        astronaut_id="ASTRO-API-101",
        domain="cardiovascular",
        severity=AlertSeverity.MEDIUM,
        title="Elevated Resting Heart Rate",
        explanation="Heart rate elevated above pre-flight baseline.",
        status=AlertStatus.ACTIVE,
        recommended_action="Assess hydration status."
    )
    db_session.add(al)
    db_session.commit()

    alerts = get_astronaut_alerts("ASTRO-API-101", domain="cardiovascular", db=db_session)
    assert len(alerts) >= 1
    assert alerts[0].domain == "cardiovascular"


def test_10_dataset_metadata_retrieval(db_session):
    datasets = list_unified_research_datasets()
    assert isinstance(datasets, list)
    assert len(datasets) > 0


def test_11_nonexistent_astronaut_handling(db_session):
    with pytest.raises(HTTPException) as exc_info:
        get_astronaut("NONEXISTENT-999", db_session)
    assert exc_info.value.status_code == 404
    assert "not found" in exc_info.value.detail.lower()


def test_12_openapi_json_and_docs_availability():
    schema = app.openapi()
    assert "paths" in schema
    assert "/api/astronauts" in schema["paths"]
    assert "/api/astronauts/{astronaut_id}" in schema["paths"]
    assert "/api/data/ingest" in schema["paths"]
    assert "/api/data/ingest/batch" in schema["paths"]
    assert "/api/analysis/{astronaut_id}" in schema["paths"]
    assert "/api/analysis/{astronaut_id}/{domain}" in schema["paths"]
    assert "/api/analysis/ml/predict/{model_key}" in schema["paths"]
    assert "/api/alerts/{astronaut_id}" in schema["paths"]
    assert "/api/analysis/research/datasets" in schema["paths"]


def test_13_cors_configuration():
    from starlette.middleware.cors import CORSMiddleware
    cors_mw = None
    for mw in app.user_middleware:
        if mw.cls == CORSMiddleware:
            cors_mw = mw
            break
    assert cors_mw is not None
    allowed_origins = cors_mw.kwargs.get("allow_origins", [])
    assert "http://localhost:3000" in allowed_origins or "*" in allowed_origins or "http://127.0.0.1:3000" in allowed_origins
    assert cors_mw.kwargs.get("allow_credentials") is True
    assert "GET" in cors_mw.kwargs.get("allow_methods", [])
    assert "POST" in cors_mw.kwargs.get("allow_methods", [])
    assert "PUT" in cors_mw.kwargs.get("allow_methods", [])
