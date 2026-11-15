import { 
  AstronautProfile, 
  SummaryStat, 
  HealthDomain, 
  IntelligenceOverview, 
  AlertItem, 
  TrendDataPoint,
  DataProvenanceItem 
} from '../types/dashboard';

export const CURRENT_MISSION = {
  name: "Artemis III Orbital Testbed",
  vessel: "Orion Deep Space Vehicle (MPC-03)",
  flightDay: 42,
  orbit: "Near-Rectilinear Halo Orbit (NRHO)",
  commsStatus: "High-Rate Ka-Band Nominal",
  nextAssessmentCycle: "04:30 UTC (T-3h 12m)",
  stationTime: "MET 042:14:28:10",
  dataFreshness: "Simulated Telemetry Stream (1.2s ping)"
};

export const SELECTED_ASTRONAUT: AstronautProfile = {
  id: "ASTRO-DOC-DEMO",
  name: "Dr. Anne McClain",
  role: "Medical Specialist",
  callsign: "Apollo-Lead",
  mission: "ARTEMIS-III",
  spacecraft: "Orion Deep Space Vehicle (MPC-03)",
  flightDay: 1,
  totalDaysInSpace: 204,
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
  status: "NORMAL",
  heartRateCurrent: 76,
  tier: "SIMULATED"
};

export const ASTRONAUT_ROSTER: AstronautProfile[] = [
  SELECTED_ASTRONAUT,
  {
    id: "ASTRO-01",
    name: "Test Astronaut",
    role: "Commander",
    callsign: "Ares-Lead",
    mission: "MISSION-01",
    spacecraft: "Orion MPC-03",
    flightDay: 1,
    totalDaysInSpace: 1,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    status: "INSUFFICIENT DATA",
    tier: "SIMULATED"
  },
  {
    id: "ASTRO-P8-6DOM",
    name: "Six Domain Test Pilot",
    role: "Flight Pilot",
    callsign: "Aurora-3",
    mission: "EXP-P8",
    spacecraft: "Orion MPC-03",
    flightDay: 1,
    totalDaysInSpace: 1,
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
    status: "INSUFFICIENT DATA",
    tier: "SIMULATED"
  },
  {
    id: "ASTRO-P8-API",
    name: "API Test Subject",
    role: "Systems Specialist",
    callsign: "Zenith-4",
    mission: "EXP-API",
    spacecraft: "Orion MPC-03",
    flightDay: 1,
    totalDaysInSpace: 1,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    status: "INSUFFICIENT DATA",
    tier: "SIMULATED"
  }
];

export const SUMMARY_STATS: SummaryStat[] = [
  {
    id: "active-astronauts",
    label: "Active Crew",
    value: "4",
    sublabel: "Deep Space Gateway",
    tier: "SIMULATED",
    icon: "Users",
    trend: "+0 this cycle",
    isPositive: true
  },
  {
    id: "health-assessments",
    label: "Health Evals",
    value: "78",
    sublabel: "Autonomous AI runs",
    tier: "SIMULATED",
    icon: "Activity",
    trend: "100% nominal cadence",
    isPositive: true
  },
  {
    id: "active-alerts",
    label: "Active Alerts",
    value: "3",
    sublabel: "1 moderate • 2 advisory",
    tier: "SIMULATED",
    icon: "AlertTriangle",
    trend: "-1 from sol 41",
    isPositive: true
  },
  {
    id: "research-datasets",
    label: "Telemetry Feeds",
    value: "203",
    sublabel: "Sensors & biosignals",
    tier: "SIMULATED",
    icon: "Database",
    trend: "12Hz live bio-packet",
    isPositive: true
  }
];

