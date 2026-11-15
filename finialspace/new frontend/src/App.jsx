import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import AnatomyMonitor from './pages/AnatomyMonitor';
import Apollo17 from './pages/Apollo17';
import Apollo17Anatomy from './pages/Apollo17Anatomy';
import IndividualProfile from './pages/IndividualProfile';
import HealthMonitoring from './pages/HealthMonitoring';
import Alerts from './pages/Alerts';
import Mission from './pages/Mission';
import TopNav from './components/TopNav';
import AstronautProfile from './components/AstronautProfile';
import { AstraAIProvider } from './context/AstraAIContext';
import AstraAIController from './components/AstraAI/AstraAIController';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  Sliders, 
  Bell, 
  Volume2, 
  ShieldCheck, 
  Cpu, 
  Radio, 
  RefreshCw, 
  Check, 
  Save 
} from 'lucide-react';

function MainAppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Settings State
  const [telemetryRate, setTelemetryRate] = useState('1.0s');
  const [radiationAudioAlarm, setRadiationAudioAlarm] = useState(true);
  const [autoSyncEarth, setAutoSyncEarth] = useState(true);
  const [hudBrightness, setHudBrightness] = useState(90);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const tabToPath = {
    'landing': '/',
    'dashboard': '/dashboard',
    'anatomy': '/anatomy',
    'apollo-17': '/apollo-17',
    'apollo-17-anatomy': '/apollo-17/anatomy',
    'profile-cernan': '/profile/cernan',
    'profile-schmitt': '/profile/schmitt',
    'profile-evans': '/profile/evans',
    'health-monitoring': '/health-monitoring',
    'immune': '/immune',
    'vitals': '/vitals',
    'radiation': '/radiation',
    'bone-health': '/bone-health',
    'mental-wellness': '/mental-wellness',
    'sleep-recovery': '/sleep-recovery',
    'alerts': '/alerts',
    'mission': '/mission',
    'settings': '/settings'
  };

  const pathToTab = {
    '/': 'landing',
    '/dashboard': 'dashboard',
    '/anatomy': 'anatomy',
    '/apollo-17': 'apollo-17',
    '/apollo-17/anatomy': 'apollo-17-anatomy',
    '/profile/cernan': 'profile-cernan',
    '/profile/schmitt': 'profile-schmitt',
    '/profile/evans': 'profile-evans',
    '/profile/member-1': 'profile-cernan',
    '/profile/member-2': 'profile-schmitt',
    '/profile/member-3': 'profile-evans',
    '/health-monitoring': 'health-monitoring',
    '/immune': 'immune',
    '/vitals': 'vitals',
    '/radiation': 'radiation',
    '/bone-health': 'bone-health',
    '/mental-wellness': 'mental-wellness',
    '/sleep-recovery': 'sleep-recovery',
    '/alerts': 'alerts',
    '/mission': 'mission',
    '/settings': 'settings'
  };

  // Sync activeTab with current URL route
  useEffect(() => {
    let currentTab = pathToTab[location.pathname];
    if (!currentTab && location.pathname.startsWith('/profile/')) {
      const seg = location.pathname.split('/')[2];
      currentTab = seg === 'member-1' ? 'profile-cernan' :
                   seg === 'member-2' ? 'profile-schmitt' :
                   seg === 'member-3' ? 'profile-evans' :
                   `profile-${seg}`;
    }
    if (!currentTab && location.pathname.startsWith('/apollo-17/astronaut')) {
      currentTab = 'apollo-17';
    }
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.pathname]);

  // 1. Handle Google OAuth callback endpoint
  if (location.pathname === '/auth/callback' || location.pathname.startsWith('/auth/callback')) {
    return <AuthCallback />;
  }

  // 2. Default homepage: Separate Landing Page at route `/`
  if (location.pathname === '/' || location.pathname === '') {
    return <LandingPage />;
  }

  // 3. Login page route `/login`
  if (location.pathname === '/login') {
    return (
      <Login
        onLoginSuccess={() => {
          const dest = location.state?.from?.pathname || '/dashboard';
          navigate(dest, { replace: true });
        }}
      />
    );
  }

  // 4. Session restoration loading screen for protected routes
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: 'var(--bg-primary, #090B10)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          position: 'relative',
        }}
        className="space-bg-grid"
      >
        <div
          style={{
            background: 'var(--card-bg, rgba(16, 20, 28, 0.85))',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
            borderRadius: '20px',
            padding: '28px 36px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
          }}
          className="glass-panel cyber-corners"
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              border: '3px solid rgba(40, 184, 232, 0.25)',
              borderTopColor: 'var(--cosmic-cyan, #28B8E8)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-tech)',
                fontSize: '0.86rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#FFF',
              }}
            >
              RESTORING TELEMETRY AUTHENTICATION...
            </div>
            <div
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-secondary, #94A3B8)',
                marginTop: '2px',
              }}
            >
              Astra Health Deep Space Cryptographic Session
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Protected application routes - unauthenticated visitors redirected to login
  if (!isAuthenticated) {
    return (
      <Login
        onLoginSuccess={() => {
          const dest = location.state?.from?.pathname || '/dashboard';
          navigate(dest, { replace: true });
        }}
      />
    );
  }

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    const targetPath = tabToPath[tabId] || '/dashboard';
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <AstraAIProvider currentRoute={location.pathname} activeTab={activeTab}>
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }} className="space-bg-grid">

      {/* Modern Futuristic Glassmorphism Top Navigation Bar */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenProfile={() => setShowProfileModal(true)}
        onNavigateToAlerts={() => handleSelectTab('alerts')}
      />

      {/* Main Content Area - Full width with 100px top padding for fixed glass navigation */}
      <main style={{
        flex: 1,
        paddingTop: '100px',
        paddingBottom: '40px',
        paddingLeft: 'clamp(14px, 2.5vw, 32px)',
        paddingRight: 'clamp(14px, 2.5vw, 32px)',
        maxWidth: '1680px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        {(activeTab === 'dashboard' || location.pathname === '/dashboard') && (
          <Dashboard onNavigateTab={handleSelectTab} />
        )}

        {(activeTab.startsWith('profile-') || location.pathname.startsWith('/profile/')) && (
          <IndividualProfile
            memberId={
              location.pathname.startsWith('/profile/')
                ? location.pathname.split('/')[2]
                : activeTab.replace('profile-', '')
            }
            onSelectMember={(id) => handleSelectTab(`profile-${id}`)}
            onReturnToDashboard={() => handleSelectTab('dashboard')}
            onNavigateToAnatomy={() => handleSelectTab('anatomy')}
          />
        )}

        {(activeTab === 'anatomy' || location.pathname === '/anatomy') && (
          <AnatomyMonitor />
        )}

        {(activeTab === 'immune' || location.pathname === '/immune') && (
          <AnatomyMonitor />
        )}

        {(activeTab === 'apollo-17' || location.pathname === '/apollo-17' || location.pathname.startsWith('/apollo-17/astronaut')) && (
          <Apollo17
            onNavigateToAnatomy={() => handleSelectTab('apollo-17-anatomy')}
            onNavigateTab={handleSelectTab}
          />
        )}

        {(activeTab === 'apollo-17-anatomy' || location.pathname === '/apollo-17/anatomy') && (
          <Apollo17Anatomy
            onBackToApollo17={() => handleSelectTab('apollo-17')}
          />
        )}

        {activeTab === 'health-monitoring' && (
          <HealthMonitoring activeSubView="vitals" />
        )}

        {activeTab === 'vitals' && (
          <HealthMonitoring activeSubView="vitals" />
        )}

        {activeTab === 'radiation' && (
          <HealthMonitoring activeSubView="radiation" />
        )}

        {activeTab === 'bone-health' && (
          <HealthMonitoring activeSubView="bone-health" />
        )}

        {activeTab === 'mental-wellness' && (
          <HealthMonitoring activeSubView="mental-wellness" />
        )}

        {activeTab === 'sleep-recovery' && (
          <HealthMonitoring activeSubView="sleep-recovery" />
        )}

        {activeTab === 'alerts' && (
          <Alerts />
        )}

        {activeTab === 'mission' && (
          <Mission />
        )}

        {/* SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge-status badge-orange">SYSTEM PREFERENCES</span>
                <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  HARDWARE CONFIGURATION
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#FFF' }}>
                MISSION CONTROL & BIOSENSOR SETTINGS
              </h1>
            </div>

            <div className="glass-panel cyber-corners" style={{ padding: '28px', maxWidth: '800px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Telemetry Polling Rate */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#FFF' }}>
                      Bio-Mesh Telemetry Polling Frequency
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
                      Interval for continuous arterial ECG, SpO2, and EEG data synthesis
                    </p>
                  </div>
                  <select
                    value={telemetryRate}
                    onChange={(e) => setTelemetryRate(e.target.value)}
                    style={{
                      background: 'rgba(24, 24, 27, 0.9)',
                      color: '#FFF',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '8px 14px',
                      fontFamily: 'var(--font-tech)',
                      fontSize: '0.88rem'
                    }}
                  >
                    <option value="0.5s">0.5 Seconds (High Bandwidth)</option>
                    <option value="1.0s">1.0 Second (Optimal Recommended)</option>
                    <option value="5.0s">5.0 Seconds (Power Saving Mode)</option>
                  </select>
                </div>

                {/* High Radiation Audio Alarm */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#FFF' }}>
                      Critical Radiation Audio Alert Alarm
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
                      Audible klaxon triggers when dosimeter exceeds 1.2 mSv/h during EVA
                    </p>
                  </div>
                  <button
                    onClick={() => setRadiationAudioAlarm(!radiationAudioAlarm)}
                    className="btn-secondary"
                    style={{
                      borderColor: radiationAudioAlarm ? 'var(--orange-accent)' : 'var(--border-color)',
                      color: radiationAudioAlarm ? 'var(--orange-accent)' : 'var(--text-secondary)'
                    }}
                  >
                    {radiationAudioAlarm ? 'ENABLED (LOUD)' : 'MUTED'}
                  </button>
                </div>

                {/* Auto-Sync with Earth DSN */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#FFF' }}>
                      Autonomous Deep Space Uplink Synchronization
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
                      Forward compressed biometric hashes to NASA Johnson Space Center every 15 min
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoSyncEarth(!autoSyncEarth)}
                    className="btn-secondary"
                    style={{
                      borderColor: autoSyncEarth ? 'var(--green-safe)' : 'var(--border-color)',
                      color: autoSyncEarth ? 'var(--green-safe)' : 'var(--text-secondary)'
                    }}
                  >
                    {autoSyncEarth ? 'AUTOMATIC UPLINK' : 'MANUAL BURST ONLY'}
                  </button>
                </div>

                {/* HUD Brightness Slider */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#FFF' }}>
                      Visor HUD Optical Luminescence
                    </span>
                    <span style={{ fontFamily: 'var(--font-tech)', color: 'var(--orange-accent)', fontWeight: 700 }}>
                      {hudBrightness}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={hudBrightness}
                    onChange={(e) => setHudBrightness(e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--orange-accent)' }}
                  />
                </div>

                {/* Save button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                  <button
                    onClick={handleSaveSettings}
                    className="btn-primary"
                  >
                    {settingsSaved ? (
                      <>
                        <Check size={16} /> CONFIGURATION SAVED
                      </>
                    ) : (
                      <>
                        <Save size={16} /> SAVE CONFIGURATION
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      {/* Astronaut Profile Hologram Modal */}
      {showProfileModal && (
        <AstronautProfile
          inModal={true}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Global ASTRA AI Interactive Robot Assistant */}
      <AstraAIController />
    </div>
  </AstraAIProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
