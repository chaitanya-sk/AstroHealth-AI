// ASTRA HEALTH - NASA / Ares-V Mars Mission Telemetry Mock Data

export const astronautProfile = {
  id: "ASTRA-CDR-049",
  name: "Alex Morgan",
  role: "Mission Commander & Astrobiologist",
  rank: "CDR",
  avatarUrl: "",
  age: 36,
  bloodType: "O+",
  height: "182 cm",
  weight: "76.4 kg",
  mission: "ARES-V MARS EXPEDITION",
  location: "Hab-01 (Acidalia Planitia Sector 4)",
  missionDay: 147,
  totalMissionDays: 365,
  evaCount: 14,
  evaHours: 84.5,
  cumulativeRadiation: "61.7 mSv",
  careerDoseLimit: "600 mSv",
  overallHealthScore: 92,
  status: "OPTIMAL",
  systemStatus: "ONLINE",
  biometricLock: "VERIFIED_QUANTUM",
  earthLatency: "4m 12s",
  suitBattery: "94%",
  telemetrySync: "0.2s ago"
};

export const currentVitals = {
  heartRate: {
    value: 72,
    unit: "BPM",
    status: "NORMAL",
    trend: "+2%",
    trendDirection: "up",
    resting: 64,
    peak: 142,
    hrv: 68,
    description: "Stable sinus rhythm with optimal microgravity adaptation."
  },
  bloodOxygen: {
    value: 98,
    unit: "%",
    status: "OPTIMAL",
    trend: "+0%",
    trendDirection: "neutral",
    range: "95 - 100%",
    description: "Arterial oxygen saturation well above mission safe baseline."
  },
  bloodPressure: {
    value: "118/76",
    unit: "mmHg",
    status: "NORMAL",
    trend: "-1%",
    trendDirection: "down",
    systolic: 118,
    diastolic: 76,
    map: 90,
    description: "Normalized vascular tone. No cephalad fluid shift hypertension detected."
  },
  bodyTemperature: {
    value: 36.8,
    unit: "°C",
    status: "NORMAL",
    trend: "+0.1°C",
    trendDirection: "neutral",
    range: "36.5 - 37.2°C",
    description: "Core thermodynamic regulation optimal within Hab-01 ambient thermal envelope."
  },
  sleepQuality: {
    value: 87,
    unit: "%",
    status: "GOOD",
    trend: "+6%",
    trendDirection: "up",
    duration: "7h 42m",
    deepSleep: "1h 48m (23%)",
    remSleep: "1h 55m (25%)",
    lightSleep: "3h 59m (52%)",
    recoveryScore: 89,
    description: "Circadian sync maintained with 460nm blue spectrum sleep-lighting protocol."
  },
  radiationExposure: {
    value: "0.42",
    unit: "mSv/day",
    status: "LOW",
    trend: "-0.04",
    trendDirection: "down",
    level: "SAFE",
    safeThreshold: "1.00 mSv/day",
    weeklyDose: "2.94 mSv",
    missionDose: "61.7 mSv",
    description: "GCR & Solar wind background within safe Martian transit and habitat limits."
  },
  boneHealth: {
    value: 98,
    unit: "%",
    status: "OPTIMAL",
    trend: "-0.4%",
    trendDirection: "neutral",
    lumbarBMD: "0.98 g/cm²",
    femurBMD: "0.97 g/cm²",
    calcaneusBMD: "0.99 g/cm²",
    aredCompliance: "100%",
    weeklyLoading: "14,200 kg",
    risk: "LOW RISK",
    description: "ARED resistance regimen mitigating microgravity demineralization successfully."
  },
  mentalWellness: {
    value: 85,
    unit: "%",
    status: "STABLE",
    trend: "+3%",
    trendDirection: "up",
    stressLevel: 24, // out of 100
    mood: "FOCUSED & POSITIVE",
    cognitiveReaction: "218 ms",
    workingMemory: "94%",
    isolationIndex: "LOW",
    recommendation: "Take a 15-minute relaxation session and communicate with mission support."
  },
  respiratoryRate: {
    value: 14,
    unit: "br/min",
    status: "NORMAL",
    trend: "0%",
    trendDirection: "neutral",
    range: "12 - 18 br/min",
    description: "Normal resting pulmonary ventilation in 101.3 kPa habitat pressure."
  }
};

