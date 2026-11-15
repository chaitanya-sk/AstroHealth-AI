from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database.base import Base


class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    astronaut_id = Column(
        String(64),
        ForeignKey("astronauts.astronaut_id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    timestamp = Column(DateTime, index=True, nullable=False, default=datetime.utcnow)
    domain = Column(String(32), index=True, nullable=False)  # immune, bone_muscle, cardiovascular, behavioral, radiation, environment
    indicator = Column(String(64), index=True, nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String(32), nullable=False)
    source = Column(String(64), nullable=False)  # wearable, lab_assay, environmental_sensor, etc.
    data_type = Column(String(16), index=True, nullable=False, default="real")  # real, simulated, research
    confidence = Column(Float, nullable=True, default=1.0)
    extra_metadata = Column("metadata", JSON, nullable=True)  # structured JSON metadata

    # Relationship back to astronaut
    astronaut = relationship("Astronaut", back_populates="health_records")

    __table_args__ = (
        Index("idx_astro_domain_data_type", "astronaut_id", "domain", "data_type"),
        Index("idx_astro_timestamp", "astronaut_id", "timestamp"),
    )
