from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database.base import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    recommendation_id = Column(String(64), unique=True, index=True, nullable=False)
    astronaut_id = Column(String(64), index=True, nullable=False)
    domain = Column(String(32), index=True, nullable=False)
    summary = Column(String(256), nullable=False)
    rationale = Column(Text, nullable=False)
    suggested_actions = Column(Text, nullable=False)  # JSON or bullet points
    evidence_reference = Column(Text, nullable=True)
    urgency = Column(String(16), default="ROUTINE")  # ROUTINE, PROMPT, IMMEDIATE
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

