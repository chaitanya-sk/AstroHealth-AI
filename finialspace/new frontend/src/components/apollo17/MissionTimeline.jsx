import React, { useState } from 'react';
import { 
  Clock, 
  Rocket, 
  MapPin, 
  Users, 
  Activity, 
  Heart, 
  Compass, 
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { DataAvailabilityBadge } from './DataAvailabilityState';

const TIMELINE_EVENTS = [
  {
    id: 'launch',
    phase: 'LAUNCH PHASE',
    title: 'Saturn V Night Launch from KSC Pad 39A',
    date: 'December 7, 1972 • 05:33:00 UTC (00:33 EST)',
    missionElapsedTime: 'GET 000:00:00',
    location: 'Kennedy Space Center, Florida, Earth',
    astronauts: ['Eugene A. Cernan', 'Harrison H. Schmitt', 'Ronald E. Evans'],
    activitySummary: 'First and only night launch of a Saturn V rocket (SA-512). The 7.5-million-pound-thrust S-IC booster illuminated the Florida coast for hundreds of miles, placing Apollo 17 into Earth parking orbit at 90 nautical miles altitude.',
    scientificActivity: 'Vehicle staging dynamics and payload validation. S-IVB third stage restart confirmed for Trans-Lunar Injection (TLI).',
    workloadContext: 'High acceleration G-forces (peaking at +4.0 G during S-IC burn and +3.5 G during S-II). Crew strapped into command couches under high acoustic vibration.',
    physiologicalRecord: 'Heart rates monitored on single-lead sternal ECG: Commander Cernan peaked at 134 BPM, LMP Schmitt at 128 BPM, CMP Evans at 124 BPM at liftoff, declining to 80-90 BPM in orbit.',
    healthDataAvailable: true
  },
  {
    id: 'tli',
    phase: 'TRANS-LUNAR COAST',
    title: 'Trans-Lunar Injection & Famous "Blue Marble" Photograph',
    date: 'December 7 - 10, 1972',
    missionElapsedTime: 'GET 003:12:00 to 086:14:00',
    location: 'Cislunar Space (Earth to Moon Trajectory)',
    astronauts: ['Eugene A. Cernan', 'Harrison H. Schmitt', 'Ronald E. Evans'],
    activitySummary: 'S-IVB stage fired to accelerate spacecraft to 24,200 mph toward the Moon. Transposition, docking, and extraction of LM Challenger from the Saturn booster. Crew took the iconic AS17-148-22727 photograph ("The Blue Marble") showing the fully illuminated Earth disk.',
    scientificActivity: 'En-route cislunar solar wind observations and passive thermal control ("barbecue roll" at 3 revolutions per hour).',
    workloadContext: 'Low physical workload; moderate procedural demand during CSM-LM docking maneuvers and midcourse correction burns.',
    physiologicalRecord: 'Space motion adaptation: Crew experienced mild cephalic fluid shifts and fullness of the head as body fluids relocated toward upper torso in microgravity. No severe space adaptation sickness reported.',
    healthDataAvailable: true
  },
  {
    id: 'loi',
    phase: 'LUNAR ORBIT INSERTION',
    title: 'Service Propulsion System Burn into Lunar Orbit',
    date: 'December 10, 1972 • 19:47:23 UTC',
    missionElapsedTime: 'GET 086:14:23',
    location: 'Lunar Farside Insertion Orbit (170 x 53 nautical miles)',
    astronauts: ['Eugene A. Cernan', 'Harrison H. Schmitt', 'Ronald E. Evans'],
    activitySummary: 'The Service Propulsion System (SPS) rocket engine fired behind the Moon for 398 seconds, decelerating America and Challenger into lunar orbit.',
    scientificActivity: 'Initiation of SIM bay radar sounder and mapping cameras over lunar farside.',
    workloadContext: 'Critical burn conducted with zero radio communication with Earth (loss of signal behind the Moon). High cognitive tension.',
    physiologicalRecord: 'Transient sinus tachycardia: Heart rates averaged 105-118 BPM during the 6.5-minute burn, returning to normal sinus baseline once acquisition of signal (AOS) confirmed nominal orbit.',
    healthDataAvailable: true
  },
  {
    id: 'landing',
    phase: 'LUNAR DESCENT & LANDING',
    title: 'Touchdown of LM Challenger at Taurus-Littrow',
    date: 'December 11, 1972 • 19:54:57 UTC',
    missionElapsedTime: 'GET 110:21:57',
    location: 'Taurus-Littrow Valley floor (20.19° N, 30.77° E)',
    astronauts: ['Eugene A. Cernan (Commander)', 'Harrison H. Schmitt (LMP)'],
    activitySummary: 'Cernan and Schmitt undocked from CSM America and piloted Challenger through Powered Descent Initiation (PDI). Cernan manually maneuvered around craters and boulders to execute a gentle touchdown with 117 seconds of descent fuel remaining.',
    scientificActivity: 'First visual inspection of the Taurus-Littrow graben valley floor, flanked by 2,000-meter mountain massifs.',
    workloadContext: 'Extreme mental concentration and manual hand-controller inputs under 1/6th gravity descent dynamics.',
    physiologicalRecord: 'Commander Cernan heart rate peaked at 130 BPM during final vertical descent throttle down; Schmitt maintained 115 BPM while calling radar altitude and descent rates.',
    healthDataAvailable: true
  },
  {
    id: 'eva1',
    phase: 'LUNAR SURFACE EVA 1',
    title: 'EVA-1: LRV Deployment, ALSEP Setup & Deep Core Drilling',
    date: 'December 11-12, 1972 • Duration: 7h 11m 53s',
    missionElapsedTime: 'GET 114:43:00 to 121:54:53',
    location: 'Taurus-Littrow Valley Floor • 100m West of LM',
    astronauts: ['Eugene A. Cernan', 'Harrison H. Schmitt'],
    activitySummary: 'Offloaded the Lunar Roving Vehicle (LRV-3) from the LM descent stage. Deployed the ALSEP package. Emplaced the deep heat flow probes and lunar neutron probe.',
    scientificActivity: 'Drilled 2.3-meter holes into hard basalt regolith; initiated surface gravimeter and cosmic ray detectors.',
    workloadContext: 'Heavy physical exertion. Rotary percussive drilling required full bodyweight downforce against suit joint stiffness.',
    physiologicalRecord: 'Peak metabolic heat production recorded: Cernan reached 1,650 BTU/hr (~484 W) during drill extraction; Schmitt reached 1,480 BTU/hr. Heart rates sustained between 110-150 BPM. No cardiac arrhythmias.',
    healthDataAvailable: true
  },
  {
    id: 'eva2',
    phase: 'LUNAR SURFACE EVA 2',
    title: 'EVA-2: South Massif Rover Traverse & Discovery of Orange Soil',
    date: 'December 12-13, 1972 • Duration: 7h 36m 56s',
    missionElapsedTime: 'GET 138:37:00 to 146:13:56',
    location: 'South Massif base, Nansen Crater, Shorty Crater (Traverse: 20.4 km)',
    astronauts: ['Eugene A. Cernan', 'Harrison H. Schmitt'],
    activitySummary: 'Drove LRV-3 on record 20.4 km traverse to South Massif. At Station 4 (Shorty Crater rim), Schmitt discovered the iconic bright orange pyroclastic volcanic soil.',
    scientificActivity: 'Retrieved core tubes 74001/74002 and ancient highland crustal troctolite rocks (4.2 billion years old). Proved ancient lunar volcanism.',
    workloadContext: 'Bouncing rough ride across craters and steep scree slopes. Post-EVA: Schmitt experienced acute upper airway mucous membrane irritation ("lunar hay fever") from clinging dust upon helmet removal in cabin.',
    physiologicalRecord: 'Metabolic rates averaged 1,050 BTU/hr (Cernan) and 1,120 BTU/hr (Schmitt). Upper respiratory congestion and paroxysmal sneezing logged by flight surgeons.',
    healthDataAvailable: true
  },
  {
    id: 'eva3',
    phase: 'LUNAR SURFACE EVA 3',
    title: 'EVA-3: North Massif, Sculptured Hills & Final Moonwalk',
    date: 'December 13-14, 1972 • Duration: 7h 15m 08s',
    missionElapsedTime: 'GET 162:26:00 to 169:41:08',
    location: 'North Massif (Station 6/7) & Sculptured Hills (Station 8)',
    astronauts: ['Eugene A. Cernan', 'Harrison H. Schmitt'],
    activitySummary: 'Sampled gigantic split boulders along North Massif. Parked LRV-3 at VIP site for television transmission of lunar liftoff. Cernan delivered the final departure remarks, dedicating the mission to the youth of the world.',
    scientificActivity: 'Collected final impact melt specimens, completing 110.5 kg total harvest. Deployed explosive seismic charges for ALSEP geophones.',
    workloadContext: 'Cumulative 3-day fatigue. Finger and wrist soreness from pressurized glove resistance.',
    physiologicalRecord: 'Metabolic expenditure remained stable at 980-1,100 BTU/hr. ECG telemetry confirmed continued normal sinus rhythm throughout the 7.25-hour excursion.',
    healthDataAvailable: true
  },
  {
    id: 'ascent',
    phase: 'LUNAR LIFTOFF & DOCKING',
    title: 'Liftoff from Taurus-Littrow & Rendezvous with America',
    date: 'December 14, 1972 • 22:54:37 UTC',
    missionElapsedTime: 'GET 185:21:37',
    location: 'Taurus-Littrow Valley to Lunar Orbit Rendezvous',
    astronauts: ['Eugene A. Cernan', 'Harrison H. Schmitt', 'Ronald E. Evans'],
    activitySummary: 'Challenger ascent engine fired, lifting the upper cabin stage off the descent stage. Rendezvous and hard docking with CSM America 2 hours later. Transferred 110.5 kg of lunar samples into CSM.',
    scientificActivity: 'Jettisoned Challenger ascent stage, which was commanded to impact the Moon on December 15 to calibrate the ALSEP seismic network.',
    workloadContext: 'High operational focus during close-proximity orbital docking maneuvers.',
    physiologicalRecord: 'Heart rates at liftoff: Cernan 122 BPM, Schmitt 112 BPM. Recovery sleep that night inside CSM America averaged 7.1 hours.',
    healthDataAvailable: true
  },
  {
    id: 'deep_space_eva',
    phase: 'TRANS-EARTH COAST',
    title: 'Trans-Earth Deep Space EVA by Ronald E. Evans',
    date: 'December 17, 1972 • 20:27:40 - 21:33:24 UTC (1h 05m 44s)',
    missionElapsedTime: 'GET 254:54:40 to 256:00:24',
    location: 'Deep Space (180,000 nautical miles from Earth)',
    astronauts: ['Ronald E. Evans (CMP)', 'Eugene A. Cernan (Stand-up Hatch Commander)'],
    activitySummary: 'Depressurized the CSM cabin in open space between Moon and Earth. Evans exited the hatch on a 40-foot tether, translating along handrails to the SIM bay to retrieve the film cassettes from the Panoramic and Mapping cameras.',
    scientificActivity: 'Retrieved vital rolls of lunar mapping film before Service Module was jettisoned before atmospheric re-entry. Retrieved MEED microbial experiment canister.',
    workloadContext: 'High-adrenaline spacewalk suspended in deep space between Earth and Moon.',
    physiologicalRecord: 'Continuous ECG: Evans heart rate reached 135 BPM during external hatch egress and SIM bay film extraction, returning to 82 BPM after cabin repressurization.',
    healthDataAvailable: true
  },
  {
    id: 'splashdown',
    phase: 'RE-ENTRY & SPLASHDOWN',
    title: 'Pacific Ocean Splashdown & Recovery by USS Ticonderoga',
    date: 'December 19, 1972 • 19:24:59 UTC',
    missionElapsedTime: 'GET 301:51:59 (Total Duration: 12d 13h 52m)',
    location: 'South Pacific Ocean (17° 53\' S, 166° 7\' W)',
    astronauts: ['Eugene A. Cernan', 'Harrison H. Schmitt', 'Ronald E. Evans'],
    activitySummary: 'Command Module America separated from Service Module, entered Earth atmosphere at 24,600 mph, deployed drogue and main parachutes, and splashed down within 2.1 nautical miles of the recovery ship USS Ticonderoga.',
    scientificActivity: 'All 110.5 kg of lunar samples and mapping film rolls safely recovered and flown to Lunar Receiving Laboratory in Houston.',
    workloadContext: 'Re-entry deceleration forces reached +6.5 G. Orthostatic intolerance and readaptation to Earth gravity upon standing.',
    physiologicalRecord: 'Flight surgeons on USS Ticonderoga conducted clinical exams: All three crew in excellent physical condition. Minor orthostatic tachycardia on standing, resolving within 48 hours. Mild vestibular disorientation ("heavy head" sensation).',
    healthDataAvailable: true
  }
];

export default function MissionTimeline({ onNavigateToInsights }) {
  const [selectedEvent, setSelectedEvent] = useState(TIMELINE_EVENTS[4]); // Default to EVA 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-status badge-cyan">
            CHRONOLOGICAL MISSION INTELLIGENCE
          </span>
          <DataAvailabilityBadge status="available" label="NASA FLIGHT TRANSCRIPT ARCHIVE" />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          fontWeight: 800,
          color: '#FFFFFF',
          margin: 0
        }}>
          Apollo 17 Mission Timeline to Health Context
        </h2>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          marginTop: '6px',
          maxWidth: '780px',
          lineHeight: 1.5
        }}>
          Click any milestone below to inspect participating astronauts, operational duties, scientific findings, and verified physiological records from December 1972.
        </p>
      </div>

      {/* Connected Relationship Banner */}
      <div 
        className="glass-card"
        style={{
          padding: '14px 18px',
          borderRadius: '10px',
          background: 'rgba(7, 21, 34, 0.75)',
          border: '1px solid rgba(40, 184, 232, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          gap: '10px'
        }}
      >
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', fontWeight: 700, flexShrink: 0 }}>
          DATA RELATIONSHIP:
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 600 }}>MISSION EVENT</span>
          <ChevronRight size={13} style={{ color: 'var(--cosmic-cyan)' }} />
          <span style={{ fontSize: '0.76rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 600 }}>ASTRONAUT PARTICIPATION</span>
          <ChevronRight size={13} style={{ color: 'var(--cosmic-cyan)' }} />
          <span style={{ fontSize: '0.76rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 600 }}>ACTIVITY</span>
          <ChevronRight size={13} style={{ color: 'var(--cosmic-cyan)' }} />
          <span style={{ fontSize: '0.76rem', color: '#FFB020', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>WORKLOAD</span>
          <ChevronRight size={13} style={{ color: 'var(--cosmic-cyan)' }} />
          <span style={{ fontSize: '0.76rem', color: 'var(--status-healthy)', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>AVAILABLE HEALTH DATA</span>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Vertical Timeline + Detailed Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Interactive Milestone Nodes */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '620px',
          overflowY: 'auto',
          paddingRight: '6px'
        }}>
          {TIMELINE_EVENTS.map((evt, idx) => {
            const isSelected = selectedEvent.id === evt.id;

            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="glass-card"
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(18, 59, 103, 0.8) 0%, rgba(10, 26, 47, 0.95) 100%)' 
                    : 'rgba(7, 21, 34, 0.65)',
                  border: isSelected 
                    ? '1px solid rgba(40, 184, 232, 0.75)' 
                    : '1px solid rgba(245, 249, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                {/* Index Pill */}
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isSelected ? 'var(--cosmic-cyan)' : 'rgba(40, 184, 232, 0.15)',
                  color: isSelected ? '#071522' : 'var(--cosmic-cyan)',
                  fontFamily: 'var(--font-tech)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {idx + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>
                      {evt.phase}
                    </span>
                    <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                      {evt.missionElapsedTime}
                    </span>
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.90rem',
                    fontWeight: 700,
                    color: isSelected ? '#FFFFFF' : 'var(--polar-white)',
                    marginTop: '2px'
                  }}>
                    {evt.title}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {evt.date.split('•')[0]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Selected Event Card */}
        {selectedEvent && (
          <div 
            className="glass-card"
            style={{
              padding: '24px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(16, 42, 67, 0.65) 0%, rgba(7, 21, 34, 0.9) 100%)',
              border: '1px solid rgba(40, 184, 232, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'sticky',
              top: '150px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge-status badge-cyan">
                  {selectedEvent.phase}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
                  {selectedEvent.missionElapsedTime}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: '2px 0 4px 0'
              }}>
                {selectedEvent.title}
              </h3>
              <div style={{ fontSize: '0.76rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)' }}>
                {selectedEvent.date}
              </div>
            </div>

            {/* Location & Astronauts */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
              padding: '12px 14px',
              background: 'rgba(7, 21, 34, 0.6)',
              borderRadius: '10px',
              border: '1px solid rgba(245, 249, 255, 0.08)'
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  MISSION LOCATION
                </div>
                <div style={{ fontSize: '0.80rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 600 }}>
                  {selectedEvent.location}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                  PARTICIPATING CREW
                </div>
                <div style={{ fontSize: '0.80rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 600 }}>
                  {selectedEvent.astronauts.join(' • ')}
                </div>
              </div>
            </div>

            {/* Operational Activities */}
            <div style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(7, 21, 34, 0.55)',
              border: '1px solid rgba(40, 184, 232, 0.2)'
            }}>
              <div style={{ fontSize: '0.70rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                OPERATIONAL ACTIVITIES PERFORMED
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--polar-white)', lineHeight: 1.55 }}>
                {selectedEvent.activitySummary}
              </p>
            </div>

            {/* Scientific Activities */}
            <div style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(18, 59, 103, 0.25)',
              border: '1px solid rgba(40, 184, 232, 0.2)'
            }}>
              <div style={{ fontSize: '0.70rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                SCIENTIFIC EXPLORATION CONTEXT
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {selectedEvent.scientificActivity}
              </p>
            </div>

            {/* Workload Context */}
            <div style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(18, 59, 103, 0.25)',
              border: '1px solid rgba(255, 176, 32, 0.25)'
            }}>
              <div style={{ fontSize: '0.70rem', color: '#FFB020', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                PHYSICAL & MISSION WORKLOAD CONTEXT
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {selectedEvent.workloadContext}
              </p>
            </div>

            {/* Physiological Record */}
            <div style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(57, 217, 138, 0.08)',
              border: '1px solid rgba(57, 217, 138, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.70rem', color: 'var(--status-healthy)', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>
                  RELATED AVAILABLE HISTORICAL PHYSIOLOGICAL RECORD
                </span>
                <DataAvailabilityBadge status="available" label="VERIFIED" />
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--polar-white)', lineHeight: 1.55 }}>
                {selectedEvent.physiologicalRecord}
              </p>
            </div>

            {/* CTA to Insights */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingTop: '8px'
            }}>
              <button
                onClick={onNavigateToInsights}
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
                <span>SYNTHESIZE ALL MISSION & HEALTH INSIGHTS</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