export const chartDatasets = {
  heartRate: {
    "24H": [
      { time: "00:00", value: 62 },
      { time: "02:00", value: 58 },
      { time: "04:00", value: 56 },
      { time: "06:00", value: 64 },
      { time: "08:00", value: 78 },
      { time: "10:00", value: 135 }, // Exercise
      { time: "12:00", value: 82 },
      { time: "14:00", value: 74 },
      { time: "16:00", value: 76 },
      { time: "18:00", value: 71 },
      { time: "20:00", value: 68 },
      { time: "22:00", value: 65 },
      { time: "Now", value: 72 }
    ],
    "7D": [
      { time: "Sol 141", value: 70 },
      { time: "Sol 142", value: 74 },
      { time: "Sol 143", value: 69 },
      { time: "Sol 144", value: 76 },
      { time: "Sol 145", value: 71 },
      { time: "Sol 146", value: 73 },
      { time: "Sol 147", value: 72 }
    ],
    "30D": [
      { time: "Sol 118", value: 75 },
      { time: "Sol 123", value: 73 },
      { time: "Sol 128", value: 71 },
      { time: "Sol 133", value: 74 },
      { time: "Sol 138", value: 70 },
      { time: "Sol 143", value: 72 },
      { time: "Sol 147", value: 72 }
    ]
  },
  bloodOxygen: {
    "24H": [
      { time: "00:00", value: 98 },
      { time: "04:00", value: 97 },
      { time: "08:00", value: 98 },
      { time: "12:00", value: 99 },
      { time: "16:00", value: 98 },
      { time: "20:00", value: 97 },
      { time: "Now", value: 98 }
    ],
    "7D": [
      { time: "Sol 141", value: 98 },
      { time: "Sol 142", value: 97 },
      { time: "Sol 143", value: 98 },
      { time: "Sol 144", value: 99 },
      { time: "Sol 145", value: 98 },
      { time: "Sol 146", value: 98 },
      { time: "Sol 147", value: 98 }
    ],
    "30D": [
      { time: "Sol 118", value: 98 },
      { time: "Sol 125", value: 97 },
      { time: "Sol 132", value: 98 },
      { time: "Sol 139", value: 99 },
      { time: "Sol 147", value: 98 }
    ]
  },
  bloodPressure: {
    "24H": [
      { time: "00:00", systolic: 114, diastolic: 72 },
      { time: "04:00", systolic: 110, diastolic: 70 },
      { time: "08:00", systolic: 120, diastolic: 78 },
      { time: "12:00", systolic: 124, diastolic: 80 },
      { time: "16:00", systolic: 119, diastolic: 77 },
      { time: "20:00", systolic: 116, diastolic: 75 },
      { time: "Now", systolic: 118, diastolic: 76 }
    ],
    "7D": [
      { time: "Sol 141", systolic: 117, diastolic: 75 },
      { time: "Sol 142", systolic: 119, diastolic: 77 },
      { time: "Sol 143", systolic: 116, diastolic: 74 },
      { time: "Sol 144", systolic: 121, diastolic: 78 },
      { time: "Sol 145", systolic: 118, diastolic: 76 },
      { time: "Sol 146", systolic: 117, diastolic: 75 },
      { time: "Sol 147", systolic: 118, diastolic: 76 }
    ],
    "30D": [
      { time: "Sol 118", systolic: 120, diastolic: 78 },
      { time: "Sol 125", systolic: 118, diastolic: 76 },
      { time: "Sol 132", systolic: 117, diastolic: 75 },
      { time: "Sol 139", systolic: 119, diastolic: 77 },
      { time: "Sol 147", systolic: 118, diastolic: 76 }
    ]
  },
  bodyTemperature: {
    "24H": [
      { time: "00:00", value: 36.5 },
      { time: "04:00", value: 36.3 },
      { time: "08:00", value: 36.7 },
      { time: "12:00", value: 37.0 },
      { time: "16:00", value: 36.9 },
      { time: "20:00", value: 36.8 },
      { time: "Now", value: 36.8 }
    ],
    "7D": [
      { time: "Sol 141", value: 36.7 },
      { time: "Sol 142", value: 36.8 },
      { time: "Sol 143", value: 36.9 },
      { time: "Sol 144", value: 36.7 },
      { time: "Sol 145", value: 36.8 },
      { time: "Sol 146", value: 36.7 },
      { time: "Sol 147", value: 36.8 }
    ],
    "30D": [
      { time: "Sol 118", value: 36.8 },
      { time: "Sol 125", value: 36.7 },
      { time: "Sol 132", value: 36.8 },
      { time: "Sol 139", value: 36.9 },
      { time: "Sol 147", value: 36.8 }
    ]
  },
  respiratoryRate: {
    "24H": [
      { time: "00:00", value: 12 },
      { time: "04:00", value: 11 },
      { time: "08:00", value: 14 },
      { time: "12:00", value: 16 },
      { time: "16:00", value: 15 },
      { time: "20:00", value: 13 },
      { time: "Now", value: 14 }
    ],
    "7D": [
      { time: "Sol 141", value: 14 },
      { time: "Sol 142", value: 15 },
      { time: "Sol 143", value: 13 },
      { time: "Sol 144", value: 14 },
      { time: "Sol 145", value: 14 },
      { time: "Sol 146", value: 13 },
      { time: "Sol 147", value: 14 }
    ],
    "30D": [
      { time: "Sol 118", value: 14 },
      { time: "Sol 125", value: 14 },
      { time: "Sol 132", value: 13 },
      { time: "Sol 139", value: 14 },
      { time: "Sol 147", value: 14 }
    ]
  },
  radiation: {
    "24H": [
      { time: "00:00", value: 0.38, threshold: 1.0 },
      { time: "04:00", value: 0.39, threshold: 1.0 },
      { time: "08:00", value: 0.45, threshold: 1.0 },
      { time: "12:00", value: 0.44, threshold: 1.0 },
      { time: "16:00", value: 0.41, threshold: 1.0 },
      { time: "20:00", value: 0.40, threshold: 1.0 },
      { time: "Now", value: 0.42, threshold: 1.0 }
    ],
    "7D": [
      { time: "Sol 141", value: 0.40, threshold: 1.0 },
      { time: "Sol 142", value: 0.46, threshold: 1.0 },
      { time: "Sol 143", value: 0.43, threshold: 1.0 },
      { time: "Sol 144", value: 0.52, threshold: 1.0 }, // minor solar burst
      { time: "Sol 145", value: 0.44, threshold: 1.0 },
      { time: "Sol 146", value: 0.39, threshold: 1.0 },
      { time: "Sol 147", value: 0.42, threshold: 1.0 }
    ],
    "30D": [
      { time: "Sol 118", value: 0.41, threshold: 1.0 },
      { time: "Sol 125", value: 0.43, threshold: 1.0 },
      { time: "Sol 132", value: 0.48, threshold: 1.0 },
      { time: "Sol 139", value: 0.42, threshold: 1.0 },
      { time: "Sol 147", value: 0.42, threshold: 1.0 }
    ]
  },
  boneDensity: {
    trends: [
      { sol: "Sol 1", score: 100, spine: 1.0, femur: 1.0 },
      { sol: "Sol 30", score: 99.6, spine: 0.99, femur: 0.99 },
      { sol: "Sol 60", score: 99.1, spine: 0.99, femur: 0.98 },
      { sol: "Sol 90", score: 98.7, spine: 0.98, femur: 0.98 },
      { sol: "Sol 120", score: 98.3, spine: 0.98, femur: 0.97 },
      { sol: "Sol 147", score: 98.0, spine: 0.98, femur: 0.97 }
    ]
  },
  sleepTimeline: [
    { phase: "Awake", start: "22:30", end: "22:50", duration: "20m", color: "#F5B942" },
    { phase: "Light Sleep", start: "22:50", end: "23:45", duration: "55m", color: "#35D07F" },
    { phase: "Deep Sleep", start: "23:45", end: "01:10", duration: "1h 25m", color: "#FF5A36" },
    { phase: "REM Sleep", start: "01:10", end: "02:00", duration: "50m", color: "#38BDF8" },
    { phase: "Light Sleep", start: "02:00", end: "03:15", duration: "1h 15m", color: "#35D07F" },
    { phase: "Deep Sleep", start: "03:15", end: "03:38", duration: "23m", color: "#FF5A36" },
    { phase: "REM Sleep", start: "03:38", end: "04:43", duration: "1h 05m", color: "#38BDF8" },
    { phase: "Light Sleep", start: "04:43", end: "06:12", duration: "1h 29m", color: "#35D07F" }
  ]
};

