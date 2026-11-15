import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Flame, 
  Layers, 
  Activity, 
  ChevronRight, 
  ArrowRight,
  Database,
  Sparkles,
  Info
} from 'lucide-react';
import { DataAvailabilityBadge } from './DataAvailabilityState';

const SCIENCE_STATIONS = [
  {
    id: 'alsep',
    name: 'ALSEP Scientific Deployment Site',
    location: '100m West of LM Challenger',
    investigator: 'Eugene Cernan & Harrison Schmitt',
    scienceObjective: 'Long-term geophysical package deployment to monitor Moonquakes, internal heat flow, and atmospheric composition.',
    geologicalTask: 'Emplaced Heat Flow probes 2.3m into regolith using rotary drill; deployed Lunar Surface Gravimeter and Cosmic Ray detector.',
    physicalWorkload: 'Peak metabolic expenditure (1,650 BTU/hr). Required sustained downward bodyweight force on drill stem into dense basalt.',
    scientificResult: 'Continuous radio telemetry operated until NASA shut down the station on September 30, 1977. Proved Moon is thermally stratified.'
  },
  {
    id: 'shorty',
    name: 'Station 4: Shorty Crater & Orange Soil Discovery',
    location: 'Shorty Crater (110m impact crater, 3.5 km West)',
    investigator: 'Harrison Schmitt (Supported by Cernan)',
    scienceObjective: 'Search for recent lunar volcanism along graben fractures bordering Taurus-Littrow valley.',
    geologicalTask: 'Trenched dark rim mantle to reveal bright orange pyroclastic soil layer. Drove 70-cm core tubes 74001/74002.',
    physicalWorkload: 'Kneeling and core tube hammering against 3.75 psi spacesuit glove resistance. Metabolic rate ~1,380 BTU/hr. Heart rate 142 BPM.',
    scientificResult: 'Orange soil proved to be titanium-rich volcanic glass droplets formed in ancient explosive fire-fountains 3.64 billion years ago.'
  },
  {
    id: 'nansen',
    name: 'Station 2: Nansen Crater at South Massif Base',
    location: 'South Massif avalanche debris (9.1 km from LM)',
    investigator: 'Eugene Cernan & Harrison Schmitt',
    scienceObjective: 'Sample ancient pre-Serenitatis lunar highland crust brought down by massive debris slide.',
    geologicalTask: 'Sampled boulders using gnomon orientation, tongs, and hammer along steep 20° scree slopes at foot of 2,300m mountain wall.',
    physicalWorkload: 'Sustained uphill climbing in 1/6th gravity with bulky EMU backpack. Substantial quadriceps fatigue and elevated heart rates.',
    scientificResult: 'Collected sample 72155 (troctolite), crystallized over 4.2 billion years ago, representing the oldest deep crustal rock of the mission.'
  },
  {
    id: 'north_massif',
    name: 'Station 6 & 7: North Massif Split Boulders',
    location: 'Base of North Massif (Station 6, 7 & Sculptured Hills)',
    investigator: 'Eugene Cernan & Harrison Schmitt',
    scienceObjective: 'Examine gigantic fractured boulders rolled down from upper mountain crest.',
    geologicalTask: 'Photographed boulder tracks down the slope; chipped blue-gray impact melt breccia from 15-meter split boulder.',
    physicalWorkload: 'Heavy hammer swinging against solid crystalline rock. Glove palm abrasion and forearm cramping documented in logs.',
    scientificResult: 'Established precise timing of the giant Serenitatis impact basin basin-forming event (~3.87 billion years ago).'
  },
  {
    id: 'orbital_sim',
    name: 'CSM America: Orbital Remote Sensing & Deep Space EVA',
    location: '60 nm Lunar Orbit & 180,000 nm Trans-Earth Trajectory',
    investigator: 'Ronald E. Evans',
    scienceObjective: 'Stereoscopic global cartography and cosmic ray microbial exposure assessment.',
    geologicalTask: 'Operated 24-inch Panoramic and 3-inch Metric Mapping Cameras. Conducted 1h 05m deep space spacewalk to retrieve film cassettes.',
    physicalWorkload: 'Strict timing and camera rotation control in orbit; high-alert spacewalk translation outside spacecraft in deep space.',
    scientificResult: 'Produced complete stereoscopic cartographic atlas covering over 1.2 million km² of lunar terrain.'
  }
];