export const HEALTH_DOMAINS: HealthDomain[] = [
  {
    id: "cardiovascular",
    name: "Cardiovascular Health",
    shortName: "Cardio",
    status: "MONITOR",
    description: "Evaluates cephalad fluid shift, orthostatic tone, autonomic balance, and resting microgravity arrhythmia metrics.",
    icon: "HeartPulse",
    tier: "SIMULATED",
    dataAvailability: "Continuous 100Hz ECG + Photoplethysmography (PPG)",
    metrics: [
      { label: "Resting Heart Rate", value: "68", unit: "bpm", status: "normal", trend: "stable" },
      { label: "HRV (RMSSD)", value: "44", unit: "ms", status: "warning", trend: "down" },
      { label: "Blood Pressure Est.", value: "114/72", unit: "mmHg", status: "normal", trend: "stable" },
      { label: "Cardiac Stroke Vol.", value: "78", unit: "mL", status: "normal", trend: "stable" }
    ],
    findingsSummary: "Mild reduction in parasympathetic tone (-14% HRV) following EVA pre-breathe protocol.",
    detailedFindings: [
      "Autonomic nervous system index indicates sympathetic predominance over past 18 hours.",
      "Cephalad fluid redistribution remains stabilized within expected space adaptation margins.",
      "Zero malignant arrhythmias observed; 2 isolated benign ventricular contractions during resistive training."
    ],
    recommendation: "Maintain scheduled 2.5-hour ARED cycle with 40-minute aerobic interval. Re-evaluate post-hydration protocol.",
    lastUpdated: "2 mins ago"
  },
  {
    id: "immune",
    name: "Immune Health",
    shortName: "Immune",
    status: "NORMAL",
    description: "Monitors salivary cytokines, subclinical viral reactivation risk markers, and systemic leukocyte indices.",
    icon: "ShieldAlert",
    tier: "SIMULATED",
    dataAvailability: "Daily Salivary Immuno-Array & Bi-weekly Bio-Assays",
    metrics: [
      { label: "Salivary Cortisol", value: "0.28", unit: "µg/dL", status: "normal", trend: "stable" },
      { label: "IL-6 Cytokine Index", value: "2.1", unit: "pg/mL", status: "normal", trend: "stable" },
      { label: "Secretory IgA", value: "142", unit: "µg/mL", status: "normal", trend: "stable" },
      { label: "EBV Reactivation Risk", value: "Low", unit: "", status: "normal", trend: "stable" }
    ],
    findingsSummary: "Immunological profile within safe baseline parameters. No elevated inflammatory cascade detected.",
    detailedFindings: [
      "Salivary cortisol shows preserved circadian diurnal slope despite artificial orbital lighting schedule.",
      "Interleukin-6 and TNF-alpha biomarkers remain within pre-flight baseline range.",
      "Bio-cartridge cartridge #04 confirms absence of Epstein-Barr virus DNA shed in saliva."
    ],
    recommendation: "Continue standard antioxidant dietary supplementation and immunonutrition pack Omega-3 regimen.",
    lastUpdated: "45 mins ago"
  },
  {
    id: "bone-muscle",
    name: "Bone & Muscle Health",
    shortName: "Musculoskeletal",
    status: "NORMAL",
    description: "Tracks microgravity musculoskeletal deconditioning, calcaneal loading, and ARED resistance load compliance.",
    icon: "Dumbbell",
    tier: "SIMULATED",
    dataAvailability: "ARED Load Sensors + Weekly Ultrasound Myometry",
    metrics: [
      { label: "ARED Adherence", value: "96.4", unit: "%", status: "normal", trend: "up" },
      { label: "Soleus Myostiffness", value: "320", unit: "N/m", status: "normal", trend: "stable" },
      { label: "Peak Squat Force", value: "1,420", unit: "N", status: "normal", trend: "stable" },
      { label: "Estimated BMD Loss", value: "-0.8", unit: "%/mo", status: "normal", trend: "stable" }
    ],
    findingsSummary: "Muscular force production maintained above 95% of Earth baseline. Bone mineral density within countermeasure target.",
    detailedFindings: [
      "Soleus and gastrocnemius muscle tone showing expected adaptation to microgravity with no significant myofibrillar loss.",
      "Total mechanical energy expended on ARED: 1.48 MJ over current 7-day cycle.",
      "High compliance with heel-strike loading protocols during treadmill with harness (T2) sessions."
    ],
    recommendation: "Maintain 145kg equivalent deadlift loading on Sol 43 to counteract spinal elongation.",
    lastUpdated: "1 hour ago"
  },
  {
    id: "behavioral",
    name: "Behavioral Health",
    shortName: "Behavioral",
    status: "MONITOR",
    description: "Assesses circadian phase alignment, actigraphy sleep architecture, cognitive throughput, and team cohesion dynamics.",
    icon: "Brain",
    tier: "SIMULATED",
    dataAvailability: "Actigraphy Band + Daily PVT (Psychomotor Vigilance Test)",
    metrics: [
      { label: "Total Sleep Duration", value: "6.4", unit: "hrs", status: "warning", trend: "down" },
      { label: "REM Ratio", value: "18.2", unit: "%", status: "normal", trend: "stable" },
      { label: "PVT Mean RT", value: "228", unit: "ms", status: "normal", trend: "stable" },
      { label: "Circadian Phase Delay", value: "+42", unit: "min", status: "warning", trend: "up" }
    ],
    findingsSummary: "Mild sleep restriction observed across past 2 sleep cycles due to docking preparation shifts.",
    detailedFindings: [
      "Slow-wave deep sleep decreased by 12 minutes relative to pre-flight average.",
      "Cognitive speed on 3-minute Psychomotor Vigilance Test (PVT) remains robust without lapses (>500ms).",
      "Subjective fatigue score logged at 3/10 (nominal to mild)."
    ],
    recommendation: "Activate dynamic blue-depleted cabin lighting (480nm suppression) at MET 21:00 to advance melatonin onset.",
    lastUpdated: "3 hours ago"
  },
  {
    id: "radiation",
    name: "Radiation Health",
    shortName: "Radiation",
    status: "NORMAL",
    description: "Deep space Galactic Cosmic Ray (GCR) & Solar Particle Event (SPE) dosimeter tracking with organ dose models.",
    icon: "Radioactive",
    tier: "SIMULATED",
    dataAvailability: "Personal Active Dosimeter (CPD) + Spacecraft Radiation Grid",
    metrics: [
      { label: "Cumulative Mission Dose", value: "34.8", unit: "mSv", status: "normal", trend: "stable" },
      { label: "Current Ambient Rate", value: "1.12", unit: "mSv/day", status: "normal", trend: "stable" },
      { label: "Blood-Forming Organ Dose", value: "26.4", unit: "mGy-Eq", status: "normal", trend: "stable" },
      { label: "SPE Solar Risk", value: "Nominal", unit: "Quiet", status: "normal", trend: "stable" }
    ],
    findingsSummary: "Cumulative radiation exposure well within NASA 600 mSv career limit; space weather indices calm.",
    detailedFindings: [
      "Solar wind plasma density normal; NOAA Space Weather Prediction Center confirms 0% proton event probability.",
      "Orion storm shelter water-wall shielding effectiveness benchmarked at 99.4% attenuation for GCR secondary neutrons.",
      "Active silicon detector dosimeters reading 46 µGy/hr ambient within Crew Quarters #1."
    ],
    recommendation: "No shelter maneuvers required. Maintain standard personal dosimeter calibration checks on Sol 45.",
    lastUpdated: "12 mins ago"
  },
  {
    id: "cabin",
    name: "Cabin Environment",
    shortName: "Life Support",
    status: "NORMAL",
    description: "Monitors ECLSS life support telemetry: partial oxygen/CO2 pressures, cabin ambient acoustics, and trace volatile organics.",
    icon: "Wind",
    tier: "SIMULATED",
    dataAvailability: "ECLSS Primary Sensors + CDRA Scrubbing Telemetry",
    metrics: [
      { label: "Cabin ppO2", value: "159.2", unit: "mmHg", status: "normal", trend: "stable" },
      { label: "Cabin ppCO2", value: "2.34", unit: "mmHg", status: "normal", trend: "stable" },
      { label: "Total Pressure", value: "14.7", unit: "psia", status: "normal", trend: "stable" },
      { label: "Cabin Temperature", value: "21.6", unit: "°C", status: "normal", trend: "stable" }
    ],
    findingsSummary: "Environmental Control & Life Support Systems (ECLSS) fully nominal. Carbon dioxide scrubbing operating at high efficiency.",
    detailedFindings: [
      "Carbon Dioxide Removal Assembly (CDRA) Desiccant Bed A/B cyclic regeneration stable with 0.1 mmHg variance.",
      "Acoustic noise in sleep stations logged at 46.2 dBA (well below NC-50 sleep threshold criteria).",
      "Cabin humidity stabilized at 44.5% RH with trace contaminant scrubbing cartridge active."
    ],
    recommendation: "ECLSS bed regeneration sequence nominal. No crew intervention required.",
    lastUpdated: "Just now"
  }
];

