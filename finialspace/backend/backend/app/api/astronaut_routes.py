from datetime import datetime
from typing import List, Optional, Union
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.astronaut import Astronaut
from app.schemas.astronaut import AstronautCreate, AstronautUpdate, AstronautResponse

router = APIRouter(
    prefix="/api/astronauts",
    tags=["Astronauts"]
)


@router.post("", response_model=AstronautResponse, status_code=201)
def create_astronaut(payload: AstronautCreate, db: Session = Depends(get_db)):
    """Register a new astronaut profile."""
    clean_id = payload.astronaut_id.strip().upper()
    existing = db.query(Astronaut).filter(Astronaut.astronaut_id == clean_id).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"Astronaut with ID '{clean_id}' already registered."
        )

    astro_data = payload.model_dump()
    astro_data["astronaut_id"] = clean_id
    astro = Astronaut(**astro_data)
    db.add(astro)
    db.commit()
    db.refresh(astro)
    return astro


@router.get("", response_model=List[AstronautResponse])
def list_astronauts(
    skip: Union[int, None] = 0,
    limit: Union[int, None] = 50,
    mission_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List registered astronauts with pagination and filtering."""
    query = db.query(Astronaut)
    if mission_id is not None:
        query = query.filter(Astronaut.mission_id == str(mission_id).strip())

    offset_val = int(skip) if isinstance(skip, (int, float, str)) and str(skip).isdigit() else 0
    limit_val = int(limit) if isinstance(limit, (int, float, str)) and str(limit).isdigit() else 50

    return query.order_by(Astronaut.created_at.desc()).offset(offset_val).limit(limit_val).all()


@router.get("/{astronaut_id}", response_model=AstronautResponse)
def get_astronaut(astronaut_id: str, db: Session = Depends(get_db)):
    """Retrieve an individual astronaut by ID."""
    clean_id = astronaut_id.strip().upper()
    astro = db.query(Astronaut).filter(Astronaut.astronaut_id == clean_id).first()
    if not astro:
        raise HTTPException(status_code=404, detail=f"Astronaut '{clean_id}' not found.")
    return astro


@router.put("/{astronaut_id}", response_model=AstronautResponse)
def update_astronaut(
    astronaut_id: str,
    payload: AstronautUpdate,
    db: Session = Depends(get_db)
):
    """Update existing astronaut profile information."""
    clean_id = astronaut_id.strip().upper()
    astro = db.query(Astronaut).filter(Astronaut.astronaut_id == clean_id).first()
    if not astro:
        raise HTTPException(status_code=404, detail=f"Astronaut '{clean_id}' not found.")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(astro, field, val)

    db.commit()
    db.refresh(astro)
    return astro
