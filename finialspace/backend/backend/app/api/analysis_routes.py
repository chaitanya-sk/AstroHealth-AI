from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.health_record import HealthRecord
from app.models.astronaut import Astronaut
from app.schemas.analysis import IntegratedHealthSummary, DomainAnalysisResult
from app.schemas.ml import ModelInfoResponse, ModelPredictRequest, ModelPredictResponse
from app.core.constants import HealthDomain, DataType
from app.intelligence.health_intelligence import health_intelligence_engine
from app.ml.predictor import Predictor
from app.ml.model_registry import ModelRegistry
from app.ml.model_loader import ModelLoader
from app.services.analytics.dataset_discovery_service import DatasetDiscoveryService
from app.services.analytics.baseline_trajectory_service import BaselineTrajectoryAnalyzer
from app.services.research.unified_research_service import UnifiedResearchService
from app.services.research.osdr_dataset_service import OSDRDatasetService

router = APIRouter(
    prefix="/api/analysis",
    tags=["Health Intelligence & Analysis"]
)


def _ensure_astronaut_exists(db: Session, astronaut_id: str) -> Astronaut:
    clean_id = astronaut_id.strip().upper()
    astro = db.query(Astronaut).filter(Astronaut.astronaut_id == clean_id).first()
    if not astro:
        raise HTTPException(status_code=404, detail=f"Astronaut '{clean_id}' not found.")
    return astro


@router.get("/{astronaut_id}", response_model=IntegratedHealthSummary)
def get_integrated_analysis(
    astronaut_id: str,
    data_type: Optional[DataType] = None,
    db: Session = Depends(get_db)
):
    """
    Comprehensive 6-domain decision support assessment combining validated telemetry,
    freshness evaluation, and cross-domain compounding risk analysis.
    """
    astro = _ensure_astronaut_exists(db, astronaut_id)
    clean_id = astro.astronaut_id

    query = db.query(HealthRecord).filter(HealthRecord.astronaut_id == clean_id)
    if data_type:
        dt_val = data_type.value if hasattr(data_type, "value") else str(data_type)
        query = query.filter(HealthRecord.data_type == dt_val)
    records = query.all()

    return health_intelligence_engine.generate_integrated_overview(
        clean_id,
        records,
        astronaut=astro,
        data_type_filter=data_type.value if hasattr(data_type, "value") else (str(data_type) if data_type else None)
    )


@router.get("/{astronaut_id}/{domain}", response_model=DomainAnalysisResult)
def get_domain_analysis(
    astronaut_id: str,
    domain: HealthDomain,
    data_type: Optional[DataType] = None,
    db: Session = Depends(get_db)
):
    """
    Deep-dive evaluation on a specific health domain including trends, anomalies,
    data quality checks, and evidence-supported observations.
    """
    astro = _ensure_astronaut_exists(db, astronaut_id)
    clean_id = astro.astronaut_id

    dom_val = domain.value if hasattr(domain, "value") else str(domain)
    query = db.query(HealthRecord).filter(
        HealthRecord.astronaut_id == clean_id,
        HealthRecord.domain == dom_val
    )
    if data_type:
        dt_val = data_type.value if hasattr(data_type, "value") else str(data_type)
        query = query.filter(HealthRecord.data_type == dt_val)
    records = query.all()

    return health_intelligence_engine.analyze_domain(
        domain,
        clean_id,
        records,
        astronaut=astro,
        data_type_filter=data_type.value if hasattr(data_type, "value") else (str(data_type) if data_type else None)
    )


# -------------------------------------------------------------
# AUTONOMOUS DATASET INTELLIGENCE & RESEARCH ANALYTICS
# -------------------------------------------------------------

@router.get("/datasets/discover")
def discover_raw_datasets():
    """Scan datasets/raw/ and return autonomous domain classification and workflow selection."""
    return DatasetDiscoveryService.discover_raw_datasets()


@router.get("/research/osd575/cohort")
def get_osd575_cohort_summary():
    """Retrieve cohort summary of NASA OSD-575 Inspiration4 proteomic baseline dataset."""
    return BaselineTrajectoryAnalyzer.get_cohort_summary()


@router.get("/research/osd575/participant/{participant_id}")
def get_osd575_participant_trajectory(participant_id: str):
    """Retrieve longitudinal baseline shifts and recovery trajectories for a specific participant (C001 - C004)."""
    res = BaselineTrajectoryAnalyzer.get_subject_trajectory(participant_id)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res


# -------------------------------------------------------------
# UNIFIED RESEARCH DATA LAYER ENDPOINTS
# -------------------------------------------------------------

@router.get("/research/datasets")
def list_unified_research_datasets():
    """List all connected and reference research datasets (NASA OSD series and MMASH)."""
    return UnifiedResearchService.list_research_datasets()


