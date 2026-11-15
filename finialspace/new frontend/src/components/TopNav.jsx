import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  ScanLine, 
  ShieldPlus, 
  Rocket, 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  Bone, 
  Brain, 
  Moon, 
  Radio, 
  AlertTriangle, 
  Compass, 
  Settings,
  ShieldCheck,
  Check,
  LogOut
} from 'lucide-react';
import { astronautProfile } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

// Core Primary Navigation Items
const PRIMARY_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'health-monitoring', label: 'Health Monitor', icon: Activity, path: '/health-monitoring' },
  { id: 'anatomy', label: '3D Anatomy', icon: ScanLine, path: '/anatomy' },
  { id: 'immune', label: 'Immune System', icon: ShieldPlus, path: '/immune' }
];

// Secondary Navigation inside "More ▼" Dropdown (Section 9)
const MORE_NAV = [
  { id: 'landing', label: 'Home / Landing Page', icon: Rocket, path: '/' },
  { id: 'bone-health', label: 'Bone Health', icon: Bone, path: '/bone-health' },
  { id: 'mental-wellness', label: 'Mental Wellness', icon: Brain, path: '/mental-wellness' },
  { id: 'sleep-recovery', label: 'Sleep & Recovery', icon: Moon, path: '/sleep-recovery' },
  { id: 'radiation', label: 'Radiation Monitoring', icon: Radio, path: '/radiation' },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle, path: '/alerts', badge: '3' },
  { id: 'mission', label: 'Mission Status', icon: Compass, path: '/mission' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
];

