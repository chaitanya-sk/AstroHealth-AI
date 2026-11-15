import pytest
from datetime import datetime, timedelta
from app.database.connection import SessionLocal
from app.models.astronaut import Astronaut
from app.models.health_record import HealthRecord
from app.core.constants import HealthDomain, SystemStatus, DataType
from app.intelligence.health_intelligence import health_intelligence_engine
from app.api.analysis_routes import get_integrated_analysis
from app.ml.predictor import Predictor
from app.ml.model_registry import ModelRegistry


@pytest.fixture(scope="module")
def db_session():
    db = SessionLocal()
    yield db
    db.close()


def test_all_six_domains_represented(db_session):
    """Test 1: Verify all 6 health domains are evaluated in the integrated overview."""
    astro_id = "ASTRO-P8-6DOM"
    db_session.query(HealthRecord).filter(HealthRecord.astronaut_id == astro_id).delete()
    db_session.query(Astronaut).filter(Astronaut.astronaut_id == astro_id).delete()
    db_session.commit()

    astro = Astronaut(astronaut_id=astro_id, name="Six Domain Test Pilot", mission_id="EXP-P8")
    db_session.add(astro)
    db_session.commit()

    summary = health_intelligence_engine.generate_integrated_overview(astro_id, [], astronaut=astro)

    expected_domains = {
        HealthDomain.CARDIOVASCULAR,
        HealthDomain.IMMUNE,
        HealthDomain.BONE_MUSCLE,
        HealthDomain.BEHAVIORAL,
        HealthDomain.RADIATION,
        HealthDomain.ENVIRONMENT
    }
    assert set(summary.domain_statuses.keys()) == expected_domains
    assert len(summary.domain_assessments) == 6
    for dom in expected_domains:
        assert dom.value in summary.domain_assessments


def test_missing_domains_return_insufficient_data(db_session):
    """Test 2: Verify empty/missing domain data yields INSUFFICIENT_DATA, never NORMAL."""
    astro_id = "ASTRO-P8-EMPTY"
    astro = Astronaut(astronaut_id=astro_id, name="Empty Pilot", mission_id="EXP-P8")
    summary = health_intelligence_engine.generate_integrated_overview(astro_id, [], astronaut=astro)

    # Empty telemetry must result in INSUFFICIENT_DATA overall and for every domain
    assert summary.overall_status == SystemStatus.INSUFFICIENT_DATA
    for dom, status in summary.domain_statuses.items():
        assert status == SystemStatus.INSUFFICIENT_DATA
    assert len(summary.insufficient_domains) == 6


def test_existing_domain_assessments_preserved(db_session):
    """Test 3: Existing domain assessment attributes and findings are preserved."""
    astro_id = "ASTRO-P8-PRESERVED"
    now = datetime.utcnow()
    rec = HealthRecord(
        astronaut_id=astro_id,
        timestamp=now,
        domain=HealthDomain.CARDIOVASCULAR.value,
        indicator="heart_rate",
        value=72.0,
        unit="bpm",
        source="sensor",
        data_type=DataType.REAL.value,
        confidence=1.0
    )
    summary = health_intelligence_engine.generate_integrated_overview(astro_id, [rec])
    cardio_res = summary.domain_assessments["cardiovascular"]
    assert cardio_res.domain == HealthDomain.CARDIOVASCULAR
    assert "heart_rate" in cardio_res.indicators_analysed
    assert cardio_res.status == SystemStatus.NORMAL


def test_cardiovascular_ml_runs_with_valid_features(db_session):
    """Test 4: When all four required features are present, cardiovascular ML runs and attaches insight."""
    astro_id = "ASTRO-P8-ML"
    now = datetime.utcnow()
    records = [
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="heart_rate", value=72.0, unit="bpm", source="sensor", data_type="real"),
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="hrv_rmssd", value=45.0, unit="ms", source="sensor", data_type="real"),
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="hrv_sdnn", value=60.0, unit="ms", source="sensor", data_type="real"),
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="pnn50", value=20.0, unit="%", source="sensor", data_type="real"),
    ]
    summary = health_intelligence_engine.generate_integrated_overview(astro_id, records)
    assert len(summary.ml_insights) >= 1
    insight = summary.ml_insights[0]
    assert insight.model_key == "cardiovascular_hrv_anomaly"
    assert insight.is_anomaly is False
    assert insight.anomaly_score is not None
    assert "terrestrial" in insight.provenance_disclaimer.lower()


