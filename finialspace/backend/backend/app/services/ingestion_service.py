from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.astronaut import Astronaut
from app.models.health_record import HealthRecord
from app.schemas.health import HealthData
from app.utils.data_quality import validate_measurement_value
from app.utils.timestamps import parse_timestamp
from app.core.constants import DataType


class IngestionService:
    @staticmethod
    def validate_astronaut_exists(db: Session, astronaut_id: str) -> Astronaut:
        clean_id = astronaut_id.strip().upper()
        astro = db.query(Astronaut).filter(Astronaut.astronaut_id == clean_id).first()
        if not astro:
            raise HTTPException(
                status_code=404,
                detail=f"Unknown astronaut '{clean_id}'. Register astronaut via POST /api/astronauts first."
            )
        return astro

    @staticmethod
    def ingest_single_record(db: Session, data: HealthData) -> HealthRecord:
        """
        Ingest a single health measurement:
        1. Validate astronaut reference (returns 404 if missing).
        2. Validate data fields and finite numeric quality.
        3. Check for exact duplicate measurement (same astronaut, indicator, source, and exact timestamp).
        4. Store record with UTC timestamp and optional JSON metadata.
        5. Commit safely; roll back upon error.
        """
        # 1. Validate astronaut existence
        IngestionService.validate_astronaut_exists(db, data.astronaut_id)

        # 2. Biological/Finite plausibility validation
        is_plausible, err_msg = validate_measurement_value(data.indicator, data.value)
        if not is_plausible:
            raise HTTPException(status_code=422, detail=f"Data quality error: {err_msg}")

        parsed_ts = parse_timestamp(data.timestamp)

        try:
            # 3. Duplicate measurement check
            # Define exact duplicate: identical astronaut, indicator, source, and timestamp
            existing_duplicate = db.query(HealthRecord).filter(
                HealthRecord.astronaut_id == data.astronaut_id,
                HealthRecord.indicator == data.indicator,
                HealthRecord.source == data.source,
                HealthRecord.timestamp == parsed_ts
            ).first()

            if existing_duplicate:
                # Update existing telemetry reading or return without duplicating
                existing_duplicate.value = data.value
                existing_duplicate.unit = data.unit
                existing_duplicate.confidence = data.confidence
                existing_duplicate.data_type = data.data_type.value
                existing_duplicate.extra_metadata = data.metadata
                db.commit()
                db.refresh(existing_duplicate)
                return existing_duplicate

            # 4. Create new record
            record = HealthRecord(
                astronaut_id=data.astronaut_id,
                timestamp=parsed_ts,
                domain=data.domain.value,
                indicator=data.indicator,
                value=data.value,
                unit=data.unit,
                source=data.source,
                data_type=data.data_type.value,
                confidence=data.confidence,
                extra_metadata=data.metadata,
            )
            db.add(record)
            db.commit()
            db.refresh(record)
            return record

        except Exception as e:
            db.rollback()
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=500,
                detail=f"Failed to persist health measurement: {str(e)}"
            )

    @staticmethod
    def ingest_batch_records(db: Session, records: List[HealthData]) -> int:
        if not records:
            return 0

        # Validate that batch does NOT mix simulated, real, or research data in the same batch
        distinct_types = {r.data_type for r in records}
        if len(distinct_types) > 1:
            raise HTTPException(
                status_code=400,
                detail="Batch data validation failed: Cannot mix simulated, real, or research data in a single batch"
            )

        # Validate astronauts exist for all records in batch
        unique_astronaut_ids = {r.astronaut_id for r in records}
        for astro_id in unique_astronaut_ids:
            IngestionService.validate_astronaut_exists(db, astro_id)

        try:
            db_records = []
            for r in records:
                is_plausible, err_msg = validate_measurement_value(r.indicator, r.value)
                if not is_plausible:
                    raise HTTPException(
                        status_code=422,
                        detail=f"Validation failed for astronaut {r.astronaut_id}, indicator {r.indicator}: {err_msg}"
                    )

                db_records.append(
                    HealthRecord(
                        astronaut_id=r.astronaut_id,
                        timestamp=parse_timestamp(r.timestamp),
                        domain=r.domain.value,
                        indicator=r.indicator,
                        value=r.value,
                        unit=r.unit,
                        source=r.source,
                        data_type=r.data_type.value,
                        confidence=r.confidence,
                        extra_metadata=r.metadata,
                    )
                )

            db.add_all(db_records)
            db.commit()
            return len(db_records)

        except Exception as e:
            db.rollback()
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=500,
                detail=f"Batch ingestion transaction failed: {str(e)}"
            )
