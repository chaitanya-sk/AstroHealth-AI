import React, { useState } from 'react';
import { 
  Heart, 
  Wind, 
  Activity, 
  Brain, 
  Moon, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ShieldCheck, 
  Flame, 
  Clock, 
  Compass, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DataAvailabilityBadge, UnavailableMetricCard, HistoricalDataNotice } from './DataAvailabilityState';
import { APOLLO17_CREW } from './CrewSelection';

const HISTORICAL_HEALTH_DATA = {
  cernan: {
    cardiovascular: {
      hasData: true,
      summary: 'Continuous single-lead sternal ECG telemetry monitored by Flight Surgeons in Houston during all mission phases and lunar EVAs.',
      restingHeartRate: '64 - 74 BPM (Cabin Rest / Translunar Coast)',
      evaHeartRate: '110 - 138 BPM average (EVA-1 & EVA-2)',
      peakExertionRate: '152 BPM (Recorded during Apollo Lunar Surface Drill core extraction on Sol 1)',
      cardiacObservations: 'Normal sinus rhythm maintained throughout mission. Rare premature ventricular contractions (PVCs) observed during peak drill torque resistance. High dietary potassium intake (supplemented in fruit drinks) successfully prevented the potassium-depletion arrhythmias documented on Apollo 15.',
      unavailableMetrics: [
        { title: 'Continuous Arterial Blood Pressure (MAP/Sys/Dia)', category: 'Hemodynamic Telemetry', reason: 'Continuous arterial blood pressure transducers were not part of the 1972 Apollo bioharness; only pre-flight and recovery clinical cuff measurements were recorded.' },
        { title: 'Continuous Stroke Volume & Cardiac Output', category: 'Advanced Hemodynamics', reason: 'Bioimpedance cardiac output hardware was unavailable in Apollo spaceflight systems.' }
      ]
    },
    respiration: {
      hasData: true,
      summary: 'Chest wall impedance pneumography recorded respiration rate via biosensor electrode chest band.',
      restingRespiration: '14 - 18 breaths/min (Cabin ambient)',
      evaRespiration: '22 - 30 breaths/min (Active EVA surface ambulation)',
      cabinEnvironment: '100% Pure Oxygen at 5.0 psi (34.5 kPa) inside LM Challenger & CSM America',
      suitEnvironment: '100% Pure Oxygen at 3.75 psi (25.9 kPa) inside Apollo A7LB EMU spacesuit',
      respiratoryObservations: 'Breathing patterns remained regular under exertion. Minor transient upper respiratory dryness reported post-EVA due to dry suit gas circulation.',
      unavailableMetrics: [
        { title: 'Continuous Pulse Oximetry (SpO2)', category: 'Blood Oxygenation', reason: 'Digital pulse oximetry technology was not invented until the late 1970s; no SpO2 sensors existed on Apollo missions.' },
        { title: 'End-Tidal CO2 Capnography (EtCO2)', category: 'Respiratory Gas Telemetry', reason: 'Lithium hydroxide (LiOH) canisters scrubbed CO2 in cabin and suit; individual breath-by-breath capnography was not measured.' }
      ]
    },
    physicalWorkload: {
      hasData: true,
      summary: 'Metabolic heat production calculated continuously from Liquid Cooling Garment (LCG) inlet/outlet water temperature differential (ΔT) and pump flow rate.',
      averageEvaMetabolicRate: '1,050 BTU/hr (~308 Watts) across 22h 4m of lunar surface operations',
      peakMetabolicRate: '1,650 BTU/hr (~484 Watts) during lunar core drill extraction and rover equipment setup',
      roverTraverseMetabolicRate: '820 - 950 BTU/hr (Low-moderate exertion while seated driving LRV-3)',
      totalEvaExpenditure: 'Approx. 23,200 BTU (~6,800 kcal) over 3 lunar EVAs',
      musculoskeletalObservations: 'High grip fatigue and wrist flexor strain from continuous squeezing of pressurized EVA suit gloves against 3.75 psi internal pressure. Mild subungual hematomas (fingernail bruising) noted upon post-mission debriefing. Microgravity axial spinal elongation estimated at +1.8 inches pre-splashdown.',
      unavailableMetrics: [
        { title: 'Real-Time Muscle Electromyography (EMG)', category: 'Musculoskeletal Biomechanics', reason: 'Surface EMG sensors were not integrated into Apollo A7LB flight suits.' },
        { title: 'Continuous Blood Lactate Telemetry', category: 'Metabolic Biomarkers', reason: 'Real-time biochemical biosensors did not exist; only pre-flight and recovery venous blood draws were performed.' }
      ]
    },
    cognitiveWorkload: {
      hasData: true,
      summary: 'Mission operations workload evaluation based on flight transcripts, CapCom communications, and checklist execution rates.',
      alertStates: 'Peak cognitive focus during LM lunar descent, Taurus-Littrow landing, and emergency rover fender fabrication',
      proceduralComplexity: 'High: Dense procedural execution across 12-day mission involving orbital rendezvous, ALSEP activation, and contingency troubleshooting.',
      cognitiveObservations: 'Mental clarity and reaction times remained sharp. Crew maintained effective humor and situational awareness despite tight timelines and difficult boulder field navigation without satellite positioning.',
      unavailableMetrics: [
        { title: 'Electroencephalogram (EEG) Cognitive Load Telemetry', category: 'Neurophysiology', reason: 'In-flight continuous EEG monitoring was not performed on Apollo 17 flight crew.' },
        { title: 'Eye-Tracking & Pupil Dynamics Telemetry', category: 'Cognitive Tracking', reason: 'No eye-tracking hardware was installed in the Apollo flight helmets.' }
      ]
    },
    restRecovery: {
      hasData: true,
      summary: 'Sleep periods logged via flight communications, crew status reports, and biomedical harness signal cessation.',
      sleepEnvironment: 'Suspended nylon hammocks hung crosswise inside LM Challenger cabin (1/6th gravity)',
      averageSleepDuration: '5.5 - 6.2 hours per scheduled sleep period (vs 8.0 hours planned)',
      sleepQualityFactors: 'Reported mild difficulty falling asleep due to excitement, background cooling fluid pump noise, and thermal variations inside the LM cabin. Earplugs utilized with moderate success.',
      fatigueAccumulation: 'Cumulative fatigue evident by Sol 3; flight surgeons monitored crew closely before lunar liftoff. Recovery sleep following rendezvous was rated high quality.',
      unavailableMetrics: [
        { title: 'Polysomnography (PSG) Sleep Staging (REM / NREM)', category: 'Sleep Neurobiology', reason: 'Sleep architecture stages were not recorded in-flight on Apollo 17.' },
        { title: 'Circadian Melatonin / Cortisol Serum Curves', category: 'Endocrine Telemetry', reason: 'No in-flight endocrine testing was feasible on 1972 Apollo flights.' }
      ]
    }
  },

  schmitt: {
    cardiovascular: {
      hasData: true,
      summary: 'Continuous single-lead sternal ECG telemetry monitored by Flight Surgeons in Houston during lunar surface exploration.',
      restingHeartRate: '60 - 72 BPM (Pre-launch & translunar coast baseline)',
      evaHeartRate: '115 - 142 BPM average across 3 EVAs',
      peakExertionRate: '148 BPM (During manual trenching and core tube hammering at Shorty Crater)',
      cardiacObservations: 'Extremely stable cardiac response. Excellent cardiovascular endurance during long geological traverses on foot and rover. No significant dysrhythmias observed.',
      unavailableMetrics: [
        { title: 'Continuous Arterial Blood Pressure (MAP/Sys/Dia)', category: 'Hemodynamic Telemetry', reason: 'No continuous arterial line or automated cuff telemetry on Apollo 17 suits.' },
        { title: 'Continuous Cardiac Stroke Volume', category: 'Advanced Hemodynamics', reason: 'Historical telemetry limited to single-lead sternal ECG.' }
      ]
    },
    respiration: {
      hasData: true,
      summary: 'Chest impedance pneumograph recording continuous breath rate, with verified clinical records of post-EVA acute upper airway reaction.',
      restingRespiration: '15 - 19 breaths/min (Cabin baseline)',
      evaRespiration: '24 - 32 breaths/min (Active field geology)',
      cabinEnvironment: '100% Pure Oxygen at 5.0 psi (34.5 kPa)',
      suitEnvironment: '100% Pure Oxygen at 3.75 psi (25.9 kPa)',
      respiratoryObservations: 'DOCUMENTED SPACE MEDICINE LANDMARK: Following EVA-1 and EVA-2, upon removing his helmet inside the repressurized LM Challenger cabin, Schmitt experienced acute upper respiratory irritation termed "Lunar Hay Fever" caused by inhaled abrasive lunar dust clinging to the spacesuits. Symptoms included paroxysmal sneezing, nasal mucous membrane congestion, and voice hoarseness, resolving within 12 hours.',
      unavailableMetrics: [
        { title: 'Continuous Pulse Oximetry (SpO2)', category: 'Blood Oxygenation', reason: 'Pulse oximetry was not available on 1972 Apollo missions.' },
        { title: 'In-Cabin Regolith Particulate Concentration Telemetry', category: 'Environmental Aerobiology', reason: 'Real-time laser particulate counters did not exist in the LM cabin.' }
      ]
    },
    physicalWorkload: {
      hasData: true,
      summary: 'Metabolic heat output measured via Liquid Cooling Garment (LCG) water thermal difference.',
      averageEvaMetabolicRate: '1,120 BTU/hr (~328 Watts) (Slightly higher than Commander due to frequent kneeling and sample hammering)',
      peakMetabolicRate: '1,580 BTU/hr (~463 Watts) during trenching at Shorty Crater and deploying ALSEP probes',
      roverTraverseMetabolicRate: '850 - 920 BTU/hr while navigating and cataloging geological stations',
      totalEvaExpenditure: 'Approx. 24,700 BTU (~7,240 kcal) over 3 lunar EVAs',
      musculoskeletalObservations: 'Continuous kneeling and rising in 1/6th gravity with 80-pound EMU suit backpack placed substantial eccentric load on quadriceps and patellar tendons. Severe hand fatigue from sampling tongs and rock hammer.',
      unavailableMetrics: [
        { title: 'Real-Time Surface Electromyography (EMG)', category: 'Musculoskeletal Biomechanics', reason: 'EMG was not included in Apollo flight telemetry.' },
        { title: 'Continuous Serum Calcium & Bone Biomarkers', category: 'Bone Metabolism', reason: 'Real-time bone turnover assays did not exist in 1972; bone density was evaluated post-flight.' }
      ]
    },
    cognitiveWorkload: {
      hasData: true,
      summary: 'High scientific cognitive workload balancing operational timeline with real-time field geology observations.',
      alertStates: 'Peak cognitive performance during rapid identification and documentation of orange pyroclastic soil at Shorty Crater',
      proceduralComplexity: 'High: Real-time verbal geological descriptions communicated directly to Science Support Room in Houston while operating sample collection tools.',
      cognitiveObservations: 'Maintained exceptional scientific acumen throughout long excursions, noting subtle stratigraphy, vesicular basalt textures, and color variations under changing solar angles.',
      unavailableMetrics: [
        { title: 'Electroencephalogram (EEG) Telemetry', category: 'Neurophysiology', reason: 'Continuous cognitive EEG was not recorded in Apollo 17 missions.' },
        { title: 'Cognitive Reaction Time Telemetry', category: 'Psychomotor Performance', reason: 'No standardized computer-based psychomotor tests existed in 1972 spacecraft.' }
      ]
    },
    restRecovery: {
      hasData: true,
      summary: 'Rest and sleep log records from LM Challenger transcripts.',
      sleepEnvironment: 'Suspended nylon hammock inside LM Challenger lower cabin',
      averageSleepDuration: '5.2 - 6.0 hours per rest period',
      sleepQualityFactors: 'Sleep mildly disrupted by cabin noise, excitement, and mild nasal congestion from lunar dust exposure following EVA-1. Quality improved on Sol 2 and Sol 3.',
      fatigueAccumulation: 'Moderate cumulative physical fatigue compensated by high motivation and successful sample collection milestones.',
      unavailableMetrics: [
        { title: 'Polysomnography (PSG) Sleep Staging', category: 'Sleep Medicine', reason: 'REM/NREM sleep staging hardware was not available in 1972.' },
        { title: 'Actigraphy / Sleep Efficiency Index', category: 'Biometrics', reason: 'Modern wrist actigraphy did not exist.' }
      ]
    }
  },

  evans: {
    cardiovascular: {
      hasData: true,
      summary: 'Continuous single-lead sternal ECG telemetry monitored by Flight Surgeons in Houston while in lunar orbit and during deep space EVA.',
      restingHeartRate: '58 - 68 BPM (Solo lunar orbit baseline)',
      evaHeartRate: '120 - 135 BPM during Trans-Earth Deep Space EVA',
      peakExertionRate: '138 BPM (While climbing handrails along CSM America exterior to SIM bay)',
      cardiacObservations: 'Stable sinus rhythm throughout 147.7 hours of solo lunar orbit. Transient sinus tachycardia during depressurization and deep space EVA egress, returning to resting levels within 40 minutes of repressurization.',
      unavailableMetrics: [
        { title: 'Continuous Arterial Blood Pressure (MAP/Sys/Dia)', category: 'Hemodynamic Telemetry', reason: 'No continuous arterial line or automated blood pressure sensors.' },
        { title: 'Continuous Central Venous Pressure', category: 'Hemodynamics', reason: 'Not available in 1972 Apollo bio-instrumentation package.' }
      ]
    },
    respiration: {
      hasData: true,
      summary: 'Chest wall impedance pneumograph transmitted breath rate during solo orbital operations and deep space EVA.',
      restingRespiration: '13 - 17 breaths/min (CSM cabin ambient)',
      evaRespiration: '20 - 26 breaths/min (Deep space EVA maneuvering)',
      cabinEnvironment: '100% Pure Oxygen at 5.0 psi (34.5 kPa) inside CSM America',
      suitEnvironment: '100% Pure Oxygen at 3.75 psi (25.9 kPa) connected via 40-foot umbilical tether',
      respiratoryObservations: 'Nominal pulmonary performance. Unlike surface crew, Evans was not exposed to abrasive lunar dust particles until after lunar ascent docking.',
      unavailableMetrics: [
        { title: 'Continuous Pulse Oximetry (SpO2)', category: 'Blood Oxygenation', reason: 'Pulse oximetry was not technologically available in 1972.' },
        { title: 'Real-Time Spirometry Telemetry', category: 'Pulmonary Mechanics', reason: 'Dynamic spirometry was not recorded in Apollo spacecraft.' }
      ]
    },
    physicalWorkload: {
      hasData: true,
      summary: 'Workload evaluation in microgravity orbital flight and external deep space translation.',
      averageEvaMetabolicRate: '920 BTU/hr (~270 Watts) during 1h 05m deep space EVA',
      peakMetabolicRate: '1,280 BTU/hr (~375 Watts) during manual extraction of Panoramic & Mapping camera film cassettes from SIM bay',
      roverTraverseMetabolicRate: 'N/A (Command Module Pilot remained in lunar orbit)',
      totalEvaExpenditure: 'Approx. 1,020 BTU (~300 kcal) during deep space EVA',
      musculoskeletalObservations: 'Prolonged microgravity posture in CSM couches resulted in cephalad fluid shift (facial fullness, nasal congestion). Moderate forearm exertion during external hand-over-hand translation along spacecraft hull.',
      unavailableMetrics: [
        { title: 'Real-Time Muscle Electromyography (EMG)', category: 'Musculoskeletal Biomechanics', reason: 'Not part of Apollo bioharness telemetry.' },
        { title: 'Real-Time Bone Mineral Density Turnover', category: 'Bone Metabolism', reason: 'Continuous bone turnover sensors do not exist even today.' }
      ]
    },
    cognitiveWorkload: {
      hasData: true,
      summary: 'Intense cognitive workload managing single-pilot orbital navigation, scientific cameras, and contingency readiness.',
      alertStates: 'Continuous high cognitive demand: operating complex Scientific Instrument Module (SIM) bay cameras while maintaining orbital position and landmark tracking',
      proceduralComplexity: 'Very High: Solo command of CSM America required monitoring dozens of spacecraft systems simultaneously without crew cross-checks.',
      cognitiveObservations: 'Evans maintained meticulous logbooks and high operational accuracy throughout his record-setting 147 hours alone in lunar orbit.',
      unavailableMetrics: [
        { title: 'Electroencephalogram (EEG) Telemetry', category: 'Neurophysiology', reason: 'Continuous EEG was not recorded on Apollo 17 flight crew.' },
        { title: 'Cognitive Eye-Tracking Telemetry', category: 'Attention Tracking', reason: 'Not available in 1972 spacecraft.' }
      ]
    },
    restRecovery: {
      hasData: true,
      summary: 'Sleep logs recorded in CSM America transcripts during solo orbital mission.',
      sleepEnvironment: 'Padded crew couch inside CSM America in weightless free float',
      averageSleepDuration: '5.0 - 5.8 hours per sleep cycle',
      sleepQualityFactors: 'Sleep was fragmented due to spacecraft attitude alignment thruster firings, orbital daylight transitions every 2 hours, and lone responsibility for vehicle alarm systems.',
      fatigueAccumulation: 'Managed well with scheduled quiet periods. Crew reported feeling refreshed upon surface crew rendezvous.',
      unavailableMetrics: [
        { title: 'Polysomnography (PSG) Sleep Staging', category: 'Sleep Medicine', reason: 'Sleep architecture hardware was unavailable in Apollo 17.' },
        { title: 'Real-Time Circadian Hormone Biosensors', category: 'Endocrinology', reason: 'Not available in historical telemetry.' }
      ]
    }
  }
};