export const initialAlerts = [
  {
    id: "ALT-801",
    priority: "RED", // Critical Health Alert
    level: "CRITICAL",
    title: "Radiation Levels Elevated During EVA-3",
    message: "Dosimeter sensor #3 detected coronal transient spike peaking at 1.42 mSv/h. Ingress to Hab-01 shelter completed. Check personal biodosimetry.",
    timestamp: "18m ago",
    category: "Radiation Hazard",
    acknowledged: false,
    details: {
      location: "Acidalia Quad 4 - External Hab Perimeter",
      sensorId: "RAD-EXT-04",
      peakReading: "1.42 mSv/h",
      safeLimit: "0.08 mSv/h",
      recommendedAction: "Execute 100% Hab storm-shelter protocol. Administer radioprotective antioxidant booster regimen (Amifostine analogue)."
    }
  },
  {
    id: "ALT-802",
    priority: "YELLOW", // Attention Required
    level: "WARNING",
    title: "Slight Increase in Stress Level",
    message: "Sympathetic nervous tone increased by 14% post-EVA debrief. Elevated salivary cortisol telemetry detected via bio-patch.",
    timestamp: "42m ago",
    category: "Mental Wellness",
    acknowledged: false,
    details: {
      biomarker: "HRV drop (54ms) + Cortisol spike",
      trigger: "Intense 6.5hr EV docking alignment maneuver",
      safeLimit: "Stress index < 30",
      currentValue: "Stress index 42",
      recommendedAction: "Schedule mandatory 20-minute Earth habitat audiovisual immersive VR rest in Cupola."
    }
  },
  {
    id: "ALT-803",
    priority: "YELLOW", // Attention Required
    level: "WARNING",
    title: "Localized CO2 Elevation in Hab-B",
    message: "ECLSS scrubbers in Module B indicate momentary CO2 rise to 0.54 kPa. Astronaut Alex scheduled in sector at 14:00.",
    timestamp: "1h 10m ago",
    category: "Environmental",
    acknowledged: false,
    details: {
      location: "Module B Hydroponics & Research",
      sensorId: "ECLSS-CO2-B2",
      reading: "0.54 kPa (Normal < 0.40 kPa)",
      recommendedAction: "Verify ventilation auxiliary valve V-44 or redirect research to Module A."
    }
  },
  {
    id: "ALT-804",
    priority: "GREEN", // Normal / Information
    level: "NORMAL",
    title: "Hydration Reminder - Electrolyte Intake",
    message: "Bio-impedance analysis indicates mild 1.8% hydration decrease following ARED resistive workout. Consume 450ml electrolyte fluid.",
    timestamp: "2h 15m ago",
    category: "Nutrition & Vitals",
    acknowledged: true,
    details: {
      metric: "Bioelectrical Impedance 540 Ohms",
      deficit: "450 ml saline solution",
      status: "Dispensary pack pre-calculated for Commander Alex."
    }
  },
  {
    id: "ALT-805",
    priority: "GREEN", // Normal / Information
    level: "NORMAL",
    title: "Heart Rate Normal Post-Workout",
    message: "Cardiovascular recovery time 4.2 minutes following high-intensity cycle ergometer session. Autonomous recovery curve is optimal.",
    timestamp: "3h 40m ago",
    category: "Cardiovascular",
    acknowledged: true,
    details: {
      peakHR: "148 BPM",
      recoveryHR: "72 BPM at +5m",
      cardiacFitnessIndex: "96.4/100"
    }
  },
  {
    id: "ALT-806",
    priority: "GREEN", // Normal / Information
    level: "NORMAL",
    title: "Bone Loading Exercise Milestone Reached",
    message: "Cumulative 14,200 kg resistance target fulfilled for Sol 147. Bone mineral resorption markers (NTX) reduced by 11%.",
    timestamp: "5h 20m ago",
    category: "Musculoskeletal",
    acknowledged: true,
    details: {
      device: "ARED System 4.0",
      compliance: "100%",
      nextSession: "Sol 148 - 09:30 UTC"
    }
  }
];