export default function ScienceActivityFlow({ onNavigateToTimeline }) {
  const [selectedStation, setSelectedStation] = useState(SCIENCE_STATIONS[1]); // Default Shorty Crater

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-status badge-cyan">
            HISTORICAL SCIENTIFIC EXPEDITION
          </span>
          <DataAvailabilityBadge status="available" label="NASA LUNAR SAMPLE COMPENDIUM" />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          fontWeight: 800,
          color: '#FFFFFF',
          margin: 0
        }}>
          Science & Geological Operations
        </h2>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          marginTop: '6px',
          maxWidth: '780px',
          lineHeight: 1.5
        }}>
          Apollo 17 returned 110.5 kg (243.6 lb) of lunar rock and soil — more than any other Apollo mission. 
          Scientific tasks are shown below connected directly to the astronaut, mission location, geology, and physical workload context.
        </p>
      </div>

      {/* Connected Flow Diagram Banner */}
      <div 
        className="glass-card"
        style={{
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'rgba(7, 21, 34, 0.75)',
          border: '1px solid rgba(40, 184, 232, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          gap: '12px'
        }}
      >
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', fontWeight: 700, flexShrink: 0 }}>
          INTELLIGENCE FLOW:
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 600 }}>ASTRONAUT</span>
          <ChevronRight size={13} style={{ color: 'var(--cosmic-cyan)' }} />
          <span style={{ fontSize: '0.76rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 600 }}>LOCATION</span>
          <ChevronRight size={13} style={{ color: 'var(--cosmic-cyan)' }} />
          <span style={{ fontSize: '0.76rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 600 }}>SCIENCE TASK</span>
          <ChevronRight size={13} style={{ color: 'var(--cosmic-cyan)' }} />
          <span style={{ fontSize: '0.76rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>GEOLOGICAL FINDING</span>
          <ChevronRight size={13} style={{ color: 'var(--cosmic-cyan)' }} />
          <span style={{ fontSize: '0.76rem', color: '#FFB020', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>WORKLOAD IMPACT</span>
        </div>
      </div>

      {/* Stations Horizontal Bar / Selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {SCIENCE_STATIONS.map((station) => {
          const isSelected = selectedStation.id === station.id;

          return (
            <div
              key={station.id}
              onClick={() => setSelectedStation(station)}
              className="glass-card"
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(18, 59, 103, 0.75) 0%, rgba(10, 26, 47, 0.95) 100%)' 
                  : 'rgba(7, 21, 34, 0.65)',
                border: isSelected 
                  ? '1px solid rgba(40, 184, 232, 0.75)' 
                  : '1px solid rgba(245, 249, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '0.70rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                {station.location.split('(')[0]}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>
                {station.name.split(':')[0]}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {station.investigator}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Station Deep Dive */}
      {selectedStation && (
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-status badge-cyan">
                SCIENTIFIC GEOLOGICAL SITE
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
                INVESTIGATORS: {selectedStation.investigator.toUpperCase()}
              </span>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '2px 0 4px 0'
            }}>
              {selectedStation.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)' }}>
              <MapPin size={13} />
              <span>{selectedStation.location}</span>
            </div>
          </div>

          {/* 4 Connected Context Panels */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px'
          }}>
            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'rgba(7, 21, 34, 0.6)',
              border: '1px solid rgba(40, 184, 232, 0.2)'
            }}>
              <div style={{ fontSize: '0.70rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                PRIMARY SCIENTIFIC OBJECTIVE
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--polar-white)', lineHeight: 1.55 }}>
                {selectedStation.scienceObjective}
              </p>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'rgba(7, 21, 34, 0.6)',
              border: '1px solid rgba(40, 184, 232, 0.2)'
            }}>
              <div style={{ fontSize: '0.70rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                FIELD GEOLOGY & SAMPLE COLLECTION
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--polar-white)', lineHeight: 1.55 }}>
                {selectedStation.geologicalTask}
              </p>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'rgba(18, 59, 103, 0.35)',
              border: '1px solid rgba(255, 176, 32, 0.3)'
            }}>
              <div style={{ fontSize: '0.70rem', color: '#FFB020', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                PHYSICAL WORKLOAD CONTEXT & METABOLIC LOAD
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {selectedStation.physicalWorkload}
              </p>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'rgba(18, 59, 103, 0.35)',
              border: '1px solid rgba(57, 217, 138, 0.3)'
            }}>
              <div style={{ fontSize: '0.70rem', color: 'var(--status-healthy)', fontFamily: 'var(--font-tech)', fontWeight: 700, marginBottom: '4px' }}>
                MAJOR SCIENTIFIC DISCOVERY / RESULT
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {selectedStation.scientificResult}
              </p>
            </div>
          </div>

          {/* CTA to Timeline */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '12px',
            borderTop: '1px solid rgba(245, 249, 255, 0.08)'
          }}>
            <button
              onClick={onNavigateToTimeline}
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
              <span>EXPLORE CHRONOLOGICAL MISSION TIMELINE</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