export const INTELLIGENCE_DATA: IntelligenceOverview = {
  overallAssessment: "MONITOR",
  lastAssessmentTimestamp: "2026-11-14 23:18:40 UTC",
  assessmentCycle: "Cycle #1,204 • Gateway Bio-AI Core v4.2",
  systemReadinessScore: 89,
  explainableSummary: "Astronaut vital telemetry demonstrates stable adaptation to deep space microgravity with no acute pathophysiological distress. Primary advisory stems from minor HRV reduction (-14%) and 42-minute circadian delay following consecutive high-workload EVA prep windows.",
  domainStatuses: [
    { domain: "Cardiovascular", status: "MONITOR", badgeCount: 1 },
    { domain: "Immune Response", status: "NORMAL" },
    { domain: "Bone & Muscle", status: "NORMAL" },
    { domain: "Behavioral & Sleep", status: "MONITOR", badgeCount: 1 },
    { domain: "Radiation Dosimetry", status: "NORMAL" },
    { domain: "Cabin Life Support", status: "NORMAL" }
  ],
  criticalObservations: [
    {
      id: "OBS-01",
      domain: "Cardiovascular Health",
      observation: "Parasympathetic tone recovery lag during nocturnal sleep cycle",
      clinicalRationale: "RMSSD declined from 58ms baseline to 44ms over past 48 hours following fluid distribution stabilization and extended robotic arm grappling tasks.",
      actionItem: "Recommend 500mL electrolyte replenishment with scheduled evening autogenic relaxation protocol.",
      severity: "MEDIUM",
      tier: "SIMULATED"
    },
    {
      id: "OBS-02",
      domain: "Behavioral & Circadian",
      observation: "Sleep midpoint delayed by 42 minutes across Sol 40-41",
      clinicalRationale: "Cabin lighting spectrum transition was overridden during docking telemetry ingress, suppressing natural dim-light melatonin onset.",
      actionItem: "Lock crew quarters lighting to 460nm-attenuated amber mode at 21:30 MET.",
      severity: "LOW",
      tier: "SIMULATED"
    },
    {
      id: "OBS-03",
      domain: "Radiation Shielding",
      observation: "Ambient GCR solar minimum flux rate nominal at 1.12 mSv/day",
      clinicalRationale: "Gateway Deep Space shielding effectiveness remains high; cumulative mission exposure at 5.8% of permitted career limits.",
      actionItem: "Routine passive detector readout scheduled for Flight Day 45.",
      severity: "LOW",
      tier: "SIMULATED"
    }
  ]
};

