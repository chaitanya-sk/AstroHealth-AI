import React from 'react';
import { 
  Compass, 
  Users, 
  Wind, 
  Radio, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Sun, 
  Droplet, 
  Layers, 
  HardDrive, 
  Clock, 
  AlertTriangle,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { 
  missionStats, 
  crewMembers, 
  astronautProfile 
} from '../data/mockData';

export default function Mission() {
  const { environmental, communication, systems } = missionStats;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', paddingBottom: '30px' }}>

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-status badge-orange">
            MISSION OPERATIONS COMMAND
          </span>
          <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            DEEP SPACE FLEET TELEMETRY
          </span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 2.4vw, 2.1rem)',
          color: '#FFFFFF'
        }}>
          ARES-V MISSION STATUS & OVERVIEW
        </h1>
      </div>

      {/* ================= MISSION PROGRESS BANNER ================= */}
      <div className="glass-panel cyber-corners" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(17, 17, 19, 0.95) 0%, rgba(24, 24, 27, 0.85) 100%)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.85rem',
              color: 'var(--orange-accent)',
              letterSpacing: '0.1em',
              fontWeight: 700
            }}>
              MISSION PROGRESS
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, color: '#FFF' }}>
                DAY 147
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                OF 365
              </span>
              <span className="badge-status badge-green" style={{ marginLeft: '10px' }}>
                SOL 143 • NOMINAL
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '20px',
            fontFamily: 'var(--font-tech)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}>
            <div>
              EARTH DISTANCE: <strong style={{ color: '#FFF' }}>{missionStats.distanceFromEarth}</strong>
            </div>
            <div>
              ONE-WAY RADIO DELAY: <strong style={{ color: 'var(--orange-accent)' }}>{missionStats.radioDelay}</strong>
            </div>
            <div>
              OVERALL FLEET HEALTH: <strong style={{ color: 'var(--green-safe)' }}>{missionStats.fleetHealth}</strong>
            </div>
          </div>
        </div>

        {/* Multi-segment Mission Progress Track */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontFamily: 'var(--font-tech)', marginBottom: '8px' }}>
            <span style={{ color: 'var(--green-safe)' }}>✓ EARTH DEPARTURE (DAY 0)</span>
            <span style={{ color: 'var(--orange-accent)', fontWeight: 700 }}>▲ MARS TRANSIT MID-COURSE (DAY 147)</span>
            <span style={{ color: 'var(--text-muted)' }}>MARS ORBIT INSERTION (DAY 210)</span>
            <span style={{ color: 'var(--text-muted)' }}>SURFACE RETURN (DAY 365)</span>
          </div>

          <div style={{
            width: '100%',
            height: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '5px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: '40.2%',
              height: '100%',
              background: 'linear-gradient(90deg, #35D07F 0%, #FF5A36 100%)',
              boxShadow: '0 0 12px rgba(255, 90, 54, 0.6)'
            }} />
          </div>
        </div>
      </div>

      {/* ================= CREW HEALTH STATUS (ROSTER) ================= */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="var(--orange-accent)" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#FFF' }}>
              CREW HEALTH STATUS & BIOMETRICS
            </h2>
          </div>
          <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-tech)', color: 'var(--text-secondary)' }}>
            4 ACTIVE CREW MEMBERS • HAB-01 BIO-LINK
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {crewMembers.map(member => (
            <div
              key={member.id}
              className="glass-panel cyber-corners"
              style={{
                padding: '20px',
                borderLeft: `4px solid ${member.color}`,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#FFF' }}>
                    {member.name}
                  </h3>
                  <div style={{ color: 'var(--orange-accent)', fontSize: '0.8rem', fontFamily: 'var(--font-tech)', fontWeight: 600 }}>
                    {member.role}
                  </div>
                </div>

                <span className={`badge-status ${member.status === 'OPTIMAL' ? 'badge-green' : 'badge-yellow'}`}>
                  {member.status}
                </span>
              </div>

              {/* Bio Scores */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-tech)',
                background: 'rgba(24, 24, 27, 0.6)',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>VITAL SCORE:</span>{' '}
                  <strong style={{ color: member.color }}>{member.healthScore}%</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>HEART:</span>{' '}
                  <strong style={{ color: '#FFF' }}>{member.heartRate}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>SpO2:</span>{' '}
                  <strong style={{ color: '#FFF' }}>{member.spo2}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>STRESS:</span>{' '}
                  <strong style={{ color: '#FFF' }}>{member.stress}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 3-COLUMN METRICS: ENVIRONMENTAL, COMM, SYSTEMS ================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>

        {/* 1. ENVIRONMENTAL STATUS (ECLSS) */}
        <div className="glass-panel cyber-corners" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Wind size={18} color="var(--blue-info)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#FFF' }}>
              ENVIRONMENTAL (ECLSS)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', fontFamily: 'var(--font-tech)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Atmospheric Pressure</span>
              <strong style={{ color: '#FFF' }}>{environmental.pressure}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Oxygen Concentration (O2)</span>
              <strong style={{ color: 'var(--green-safe)' }}>{environmental.oxygen}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Nitrogen Balance (N2)</span>
              <strong style={{ color: '#FFF' }}>{environmental.nitrogen}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Carbon Dioxide (CO2)</span>
              <strong style={{ color: 'var(--yellow-warning)' }}>{environmental.co2}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cabin Temperature</span>
              <strong style={{ color: '#FFF' }}>{environmental.temperature}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Water Recycling Efficiency</span>
              <strong style={{ color: 'var(--green-safe)' }}>{environmental.waterRecycled}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Air Scrubber Status</span>
              <strong style={{ color: 'var(--green-safe)' }}>{environmental.airScrubberStatus}</strong>
            </div>
          </div>
        </div>

        {/* 2. COMMUNICATION STATUS */}
        <div className="glass-panel cyber-corners" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Radio size={18} color="var(--orange-accent)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#FFF' }}>
              COMMUNICATION NETWORK
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', fontFamily: 'var(--font-tech)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>DSN Primary Antenna</span>
              <strong style={{ color: '#FFF' }}>{communication.dsnAntenna}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Signal Quality & Carrier Lock</span>
              <strong style={{ color: 'var(--green-safe)' }}>{communication.signalQuality}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Downlink Bandwidth</span>
              <strong style={{ color: '#FFF' }}>{communication.bandwidth}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Round-Trip Light Latency</span>
              <strong style={{ color: 'var(--orange-accent)' }}>{communication.latency}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Quantum Key Distribution</span>
              <strong style={{ color: 'var(--green-safe)' }}>{communication.quantumRelay}</strong>
            </div>
          </div>
        </div>

        {/* 3. HARDWARE & LIFE SUPPORT SYSTEM STATUS */}
        <div className="glass-panel cyber-corners" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Cpu size={18} color="var(--green-safe)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#FFF' }}>
              CRITICAL SYSTEMS
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', fontFamily: 'var(--font-tech)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Life Support (ECLSS)</span>
              <strong style={{ color: 'var(--green-safe)' }}>{systems.eclss}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Solar Array Efficiency</span>
              <strong style={{ color: 'var(--green-safe)' }}>{systems.powerSolar}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>RTG Kilopower Reactor</span>
              <strong style={{ color: '#FFF' }}>{systems.reactorRTG}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Bio-Mesh Sensor Arrays</span>
              <strong style={{ color: 'var(--green-safe)' }}>{systems.bioMeshSensors}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Radiation Storm Shelter</span>
              <strong style={{ color: 'var(--green-safe)' }}>{systems.stormShelter}</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
