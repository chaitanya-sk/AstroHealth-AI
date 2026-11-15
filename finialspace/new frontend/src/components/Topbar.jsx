import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  ShieldCheck, 
  Radio, 
  ChevronRight, 
  Compass, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { astronautProfile } from '../data/mockData';

export default function Topbar({ onToggleSidebar, onOpenProfile, onNavigateToAlerts }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Radiation Warning during EVA-3', time: '18m ago', type: 'red' },
    { id: 2, title: 'Stress Level Elevation Detected', time: '42m ago', type: 'yellow' },
    { id: 3, title: 'Electrolyte Hydration Reminder', time: '2h ago', type: 'green' }
  ];

  return (
    <header
      style={{
        height: '70px',
        background: 'rgba(17, 17, 19, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 900
      }}
    >
      {/* Left side: Hamburger Toggle & Mission Telemetry */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          className="mobile-hamburger-btn"
          style={{
            background: 'rgba(24, 24, 27, 0.8)',
            border: '1px solid var(--border-color)',
            color: '#FFFFFF',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mission Capsule Badge */}
          <div style={{
            background: 'rgba(255, 90, 54, 0.12)',
            border: '1px solid rgba(255, 90, 54, 0.35)',
            padding: '4px 10px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Compass size={14} color="var(--orange-accent)" />
            <span style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--orange-accent)',
              letterSpacing: '0.06em'
            }}>
              MARS EXPLORATION MISSION
            </span>
          </div>

          {/* Mission Day Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            color: '#FFFFFF',
            letterSpacing: '0.04em'
          }} className="hide-on-mobile">
            <span>DAY 147</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>SOL 143</span>
          </div>
        </div>
      </div>

      {/* Right side: System Status, Notifications & Astronaut Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* System Status: ONLINE */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(24, 24, 27, 0.8)',
          border: '1px solid var(--border-color)',
          padding: '6px 12px',
          borderRadius: '8px',
          fontFamily: 'var(--font-tech)',
          fontSize: '0.82rem'
        }} className="hide-on-mobile">
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--green-safe)',
            boxShadow: '0 0 10px var(--green-safe)',
            animation: 'pulseGlow 2s infinite'
          }} />
          <span style={{ color: 'var(--text-secondary)' }}>SYSTEM STATUS:</span>
          <span style={{ color: 'var(--green-safe)', fontWeight: 700, letterSpacing: '0.05em' }}>ONLINE</span>
        </div>

        {/* Notifications Icon with Badge & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: 'rgba(24, 24, 27, 0.8)',
              border: '1px solid var(--border-color)',
              color: '#FFFFFF',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
            className="interactive-hover"
          >
            <Bell size={18} color="var(--orange-accent)" />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--red-emergency)',
              boxShadow: '0 0 8px var(--red-emergency)'
            }} />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '320px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
                zIndex: 1000
              }}
              className="glass-panel"
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                paddingBottom: '8px'
              }}>
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.88rem', fontWeight: 700, color: '#FFF' }}>
                  MISSION TELEMETRY NOTICES
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--orange-accent)', fontFamily: 'var(--font-tech)' }}>
                  3 UNREAD
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifications(false);
                      if (onNavigateToAlerts) onNavigateToAlerts();
                    }}
                    style={{
                      padding: '10px',
                      background: 'rgba(24, 24, 27, 0.7)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      borderLeft: `3px solid ${n.type === 'red' ? 'var(--red-emergency)' : n.type === 'yellow' ? 'var(--yellow-warning)' : 'var(--green-safe)'}`
                    }}
                    className="interactive-hover"
                  >
                    <div style={{ fontSize: '0.8rem', color: '#FFF', fontWeight: 600 }}>{n.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.time}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowNotifications(false);
                  if (onNavigateToAlerts) onNavigateToAlerts();
                }}
                className="btn-secondary"
                style={{ width: '100%', marginTop: '12px', fontSize: '0.78rem', padding: '6px' }}
              >
                VIEW ALL MISSION ALERTS →
              </button>
            </div>
          )}
        </div>

        {/* Astronaut Profile Button */}
        <button
          onClick={onOpenProfile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(24, 24, 27, 0.8)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '6px 14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          className="interactive-hover"
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #FF5A36, #E84A2A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF'
          }}>
            <User size={16} />
          </div>

          <div style={{ textAlign: 'left' }} className="hide-on-mobile">
            <div style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.04em'
            }}>
              {astronautProfile.name.toUpperCase()}
            </div>
            <div style={{
              fontSize: '0.68rem',
              color: 'var(--orange-accent)',
              fontFamily: 'var(--font-tech)',
              letterSpacing: '0.04em'
            }}>
              COMMANDER
            </div>
          </div>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
