from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, DateTime, Date
from sqlalchemy.orm import relationship
from app.database.base import Base


class Astronaut(Base):
    __tablename__ = "astronauts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    astronaut_id = Column(String(64), unique=True, index=True, nullable=False)
    name = Column(String(128), nullable=False)  # Name or display_name
    mission_id = Column(String(64), index=True, nullable=True)
    mission_start_date = Column(Date, nullable=True)
    role = Column(String(64), nullable=True)  # Mission role / specialization
    mission_day = Column(Integer, nullable=True, default=1)
    blood_type = Column(String(8), nullable=True)
    resting_hr_baseline = Column(Float, nullable=True)
    resting_bp_sys_baseline = Column(Float, nullable=True)
    resting_bp_dia_baseline = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship to health records
    health_records = relationship(
        "HealthRecord",
        back_populates="astronaut",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