export const aiHealthInsights = [
  {
    id: "INS-1",
    category: "Cardiovascular Health",
    title: "Cardiovascular Indicators are Stable",
    status: "OPTIMAL",
    confidence: "98.7%",
    summary: "Your cardiovascular indicators are stable with a resting heart rate of 72 BPM during microgravity adaptation.",
    recommendation: "Maintain the current 2-hour daily ARED + T2 treadmill workout schedule. No cardiovascular remodeling risks observed.",
    metrics: [
      { label: "Resting HR", value: "72 BPM" },
      { label: "HRV (SDNN)", value: "68 ms" },
      { label: "Cardiac Output", value: "5.1 L/min" }
    ],
    timestamp: "Generated 12m ago"
  },
  {
    id: "INS-2",
    category: "Sleep & Circadian Rhythm",
    title: "Sleep Recovery is Improving",
    status: "POSITIVE",
    confidence: "96.2%",
    summary: "Sleep recovery is improving with a 14% increase in deep sleep duration following T2 interval training.",
    recommendation: "Keep ambient circadian lighting shift at 21:00 UTC. Melatonin production profile indicates natural synchrony.",
    metrics: [
      { label: "Deep Sleep Ratio", value: "23% (+4%)" },
      { label: "REM Stability", value: "92%" },
      { label: "Sleep Latency", value: "11 min" }
    ],
    timestamp: "Generated 35m ago"
  },
  {
    id: "INS-3",
    category: "Radiological Safety",
    title: "Radiation Exposure Within Safe Limits",
    status: "SAFE",
    confidence: "99.4%",
    summary: "Radiation exposure remains within safe limits (0.42 mSv/day) following Hab-A shielding reinforcement.",
    recommendation: "Safe for scheduled external rover excursion on Sol 149. Galactic Cosmic Ray (GCR) background is quiescent.",
    metrics: [
      { label: "Daily Rate", value: "0.42 mSv/d" },
      { label: "Solar Proton Event", value: "0% Probability" },
      { label: "Total Career Dose", value: "61.7 mSv" }
    ],
    timestamp: "Generated 1h ago"
  },
  {
    id: "INS-4",
    category: "Neuro-Cognitive Wellness",
    title: "Stress Level Slightly Elevated",
    status: "ATTENTION",
    confidence: "94.1%",
    summary: "Stress level is slightly elevated (+8%) during EVA planning phase. Recommended: 15-minute neuro-acoustic session.",
    recommendation: "AI suggests a 15-minute audio-visual binaural relaxation session and brief family uplink to preserve mental resilience.",
    metrics: [
      { label: "Stress Index", value: "24/100" },
      { label: "Cognitive Latency", value: "218 ms" },
      { label: "EEG Alpha Ratio", value: "Stable" }
    ],
    timestamp: "Generated 1h 45m ago"
  }
];

