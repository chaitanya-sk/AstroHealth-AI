import React from 'react';
import { 
  User, 
  Award, 
  MapPin, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { DataAvailabilityBadge } from './DataAvailabilityState';

export const APOLLO17_CREW = [
  {
    id: 'cernan',
    name: 'Eugene A. Cernan',
    shortName: 'Gene Cernan',
    rank: 'Captain, USN',
    role: 'Commander',
    callSign: 'America CDR',
    photo: `${import.meta.env.BASE_URL}cernan-portrait.jpg`,
    specialty: 'Naval Aviator & Aeronautical Engineer',
    missionAssignment: 'Mission Commander & Lunar Surface Explorer. Commanded LM Challenger, led 3 lunar surface EVAs (22h 4m), traversed 35.7 km in Lunar Roving Vehicle.',
    keyStats: [
      { label: 'Surface EVAs', value: '3 (22h 04m)' },
      { label: 'Rover Distance', value: '35.7 km' },
      { label: 'Samples Collected', value: '110.5 kg' },
      { label: 'Telemetry Stream', value: 'Single-Lead ECG' }
    ],
    location: 'Lunar Surface (Taurus-Littrow Valley)'
  },
  {
    id: 'schmitt',
    name: 'Harrison H. Schmitt',
    shortName: 'Jack Schmitt',
    rank: 'Ph.D. Geologist (Civilian)',
    role: 'Lunar Module Pilot / Scientist-Astronaut',
    callSign: 'Challenger LMP',
    photo: `${import.meta.env.BASE_URL}schmitt-portrait.jpg?v=2`,
    avatarColor: '#28B8E8',
    specialty: 'Geologist, Harvard Ph.D., First Scientist in Deep Space',
    missionAssignment: 'Scientist-Astronaut & Field Geologist. First professional scientist on the Moon. Discovered pyroclastic orange volcanic glass at Shorty Crater, mapped complex graben geology.',
    keyStats: [
      { label: 'Surface EVAs', value: '3 (22h 04m)' },
      { label: 'Major Discovery', value: 'Orange Soil (Volcanic)' },
      { label: 'Heat Flow Probe', value: 'Deployed (2.3m deep)' },
      { label: 'Documented Hazard', value: 'Regolith Irritation' }
    ],
    location: 'Lunar Surface (Taurus-Littrow Valley)'
  },
  {
    id: 'evans',
    name: 'Ronald E. Evans',
    shortName: 'Ron Evans',
    rank: 'Captain, USN',
    role: 'Command Module Pilot',
    callSign: 'America CMP',
    photo: `${import.meta.env.BASE_URL}evans-portrait.jpg`,
    avatarColor: '#123B67',
    specialty: 'Naval Aviator & Combat Pilot',
    missionAssignment: 'Command Module Pilot. Orbited the Moon solo in CSM America during surface expedition. Executed 1h 05m deep space EVA during trans-Earth coast to retrieve SIM bay film cassettes.',
    keyStats: [
      { label: 'Solo Lunar Orbit', value: '147h 43m' },
      { label: 'Deep Space EVA', value: '1h 05m (Trans-Earth)' },
      { label: 'Mapping Cameras', value: 'Metric & Panoramic' },
      { label: 'Orbital Telemetry', value: 'CSM Bio-Package' }
    ],
    location: 'Lunar Orbit (CSM America) • Deep Space'
  }
];

export default function CrewSelection({ onSelectAstronaut, selectedId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Section Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-status badge-cyan">
            HISTORICAL CREW ROSTER
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
            SELECT AN ASTRONAUT TO CONTINUE CONNECTED MISSION JOURNEY
          </span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '0.03em',
          margin: 0
        }}>
          Apollo 17 Flight Crew
        </h2>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          marginTop: '6px',
          maxWidth: '750px',
          lineHeight: 1.5
        }}>
          Selecting an astronaut loads their individual mission responsibilities, specific EVA or orbital activities, verified 1972 physiological records, scientific tasks, and health workload context.
        </p>
      </div>

      {/* 3 Astronaut Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {APOLLO17_CREW.map((astronaut) => {
          const isSelected = selectedId === astronaut.id;

          return (
            <div
              key={astronaut.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                borderRadius: '16px',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(18, 59, 103, 0.7) 0%, rgba(10, 26, 47, 0.9) 100%)' 
                  : 'linear-gradient(135deg, rgba(16, 42, 67, 0.45) 0%, rgba(7, 21, 34, 0.75) 100%)',
                border: isSelected 
                  ? '1px solid rgba(40, 184, 232, 0.75)' 
                  : '1px solid rgba(245, 249, 255, 0.12)',
                boxShadow: isSelected 
                  ? '0 12px 35px rgba(40, 184, 232, 0.25)' 
                  : '0 8px 24px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Active Selection Glow Accent */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent 0%, #28B8E8 50%, transparent 100%)',
                  boxShadow: '0 0 10px #28B8E8'
                }} />
              )}

              {/* Card Top: Avatar / Photo + Identity */}
              <div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  {/* Photo or Portrait */}
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: isSelected ? '2px solid #28B8E8' : '1px solid rgba(245, 249, 255, 0.2)',
                    background: '#071522',
                    flexShrink: 0,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {astronaut.photo ? (
                      <img 
                        src={astronaut.photo} 
                        alt={astronaut.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                      />
                    ) : (
                      <User size={36} style={{ color: 'var(--cosmic-cyan)' }} />
                    )}
                  </div>

                  <div>
                    <span style={{
                      fontSize: '0.70rem',
                      fontFamily: 'var(--font-tech)',
                      color: 'var(--cosmic-cyan)',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}>
                      {astronaut.role}
                    </span>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      margin: '2px 0 2px 0'
                    }}>
                      {astronaut.name}
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
                      {astronaut.rank} • {astronaut.callSign}
                    </div>
                  </div>
                </div>

                {/* Location Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'rgba(7, 21, 34, 0.65)',
                  border: '1px solid rgba(40, 184, 232, 0.2)',
                  fontSize: '0.74rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-tech)',
                  marginBottom: '14px'
                }}>
                  <MapPin size={12} style={{ color: 'var(--cosmic-cyan)' }} />
                  <span>{astronaut.location}</span>
                </div>

                {/* Mission Assignment Bio */}
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  margin: '0 0 16px 0'
                }}>
                  {astronaut.missionAssignment}
                </p>

                {/* Key Mission Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginBottom: '20px',
                  background: 'rgba(7, 21, 34, 0.45)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(245, 249, 255, 0.06)'
                }}>
                  {astronaut.keyStats.map(stat => (
                    <div key={stat.label}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 600 }}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Button */}
              <button
                onClick={() => onSelectAstronaut(astronaut.id)}
                className={isSelected ? 'btn-primary' : 'btn-secondary'}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-tech)',
                  fontWeight: 700,
                  letterSpacing: '0.04em'
                }}
              >
                <span>{isSelected ? 'VIEWING PROFILE' : 'EXPLORE PROFILE'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
