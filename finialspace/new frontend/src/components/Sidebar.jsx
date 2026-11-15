import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  HeartPulse, 
  Radio, 
  Bone, 
  Brain, 
  Moon, 
  Bell, 
  Compass, 
  Settings, 
  LogOut, 
  X, 
  ShieldCheck,
  Flame,
  Box,
  Rocket
} from 'lucide-react';
import { astronautProfile } from '../data/mockData';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'anatomy', label: '3D Anatomy Monitor', icon: Box },
  { id: 'apollo-17', label: 'Apollo 17 Mission', icon: Rocket, badge: 'NASA' },
  { id: 'health-monitoring', label: 'Health Monitoring', icon: Activity },
  { id: 'vitals', label: 'Vital Signs', icon: HeartPulse },
  { id: 'radiation', label: 'Radiation', icon: Radio },
  { id: 'bone-health', label: 'Bone Health', icon: Bone },
  { id: 'mental-wellness', label: 'Mental Wellness', icon: Brain },
  { id: 'sleep-recovery', label: 'Sleep & Recovery', icon: Moon },
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: '3' },
  { id: 'mission', label: 'Mission Status', icon: Compass },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function Sidebar({ activeTab, onSelectTab, isOpen, onClose, onLogout }) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 990,
            display: 'block'
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          width: '270px',
          background: 'var(--card-bg)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          transform: isOpen ? 'translateX(0)' : 'none',
          transition: 'transform 0.3s ease',
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)'
        }}
        className="sidebar-responsive"
      >
        {/* Top Logo & System Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Glowing Logo Icon */}
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF5A36 0%, #E84A2A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(255, 90, 54, 0.5)',
              position: 'relative'
            }}>
              <Flame size={24} color="#FFF" />
              <span style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--green-safe)',
                boxShadow: '0 0 8px var(--green-safe)'
              }} />
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.15rem',
                letterSpacing: '0.08em',
                color: '#FFFFFF'
              }}>
                ASTRA <span style={{ color: 'var(--orange-accent)' }}>HEALTH</span>
              </div>
              <div style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-tech)',
                letterSpacing: '0.08em',
                color: 'var(--text-secondary)'
              }}>
                AI MISSION TELEMETRY
              </div>
            </div>
          </div>

          {/* Close button on Mobile */}
          <button
            onClick={onClose}
            className="mobile-close-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'none',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu List */}
        <nav style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px'
        }}>
          <div style={{
            fontSize: '0.68rem',
            fontFamily: 'var(--font-tech)',
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            padding: '4px 12px 10px 12px',
            textTransform: 'uppercase'
          }}>
            SYSTEM MODULES
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(255, 90, 54, 0.4)' : 'transparent',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(255, 90, 54, 0.16) 0%, rgba(232, 74, 42, 0.04) 100%)'
                      : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {/* Left Active Glow Indicator */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: '15%',
                      bottom: '15%',
                      width: '3px',
                      background: 'var(--orange-accent)',
                      borderRadius: '0 2px 2px 0',
                      boxShadow: '0 0 10px var(--orange-accent)'
                    }} />
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon
                      size={18}
                      color={isActive ? 'var(--orange-accent)' : 'currentColor'}
                      style={{ filter: isActive ? 'drop-shadow(0 0 4px var(--orange-accent))' : 'none' }}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span style={{
                      background: 'var(--red-emergency)',
                      color: '#FFF',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-tech)',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                      boxShadow: '0 0 8px rgba(255, 75, 75, 0.6)'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Astronaut Status & Logout */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(24, 24, 27, 0.4)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(255, 90, 54, 0.15)',
                border: '1px solid var(--orange-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--orange-accent)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                AM
              </div>
              <div>
                <div style={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-tech)' }}>
                  {astronautProfile.name}
                </div>
                <div style={{ color: 'var(--green-safe)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  SOL 147 • OPTIMAL
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Terminate Mission Session"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="interactive-hover"
            >
              <LogOut size={15} />
            </button>
          </div>

          <div style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-tech)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>ENCRYPTED BIO-LINK</span>
            <span style={{ color: 'var(--green-safe)' }}>ONLINE</span>
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .sidebar-responsive {
            transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
