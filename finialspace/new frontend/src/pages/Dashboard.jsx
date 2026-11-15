import React from 'react';
import { 
  Activity, 
  ScanLine, 
  ShieldPlus, 
  ArrowRight, 
  Sparkles,
  Compass
} from 'lucide-react';
import CrewProfilesSection from '../components/CrewProfilesSection';

export default function Dashboard({ onNavigateTab }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      paddingBottom: '60px',
      maxWidth: '1440px',
      margin: '0 auto'
    }}>

      {/* ================= 1. CLEAN DASHBOARD HEADER ================= */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '8px'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
            fontWeight: 800,
            color: 'var(--polar-white)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: '0 0 4px 0'
          }}>
            GOOD MORNING
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.96rem',
            margin: 0,
            fontFamily: 'var(--font-body)'
          }}>
            Your space health and mission information overview.
          </p>
        </div>

        {/* Minimal System Online Indicator */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          borderRadius: '24px',
          background: 'rgba(57, 217, 138, 0.12)',
          border: '1px solid rgba(57, 217, 138, 0.35)',
          fontSize: '0.80rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: '#39D98A',
          fontFamily: 'var(--font-tech)'
        }}>
          <span className="pulsing-dot-green" />
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* ================= 2. PRIMARY FOCUS: THREE CREW MEMBER PROFILES ================= */}
      <CrewProfilesSection
        onSelectMember={(memberId) => onNavigateTab && onNavigateTab(`profile-${memberId}`)}
      />

      {/* ================= 3. CLEAN PLATFORM NAVIGATION RIBBON ================= */}
      <div 
        className="glass-card"
        style={{
          padding: '20px 24px',
          borderRadius: '16px',
          background: 'rgba(7, 21, 34, 0.65)',
          border: '1px solid rgba(245, 249, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(40, 184, 232, 0.15)',
            border: '1px solid rgba(40, 184, 232, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cosmic-cyan)'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--polar-white)', fontFamily: 'var(--font-display)' }}>
              Astra Health Diagnostic Suites
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
              Dedicated modules for 3D anatomical scans, continuous biometrics, and immune surveillance
            </div>
          </div>
        </div>

        {/* Quick Access Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigateTab && onNavigateTab('anatomy')}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              padding: '8px 14px',
              fontFamily: 'var(--font-tech)',
              color: 'var(--cosmic-cyan)',
              borderColor: 'rgba(40, 184, 232, 0.35)'
            }}
          >
            <ScanLine size={14} />
            <span>3D ANATOMY</span>
            <ArrowRight size={12} />
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('health-monitoring')}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              padding: '8px 14px',
              fontFamily: 'var(--font-tech)'
            }}
          >
            <Activity size={14} />
            <span>HEALTH MONITOR</span>
            <ArrowRight size={12} />
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('immune')}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              padding: '8px 14px',
              fontFamily: 'var(--font-tech)'
            }}
          >
            <ShieldPlus size={14} />
            <span>IMMUNE SUITE</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

    </div>
  );
}