@router.get("/research/datasets/{dataset_id}")
def get_research_dataset_details(dataset_id: str):
    """Retrieve complete metadata, status, and supported measurements for a research dataset."""
    details = UnifiedResearchService.get_dataset_details(dataset_id)
    if not details:
        raise HTTPException(status_code=404, detail=f"Research dataset '{dataset_id}' not found.")
    return details


@router.get("/research/domains/{domain}")
def get_research_domain_data(domain: str, db: Session = Depends(get_db)):
    """Retrieve empirical research measurements and availability status connected to a specific health domain."""
    return UnifiedResearchService.get_unified_domain_evidence_analysis(domain, db)


@router.get("/research/timeline/{participant_id}")
def get_research_participant_timeline(participant_id: str, db: Session = Depends(get_db)):
    """Retrieve full research timeline for a spaceflight (OSD-575) or terrestrial (MMASH) participant."""
    res = UnifiedResearchService.get_research_participant_timeline(participant_id, db)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res


@router.get("/research/compare/{astronaut_id}/{indicator}")
def compare_astronaut_with_research(astronaut_id: str, indicator: str, db: Session = Depends(get_db)):
    """Compare an operational astronaut's real telemetry against external research distributions."""
    _ensure_astronaut_exists(db, astronaut_id)
    return UnifiedResearchService.compare_research_vs_operational(astronaut_id, indicator, db)


@router.get("/research/osd/{study_id}/cohort-summary")
def get_osd_cohort_summary(study_id: str):
    """Retrieve cohort summary and acute post-flight shifts for an OSDR study (OSD-569, OSD-656, OSD-571, OSD-570)."""
    clean_id = study_id.strip().upper().replace("NASA-", "")
    if clean_id == "OSD-569":
        return OSDRDatasetService.get_osd569_cohort_summary()
    elif clean_id == "OSD-656":
        return OSDRDatasetService.get_osd656_cohort_summary()
    elif clean_id == "OSD-571":
        return OSDRDatasetService.get_osd571_summary()
    elif clean_id == "OSD-570":
        return OSDRDatasetService.get_osd570_summary()
    elif clean_id == "OSD-575":
        return BaselineTrajectoryAnalyzer.get_cohort_summary()
    else:
        raise HTTPException(status_code=404, detail=f"Study '{study_id}' not found or unsupported.")


@router.post("/research/osd/ingest")
def trigger_osdr_ingestion(db: Session = Depends(get_db)):
    """Idempotently ingest OSD-569 and OSD-656 research records into the quarantined research database."""
    return OSDRDatasetService.ingest_osd569_and_osd656(db)


# -------------------------------------------------------------
# MACHINE LEARNING INFRASTRUCTURE ENDPOINTS
# -------------------------------------------------------------

@router.get("/ml/models", response_model=List[ModelInfoResponse])
def list_registered_models():
    """List all registered candidate ML models, expected features, units, and deployment status."""
    results = []
    for key, info in ModelRegistry.list_models().items():
        is_avail = ModelLoader.is_model_available(info["domain"], info["filename"])
        results.append(
            ModelInfoResponse(
                model_key=key,
                domain=info["domain"],
                model_name=info["model_name"],
                filename=info["filename"],
                description=info["description"],
                expected_features=info["expected_features"],
                expected_units=info["expected_units"],
                model_version=info["model_version"],
                task_type=info["task_type"],
                dataset_requirements=info.get("dataset_requirements"),
                target_description=info.get("target_description"),
                is_available=is_avail,
                status="READY" if is_avail else "NOT_DEPLOYED"
            )
        )
    return results


@router.get("/ml/models/{model_key}", response_model=ModelInfoResponse)
def get_model_metadata(model_key: str):
    """Retrieve detailed metadata and contract for a specific model key."""
    meta = ModelRegistry.get_metadata(model_key)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Model key '{model_key}' not found in registry.")

    is_avail = ModelLoader.is_model_available(meta.domain.value, meta.filename)
    return ModelInfoResponse(
        model_key=model_key,
        domain=meta.domain.value,
        model_name=meta.model_name,
        filename=meta.filename,
        description=meta.description,
        expected_features=meta.expected_features,
        expected_units=meta.expected_units,
        model_version=meta.model_version,
        task_type=meta.task_type,
        dataset_requirements=meta.dataset_requirements,
        target_description=meta.target_description,
        is_available=is_avail,
        status="READY" if is_avail else "NOT_DEPLOYED"
    )


@router.post("/ml/predict/{model_key}", response_model=ModelPredictResponse)
def run_model_prediction(model_key: str, payload: ModelPredictRequest):
    """
    Execute offline ML prediction with input feature and unit validation.
    Gracefully returns descriptive diagnostic if model artifact is not yet placed in trained_models.
    """
    res = Predictor.predict(model_key, payload.features, units_dict=payload.units)
    return ModelPredictResponse(**res)
