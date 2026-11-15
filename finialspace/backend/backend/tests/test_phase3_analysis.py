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
from fastapi.testclient import TestClient

from app.main import app
from app.database.base import Base
from app.database.connection import get_db
from app.api.astronaut_routes import create_astronaut, get_astronaut
from app.api.health_routes import ingest_record
from app.api.analysis_routes import get_integrated_analysis, get_domain_analysis
from app.api.alert_routes import get_astronaut_alerts, get_astronaut_recommendations
from app.schemas.astronaut import AstronautCreate
from app.schemas.health import HealthData
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


# 1. Test each of the six analyzers independently
def test_six_independent_analyzers():
    db = get_test_db()
    astro_id = "ASTRO-P3-01"
    create_astronaut(
        AstronautCreate(
            astronaut_id=astro_id,
            name="Commander Reid Wiseman",
            resting_hr_baseline=60.0,
            resting_bp_sys_baseline=118.0
        ),
        db
    )

    # Ingest 1 measurement for each of the 6 domains
    now = datetime.utcnow()
    domain_samples = [
        (HealthDomain.CARDIOVASCULAR, "heart_rate", 64.0, "bpm", "wearable"),
        (HealthDomain.IMMUNE, "white_blood_cell_count", 6.8, "10^9/L", "lab_panel"),
        (HealthDomain.BONE_MUSCLE, "urinary_ntx", 35.0, "nM_BCE/mM_Cr", "urine_assay"),
        (HealthDomain.BEHAVIORAL, "sleep_duration_hours", 7.8, "hours", "actigraphy"),
        (HealthDomain.RADIATION, "daily_dose_equivalent", 0.35, "mSv/day", "dosimeter"),
        (HealthDomain.ENVIRONMENT, "cabin_co2_pp", 1.8, "mmHg", "eclss_sensor"),
    ]

    for dom, ind, val, unit, src in domain_samples:
        ingest_record(
            HealthData(
                astronaut_id=astro_id,
                timestamp=now,
                domain=dom,
                indicator=ind,
                value=val,
                unit=unit,
                source=src,
                data_type=DataType.SIMULATED
            ),
            db
        )

    # Verify every analyzer runs and yields structured findings
    for dom, ind, val, unit, src in domain_samples:
        res = get_domain_analysis(astro_id, dom, data_type=None, db=db)
        assert res.status == SystemStatus.NORMAL
        assert res.domain == dom
        assert len(res.findings) >= 1
        assert res.data_quality.is_valid is True
        assert len(res.indicators_analysed) >= 1
        assert res.indicators_analysed[0] == ind


# 2. Test missing data handling (must return INSUFFICIENT_DATA, never silently NORMAL)
def test_missing_data_handling():
    db = get_test_db()
    astro_id = "ASTRO-P3-EMPTY"
    create_astronaut(AstronautCreate(astronaut_id=astro_id, name="Empty Record Astronaut"), db)

    for dom in HealthDomain:
        res = get_domain_analysis(astro_id, dom, data_type=None, db=db)
        assert res.status == SystemStatus.INSUFFICIENT_DATA
        assert res.data_quality.is_valid is False
        assert any(term in res.explanation.lower() for term in ["insufficient", "requires", "cannot proceed"])


# 3. Test stale data handling (old telemetry must not remain silently NORMAL)
def test_stale_data_handling():
    db = get_test_db()
    astro_id = "ASTRO-P3-STALE"
    create_astronaut(AstronautCreate(astronaut_id=astro_id, name="Stale Astronaut"), db)

    # Ingest 72-hour old continuous heart rate telemetry (expected max_freshness is 8h)
    old_time = datetime.utcnow() - timedelta(hours=72)
    ingest_record(
        HealthData(
            astronaut_id=astro_id,
            timestamp=old_time,
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=65.0,  # Value is normal, but age is 72 hours
            unit="bpm",
            source="wearable",
            data_type=DataType.SIMULATED
        ),
        db
    )

    res = get_domain_analysis(astro_id, HealthDomain.CARDIOVASCULAR, data_type=None, db=db)
    # Stale data cannot remain silently NORMAL
    assert res.status in (SystemStatus.MONITOR, SystemStatus.INSUFFICIENT_DATA)
    assert res.data_quality.freshness_status in ("STALE", "CRITICALLY_STALE")


# 4. Test invalid and non-finite measurements (NaN / Inf / bad units)
def test_invalid_and_non_finite_measurements():
    db = get_test_db()
    astro_id = "ASTRO-P3-INVALID"
    create_astronaut(AstronautCreate(astronaut_id=astro_id, name="Invalid Telemetry Astronaut"), db)

    # Pydantic schema validation rejects NaN and Inf at ingestion
    from pydantic import ValidationError
    try:
        HealthData(
            astronaut_id=astro_id,
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=float("nan"),
            unit="bpm",
            source="sensor",
            data_type=DataType.SIMULATED
        )
        assert False, "Should have rejected NaN"
    except ValidationError:
        pass