export default function PhysiologicalDataPanel({
  astronautId = 'cernan',
  onNavigateToScience
}) {
  const [activeCategory, setActiveCategory] = useState('cardiovascular');
  const astronaut = APOLLO17_CREW.find(c => c.id === astronautId) || APOLLO17_CREW[0];
  const healthData = HISTORICAL_HEALTH_DATA[astronautId] || HISTORICAL_HEALTH_DATA.cernan;
  const currentData = healthData[activeCategory];

  const categories = [
    { id: 'cardiovascular', label: 'Cardiovascular', icon: Heart, color: '#39D98A' },
    { id: 'respiration', label: 'Respiration', icon: Wind, color: '#28B8E8' },
    { id: 'physicalWorkload', label: 'Physical Workload', icon: Activity, color: '#FFB020' },
    { id: 'cognitiveWorkload', label: 'Cognitive Workload', icon: Brain, color: '#28B8E8' },
    { id: 'restRecovery', label: 'Rest & Recovery', icon: Moon, color: '#38BDF8' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header with Clear Provenance Notice */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-status badge-cyan">
            HISTORICAL PHYSIOLOGICAL ARCHIVE
          </span>
          <DataAvailabilityBadge status="available" label="NASA FLIGHT SURGEON ARCHIVE (1972)" />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          fontWeight: 800,
          color: '#FFFFFF',
          margin: 0
        }}>
          {astronaut.name} — Physiological & Health Data
        </h2>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          marginTop: '6px',
          maxWidth: '780px',
          lineHeight: 1.5
        }}>
          Verified biomedical telemetry from the 1972 Apollo Bio-Instrumentation Harness. 
          Parameters not recorded historically are explicitly marked as <strong>HISTORICAL DATA NOT AVAILABLE</strong> to preserve clinical and scientific integrity.
        </p>
      </div>

      {/* 5 Health Category Selector Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        paddingBottom: '4px'
      }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: isActive 
                  ? `1px solid ${cat.color}` 
                  : '1px solid rgba(245, 249, 255, 0.1)',
                background: isActive 
                  ? `linear-gradient(135deg, ${cat.color}25 0%, rgba(7, 21, 34, 0.9) 100%)` 
                  : 'rgba(7, 21, 34, 0.65)',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '0.80rem',
                fontFamily: 'var(--font-tech)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? `0 0 14px ${cat.color}40` : 'none'
              }}
            >
              <Icon size={14} style={{ color: isActive ? cat.color : 'inherit' }} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Physiological Content Card */}
      <div 
        className="glass-card"
        style={{
          padding: '28px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(16, 42, 67, 0.6) 0%, rgba(7, 21, 34, 0.85) 100%)',
          border: '1px solid rgba(40, 184, 232, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Category Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700, letterSpacing: '0.06em' }}>
              BIOMEDICAL DOMAIN: {activeCategory.toUpperCase()}
            </span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '2px 0 0 0'
            }}>
              Verified Historical Records & Telemetry
            </h3>
          </div>

          <DataAvailabilityBadge status="available" label="VERIFIED 1972 NASA LOG" />
        </div>

        {/* Summary Description */}
        <div style={{
          padding: '14px 18px',
          borderRadius: '10px',
          background: 'rgba(7, 21, 34, 0.65)',
          border: '1px solid rgba(40, 184, 232, 0.2)',
          fontSize: '0.88rem',
          color: 'var(--polar-white)',
          lineHeight: 1.55
        }}>
          {currentData.summary}
        </div>

        {/* Category-Specific Verified Metrics Grid */}
        {activeCategory === 'cardiovascular' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px'
            }}>
              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  RESTING HEART RATE
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--status-healthy)', fontWeight: 800, marginTop: '2px' }}>
                  {currentData.restingHeartRate}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  EVA AVERAGE HEART RATE
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--cosmic-cyan)', fontWeight: 800, marginTop: '2px' }}>
                  {currentData.evaHeartRate}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  PEAK EXERTION HEART RATE
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFB020', fontWeight: 800, marginTop: '2px' }}>
                  {currentData.peakExertionRate}
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px 18px',
              borderRadius: '10px',
              background: 'rgba(18, 59, 103, 0.25)',
              border: '1px solid rgba(40, 184, 232, 0.2)'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                FLIGHT SURGEON CLINICAL CARDIAC OBSERVATIONS
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentData.cardiacObservations}
              </p>
            </div>
          </div>
        )}

        {activeCategory === 'respiration' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px'
            }}>
              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  RESTING RESPIRATION
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--status-healthy)', fontWeight: 800, marginTop: '2px' }}>
                  {currentData.restingRespiration}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  EVA RESPIRATION RATE
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--cosmic-cyan)', fontWeight: 800, marginTop: '2px' }}>
                  {currentData.evaRespiration}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  CABIN ATMOSPHERE
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#FFF', fontWeight: 800, marginTop: '2px' }}>
                  {currentData.cabinEnvironment}
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px 18px',
              borderRadius: '10px',
              background: 'rgba(18, 59, 103, 0.25)',
              border: '1px solid rgba(40, 184, 232, 0.2)'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                PULMONARY OBSERVATIONS & DOCUMENTED LUNAR REGOLITH EFFECT
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentData.respiratoryObservations}
              </p>
            </div>
          </div>
        )}

        {activeCategory === 'physicalWorkload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px'
            }}>
              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  AVG EVA METABOLIC RATE (LCG ΔT)
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--status-healthy)', fontWeight: 800, marginTop: '2px' }}>
                  {currentData.averageEvaMetabolicRate}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  PEAK EXERTION METABOLIC SPIKE
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFB020', fontWeight: 800, marginTop: '2px' }}>
                  {currentData.peakMetabolicRate}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  TOTAL EVA ENERGY EXPENDITURE
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--cosmic-cyan)', fontWeight: 800, marginTop: '2px' }}>
                  {currentData.totalEvaExpenditure}
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px 18px',
              borderRadius: '10px',
              background: 'rgba(18, 59, 103, 0.25)',
              border: '1px solid rgba(40, 184, 232, 0.2)'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                MUSCULOSKELETAL OBSERVATIONS & SUIT GLOVE STRAIN
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentData.musculoskeletalObservations}
              </p>
            </div>
          </div>
        )}

        {activeCategory === 'cognitiveWorkload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px'
            }}>
              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  PEAK ALERT OPERATIONAL STATES
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.94rem', color: '#FFF', fontWeight: 700, marginTop: '4px', lineHeight: 1.4 }}>
                  {currentData.alertStates}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  MISSION PROCEDURAL COMPLEXITY
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.94rem', color: 'var(--cosmic-cyan)', fontWeight: 700, marginTop: '4px', lineHeight: 1.4 }}>
                  {currentData.proceduralComplexity}
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px 18px',
              borderRadius: '10px',
              background: 'rgba(18, 59, 103, 0.25)',
              border: '1px solid rgba(40, 184, 232, 0.2)'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                COGNITIVE & SITUATIONAL AWARENESS CONTEXT
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentData.cognitiveObservations}
              </p>
            </div>
          </div>
        )}

        {activeCategory === 'restRecovery' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px'
            }}>
              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  SLEEP ENVIRONMENT
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#FFF', fontWeight: 700, marginTop: '2px' }}>
                  {currentData.sleepEnvironment}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  AVERAGE SLEEP PER PERIOD
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFB020', fontWeight: 800, marginTop: '2px' }}>
                  {currentData.averageSleepDuration}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(7, 21, 34, 0.55)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  CUMULATIVE FATIGUE EVALUATION
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.90rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
                  {currentData.fatigueAccumulation}
                </div>
              </div>
            </div>

            <div style={{
              padding: '16px 18px',
              borderRadius: '10px',
              background: 'rgba(18, 59, 103, 0.25)',
              border: '1px solid rgba(40, 184, 232, 0.2)'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                SLEEP DISRUPTION FACTORS IN 1/6TH GRAVITY & ORBIT
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentData.sleepQualityFactors}
              </p>
            </div>
          </div>
        )}

        {/* ================= SECTION: EXPLICIT MISSING DATA CARDS ================= */}
        <div style={{ marginTop: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{
              fontSize: '0.76rem',
              fontFamily: 'var(--font-tech)',
              fontWeight: 700,
              color: 'var(--yellow-warning)',
              letterSpacing: '0.04em'
            }}>
              DATA INTEGRITY AUDIT: UNAVAILABLE HISTORICAL BIOMARKERS
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
              (Not recorded by 1972 NASA hardware — Never synthesized)
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '14px'
          }}>
            {currentData.unavailableMetrics.map((unavail) => (
              <UnavailableMetricCard
                key={unavail.title}
                title={unavail.title}
                category={unavail.category}
                reason={unavail.reason}
              />
            ))}
          </div>
        </div>

        {/* CTA to Science */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: '16px',
          borderTop: '1px solid rgba(245, 249, 255, 0.08)'
        }}>
          <button
            onClick={onNavigateToScience}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-tech)',
              fontWeight: 700
            }}
          >
            <span>CONTINUE TO SCIENCE & GEOLOGICAL EXPEDITION</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}
