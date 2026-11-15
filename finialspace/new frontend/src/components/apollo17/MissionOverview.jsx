import React from 'react';
import { 
  Rocket, 
  MapPin, 
  Calendar, 
  Users, 
  Compass, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  Database,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { HistoricalDataNotice } from './DataAvailabilityState';

export default function MissionOverview({ onExploreCrew }) {
  const missionPhases = [
    { title: 'LAUNCH', date: 'Dec 7, 1972', detail: 'Saturn V (SA-512) Night Launch', status: 'COMPLETED' },
    { title: 'LUNAR LANDING', date: 'Dec 11, 1972', detail: 'LM Challenger at Taurus-Littrow', status: 'COMPLETED' },
    { title: 'SURFACE EVAS', date: 'Dec 11-14, 1972', detail: '3 EVAs • 22h 4m • 35.7 km Rover', status: 'COMPLETED' },
    { title: 'LUNAR ASCENT', date: 'Dec 14, 1972', detail: 'Liftoff & Rendezvous with America', status: 'COMPLETED' },
    { title: 'SPLASHDOWN', date: 'Dec 19, 1972', detail: 'Pacific Recovery (USS Ticonderoga)', status: 'COMPLETED' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Historical Verification Notice */}
      <HistoricalDataNotice />

      {/* Hero Mission Intelligence Panel */}
      <div 
        className="glass-card"
        style={{
          position: 'relative',
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(16, 42, 67, 0.75) 0%, rgba(7, 21, 34, 0.92) 100%)',
          border: '1px solid rgba(40, 184, 232, 0.3)',
          borderRadius: '20px',
          overflow: 'hidden'
        }}
      >
        {/* Subtle Atmospheric Depth Glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(40, 184, 232, 0.16) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Badge & Mission State */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge-status badge-cyan">
                NASA APOLLO PROGRAM • AS-512
              </span>
              <span style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-tech)',
                color: 'var(--status-healthy)',
                background: 'rgba(57, 217, 138, 0.12)',
                border: '1px solid rgba(57, 217, 138, 0.35)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 600
              }}>
                MISSION STATUS: COMPLETED
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-tech)'
            }}>
              <Database size={13} style={{ color: 'var(--cosmic-cyan)' }} />
              <span>NASA HISTORICAL FLIGHT ARCHIVE (1972)</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              margin: '0 0 8px 0',
              lineHeight: 1.1
            }}>
              APOLLO 17
            </h1>
            <div style={{
              fontSize: '1.05rem',
              color: 'var(--cosmic-cyan)',
              fontFamily: 'var(--font-tech)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              marginBottom: '10px'
            }}>
              HISTORICAL MISSION INTELLIGENCE ARCHIVE
            </div>
            <p style={{
              fontSize: '0.94rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '860px',
              margin: 0
            }}>
              Explore the mission, crew activities, scientific operations, and available health-related historical context through one connected mission experience. 
              Apollo 17 was the final and most scientifically intensive lunar landing of the Apollo Program, featuring the first scientist-astronaut, three record-setting EVAs, and comprehensive physiological telemetry.
            </p>
          </div>

          {/* Primary Quick Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            paddingTop: '8px'
          }}>
            <div className="glass-panel" style={{ padding: '16px 18px', background: 'rgba(7, 21, 34, 0.6)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
                MISSION TYPE
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFF', fontWeight: 800, marginTop: '4px' }}>
                Lunar Landing
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', marginTop: '2px' }}>
                J-Series Science Mission
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px 18px', background: 'rgba(7, 21, 34, 0.6)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
                LANDING SITE
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFF', fontWeight: 800, marginTop: '4px' }}>
                Taurus-Littrow
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)', marginTop: '2px' }}>
                20.19° N, 30.77° E (Moon)
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px 18px', background: 'rgba(7, 21, 34, 0.6)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
                MISSION DURATION
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--status-healthy)', fontWeight: 800, marginTop: '4px' }}>
                12d 13h 52m
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)', marginTop: '2px' }}>
                Surface Stay: 74h 59m
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px 18px', background: 'rgba(7, 21, 34, 0.6)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
                TOTAL EVA TIME
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--cosmic-cyan)', fontWeight: 800, marginTop: '4px' }}>
                22h 04m
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)', marginTop: '2px' }}>
                3 Surface + 1 Deep Space EVA
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px 18px', background: 'rgba(7, 21, 34, 0.6)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
                SAMPLES RETURNED
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFF', fontWeight: 800, marginTop: '4px' }}>
                110.5 kg
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)', marginTop: '2px' }}>
                243.6 lb Lunar Regolith & Rock
              </div>
            </div>
          </div>

          {/* Connected Mission Journey Visualization */}
          <div style={{
            background: 'rgba(7, 21, 34, 0.75)',
            border: '1px solid rgba(40, 184, 232, 0.2)',
            borderRadius: '14px',
            padding: '20px 24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '0.78rem',
                fontFamily: 'var(--font-tech)',
                fontWeight: 700,
                color: 'var(--polar-white)',
                letterSpacing: '0.06em'
              }}>
                CHRONOLOGICAL MISSION PHASES
              </span>
              <span style={{
                fontSize: '0.72rem',
                color: 'var(--cosmic-cyan)',
                fontFamily: 'var(--font-tech)'
              }}>
                DECEMBER 7 - 19, 1972
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '12px'
            }}>
              {missionPhases.map((phase, idx) => (
                <div 
                  key={phase.title}
                  style={{
                    position: 'relative',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(18, 59, 103, 0.35)',
                    border: '1px solid rgba(40, 184, 232, 0.25)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>
                      PHASE 0{idx + 1}
                    </span>
                    <span style={{ fontSize: '0.66rem', color: 'var(--status-healthy)', fontFamily: 'var(--font-tech)' }}>
                      ✓ {phase.status}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 800, color: '#FFF' }}>
                    {phase.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {phase.date}
                  </div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                    {phase.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Flow Guidance CTA to Next Stage */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            borderTop: '1px solid rgba(245, 249, 255, 0.08)',
            paddingTop: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
                NEXT STAGE:
              </span>
              <span style={{ fontSize: '0.84rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>
                EXPLORE THE APOLLO 17 CREW (3 ASTRONAUTS)
              </span>
            </div>

            <button
              onClick={onExploreCrew}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-tech)',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
            >
              <span>EXPLORE CREW DATA</span>
              <ArrowRight size={15} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