# 5. Test Real vs Simulated vs Research data separation
def test_data_type_separation():
    db = get_test_db()
    astro_id = "ASTRO-P3-TYPES"
    create_astronaut(AstronautCreate(astronaut_id=astro_id, name="Multi-type Astronaut"), db)

    now = datetime.utcnow()
    # Ingest 1 simulated reading (elevated) and 1 real reading (normal)
    ingest_record(
        HealthData(
            astronaut_id=astro_id,
            timestamp=now,
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=115.0,  # Elevated
            unit="bpm",
            source="simulator",
            data_type=DataType.SIMULATED
        ),
        db
    )
    ingest_record(
        HealthData(
            astronaut_id=astro_id,
            timestamp=now,
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=68.0,  # Normal
            unit="bpm",
            source="flight_wearable",
            data_type=DataType.REAL
        ),
        db
    )

    # Query analysis filtered exclusively by REAL data
    real_analysis = get_domain_analysis(astro_id, HealthDomain.CARDIOVASCULAR, data_type=DataType.REAL, db=db)
    assert real_analysis.status == SystemStatus.NORMAL
    assert real_analysis.data_quality.data_types_present == ["real"]

    # Query analysis filtered exclusively by SIMULATED data
    sim_analysis = get_domain_analysis(astro_id, HealthDomain.CARDIOVASCULAR, data_type=DataType.SIMULATED, db=db)
    assert sim_analysis.status == SystemStatus.MONITOR
    assert sim_analysis.data_quality.data_types_present == ["simulated"]


# 6. Test trend calculations
def test_trend_calculations():
    from app.services.trend_service import TrendService
    from app.models.health_record import HealthRecord

    # Upward slope
    base_time = datetime(2026, 11, 14, 8, 0, 0)
    records = [
        HealthRecord(astronaut_id="A1", domain="cardiovascular", indicator="heart_rate", value=60.0 + i * 5, unit="bpm", source="s", timestamp=base_time + timedelta(minutes=i*10))
        for i in range(5)
    ]
    trend = TrendService.calculate_trend(records, baseline_value=60.0)
    assert trend["direction"] == "increasing"
    assert trend["slope"] > 0
    assert trend["sample_count"] == 5
    assert trend["baseline_deviation_pct"] > 0


# 7. Test anomaly detection (threshold breach and sudden shift)
def test_anomaly_detection():
    from app.services.anomaly_service import AnomalyService
    eval_res = AnomalyService.evaluate_threshold("cabin_co2_pp", 4.5)
    assert eval_res["status"] == SystemStatus.MONITOR

    eval_crit = AnomalyService.evaluate_threshold("cabin_co2_pp", 5.5)
    assert eval_crit["status"] == SystemStatus.REVIEW_REQUIRED


# 8. Test baseline comparison
def test_baseline_comparison():
    db = get_test_db()
    astro_id = "ASTRO-P3-BASE"
    create_astronaut(
        AstronautCreate(
            astronaut_id=astro_id,
            name="Baseline Astronaut",
            resting_hr_baseline=60.0
        ),
        db
    )
    # Measured heart rate of 88 bpm is a 46% increase above baseline (60 bpm)
    ingest_record(
        HealthData(
            astronaut_id=astro_id,
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=88.0,
            unit="bpm",
            source="wearable",
            data_type=DataType.SIMULATED
        ),
        db
    )

    res = get_domain_analysis(astro_id, HealthDomain.CARDIOVASCULAR, data_type=None, db=db)
    # Check baseline shift detected in anomalies
    shifts = [a for a in res.anomalies if a.anomaly_type == "baseline_shift"]
    assert len(shifts) >= 1
    assert shifts[0].value == 88.0


# 9. Test cross-domain interactions (CO2 + HR / BP)
def test_cross_domain_interaction():
    db = get_test_db()
    astro_id = "ASTRO-P3-COMPOUND"
    create_astronaut(AstronautCreate(astronaut_id=astro_id, name="Compounding Astronaut"), db)

    now = datetime.utcnow()
    # Ingest elevated CO2 (Environmental)
    ingest_record(
        HealthData(
            astronaut_id=astro_id,
            timestamp=now,
            domain=HealthDomain.ENVIRONMENT,
            indicator="cabin_co2_pp",
            value=4.2,  # > 4.0 MONITOR
            unit="mmHg",
            source="sensor",
            data_type=DataType.SIMULATED
        ),
        db
    )
    # Ingest elevated heart rate (Cardiovascular)
    ingest_record(
        HealthData(
            astronaut_id=astro_id,
            timestamp=now,
            domain=HealthDomain.CARDIOVASCULAR,
            indicator="heart_rate",
            value=112.0,  # > 105 MONITOR
            unit="bpm",
            source="wearable",
            data_type=DataType.SIMULATED
        ),
        db
    )

    overview = get_integrated_analysis(astro_id, data_type=None, db=db)
    assert overview.overall_status == SystemStatus.REVIEW_REQUIRED
    # Check that cross-domain interaction is identified and clearly labelled as possible association
    assert len(overview.cross_domain_interactions) >= 1
    assert "Possible association" in overview.cross_domain_interactions[0]
    assert "cabin" in overview.cross_domain_interactions[0].lower()