export const ACTIVE_ALERTS: AlertItem[] = [
  {
    id: "ALT-8092",
    title: "HRV Parasympathetic Dip Detected",
    severity: "MEDIUM",
    domain: "Cardiovascular",
    timestamp: "28 min ago (22:50 UTC)",
    status: "ACTIVE",
    description: "Nocturnal HRV RMSSD dipped to 44ms (baseline 58ms). Elevated sympathetic index during non-REM sleep.",
    tier: "SIMULATED",
    astronautName: "Dr. Lora Piterson",
    recommendedAction: "Review hydration balance and adjust next ARED aerobic resistance ratio."
  },
  {
    id: "ALT-8089",
    title: "Circadian Phase Delay Observed",
    severity: "LOW",
    domain: "Behavioral Health",
    timestamp: "2 hr ago (21:18 UTC)",
    status: "ACTIVE",
    description: "Actigraphy sleep onset shifted +42 minutes past target mission rest window.",
    tier: "SIMULATED",
    astronautName: "Dr. Lora Piterson",
    recommendedAction: "Implement automated blue-attenuated cabin lighting protocol at 21:00 MET."
  },
  {
    id: "ALT-8074",
    title: "Cabin ppCO2 Micro-spike Scrubbed",
    severity: "LOW",
    domain: "Cabin Environment",
    timestamp: "5 hr ago (18:12 UTC)",
    status: "RESOLVED",
    description: "Brief excursion to 2.8 mmHg in Exercise Bay during simultaneous dual-crew workout. CDRA restored to 2.3 mmHg.",
    tier: "SIMULATED",
    astronautName: "All Crew",
    recommendedAction: "ECLSS auto-scrub cycle completed normally. No crew intervention needed."
  }
];

