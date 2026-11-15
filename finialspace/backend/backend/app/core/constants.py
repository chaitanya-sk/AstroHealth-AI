from enum import Enum


class HealthDomain(str, Enum):
    IMMUNE = "immune"
    BONE_MUSCLE = "bone_muscle"
    CARDIOVASCULAR = "cardiovascular"
    BEHAVIORAL = "behavioral"
    RADIATION = "radiation"
    ENVIRONMENT = "environment"

    @classmethod
    def _missing_(cls, value):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.strip().lower():
                    return member
        return None


class DataType(str, Enum):
    REAL = "real"
    SIMULATED = "simulated"
    RESEARCH = "research"

    @classmethod
    def _missing_(cls, value):
        if isinstance(value, str):
            for member in cls:
                if member.value.lower() == value.strip().lower():
                    return member
        return None


class SystemStatus(str, Enum):
    NORMAL = "NORMAL"
    MONITOR = "MONITOR"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"

    # Backward compatibility aliases
    WATCH = "MONITOR"
    ACTION_REQUIRED = "REVIEW_REQUIRED"

    @classmethod
    def _missing_(cls, value):
        if isinstance(value, str):
            val_clean = value.strip().upper()
            if val_clean in ("WATCH", "MONITOR"):
                return cls.MONITOR
            if val_clean in ("ACTION_REQUIRED", "REVIEW_REQUIRED"):
                return cls.REVIEW_REQUIRED
            for member in cls:
                if member.value == val_clean:
                    return member
        return None


class AlertSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AlertStatus(str, Enum):
    ACTIVE = "ACTIVE"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    RESOLVED = "RESOLVED"
    DISMISSED = "DISMISSED"