def test_cardiovascular_ml_outlier_detection(db_session):
    """Verify extreme statistical outlier triggers anomaly insight and escalation."""
    astro_id = "ASTRO-P8-ML-OUTLIER"
    now = datetime.utcnow()
    records = [
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="heart_rate", value=195.0, unit="bpm", source="sensor", data_type="real"),
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="hrv_rmssd", value=3.0, unit="ms", source="sensor", data_type="real"),
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="hrv_sdnn", value=4.0, unit="ms", source="sensor", data_type="real"),
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="pnn50", value=0.0, unit="%", source="sensor", data_type="real"),
    ]
    summary = health_intelligence_engine.generate_integrated_overview(astro_id, records)
    assert len(summary.ml_insights) >= 1
    insight = summary.ml_insights[0]
    assert insight.is_anomaly is True
    assert insight.anomaly_score is not None
    assert "CARDIOVASCULAR ML ANOMALY" in summary.key_findings[0]


def test_missing_ml_features_rejected_gracefully(db_session):
    """Test 6: Missing features (e.g. only 3 present) does not run ML, degrading gracefully."""
    astro_id = "ASTRO-P8-ML-MISSING"
    now = datetime.utcnow()
    records = [
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="heart_rate", value=72.0, unit="bpm", source="sensor", data_type="real"),
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="hrv_rmssd", value=45.0, unit="ms", source="sensor", data_type="real"),
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="hrv_sdnn", value=60.0, unit="ms", source="sensor", data_type="real"),
    ]
    summary = health_intelligence_engine.generate_integrated_overview(astro_id, records)
    # ML insights should be empty without raising exceptions
    assert len(summary.ml_insights) == 0


def test_research_data_cannot_silently_become_real(db_session):
    """Test 7: Explicit data-tier filtering keeps RESEARCH data separate from REAL astronaut assessments."""
    astro_id = "ASTRO-P8-TIER"
    now = datetime.utcnow()
    records = [
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="heart_rate", value=70.0, unit="bpm", source="sensor", data_type=DataType.RESEARCH.value),
        HealthRecord(astronaut_id=astro_id, timestamp=now, domain="cardiovascular", indicator="heart_rate", value=130.0, unit="bpm", source="sensor", data_type=DataType.REAL.value),
    ]

    # Query REAL data tier
    summary_real = health_intelligence_engine.generate_integrated_overview(astro_id, records, data_type_filter="real")
    cardio_real = summary_real.domain_assessments["cardiovascular"]
    assert len(cardio_real.observations) == 1
    assert cardio_real.observations[0].measured_value == 130.0

    # Query RESEARCH data tier
    summary_res = health_intelligence_engine.generate_integrated_overview(astro_id, records, data_type_filter="research")
    cardio_res = summary_res.domain_assessments["cardiovascular"]
    assert len(cardio_res.observations) == 1
    assert cardio_res.observations[0].measured_value == 70.0


def test_stale_indicators_reported(db_session):
    """Test 9: Stale indicators older than maximum freshness thresholds are explicitly flagged."""
    astro_id = "ASTRO-P8-STALE"
    stale_ts = datetime.utcnow() - timedelta(hours=100)
    records = [
        HealthRecord(astronaut_id=astro_id, timestamp=stale_ts, domain="cardiovascular", indicator="heart_rate", value=72.0, unit="bpm", source="sensor", data_type="real")
    ]
    summary = health_intelligence_engine.generate_integrated_overview(astro_id, records)
    assert len(summary.stale_indicators) >= 1
    assert "cardiovascular:heart_rate" in summary.stale_indicators[0]


def test_cross_domain_observations_preserve_provenance():
    """Test 10: Multi-system interactions state possible association, never causation."""
    domain_statuses = {
        HealthDomain.ENVIRONMENT: SystemStatus.MONITOR,
        HealthDomain.CARDIOVASCULAR: SystemStatus.MONITOR,
        HealthDomain.IMMUNE: SystemStatus.NORMAL,
        HealthDomain.BONE_MUSCLE: SystemStatus.NORMAL,
        HealthDomain.BEHAVIORAL: SystemStatus.NORMAL,
        HealthDomain.RADIATION: SystemStatus.NORMAL,
    }
    from app.intelligence.risk_engine import RiskEngine
    overall, findings, interactions = RiskEngine.evaluate_multi_system_compounding(domain_statuses)
    assert overall == SystemStatus.REVIEW_REQUIRED
    assert len(interactions) >= 1
    assert "not proven causation" in interactions[0]


def test_api_response_compatibility(db_session):
    """Test 11: GET /api/analysis/{astronaut_id} returns the unified response model."""
    astro_id = "ASTRO-P8-API"
    db_session.query(HealthRecord).filter(HealthRecord.astronaut_id == astro_id).delete()
    db_session.query(Astronaut).filter(Astronaut.astronaut_id == astro_id).delete()
    db_session.commit()

    astro = Astronaut(astronaut_id=astro_id, name="API Test Subject", mission_id="EXP-API")
    db_session.add(astro)
    db_session.commit()

    res = get_integrated_analysis(astro_id, data_type=None, db=db_session)
    assert res.astronaut_id == astro_id
    assert hasattr(res, "domain_assessments")
    assert hasattr(res, "ml_insights")
    assert hasattr(res, "stale_indicators")
    assert hasattr(res, "insufficient_domains")
    assert hasattr(res, "supporting_evidence_references")


