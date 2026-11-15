import React, { useState } from 'react';
import { 
  Activity, 
  MapPin, 
  Clock, 
  Compass, 
  Zap, 
  Layers, 
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { DataAvailabilityBadge } from './DataAvailabilityState';

const ASTRONAUT_ACTIVITIES = {
  cernan: [
    {
      id: 'eva1_cernan',
      name: 'EVA-1: ALSEP Deployment & Core Sample Drilling',
      phase: 'Lunar Surface Phase (Sol 1)',
      date: 'December 11-12, 1972',
      duration: '7 hours, 11 minutes, 53 seconds',
      location: 'Taurus-Littrow Valley Floor • 100m West of LM Challenger',
      workloadLevel: 'HIGH WORKLOAD',
      workloadColor: '#FFB020',
      description: 'Offloaded and unpacked the Lunar Roving Vehicle (LRV-3). Deployed the Apollo Lunar Surface Experiments Package (ALSEP). Operated the Apollo Lunar Surface Drill (ALSD) to extract deep core tube samples from hard basalt regolith.',
      scientificContext: 'Drilling required heavy manual downpressure and torque resistance, leading to peak EVA metabolic heat production (~1,650 BTU/hr). Implanted the neutron probe and thermal heat flow sensors.',
      workloadContext: 'High physical exertion; cardiac rate elevated to 135-150 BPM during rotary percussive drilling through dense basalt layers. Significant wrist and grip fatigue from pressurized EMU glove resistance.'
    },
    {
      id: 'eva2_cernan',
      name: 'EVA-2: South Massif Rover Traverse & Station 2 Exploration',
      phase: 'Lunar Surface Phase (Sol 2)',
      date: 'December 12-13, 1972',
      duration: '7 hours, 36 minutes, 56 seconds',
      location: 'South Massif base, Nansen Crater, Shorty Crater (Traverse: 20.4 km)',
      workloadLevel: 'SUSTAINED HIGH WORKLOAD',
      workloadColor: '#FFB020',
      description: 'Drove LRV-3 on the longest single rover traverse of the Apollo Program. Reached Station 2 at Nansen Crater, exploring the debris avalanche from the 2,000-meter-high South Massif mountain wall. Supported Schmitt during discovery of orange pyroclastic soil at Station 4 (Shorty).',
      scientificContext: 'Sampled ancient lunar crustal rocks (norites and anorthosites) displaced by the Serenitatis impact basin. Improvised rear fender repair using tape, clamps, and folded lunar maps to prevent blinding dust plumes.',
      workloadContext: 'Prolonged bouncing and vibration while steering rover over rough boulder fields. Moderate sustained metabolic expenditure (approx. 1,050 BTU/hr) with brief spikes during boulder chipping on 25° incline slopes.'
    },
    {
      id: 'eva3_cernan',
      name: 'EVA-3: North Massif, Sculptured Hills & Final Lunar Departure',
      phase: 'Lunar Surface Phase (Sol 3)',
      date: 'December 13-14, 1972',
      duration: '7 hours, 15 minutes, 08 seconds',
      location: 'North Massif (Station 6 & 7), Sculptured Hills (Station 8), Van Serg',
      workloadLevel: 'HIGH CUMULATIVE FATIGUE',
      workloadColor: '#28B8E8',
      description: 'Traversed to base of North Massif and Sculptured Hills. Sampled massive split boulders with rake and tongs. Parked LRV-3 at final VIP site 100 meters east for TV broadcast of lunar liftoff. Left the final human footprint of the 20th century.',
      scientificContext: 'Retrieved 110.5 kg of total samples. Documented vesicular basalt, impact melt breccias, and regolith mantle.',
      workloadContext: 'Cumulative physical fatigue after 3 consecutive days of 7+ hour EVAs. Mild finger hyperemia and fingernail bruising under pressurized glove fingertips. Post-flight clinical recovery nominal.'
    }
  ],
  schmitt: [
    {
      id: 'eva1_schmitt',
      name: 'EVA-1: ALSEP Heat Flow Deployment & Geological Reconnaissance',
      phase: 'Lunar Surface Phase (Sol 1)',
      date: 'December 11-12, 1972',
      duration: '7 hours, 11 minutes, 53 seconds',
      location: 'Taurus-Littrow ALSEP Deployment Site',
      workloadLevel: 'HIGH WORKLOAD',
      workloadColor: '#FFB020',
      description: 'Unpacked and deployed scientific instruments: Lunar Surface Gravimeter (LSG), Lunar Atmospheric Composition Experiment (LACE), and Lunar Ejecta and Meteorites (LEAM). Emplaced two heat flow probes into drill holes 2.3 meters deep.',
      scientificContext: 'Recorded lunar internal thermal gradients to determine if the Moon possessed an active thermal core. Documented local soil mechanical properties and boulder distribution.',
      workloadContext: 'Strenuous bending, kneeling, and hammer wielding in 1/6th gravity against pressurized suit resistance. Metabolic rate averaged 1,120 BTU/hr. Heart rates reached 130-145 BPM during probe insertion.'
    },
    {
      id: 'eva2_schmitt',
      name: 'EVA-2: Discovery of Volcanic Orange Soil at Shorty Crater',
      phase: 'Lunar Surface Phase (Sol 2)',
      date: 'December 12-13, 1972',
      duration: '7 hours, 36 minutes, 56 seconds',
      location: 'Station 4 (Shorty Crater rim)',
      workloadLevel: 'HIGH COGNITIVE & PHYSICAL',
      workloadColor: '#28B8E8',
      description: 'While trenching the rim of Shorty Crater (a 110-meter impact crater), Schmitt visually identified bright orange soil beneath the gray mantle: "Hey, there is orange soil! It is all over!" Took core tube sample 74001/74002.',
      scientificContext: 'Proved the occurrence of ancient pyroclastic fire-fountaining on the Moon 3.64 billion years ago. The orange glass beads contained volatile elements (lead, sulfur, zinc) from deep lunar interior.',
      workloadContext: 'Intense cognitive focus and rapid scientific note-taking. High physical stamina maintained over 7.5 hours. Post-EVA: Experienced acute sneezing, turbinate swelling, and eye irritation ("lunar hay fever") upon re-entering LM cabin from clinging regolith dust.'
    },
    {
      id: 'eva3_schmitt',
      name: 'EVA-3: Boulder Sampling at North Massif & Sculptured Hills',
      phase: 'Lunar Surface Phase (Sol 3)',
      date: 'December 13-14, 1972',
      duration: '7 hours, 15 minutes, 08 seconds',
      location: 'North Massif (Station 6) & Sculptured Hills (Station 8)',
      workloadLevel: 'MODERATE-HIGH WORKLOAD',
      workloadColor: '#28B8E8',
      description: 'Investigated a 15-meter wide split boulder that rolled down from the North Massif crest. Sampled light-colored impact melt rocks and friable matrix materials using hammer and gnomon orientation device.',
      scientificContext: 'Clarified the structural relationship between valley graben floor and surrounding highlands massifs. Collected final rake samples and trench profiles.',
      workloadContext: 'Sustained muscular effort climbing 15-20° scree slopes. Muscle soreness in quadriceps and calves noted in debriefing, but no cardiac arrhythmias or heat exhaustion symptoms.'
    }
  ],
  evans: [
    {
      id: 'csm_orbit_mapping',
      name: 'Orbital Scientific Survey from CSM America',
      phase: 'Lunar Orbit Phase (147.7 Solo Hours)',
      date: 'December 11-14, 1972',
      duration: '147 hours, 43 minutes solo in orbit',
      location: '60 nautical mile circular Lunar Orbit',
      workloadLevel: 'HIGH COGNITIVE WORKLOAD',
      workloadColor: '#28B8E8',
      description: 'Operated the Scientific Instrument Module (SIM) bay in Service Module 114. Conducted continuous high-resolution orbital photography using the 24-inch Panoramic Camera and 3-inch Mapping Camera. Operated the Lunar Sounder (VHF/HF radar) to probe lunar crustal layers down to 1 km depth.',
      scientificContext: 'Acquired stereoscopic mapping of over 1.2 million square kilometers of lunar farside and nearside terrain, discovering multiple volcanic domes and rilles.',
      workloadContext: 'Strict schedule of camera magazine cycling, orbital attitude alignment maneuvers, and horizon tracking. High cognitive responsibility maintaining lone spacecraft systems. Sleep logs show fragmented sleep patterns (5.1 hours average) due to orbital day/night cycles.'
    },
    {
      id: 'deep_space_eva',
      name: 'Trans-Earth Deep Space Extravehicular Activity (EVA)',
      phase: 'Trans-Earth Coast (Return Trajectory)',
      date: 'December 17, 1972 (20:27 - 21:32 UTC)',
      duration: '1 hour, 05 minutes, 44 seconds',
      location: 'Deep Space (approx. 180,000 nautical miles from Earth)',
      workloadLevel: 'HIGH ALERT & METABOLIC PEAK',
      workloadColor: '#FFB020',
      description: 'While in deep space between the Moon and Earth, Evans depressurized the CSM cabin and climbed out through the side hatch. Hand-over-hand along handrails to the rear SIM bay, he retrieved the high-resolution film canisters from the Panoramic and Mapping cameras before the Service Module was discarded prior to atmospheric re-entry.',
      scientificContext: 'Safeguarded all scientific film rolls containing the orbital cartography of Apollo 17. Exposed a microbial ecology canister (MEED experiment) to direct cosmic radiation.',
      workloadContext: 'High adrenaline and peak alert state in open space vacuum. ECG telemetry monitored closely by Mission Control; stable sinus tachycardia (120-135 BPM) during external hand-over-hand transfers. Full suit pressurization integrity nominal.'
    }
  ]
};

export default function MissionActivities({
  astronautId = 'cernan',
  onNavigateToPhysiology
}) {
  const activities = ASTRONAUT_ACTIVITIES[astronautId] || ASTRONAUT_ACTIVITIES.cernan;
  const [selectedActivity, setSelectedActivity] = useState(activities[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-status badge-cyan">
            HISTORICAL MISSION ACTIVITIES
          </span>
          <DataAvailabilityBadge status="workload-context" label="WORKLOAD & OPERATIONAL ARCHIVE" />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          fontWeight: 800,
          color: '#FFFFFF',
          margin: 0
        }}>
          Mission Activities & Workload Context
        </h2>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          marginTop: '6px',
          maxWidth: '780px',
          lineHeight: 1.5
        }}>
          Every mission activity directly influenced astronaut physical workload, metabolic expenditure, cardiovascular response, and rest patterns.
        </p>
      </div>

      {/* Activities Grid / Selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {activities.map((act) => {
          const isSelected = selectedActivity.id === act.id;

          return (
            <div
              key={act.id}
              onClick={() => setSelectedActivity(act)}
              className="glass-card"
              style={{
                padding: '20px',
                borderRadius: '14px',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(18, 59, 103, 0.75) 0%, rgba(10, 26, 47, 0.95) 100%)' 
                  : 'rgba(7, 21, 34, 0.65)',
                border: isSelected 
                  ? '1px solid rgba(40, 184, 232, 0.75)' 
                  : '1px solid rgba(245, 249, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '0.70rem',
                  color: act.workloadColor,
                  fontFamily: 'var(--font-tech)',
                  fontWeight: 700,
                  letterSpacing: '0.04em'
                }}>
                  {act.workloadLevel}
                </span>
                <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
                  {act.duration}
                </span>
              </div>

              <h4 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: isSelected ? 'var(--cosmic-cyan)' : '#FFFFFF',
                margin: '0 0 6px 0'
              }}>
                {act.name}
              </h4>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.74rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-tech)',
                marginBottom: '10px'
              }}>
                <MapPin size={12} style={{ color: 'var(--cosmic-cyan)' }} />
                <span>{act.location}</span>
              </div>

              <p style={{
                fontSize: '0.80rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.45,
                margin: 0
              }}>
                {act.description.slice(0, 140)}...
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Activity Deep Dive Panel */}
      {selectedActivity && (
        <div 
          className="glass-card"
          style={{
            padding: '28px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(16, 42, 67, 0.6) 0%, rgba(7, 21, 34, 0.85) 100%)',
            border: '1px solid rgba(40, 184, 232, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge-status badge-cyan">
                  {selectedActivity.phase.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
                  {selectedActivity.date}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: 0
              }}>
                {selectedActivity.name}
              </h3>
            </div>

            <div style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'rgba(7, 21, 34, 0.75)',
              border: `1px solid ${selectedActivity.workloadColor}50`,
              color: selectedActivity.workloadColor,
              fontSize: '0.76rem',
              fontFamily: 'var(--font-tech)',
              fontWeight: 700
            }}>
              {selectedActivity.workloadLevel}
            </div>
          </div>

          {/* Description */}
          <div style={{
            padding: '16px 18px',
            background: 'rgba(7, 21, 34, 0.55)',
            borderRadius: '10px',
            border: '1px solid rgba(245, 249, 255, 0.08)'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', marginBottom: '4px' }}>
              OPERATIONAL MISSION DESCRIPTION
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--polar-white)', lineHeight: 1.6 }}>
              {selectedActivity.description}
            </p>
          </div>

          {/* Science & Workload 2-Column Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px'
          }}>
            <div style={{
              padding: '16px',
              background: 'rgba(18, 59, 103, 0.35)',
              borderRadius: '10px',
              border: '1px solid rgba(40, 184, 232, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Compass size={14} style={{ color: 'var(--cosmic-cyan)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>
                  SCIENTIFIC CONTEXT
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {selectedActivity.scientificContext}
              </p>
            </div>

            <div style={{
              padding: '16px',
              background: 'rgba(18, 59, 103, 0.35)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 176, 32, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Zap size={14} style={{ color: '#FFB020' }} />
                <span style={{ fontSize: '0.72rem', color: '#FFB020', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>
                  WORKLOAD & PHYSIOLOGICAL CONTEXT
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {selectedActivity.workloadContext}
              </p>
            </div>
          </div>

          {/* Connected Flow Guidance CTA to Physiology */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '12px',
            borderTop: '1px solid rgba(245, 249, 255, 0.08)'
          }}>
            <button
              onClick={onNavigateToPhysiology}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-tech)',
                fontWeight: 700
              }}
            >
              <span>CONNECT WORKLOAD TO PHYSIOLOGICAL DATA</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