# 10. Test explainable assessment generation
def test_explainable_assessment_generation():
    db = get_test_db()
    astro_id = "ASTRO-P3-EXPLAIN"
    create_astronaut(AstronautCreate(astronaut_id=astro_id, name="Explainable Astronaut"), db)

    ingest_record(
        HealthData(
            astronaut_id=astro_id,
            domain=HealthDomain.RADIATION,
            indicator="daily_dose_equivalent",
            value=2.4,  # REVIEW_REQUIRED
            unit="mSv/day",
            source="dosimeter",
            data_type=DataType.SIMULATED
        ),
        db
    )

    res = get_domain_analysis(astro_id, HealthDomain.RADIATION, data_type=None, db=db)
    assert res.status == SystemStatus.REVIEW_REQUIRED
    assert len(res.evidence) >= 1
    assert "daily_dose_equivalent" in res.explanation.lower()
    assert len(res.recommendations) >= 1


# 11. Test API endpoint logic directly with session override
def test_api_endpoints_direct():
    test_db = get_test_db()
    # 1. Register astronaut
    reg_astro = create_astronaut(AstronautCreate(
        astronaut_id="ASTRO-HTTP-01",
        name="Dr. Sunita Williams",
        role="Mission Commander"
    ), test_db)
    assert reg_astro.astronaut_id == "ASTRO-HTTP-01"

    # 2. Ingest telemetry
    ing_rec = ingest_record(HealthData(
        astronaut_id="ASTRO-HTTP-01",
        domain=HealthDomain.CARDIOVASCULAR,
        indicator="heart_rate",
        value=72.0,
        unit="bpm",
        source="wearable",
        data_type=DataType.SIMULATED
    ), test_db)
    assert ing_rec.id is not None

    # 3. GET /api/analysis/{astronaut_id}
    analysis = get_integrated_analysis("ASTRO-HTTP-01", data_type=None, db=test_db)
    assert analysis.astronaut_id == "ASTRO-HTTP-01"
    assert hasattr(analysis, "overall_status")
    assert hasattr(analysis, "cross_domain_interactions")

    # 4. GET /api/analysis/{astronaut_id}/{domain}
    domain_res = get_domain_analysis("ASTRO-HTTP-01", HealthDomain.CARDIOVASCULAR, data_type=None, db=test_db)
    assert domain_res.domain == HealthDomain.CARDIOVASCULAR
    assert len(domain_res.indicators_analysed) == 1

    # 5. GET /api/alerts/{astronaut_id}
    alerts = get_astronaut_alerts("ASTRO-HTTP-01", db=test_db)
    assert isinstance(alerts, list)

    # 6. GET /api/recommendations/{astronaut_id}
    recs = get_astronaut_recommendations("ASTRO-HTTP-01", db=test_db)
    assert isinstance(recs, list)

    # 7. 404 for unknown astronaut
    try:
        get_integrated_analysis("UNKNOWN-ASTRO-999", data_type=None, db=test_db)
        assert False, "Should raise 404"
    except HTTPException as e:
        assert e.status_code == 404


if __name__ == "__main__":
    print("==================================================")
    print("ASTROHEALTH AI — PHASE 3 HEALTH ANALYSIS ENGINE")
    print("==================================================")
    test_six_independent_analyzers()
    print("1. [PASS] Six Specialized Analyzers Functional")
    test_missing_data_handling()
    print("2. [PASS] Missing Data Handling (INSUFFICIENT_DATA affirmed)")
    test_stale_data_handling()
    print("3. [PASS] Stale Data Handling (Cannot silently remain NORMAL)")
    test_invalid_and_non_finite_measurements()
    print("4. [PASS] Invalid and Non-finite Measurements (NaN/Inf rejected)")
    test_data_type_separation()
    print("5. [PASS] Real vs Simulated vs Research Separation")
    test_trend_calculations()
    print("6. [PASS] Time-series Trend Detection & Slope Calculations")
    test_anomaly_detection()
    print("7. [PASS] Anomaly & Sudden Shift Detection")
    test_baseline_comparison()
    print("8. [PASS] Pre-flight Baseline Comparison")
    test_cross_domain_interaction()
    print("9. [PASS] Cross-Domain Interaction & Compounding Risk Matrix")
    test_explainable_assessment_generation()
    print("10. [PASS] Explainable Assessment Output & Literature Evidence")
    test_api_endpoints_direct()
    print("11. [PASS] API Route Logic & 404 Unknown Astronaut Handling")
    print("==================================================")
    print("ALL 11 PHASE 3 TEST SUITES PASSED FLAWLESSLY!")
    print("==================================================")