export default function TopNav({ activeTab, onSelectTab, onOpenProfile, onNavigateToAlerts }) {
  const { user, profile: authProfile, logout } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const moreDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setShowMoreMenu(false);
        setShowNotifications(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isMoreActive = MORE_NAV.some(item => item.id === activeTab);
  const activeMoreItem = MORE_NAV.find(item => item.id === activeTab);

  const notifications = [
    { id: 1, title: 'Cabin radiation baseline nominal (0.42 mSv)', time: '14m ago', status: 'normal' },
    { id: 2, title: 'Cardiovascular circadian rhythm calibrated', time: '1h ago', status: 'normal' },
    { id: 3, title: 'Electrolyte hydration target 98% achieved', time: '3h ago', status: 'normal' }
  ];

  const handleNavClick = (tabId) => {
    onSelectTab(tabId);
    setShowMoreMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ================= FLOATING GLASS NAVBAR ================= */}
      <nav
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '92%',
          maxWidth: '1500px',
          height: '68px',
          zIndex: 1000,
          background: 'linear-gradient(135deg, rgba(245, 249, 255, 0.12), rgba(18, 59, 103, 0.32))',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: '1px solid rgba(245, 249, 255, 0.16)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 16px 50px rgba(0, 0, 0, 0.35)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="glass-navbar"
      >
        {/* Subtle reflective top highlight overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20px',
          right: '20px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(245, 249, 255, 0.35) 50%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        {/* ================= LEFT: ASTRA HEALTH LOGO ================= */}
        <div
          onClick={() => handleNavClick('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          {/* Minimalist NASA medical/orbit symbol */}
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(40, 184, 232, 0.25), rgba(18, 59, 103, 0.5))',
            border: '1px solid rgba(40, 184, 232, 0.40)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(40, 184, 232, 0.2)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#28B8E8" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="12" cy="12" r="4" fill="#28B8E8" />
              <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="#F5F9FF" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '0.04em',
              color: 'var(--polar-white)'
            }}>
              ASTRA
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '0.04em',
              color: 'var(--cosmic-cyan)'
            }}>
              HEALTH
            </span>
          </div>
        </div>

        {/* ================= CENTER: PRIMARY NAVIGATION ================= */}
        <div 
          className="desktop-nav-center"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {PRIMARY_NAV.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (item.id === 'apollo-17' && activeTab === 'apollo-17-anatomy');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  border: isActive ? '1px solid rgba(40, 184, 232, 0.40)' : '1px solid transparent',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(40, 184, 232, 0.20), rgba(18, 59, 103, 0.18))' 
                    : 'transparent',
                  color: isActive ? 'var(--polar-white)' : 'rgba(245, 249, 255, 0.65)',
                  boxShadow: isActive ? '0 0 24px rgba(40, 184, 232, 0.12)' : 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(245, 249, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(245, 249, 255, 0.10)';
                    e.currentTarget.style.color = 'var(--polar-white)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = 'rgba(245, 249, 255, 0.65)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <Icon size={16} color={isActive ? '#28B8E8' : 'currentColor'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= RIGHT: STATUS + NOTIFS + PROFILE + MORE ================= */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* Live System Status (Section 7) */}
          <div 
            className="system-online-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'rgba(57, 217, 138, 0.10)',
              border: '1px solid rgba(57, 217, 138, 0.25)',
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#39D98A',
              userSelect: 'none'
            }}
          >
            <span className="pulsing-dot-green" />
            <span>SYSTEM ONLINE</span>
          </div>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }} ref={notifDropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: showNotifications ? 'rgba(40, 184, 232, 0.15)' : 'rgba(245, 249, 255, 0.06)',
                border: '1px solid rgba(245, 249, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showNotifications ? 'var(--cosmic-cyan)' : 'var(--polar-white)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              aria-label="System Notifications"
            >
              <Bell size={17} />
              <span style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--cosmic-cyan)',
                boxShadow: '0 0 6px var(--cosmic-cyan)'
              }} />
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '320px',
                  background: 'linear-gradient(135deg, rgba(16, 42, 67, 0.95), rgba(7, 21, 34, 0.98))',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid rgba(245, 249, 255, 0.16)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                  padding: '16px',
                  zIndex: 1100,
                  animation: 'fadeIn 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>Telemetry Notifications</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--cosmic-cyan)' }}>3 Nominal</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px 12px',
                        background: 'rgba(245, 249, 255, 0.04)',
                        border: '1px solid rgba(245, 249, 255, 0.08)',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <span style={{ fontSize: '0.80rem', color: 'var(--polar-white)', lineHeight: 1.35 }}>{n.title}</span>
                      <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Astronaut Profile Button */}
          <button
            onClick={onOpenProfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px 6px 6px',
              borderRadius: '12px',
              background: 'rgba(245, 249, 255, 0.06)',
              border: '1px solid rgba(245, 249, 255, 0.12)',
              color: 'var(--polar-white)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Astronaut Telemetry Profile"
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #123B67 0%, #28B8E8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              fontWeight: 700,
              fontSize: '0.75rem',
              overflow: 'hidden'
            }}>
              {authProfile?.avatarUrl ? (
                <img src={authProfile.avatarUrl} alt={authProfile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                authProfile?.name ? authProfile.name.slice(0, 2).toUpperCase() : 'AM'
              )}
            </div>
            <span className="profile-name-text" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              {authProfile?.name || 'Alex Morgan'}
            </span>
          </button>

          {/* ================= MORE ▼ DROPDOWN MENU (Section 9) ================= */}
          <div style={{ position: 'relative' }} ref={moreDropdownRef}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '12px',
                background: isMoreActive 
                  ? 'linear-gradient(135deg, rgba(40, 184, 232, 0.20), rgba(18, 59, 103, 0.18))'
                  : 'rgba(245, 249, 255, 0.06)',
                border: isMoreActive ? '1px solid rgba(40, 184, 232, 0.40)' : '1px solid rgba(245, 249, 255, 0.12)',
                color: isMoreActive ? 'var(--polar-white)' : 'rgba(245, 249, 255, 0.75)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{isMoreActive && activeMoreItem ? activeMoreItem.label : 'More'}</span>
              <ChevronDown size={14} style={{ transform: showMoreMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }} />
            </button>

            {/* Dropdown Menu */}
            {showMoreMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '230px',
                  background: 'linear-gradient(135deg, rgba(16, 42, 67, 0.95), rgba(7, 21, 34, 0.98))',
                  backdropFilter: 'blur(28px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                  border: '1px solid rgba(245, 249, 255, 0.16)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
                  padding: '8px',
                  zIndex: 1100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  animation: 'fadeIn 0.2s ease'
                }}
              >
                {MORE_NAV.map(sub => {
                  const SubIcon = sub.icon;
                  const isSubActive = activeTab === sub.id;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleNavClick(sub.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: isSubActive ? 'rgba(40, 184, 232, 0.15)' : 'transparent',
                        border: isSubActive ? '1px solid rgba(40, 184, 232, 0.35)' : '1px solid transparent',
                        color: isSubActive ? 'var(--cosmic-cyan)' : 'var(--polar-white)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.82rem',
                        fontWeight: isSubActive ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubActive) {
                          e.currentTarget.style.background = 'rgba(245, 249, 255, 0.08)';
                          e.currentTarget.style.color = 'var(--polar-white)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--polar-white)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <SubIcon size={15} color={isSubActive ? '#28B8E8' : 'rgba(245, 249, 255, 0.7)'} />
                        <span>{sub.label}</span>
                      </div>
                      {sub.badge && (
                        <span style={{
                          fontSize: '0.68rem',
                          padding: '1px 6px',
                          borderRadius: '6px',
                          background: 'rgba(40, 184, 232, 0.2)',
                          color: '#28B8E8',
                          fontWeight: 700
                        }}>
                          {sub.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Sign Out Option */}
                <div style={{ height: '1px', background: 'rgba(245, 249, 255, 0.10)', margin: '4px 0' }} />
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    logout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: '#FF6B6B',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 107, 107, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <LogOut size={15} color="#FF6B6B" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle (Section 10) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-trigger"
            style={{
              display: 'none',
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'rgba(245, 249, 255, 0.06)',
              border: '1px solid rgba(245, 249, 255, 0.12)',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--polar-white)',
              cursor: 'pointer'
            }}
            aria-label="Toggle Navigation Drawer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE GLASS SLIDING DRAWER (Section 10) ================= */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(7, 21, 34, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: '24px 20px',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(16, 42, 67, 0.95), rgba(7, 21, 34, 0.98))',
              border: '1px solid rgba(245, 249, 255, 0.16)',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(245, 249, 255, 0.10)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, color: 'var(--polar-white)' }}>ASTRA</span>
                <span style={{ fontWeight: 800, color: 'var(--cosmic-cyan)' }}>HEALTH</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--polar-white)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '70vh', overflowY: 'auto' }}>
              {[...PRIMARY_NAV, ...MORE_NAV].map(item => {
                const ItemIcon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: isActive ? 'rgba(40, 184, 232, 0.15)' : 'transparent',
                      border: isActive ? '1px solid rgba(40, 184, 232, 0.40)' : '1px solid transparent',
                      color: isActive ? 'var(--cosmic-cyan)' : 'var(--polar-white)',
                      fontSize: '0.90rem',
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <ItemIcon size={18} color={isActive ? '#28B8E8' : 'currentColor'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Sign Out Option */}
              <div style={{ height: '1px', background: 'rgba(245, 249, 255, 0.10)', margin: '6px 0' }} />
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 107, 107, 0.08)',
                  border: '1px solid rgba(255, 107, 107, 0.25)',
                  color: '#FF6B6B',
                  fontSize: '0.90rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <LogOut size={18} color="#FF6B6B" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for Responsive Nav Breakpoints */}
      <style>{`
        @media (max-width: 1040px) {
          .desktop-nav-center {
            display: none !important;
          }
          .mobile-menu-trigger {
            display: flex !important;
          }
          .profile-name-text {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .system-online-badge {
            display: none !important;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