# Standard physiological & environmental reference intervals documented in aerospace medicine literature
# (NASA Human Research Program, NASA-STD-3001, Spaceflight Clinical Protocols)
# Each entry includes:
# - unit, min_normal, max_normal, monitor_high/low, review_high/low
# - expected_units: for unit consistency validation
# - max_freshness_hours: indicator-specific freshness expectation (e.g. continuous vitals 6h, daily actigraphy 28h, periodic lab 336h/14d)
# - source_reference: traceable citation or explicit "Configurable demonstration threshold"
REFERENCE_RANGES = {
    # Cardiovascular (Continuous/Frequent telemetry)
    "heart_rate": {
        "unit": "bpm",
        "min_normal": 55.0,
        "max_normal": 100.0,
        "monitor_high": 105.0,
        "review_high": 125.0,
        "monitor_low": 50.0,
        "review_low": 42.0,
        "expected_units": ["bpm", "beats/min"],
        "max_freshness_hours": 8.0,
        "source_reference": "NASA-STD-3001 Vol 1 Rev B: Crew Health Standards (Cardiovascular Monitoring)"
    },
    "systolic_bp": {
        "unit": "mmHg",
        "min_normal": 90.0,
        "max_normal": 135.0,
        "monitor_high": 140.0,
        "review_high": 160.0,
        "monitor_low": 85.0,
        "review_low": 75.0,
        "expected_units": ["mmhg"],
        "max_freshness_hours": 24.0,
        "source_reference": "NASA-STD-3001 Vol 1 Rev B: Resting Arterial Pressure Boundaries"
    },
    "diastolic_bp": {
        "unit": "mmHg",
        "min_normal": 60.0,
        "max_normal": 85.0,
        "monitor_high": 90.0,
        "review_high": 100.0,
        "monitor_low": 55.0,
        "review_low": 45.0,
        "expected_units": ["mmhg"],
        "max_freshness_hours": 24.0,
        "source_reference": "NASA-STD-3001 Vol 1 Rev B: Resting Diastolic Pressure Boundaries"
    },
    "hrv_rmssd": {
        "unit": "ms",
        "min_normal": 25.0,
        "max_normal": 120.0,
        "monitor_low": 20.0,
        "review_low": 15.0,
        "expected_units": ["ms"],
        "max_freshness_hours": 12.0,
        "source_reference": "Spaceflight Autonomic Tone Literature (Task Force of ESC/NASPE HRV Standards)"
    },
    "spo2": {
        "unit": "%",
        "min_normal": 94.0,
        "max_normal": 100.0,
        "monitor_low": 92.0,
        "review_low": 89.0,
        "expected_units": ["%"],
        "max_freshness_hours": 8.0,
        "source_reference": "NASA-STD-3001 Vol 1: Peripheral Blood Oxygen Saturation Standards"
    },

    # Radiation (Continuous dosimeter & flux logs)
    "daily_dose_equivalent": {
        "unit": "mSv/day",
        "min_normal": 0.0,
        "max_normal": 0.6,
        "monitor_high": 1.0,
        "review_high": 2.0,
        "expected_units": ["msv/day", "msv"],
        "max_freshness_hours": 24.0,
        "source_reference": "NASA Space Permissible Exposure Limits (PEL) & NCRP Report No. 132"
    },
    "cumulative_dose_career": {
        "unit": "mSv",
        "min_normal": 0.0,
        "max_normal": 600.0,
        "monitor_high": 500.0,
        "review_high": 600.0,
        "expected_units": ["msv"],
        "max_freshness_hours": 48.0,
        "source_reference": "NASA Permissible Exposure Limits for Career Ionizing Radiation"
    },
    "active_flux_rate": {
        "unit": "particles/cm2/s",
        "min_normal": 0.0,
        "max_normal": 50.0,
        "monitor_high": 100.0,
        "review_high": 500.0,
        "expected_units": ["particles/cm2/s", "cts/sec"],
        "max_freshness_hours": 6.0,
        "source_reference": "Vehicle Charged Particle Dosimeter Telemetry (Active Radiation Monitoring)"
    },

    # Cabin Environment (Continuous habitat telemetry per NASA-STD-3001 Vol 2)
    "cabin_co2_pp": {
        "unit": "mmHg",
        "min_normal": 0.0,
        "max_normal": 3.0,
        "monitor_high": 4.0,
        "review_high": 5.0,
        "expected_units": ["mmhg"],
        "max_freshness_hours": 4.0,
        "source_reference": "NASA-STD-3001 Vol 2 Rev C: Habitable Atmosphere Architecture"
    },
    "cabin_o2_pp": {
        "unit": "mmHg",
        "min_normal": 150.0,
        "max_normal": 165.0,
        "monitor_low": 140.0,
        "review_low": 128.0,
        "expected_units": ["mmhg"],
        "max_freshness_hours": 4.0,
        "source_reference": "NASA-STD-3001 Vol 2: Oxygen Partial Pressure Operational Bounds"
    },
    "cabin_pressure": {
        "unit": "kPa",
        "min_normal": 98.0,
        "max_normal": 103.0,
        "monitor_low": 95.0,
        "review_low": 90.0,
        "expected_units": ["kpa", "psi"],
        "max_freshness_hours": 4.0,
        "source_reference": "NASA-STD-3001 Vol 2: Total Atmospheric Pressure Operational Limits"
    },
    "cabin_temperature": {
        "unit": "C",
        "min_normal": 18.3,
        "max_normal": 26.7,
        "monitor_low": 16.0,
        "monitor_high": 28.0,
        "review_high": 31.0,
        "expected_units": ["c", "celsius"],
        "max_freshness_hours": 4.0,
        "source_reference": "NASA-STD-3001 Vol 2: Thermal Comfort & Life Support Specifications"
    },
    "cabin_humidity": {
        "unit": "%",
        "min_normal": 25.0,
        "max_normal": 70.0,
        "monitor_low": 20.0,
        "monitor_high": 75.0,
        "expected_units": ["%"],
        "max_freshness_hours": 4.0,
        "source_reference": "NASA-STD-3001 Vol 2: Relative Humidity Environmental Limits"
    },

    # Bone & Muscle Health (Periodic laboratory assays & functional testing)
    "urinary_ntx": {
        "unit": "nM_BCE/mM_Cr",
        "min_normal": 15.0,
        "max_normal": 65.0,
        "monitor_high": 80.0,
        "review_high": 100.0,
        "expected_units": ["nm_bce/mm_cr"],
        "max_freshness_hours": 336.0,  # 14 days
        "source_reference": "NASA HRP: Bone Mineral Loss and Resorption Markers in Microgravity"
    },
    "calf_circumference": {
        "unit": "cm",
        "min_loss_pct": 5.0,
        "monitor_loss_pct": 10.0,
        "review_loss_pct": 15.0,
        "expected_units": ["cm"],
        "max_freshness_hours": 168.0,  # 7 days
        "source_reference": "NASA HRP: Muscle Size Atrophy and Functional Strength Protocols"
    },
    "isometric_strength_loss_pct": {
        "unit": "%",
        "min_loss_pct": 5.0,
        "monitor_loss_pct": 12.0,
        "review_loss_pct": 20.0,
        "expected_units": ["%"],
        "max_freshness_hours": 168.0,  # 7 days
        "source_reference": "NASA HRP: Muscle Countermeasures & Exercise Performance Tracking"
    },

    # Immune System (Periodic blood panels & salivary reactivation assays)
    "white_blood_cell_count": {
        "unit": "10^9/L",
        "min_normal": 4.0,
        "max_normal": 10.5,
        "monitor_low": 3.5,
        "monitor_high": 12.0,
        "review_high": 15.0,
        "expected_units": ["10^9/l", "k/ul"],
        "max_freshness_hours": 168.0,  # 7 days
        "source_reference": "NASA HRP Evidence Report: Human Immune System Dysregulation"
    },
    "c_reactive_protein": {
        "unit": "mg/L",
        "min_normal": 0.0,
        "max_normal": 3.0,
        "monitor_high": 5.0,
        "review_high": 10.0,
        "expected_units": ["mg/l"],
        "max_freshness_hours": 168.0,  # 7 days
        "source_reference": "Clinical Chemistry Guidelines: Systemic Inflammation Reference Range"
    },
    "salivary_cortisol": {
        "unit": "ug/dL",
        "min_normal": 0.1,
        "max_normal": 0.8,
        "monitor_high": 1.0,
        "review_high": 1.4,
        "expected_units": ["ug/dl", "nmol/l"],
        "max_freshness_hours": 72.0,   # 3 days
        "source_reference": "NASA HRP: Neuroendocrine Stress Assessment Protocols"
    },
    "ebv_viral_load": {
        "unit": "copies/mL",
        "min_normal": 0.0,
        "max_normal": 500.0,
        "monitor_high": 1000.0,
        "review_high": 5000.0,
        "expected_units": ["copies/ml"],
        "max_freshness_hours": 336.0,  # 14 days
        "source_reference": "Crucian et al.: Epstein-Barr Viral Reactivation in Astronauts"
    },

    # Behavioral and Mental Health (Daily actigraphy & operational PVT sessions)
    "sleep_duration_hours": {
        "unit": "hours",
        "min_normal": 7.0,
        "max_normal": 9.0,
        "monitor_low": 6.0,
        "review_low": 5.0,
        "expected_units": ["hours", "h"],
        "max_freshness_hours": 28.0,   # Daily post-sleep
        "source_reference": "NASA-STD-3001 Vol 1: Sleep Duration Guidelines for Spaceflight"
    },
    "pvt_mean_rt": {
        "unit": "ms",
        "min_normal": 180.0,
        "max_normal": 280.0,
        "monitor_high": 320.0,
        "review_high": 380.0,
        "expected_units": ["ms"],
        "max_freshness_hours": 48.0,
        "source_reference": "Basner et al.: Psychomotor Vigilance Task (PVT) Response Times on ISS"
    },
    "pvt_lapses": {
        "unit": "count",
        "min_normal": 0.0,
        "max_normal": 2.0,
        "monitor_high": 4.0,
        "review_high": 7.0,
        "expected_units": ["count", "lapses"],
        "max_freshness_hours": 48.0,
        "source_reference": "Basner et al.: Psychomotor Vigilance Task Lapse Frequency Criteria"
    },
    "subjective_fatigue_scale": {
        "unit": "score_1_10",
        "min_normal": 1.0,
        "max_normal": 4.0,
        "monitor_high": 6.0,
        "review_high": 8.0,
        "expected_units": ["score_1_10", "score"],
        "max_freshness_hours": 28.0,
        "source_reference": "Configurable demonstration threshold: Visual Analog Fatigue Scale"
    }
}