export const crewMembers = [
  {
    id: "ASTRA-001",
    name: "Alex Morgan",
    role: "Commander & Astrobiologist",
    healthScore: 92,
    heartRate: "72 BPM",
    spo2: "98%",
    stress: "Low (24)",
    radiation: "0.42 mSv",
    status: "OPTIMAL",
    color: "#35D07F"
  },
  {
    id: "ASTRA-002",
    name: "Dr. Sarah Chen",
    role: "Flight Engineer & Pilot",
    healthScore: 95,
    heartRate: "68 BPM",
    spo2: "99%",
    stress: "Low (18)",
    radiation: "0.39 mSv",
    status: "OPTIMAL",
    color: "#35D07F"
  },
  {
    id: "ASTRA-003",
    name: "Marcus Vance",
    role: "Mission Specialist - EVA Lead",
    healthScore: 88,
    heartRate: "79 BPM",
    spo2: "97%",
    stress: "Moderate (38)",
    radiation: "0.58 mSv",
    status: "CAUTION",
    color: "#F5B942"
  },
  {
    id: "ASTRA-004",
    name: "Dr. Elena Rostova",
    role: "Chief Medical Officer",
    healthScore: 96,
    heartRate: "65 BPM",
    spo2: "99%",
    stress: "Low (15)",
    radiation: "0.36 mSv",
    status: "OPTIMAL",
    color: "#35D07F"
  }
];

export const missionStats = {
  missionName: "ARES-V MARS SURFACE EXPEDITION",
  destination: "Mars (Acidalia Planitia / 44.5° N 332.1° E)",
  currentDay: 147,
  totalDays: 365,
  solDay: 143,
  distanceFromEarth: "225.4 Million km",
  radioDelay: "4 min 12 sec (One-Way)",
  habitatStatus: "HAB-01 PRESSURIZED",
  fleetHealth: "94% NOMINAL",
  environmental: {
    pressure: "101.3 kPa",
    oxygen: "21.2%",
    nitrogen: "77.8%",
    co2: "0.32%",
    temperature: "21.4°C",
    humidity: "44%",
    waterRecycled: "98.4%",
    airScrubberStatus: "100% OPERATIONAL"
  },
  communication: {
    dsnAntenna: "Goldstone 70m Dish Lock",
    signalQuality: "99.1%",
    bandwidth: "42.5 Mbps",
    latency: "8m 24s Round-Trip",
    quantumRelay: "ACTIVE"
  },
  systems: {
    eclss: "NOMINAL",
    powerSolar: "96.2% EFFICIENCY",
    reactorRTG: "NOMINAL (4.2 kW)",
    bioMeshSensors: "32/32 ONLINE",
    stormShelter: "ARMED & STANDBY"
  }
};