def test_five_insufficient_domains_cannot_produce_normal():
    """Verify that having 5 insufficient domains strictly produces INSUFFICIENT_DATA, never NORMAL."""
    from app.intelligence.risk_engine import RiskEngine
    # 5 INSUFFICIENT, 1 NORMAL
    domain_statuses = {
        HealthDomain.CARDIOVASCULAR: SystemStatus.NORMAL,
        HealthDomain.IMMUNE: SystemStatus.INSUFFICIENT_DATA,
        HealthDomain.BONE_MUSCLE: SystemStatus.INSUFFICIENT_DATA,
        HealthDomain.BEHAVIORAL: SystemStatus.INSUFFICIENT_DATA,
        HealthDomain.RADIATION: SystemStatus.INSUFFICIENT_DATA,
        HealthDomain.ENVIRONMENT: SystemStatus.INSUFFICIENT_DATA,
    }
    overall, findings, _ = RiskEngine.evaluate_multi_system_compounding(domain_statuses)
    assert overall == SystemStatus.INSUFFICIENT_DATA
    assert "More than half" in findings[0]


def test_mixed_statuses_preserve_active_concerns_when_insufficient():
    """Verify that if an available domain has a concern (MONITOR or REVIEW_REQUIRED), it is preserved and not masked."""
    from app.intelligence.risk_engine import RiskEngine
    # 5 INSUFFICIENT, 1 REVIEW_REQUIRED
    domain_statuses_review = {
        HealthDomain.CARDIOVASCULAR: SystemStatus.REVIEW_REQUIRED,
        HealthDomain.IMMUNE: SystemStatus.INSUFFICIENT_DATA,
        HealthDomain.BONE_MUSCLE: SystemStatus.INSUFFICIENT_DATA,
        HealthDomain.BEHAVIORAL: SystemStatus.INSUFFICIENT_DATA,
        HealthDomain.RADIATION: SystemStatus.INSUFFICIENT_DATA,
        HealthDomain.ENVIRONMENT: SystemStatus.INSUFFICIENT_DATA,
    }
    overall_rev, _, _ = RiskEngine.evaluate_multi_system_compounding(domain_statuses_review)
    assert overall_rev == SystemStatus.REVIEW_REQUIRED

    # 5 INSUFFICIENT, 1 MONITOR
    domain_statuses_mon = {
        HealthDomain.CARDIOVASCULAR: SystemStatus.MONITOR,
        HealthDomain.IMMUNE: SystemStatus.INSUFFICIENT_DATA,
        HealthDomain.BONE_MUSCLE: SystemStatus.INSUFFICIENT_DATA,
        HealthDomain.BEHAVIORAL: SystemStatus.INSUFFICIENT_DATA,
        HealthDomain.RADIATION: SystemStatus.INSUFFICIENT_DATA,
        HealthDomain.ENVIRONMENT: SystemStatus.INSUFFICIENT_DATA,
    }
    overall_mon, _, _ = RiskEngine.evaluate_multi_system_compounding(domain_statuses_mon)
    assert overall_mon == SystemStatus.MONITOR


def test_recommendations_do_not_claim_all_domains_verified_when_missing(db_session):
    """Verify recommendations do not falsely claim all domains verified when data is missing."""
    astro_id = "ASTRO-P8-RECS-CHECK"
    summary = health_intelligence_engine.generate_integrated_overview(astro_id, [])
    assert summary.overall_status == SystemStatus.INSUFFICIENT_DATA
    for rec in summary.structured_recommendations:
        assert "All 6 evaluated bio-parameters" not in rec.observed
        assert "6 domains verified with active telemetry" not in rec.supporting_measurements
        assert "insufficient" in rec.observed.lower() or "missing" in rec.observed.lower()


def test_no_unsupported_composite_health_score(db_session):
    """Test 12: Ensure no arbitrary health percentage or numerical score is generated."""
    astro_id = "ASTRO-P8-NOCOMP"
    astro = Astronaut(astronaut_id=astro_id, name="No Score Pilot", mission_id="EXP-P8")
    summary = health_intelligence_engine.generate_integrated_overview(astro_id, [], astronaut=astro)
    # Check that summary schema attributes are categorical SystemStatus enums, not arbitrary percentages
    assert isinstance(summary.overall_status, SystemStatus)
    dumped = summary.model_dump()
    assert "health_percentage" not in dumped
    assert "composite_risk_score" not in dumped

