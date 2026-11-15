from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.database.base import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    alert_id = Column(String(64), unique=True, index=True, nullable=False)
    astronaut_id = Column(String(64), index=True, nullable=False)
    domain = Column(String(32), index=True, nullable=False)
    severity = Column(String(16), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    title = Column(String(256), nullable=False)
    explanation = Column(Text, nullable=False)
    supporting_measurements = Column(Text, nullable=True)  # JSON formatted strings of observations
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    status = Column(String(16), default="ACTIVE", index=True)  # ACTIVE, ACKNOWLEDGED, RESOLVED, DISMISSED
    recommended_action = Column(Text, nullable=False)
    evidence = Column(Text, nullable=True)