export const HEALTH_TREND_DATA: TrendDataPoint[] = [
  { time: "00:00", heartRate: 58, hrv: 56, baselineHR: 62, baselineHRV: 58, workload: 10, sleepStage: "Deep" },
  { time: "02:00", heartRate: 54, hrv: 62, baselineHR: 60, baselineHRV: 60, workload: 10, sleepStage: "Deep" },
  { time: "04:00", heartRate: 56, hrv: 58, baselineHR: 61, baselineHRV: 59, workload: 12, sleepStage: "REM" },
  { time: "06:00", heartRate: 64, hrv: 48, baselineHR: 63, baselineHRV: 55, workload: 25, sleepStage: "Wake" },
  { time: "08:00", heartRate: 72, hrv: 44, baselineHR: 68, baselineHRV: 52, workload: 65 },
  { time: "10:00", heartRate: 78, hrv: 42, baselineHR: 70, baselineHRV: 50, workload: 78 },
  { time: "12:00", heartRate: 124, hrv: 32, baselineHR: 120, baselineHRV: 35, workload: 95 }, // ARED exercise session
  { time: "14:00", heartRate: 82, hrv: 41, baselineHR: 74, baselineHRV: 48, workload: 70 },
  { time: "16:00", heartRate: 74, hrv: 45, baselineHR: 71, baselineHRV: 51, workload: 60 },
  { time: "18:00", heartRate: 70, hrv: 46, baselineHR: 69, baselineHRV: 52, workload: 45 },
  { time: "20:00", heartRate: 68, hrv: 44, baselineHR: 66, baselineHRV: 54, workload: 30 },
  { time: "22:00", heartRate: 62, hrv: 49, baselineHR: 64, baselineHRV: 56, workload: 15, sleepStage: "Light" },
];

export const DATA_PROVENANCE_REGISTRY: DataProvenanceItem[] = [
  {
    id: "PROV-01",
    name: "Autonomous Gateway Bio-Telemetry",
    category: "Vital Signs Telemetry",
    tier: "SIMULATED",
    sourceDataset: "AstroHealth Space Synthesizer (CCSDS Packet Standard)",
    collectionMethod: "Simulated microgravity continuous biosensor stream",
    complianceNote: "Generates physiologically plausible telemetry for Orion deep-space testing; never displays terrestrial ground data as flight biosignals.",
    latency: "1.2s via simulated DSN link"
  },
  {
    id: "PROV-02",
    name: "NASA Life Sciences Data Archive (LSDA) Baseline",
    category: "Spaceflight Physiological Norms",
    tier: "RESEARCH",
    sourceDataset: "NASA Open Science Data Repository (OSDR / GeneLab)",
    collectionMethod: "Archival ISS spaceflight and space-analog reference studies",
    complianceNote: "Used solely for normative population baseline boundaries and model validation thresholds.",
    latency: "Static reference benchmark"
  },
  {
    id: "PROV-03",
    name: "Terrestrial Multi-Modal Stress (MMASH)",
    category: "Ground Validation Dataset",
    tier: "RESEARCH",
    sourceDataset: "PhysioNet MMASH Benchmark",
    collectionMethod: "Terrestrial human subject ambulatory ECG/actigraphy monitoring",
    complianceNote: "STRICT COMPLIANCE: Terrestrial MMASH data is isolated to ML validation pipelines only. It is NEVER represented as astronaut telemetry.",
    latency: "Offline research cohort"
  },
  {
    id: "PROV-04",
    name: "ECLSS Environmental Telemetry Protocol",
    category: "Cabin Atmospheric Monitoring",
    tier: "SIMULATED",
    sourceDataset: "NASA ECLSS Model Baseline (Orion/Gateway Spec)",
    collectionMethod: "Integrated mass spectrometer & laser gas sensor simulation",
    complianceNote: "Conforms to NASA STD-3001 Vol 2 environmental life support limits.",
    latency: "Real-time telemetry bus"
  }
];

export const DAILY_SCHEDULE_ITEMS = [
  {
    time: "08:00 UTC",
    title: "Mission Medical Debrief",
    subtitle: "Flight Surgeon & Crew Health Sync",
    type: "medical",
    completed: true,
    avatars: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    ]
  },
  {
    time: "11:30 UTC",
    title: "ARED Resistance & T2 Interval",
    subtitle: "Cardiovascular & BMD Countermeasures",
    type: "exercise",
    completed: true,
    avatars: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
    ]
  },
  {
    time: "14:15 UTC",
    title: "Salivary Immuno-Array Assay",
    subtitle: "Bio-Cartridge #04 Analysis",
    type: "research",
    completed: false,
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
    ]
  },
  {
    time: "19:00 UTC",
    title: "Autonomic Recovery & Sleep Ingress",
    subtitle: "Cabin light 480nm suppression mode",
    type: "rest",
    completed: false,
    avatars: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
    ]
  }
];

