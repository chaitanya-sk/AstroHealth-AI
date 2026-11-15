import React from 'react';
import { astronautProfile } from '../data/mockData';
import { ShieldCheck, UserCheck, Activity, Award, Radio, BatteryCharging, Clock, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AstronautProfile({ onClose, inModal = false }) {
  const { profile: authProfile, logout } = useAuth();
  const profile = astronautProfile;
  const displayName = authProfile?.name || profile.name;
  const displayRole = authProfile?.role || profile.role;
  const displayAvatar = authProfile?.avatarUrl;

  const content = (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }} className="glass-panel cyber-corners">
      {/* Background radial highlight */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,90,54,0.18) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header with Close button if in modal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <span className="badge-status badge-orange" style={{ marginBottom: '8px' }}>
            ARES-V FLIGHT CREW
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFF' }}>
            ASTRONAUT DOSSIER
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-tech)' }}>
            BIO-TELEMETRY & CREDENTIAL REGISTRY
          </p>
        </div>
        {inModal && onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Profile Bio Block */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        {/* Holographic Avatar */}
        <div style={{
          position: 'relative',
          width: '84px',
          height: '84px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #18181B, #27272a)',
          border: '2px solid var(--orange-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(255,90,54,0.3)',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          {displayAvatar ? (
            <img src={displayAvatar} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            /* Futuristic Helmet Icon SVG */
            <svg viewBox="0 0 64 64" style={{ width: '56px', height: '56px' }}>
              <path
                d="M 32 8 C 18 8 10 18 10 32 C 10 46 18 56 32 56 C 46 56 54 46 54 32 C 54 18 46 8 32 8 Z"
                fill="none"
                stroke="#FF5A36"
                strokeWidth="2"
              />
              <path
                d="M 16 26 C 16 20 22 16 32 16 C 42 16 48 20 48 26 C 48 38 42 44 32 44 C 22 44 16 38 16 26 Z"
                fill="rgba(245, 185, 66, 0.25)"
                stroke="#F5B942"
                strokeWidth="1.5"
              />
              <path d="M 22 22 Q 32 18 42 22" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
              <circle cx="32" cy="50" r="2.5" fill="#35D07F" />
            </svg>
          )}
          <div style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            background: 'var(--green-safe)',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #111'
          }}>
            <ShieldCheck size={11} color="#000" />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#FFF' }}>
              {displayName}
            </h3>
            <span style={{
              background: 'rgba(255,255,255,0.08)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-tech)'
            }}>
              {authProfile?.email ? 'VERIFIED' : profile.rank}
            </span>
          </div>
          <div style={{ color: 'var(--orange-accent)', fontFamily: 'var(--font-tech)', fontSize: '0.9rem', fontWeight: 600 }}>
            {displayRole}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '4px', fontFamily: 'var(--font-tech)' }}>
            {authProfile?.email ? (
              <span>ACCOUNT: <span style={{ color: '#FFF' }}>{authProfile.email}</span></span>
            ) : (
              <span>ID: <span style={{ color: '#FFF' }}>{profile.id}</span> • BLOOD: <span style={{ color: '#FFF' }}>{profile.bloodType}</span> • AGE: <span style={{ color: '#FFF' }}>{profile.age}</span></span>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Key Mission Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'rgba(24, 24, 27, 0.7)',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
            <Clock size={13} color="var(--orange-accent)" />
            MISSION ELAPSED
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#FFF', marginTop: '4px' }}>
            DAY {profile.missionDay} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>/ 365</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(24, 24, 27, 0.7)',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
            <Award size={13} color="var(--orange-accent)" />
            EVA SORTIES
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#FFF', marginTop: '4px' }}>
            {profile.evaCount} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({profile.evaHours}h)</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(24, 24, 27, 0.7)',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
            <Radio size={13} color="var(--orange-accent)" />
            CUMULATIVE RAD
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--green-safe)', marginTop: '4px' }}>
            {profile.cumulativeRadiation}
          </div>
        </div>

        <div style={{
          background: 'rgba(24, 24, 27, 0.7)',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
            <BatteryCharging size={13} color="var(--green-safe)" />
            SUIT TELEMETRY
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#FFF', marginTop: '4px' }}>
            {profile.suitBattery} <span style={{ fontSize: '0.72rem', color: 'var(--green-safe)' }}>NORMAL</span>
          </div>
        </div>
      </div>

      {/* Security & Link status footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.76rem',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-tech)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green-safe)' }} />
          <span>QUANTUM UPLINK: {profile.systemStatus}</span>
        </div>
        <div>
          EARTH LATENCY: <span style={{ color: '#FFF' }}>{profile.earthLatency}</span>
        </div>
      </div>

      {/* Operator Session Logout Action */}
      <div style={{ marginTop: '16px' }}>
        <button
          onClick={async () => {
            if (onClose) onClose();
            await logout();
          }}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'rgba(255, 75, 75, 0.1)',
            border: '1px solid rgba(255, 75, 75, 0.3)',
            borderRadius: '10px',
            color: '#FF6B6B',
            fontFamily: 'var(--font-tech)',
            fontSize: '0.84rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 75, 75, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 75, 75, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 75, 75, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 75, 75, 0.3)';
          }}
        >
          <LogOut size={16} color="#FF6B6B" />
          <span>SIGN OUT / TERMINATE SESSION</span>
        </button>
      </div>
    </div>
  );

  if (inModal) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '540px', width: '100%' }}>
          {content}
        </div>
      </div>
    );
  }

  return content;
}
