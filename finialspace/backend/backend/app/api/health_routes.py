from datetime import datetime
from typing import List, Optional, Union
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.health_record import HealthRecord
from app.models.astronaut import Astronaut
from app.schemas.health import (
    HealthData,
    HealthRecordResponse,
    BatchIngestRequest,
    BatchIngestResponse,
)
from app.services.ingestion_service import IngestionService
from app.core.constants import HealthDomain, DataType

router = APIRouter(
    prefix="/api/data",
    tags=["Health Data & Ingestion"]
)


def _ensure_astronaut_exists(db: Session, astronaut_id: str) -> str:
    clean_id = astronaut_id.strip().upper()
    astro = db.query(Astronaut).filter(Astronaut.astronaut_id == clean_id).first()
    if not astro:
        raise HTTPException(
            status_code=404,
            detail=f"Astronaut '{clean_id}' not found."
        )
    return clean_id


@router.post("/ingest", response_model=HealthRecordResponse, status_code=201)
def ingest_record(data: HealthData, db: Session = Depends(get_db)):
    """
    Ingest a single astronaut health measurement with validation against registered astronauts,
    finite numerical checks, duplicate protection, and domain standards.
    """
    return IngestionService.ingest_single_record(db, data)


@router.post("/ingest/batch", response_model=BatchIngestResponse, status_code=201)
def ingest_batch(payload: BatchIngestRequest, db: Session = Depends(get_db)):
    """Batch ingestion enforcing strict isolation between real, simulated, and research data."""
    if not payload.records:
        raise HTTPException(status_code=400, detail="Batch ingestion payload contains no records.")
    count = IngestionService.ingest_batch_records(db, payload.records)
    dtype = payload.records[0].data_type if payload.records else DataType.REAL
    return BatchIngestResponse(
        inserted_count=count,
        data_type=dtype,
        message=f"Successfully ingested {count} {dtype.value} records."
    )


@router.get("/{astronaut_id}", response_model=List[HealthRecordResponse])
def get_astronaut_data(
    astronaut_id: str,
    domain: Optional[HealthDomain] = None,
    indicator: Optional[str] = None,
    data_type: Optional[DataType] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    skip: Union[int, None] = 0,
    limit: Union[int, None] = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve telemetry records for an astronaut with comprehensive filtering by domain,
    data type, indicator, time intervals, and pagination. Returns 404 if astronaut does not exist.
    """
    clean_id = _ensure_astronaut_exists(db, astronaut_id)

    query = db.query(HealthRecord).filter(HealthRecord.astronaut_id == clean_id)

    if domain is not None:
        dom_val = domain.value if hasattr(domain, "value") else str(domain)
        query = query.filter(HealthRecord.domain == dom_val)
    if indicator is not None:
        query = query.filter(HealthRecord.indicator == indicator.strip().lower())
    if data_type is not None:
        dt_val = data_type.value if hasattr(data_type, "value") else str(data_type)
        query = query.filter(HealthRecord.data_type == dt_val)
    if start_time is not None:
        query = query.filter(HealthRecord.timestamp >= start_time)
    if end_time is not None:
        query = query.filter(HealthRecord.timestamp <= end_time)

    offset_val = int(skip) if isinstance(skip, (int, float, str)) and str(skip).isdigit() else 0
    limit_val = int(limit) if isinstance(limit, (int, float, str)) and str(limit).isdigit() else 100

    return query.order_by(HealthRecord.timestamp.desc()).offset(offset_val).limit(limit_val).all()


@router.get("/{astronaut_id}/domain/{domain}", response_model=List[HealthRecordResponse])
def get_domain_data(
    astronaut_id: str,
    domain: HealthDomain,
    data_type: Optional[DataType] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    skip: Union[int, None] = 0,
    limit: Union[int, None] = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve domain-specific measurements for an astronaut. Returns 404 if astronaut does not exist.
    """
    clean_id = _ensure_astronaut_exists(db, astronaut_id)

    dom_val = domain.value if hasattr(domain, "value") else str(domain)
    query = db.query(HealthRecord).filter(
        HealthRecord.astronaut_id == clean_id,
        HealthRecord.domain == dom_val
    )

    if data_type is not None:
        dt_val = data_type.value if hasattr(data_type, "value") else str(data_type)
        query = query.filter(HealthRecord.data_type == dt_val)
    if start_time is not None:
        query = query.filter(HealthRecord.timestamp >= start_time)
    if end_time is not None:
        query = query.filter(HealthRecord.timestamp <= end_time)

    offset_val = int(skip) if isinstance(skip, (int, float, str)) and str(skip).isdigit() else 0
    limit_val = int(limit) if isinstance(limit, (int, float, str)) and str(limit).isdigit() else 100

    return query.order_by(HealthRecord.timestamp.desc()).offset(offset_val).limit(limit_val).all()
