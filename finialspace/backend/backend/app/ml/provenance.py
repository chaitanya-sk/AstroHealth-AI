import os
import json
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class DatasetProvenance(BaseModel):
    """
    Standard metadata record enforcing strict lineage and biological validity.
    Prevents confusing cell/rodent/simulated datasets with actual human astronaut data.
    """
    dataset_name: str
    original_source: str  # e.g., NASA Life Sciences Data Archive (LSDA), GeneLab, PhysioNet, etc.
    download_date: str  # ISO format YYYY-MM-DD
    organism_or_population: str  # e.g., "Human (Active Flight Crew)", "Human (Ground Bed-Rest Analogue)", "Synthetic Scenario"
    mission_or_experiment: str  # e.g., "ISS Expedition 50-60", "HERA Campaign 5", "SIMULATED-TEST-SUITE"
    number_of_records: int
    features: List[str]
    target_labels: List[str]
    missing_values_summary: Dict[str, int] = Field(default_factory=dict)
    known_limitations: List[str] = Field(default_factory=list)
    usage_and_access_restrictions: str
    data_type: str = "RESEARCH"  # REAL, SIMULATED, RESEARCH

    def save_manifest(self, directory_path: str, filename: str = "manifest.json") -> str:
        os.makedirs(directory_path, exist_ok=True)
        out_path = os.path.join(directory_path, filename)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(self.model_dump(), f, indent=2)
        return out_path

    @classmethod
    def load_manifest(cls, manifest_path: str) -> "DatasetProvenance":
        with open(manifest_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return cls(**data)

