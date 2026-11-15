import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ArrowRight, Activity, X, Compass, Shield, HeartPulse, Sparkles, Orbit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated } = useAuth();
  const [activeModal, setActiveModal] = useState(null); // 'mission' | 'about' | null

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page-root">
      
      {/* 1. Cinematic Background Layer */}
      <div className="landing-bg-layer">
        <img
          src="/images/space-bg.jpg"
          alt="AstroHealth AI Cinematic Space Background"
          className="landing-bg-img"
        />
        {/* Subtle center atmospheric vignette for maximum typography contrast */}
        <div className="landing-bg-vignette" />
      </div>

      {/* 2. Top Floating Navigation Bar */}
      <header className="landing-header">
        <nav className="landing-nav">
          
          {/* Left: Official Astra Health Logo */}
          <div className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src="/images/astra-health-logo.png"
              alt="Astra Health Logo"
              className="landing-logo"
            />
          </div>

          {/* Vertical Divider */}
          <div className="landing-divider" />

          {/* Center Links: Home, Mission, About */}
          <div className="landing-nav-links">
            {/* Home with active electric-blue glowing line */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="landing-nav-link landing-nav-link-active"
            >
              <span>Home</span>
              <span className="landing-active-glow" />
            </a>

            <button
              onClick={() => setActiveModal('mission')}
              className="landing-nav-link"
            >
              Mission
            </button>

            <button
              onClick={() => setActiveModal('about')}
              className="landing-nav-link"
            >
              About
            </button>
          </div>

          {/* Right: Login / Dashboard Button */}
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="landing-nav-btn"
                title={`Signed in as ${profile?.name || user?.email}`}
              >
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <User style={{ width: '14px', height: '14px' }} />
                )}
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="landing-nav-btn"
              >
                <User style={{ width: '14px', height: '14px' }} />
                <span>Login</span>
              </Link>
            )}
          </div>

        </nav>
      </header>

      {/* 3. Hero Content (Centered Horizontally) */}
      <main className="landing-main">
        
        {/* Small Rounded Badge */}
        <div className="landing-badge">
          <Activity className="landing-pulse" style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
          <span className="landing-badge-text">
            Astronaut Health Monitoring
          </span>
        </div>

        {/* Main Heading: AstroHealth (white) + AI (electric blue) */}
        <h1 className="landing-title">
          AstroHealth{' '}
          <span className="landing-title-gradient">
            AI
          </span>
        </h1>

        {/* Second Heading: Tagline */}
        <h2 className="landing-tagline">
          Monitor. Predict. Protect.
        </h2>

        {/* Description: 2 centered lines */}
        <p className="landing-desc">
          Intelligent health monitoring for astronauts in long-duration space missions.
        </p>

        {/* 4. Main Prominent Button */}
        <div className="landing-hero-cta">
          <button
            onClick={handleCtaClick}
            className="landing-primary-btn"
          >
            <span>{isAuthenticated ? 'Enter Health Dashboard' : 'Login to Dashboard'}</span>
            <ArrowRight className="landing-btn-arrow" style={{ width: '17px', height: '17px' }} />
          </button>
        </div>

      </main>

      {/* Bottom Spacer to balance composition with Earth Curvature */}
      <div className="landing-spacer" />

      {/* ================= MODAL: MISSION OVERVIEW POPUP ================= */}
      {activeModal === 'mission' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(7, 13, 25, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              background: 'linear-gradient(135deg, rgba(16, 26, 46, 0.95), rgba(8, 14, 28, 0.98))',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}>
                <Compass size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-tech, sans-serif)', fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em' }}>
                DEEP SPACE MISSION ARCHIVE
              </span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>
              Apollo 17 & Mars Expeditions
            </h3>

            <p style={{ color: 'rgba(203, 213, 225, 0.85)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              AstroHealth AI tracks biological telemetry across historical Apollo 17 missions (Eugene Cernan, Harrison Schmitt, Ronald Evans) and deep-space Mars expeditions. Real-time biometrics provide continuous cardiac, radiation, and metabolic oversight.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'var(--font-tech, sans-serif)' }}>EVA SORTIES RECORDED</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>22h 04m</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'var(--font-tech, sans-serif)' }}>LUNAR SAMPLE MASS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#39D98A', marginTop: '2px' }}>110.4 kg</div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                handleCtaClick();
              }}
              className="landing-primary-btn"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>{isAuthenticated ? 'Open Mission Records' : 'Sign In to Access Mission Telemetry'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: ABOUT ASTROHEALTH AI POPUP ================= */}
      {activeModal === 'about' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(7, 13, 25, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              background: 'linear-gradient(135deg, rgba(16, 26, 46, 0.95), rgba(8, 14, 28, 0.98))',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8'
              }}>
                <HeartPulse size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-tech, sans-serif)', fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em' }}>
                AI MEDICAL TELEMETRY SYSTEM
              </span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>
              About AstroHealth AI
            </h3>

            <p style={{ color: 'rgba(203, 213, 225, 0.85)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
              Engineered for deep-space long-duration expeditions. Autonomous neural telemetry continuously monitors radiation exposure, cardiovascular resilience, microgravity bone demineralization, and psychological wellness in real-time.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#E2E8F0' }}>
                <Shield size={14} color="#39D98A" />
                <span>Google OAuth & Biometric encrypted session control</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#E2E8F0' }}>
                <Orbit size={14} color="#38bdf8" />
                <span>Interactive 3D anatomical organ hotspot telemetry</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#E2E8F0' }}>
                <Sparkles size={14} color="#FFB020" />
                <span>ASTRA AI robotic voice and biometric triage assistant</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModal(null);
                handleCtaClick();
              }}
              className="landing-primary-btn"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>{isAuthenticated ? 'Open Health Dashboard' : 'Get Started with Google Login'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
