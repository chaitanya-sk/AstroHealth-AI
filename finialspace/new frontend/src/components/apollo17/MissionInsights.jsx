import React from 'react';
import { 
  Sparkles, 
  Activity, 
  Flame, 
  Wind, 
  Moon, 
  Database, 
  ShieldCheck, 
  Layers, 
  Compass, 
  ArrowRight,
  CheckCircle2,
  Info
} from 'lucide-react';
import { DataAvailabilityBadge, HistoricalDataNotice } from './DataAvailabilityState';

export default function MissionInsights({ onReturnToOverview, onNavigateToAnatomy }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Historical Verification Notice */}
      <HistoricalDataNotice />

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-status badge-cyan">
            HISTORICAL MISSION SYNTHESIS
          </span>
          <DataAvailabilityBadge status="available" label="CLINICAL & MISSION ARCHIVE" />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          fontWeight: 800,
          color: '#FFFFFF',
          margin: 0
        }}>
          Mission & Health Insights
        </h2>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          marginTop: '6px',
          maxWidth: '820px',
          lineHeight: 1.5
        }}>
          Bringing together mission context, individual astronaut responsibilities, operational activities, physical workloads, and available biomedical data into one coherent space medicine understanding.
        </p>
      </div>

      {/* Core Principle Callout Banner */}
      <div 
        className="glass-card"
        style={{
          padding: '24px 28px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(18, 59, 103, 0.7) 0%, rgba(10, 26, 47, 0.9) 100%)',
          border: '1px solid rgba(40, 184, 232, 0.45)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(40, 184, 232, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            fontSize: '0.74rem',
            fontFamily: 'var(--font-tech)',
            fontWeight: 700,
            color: 'var(--cosmic-cyan)',
            letterSpacing: '0.08em',
            marginBottom: '6px'
          }}>
            ASTRA HEALTH CORE CLINICAL PARADIGM
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.45rem',
            fontWeight: 900,
            color: '#FFFFFF',
            margin: '0 0 10px 0',
            letterSpacing: '0.02em'
          }}>
            ASTRONAUT HEALTH IS BEST UNDERSTOOD IN MISSION CONTEXT
          </h3>
          <p style={{
            fontSize: '0.90rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: 0,
            maxWidth: '900px'
          }}>
            Biomedical telemetry cannot be interpreted in isolation. A heart rate spike to 150 BPM on Apollo 17 did not represent an acute coronary syndrome, but the mechanical challenge of rotary percussive drilling into solid lunar basalt. 
            Understanding the mission phase, EVA duration, terrain slope, spacesuit internal pressure, and task complexity is essential to evaluating spaceflight health.
          </p>
        </div>
      </div>

      {/* 4 Professional Historical Health Insights Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '18px'
      }}>
        
        {/* Card 1: Metabolic Workload Context */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(7, 21, 34, 0.7)', border: '1px solid rgba(40, 184, 232, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Flame size={18} style={{ color: '#FFB020' }} />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Metabolic Workload & Cooling
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 14px 0' }}>
            Apollo 17 demonstrated that lunar surface extravehicular activity is physically demanding. Average metabolic heat production remained between 950–1,200 BTU/hr (~300 W), with peak spikes exceeding 1,600 BTU/hr during core tube drilling and steep mountain ascents.
          </p>
          <div style={{
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(18, 59, 103, 0.3)',
            borderLeft: '2px solid #FFB020',
            fontSize: '0.76rem',
            color: 'var(--polar-white)',
            fontFamily: 'var(--font-tech)'
          }}>
            <strong>Historical Lesson:</strong> Liquid Cooling Garment (LCG) water loop cooling was essential to prevent heat storage exhaustion in pressurized spacesuits.
          </div>
        </div>

        {/* Card 2: Lunar Regolith Respiratory Hazard */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(7, 21, 34, 0.7)', border: '1px solid rgba(40, 184, 232, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Wind size={18} style={{ color: 'var(--cosmic-cyan)' }} />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Abrasive Regolith Inhalation
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 14px 0' }}>
            Harrison Schmitt experienced verified acute rhinitis and paroxysmal sneezing ("Lunar Hay Fever") after regolith dust particles clinging to spacesuit fabric became airborne upon cabin repressurization.
          </p>
          <div style={{
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(18, 59, 103, 0.3)',
            borderLeft: '2px solid var(--cosmic-cyan)',
            fontSize: '0.76rem',
            color: 'var(--polar-white)',
            fontFamily: 'var(--font-tech)'
          }}>
            <strong>Historical Lesson:</strong> Lunar regolith has jagged, un-weathered glassy shards that pose occupational pulmonary and ocular hazards without vacuum suit wash systems.
          </div>
        </div>

        {/* Card 3: Cardiovascular Arrhythmia Mitigation */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(7, 21, 34, 0.7)', border: '1px solid rgba(57, 217, 138, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Activity size={18} style={{ color: 'var(--status-healthy)' }} />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Electrolyte & Cardiac Management
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 14px 0' }}>
            Following potassium-depletion arrhythmias documented on Apollo 15, NASA enriched Apollo 17 food and beverage provisions with high potassium dietary supplements. All three astronauts maintained stable sinus rhythms throughout lunar descent and surface exploration.
          </p>
          <div style={{
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(18, 59, 103, 0.3)',
            borderLeft: '2px solid var(--status-healthy)',
            fontSize: '0.76rem',
            color: 'var(--polar-white)',
            fontFamily: 'var(--font-tech)'
          }}>
            <strong>Historical Lesson:</strong> Proactive nutritional and electrolyte balance is critical for maintaining cardiac stability under high microgravity workload.
          </div>
        </div>

        {/* Card 4: Rest & Fatigue Accumulation */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(7, 21, 34, 0.7)', border: '1px solid rgba(40, 184, 232, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Moon size={18} style={{ color: '#38BDF8' }} />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Sleep & Microgravity Adaptation
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 14px 0' }}>
            Sleep logs recorded 5.5 to 6.2 hours average sleep per scheduled period, falling short of the 8.0 hours planned. Factors included background equipment cooling pumps, excitement, tight timelines, and uncomfortable cabin temperature fluctuations.
          </p>
          <div style={{
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(18, 59, 103, 0.3)',
            borderLeft: '2px solid #38BDF8',
            fontSize: '0.76rem',
            color: 'var(--polar-white)',
            fontFamily: 'var(--font-tech)'
          }}>
            <strong>Historical Lesson:</strong> Acoustic dampening and environmental temperature stabilization are essential to ensure adequate sleep architecture and avoid cumulative operational fatigue.
          </div>
        </div>

      </div>

      {/* Comparative Data Architecture Table: 1972 Apollo vs Modern ASTRA HEALTH */}
      <div 
        className="glass-card"
        style={{
          padding: '28px',
          borderRadius: '16px',
          background: 'rgba(7, 21, 34, 0.8)',
          border: '1px solid rgba(40, 184, 232, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--cosmic-cyan)', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>
              TELEMETRY ARCHITECTURE COMPARISON
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '2px 0 0 0'
            }}>
              1972 Apollo Bio-Instrumentation vs. Modern ASTRA HEALTH Bio-Mesh
            </h3>
          </div>
          <DataAvailabilityBadge status="workload-context" label="SYSTEMS ANALYSIS" />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-tech)'
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(40, 184, 232, 0.3)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>BIOMEDICAL DOMAIN</th>
                <th style={{ padding: '10px 12px', color: '#FFB020' }}>HISTORICAL 1972 APOLLO TELEMETRY</th>
                <th style={{ padding: '10px 12px', color: 'var(--cosmic-cyan)' }}>MODERN ASTRA HEALTH CAPABILITY</th>
                <th style={{ padding: '10px 12px', color: 'var(--status-healthy)' }}>HISTORICAL DATA PROVENANCE</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(245, 249, 255, 0.06)' }}>
                <td style={{ padding: '12px', color: '#FFF', fontWeight: 700 }}>Cardiovascular</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>Single-lead sternal ECG (ECG analog FM telemetry)</td>
                <td style={{ padding: '12px', color: 'var(--cosmic-cyan)' }}>12-lead digital ECG, continuous blood pressure, pulse wave velocity</td>
                <td style={{ padding: '12px' }}><DataAvailabilityBadge status="available" label="ECG VERIFIED" /></td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(245, 249, 255, 0.06)' }}>
                <td style={{ padding: '12px', color: '#FFF', fontWeight: 700 }}>Blood Oxygenation (SpO2)</td>
                <td style={{ padding: '12px', color: '#FFB020' }}>Not Available (Technology invented in late 1970s)</td>
                <td style={{ padding: '12px', color: 'var(--cosmic-cyan)' }}>Continuous multi-wavelength reflectance pulse oximetry</td>
                <td style={{ padding: '12px' }}><DataAvailabilityBadge status="unavailable" label="NOT IN 1972" /></td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(245, 249, 255, 0.06)' }}>
                <td style={{ padding: '12px', color: '#FFF', fontWeight: 700 }}>Metabolic Workload</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>Calculated from Liquid Cooling Garment (LCG) water ΔT</td>
                <td style={{ padding: '12px', color: 'var(--cosmic-cyan)' }}>VO2 consumption, indirect calorimetry, interstitial lactate</td>
                <td style={{ padding: '12px' }}><DataAvailabilityBadge status="available" label="LCG ΔT VERIFIED" /></td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(245, 249, 255, 0.06)' }}>
                <td style={{ padding: '12px', color: '#FFF', fontWeight: 700 }}>Neuro-Cognitive Load</td>
                <td style={{ padding: '12px', color: '#FFB020' }}>Not Available (Inferred from verbal transcripts & errors)</td>
                <td style={{ padding: '12px', color: 'var(--cosmic-cyan)' }}>Dry-electrode EEG, eye tracking, voice pitch biometric analysis</td>
                <td style={{ padding: '12px' }}><DataAvailabilityBadge status="unavailable" label="NOT IN 1972" /></td>
              </tr>
              <tr>
                <td style={{ padding: '12px', color: '#FFF', fontWeight: 700 }}>Radiation Dosimetry</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>Passive thermoluminescent dosimeters (TLD) read post-flight</td>
                <td style={{ padding: '12px', color: 'var(--cosmic-cyan)' }}>Active real-time silicon micro-dosimeters (mSv/day)</td>
                <td style={{ padding: '12px' }}><DataAvailabilityBadge status="available" label="TLD BADGES READ" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Final Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        paddingTop: '16px'
      }}>
        <button
          onClick={onReturnToOverview}
          className="btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-tech)'
          }}
        >
          <span>← RETURN TO MISSION OVERVIEW</span>
        </button>

        {onNavigateToAnatomy && (
          <button
            onClick={onNavigateToAnatomy}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              fontSize: '0.84rem',
              fontFamily: 'var(--font-tech)',
              fontWeight: 700
            }}
          >
            <Compass size={15} />
            <span>OPEN 3D HOLOGRAPHIC ANATOMY SCANNER</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>

    </div>
  );
}
