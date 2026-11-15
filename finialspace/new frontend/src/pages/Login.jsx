import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  Activity, 
  Wind, 
  Bone, 
  Brain, 
  Radio, 
  Moon, 
  Flame, 
  ArrowRight, 
  ArrowLeft,
  Cpu,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import BiometricScanner from '../components/BiometricScanner';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuth } from '../context/AuthContext';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, isConfigured, signInWithGoogle, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Destination route after login (defaults to /dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  // Check URL parameters for OAuth errors (e.g. from redirect cancellation)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error_description') || params.get('error');
    const stateError = location.state?.error;

    if (oauthError) {
      setErrorMessage(decodeURIComponent(oauthError.replace(/\+/g, ' ')));
    } else if (stateError) {
      setErrorMessage(stateError);
    }
  }, [location]);

  // If already logged in, automatically redirect to dashboard
  useEffect(() => {
    if (user && !loading) {
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, loading, navigate, from, onLoginSuccess]);

  // Handle Google OAuth Sign In
  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setGoogleLoading(true);

    const res = await signInWithGoogle();
    if (!res.success) {
      setGoogleLoading(false);
      setErrorMessage(res.error || 'Failed to initiate Google authentication.');
    }
  };

  // Handle Email / Password Sign In
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please provide your operational email and security key.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-primary, #090B10)',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '24px'
    }} className="space-bg-grid">

      {/* Ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232, 74, 42, 0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(40px)'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 90, 54, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(50px)'
      }} />

      {/* Main Split Authentication Layout */}
      <div style={{
        maxWidth: '1240px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '40px',
        alignItems: 'center',
        zIndex: 10
      }}>

        {/* ================= LEFT SIDE: PROJECT BRANDING & PLANET TELEMETRY ================= */}
        <div style={{ padding: '16px' }}>
          {/* Logo badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF5A36 0%, #E84A2A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 90, 54, 0.5)'
            }}>
              <Flame size={26} color="#FFF" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.4rem',
                letterSpacing: '0.08em',
                lineHeight: 1.1
              }}>
                ASTRA <span style={{ color: 'var(--orange-accent, #FF5A36)' }}>HEALTH</span>
              </div>
              <div style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-tech)',
                letterSpacing: '0.08em',
                color: 'var(--text-secondary, #94A3B8)'
              }}>
                AI-Powered Astronaut Health Monitoring System
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 3.2vw, 2.7rem)',
            fontWeight: 800,
            lineHeight: '1.2',
            marginBottom: '16px',
            color: '#FFFFFF'
          }}>
            Your Health. <br />
            <span style={{
              background: 'linear-gradient(90deg, #FF5A36 0%, #F5B942 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Your Mission. Your Control.
            </span>
          </h1>

          {/* Description */}
          <p style={{
            color: 'var(--text-secondary, #94A3B8)',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            maxWidth: '520px',
            marginBottom: '32px'
          }}>
            Engineered for deep-space long-duration expeditions. Autonomous AI telemetry monitors
            radiation exposure, cardiovascular resilience, microgravity bone density loss, and neuro-behavioral
            stability in real-time.
          </p>

          {/* Futuristic Planet & Health Status Visualization Container */}
          <div style={{
            position: 'relative',
            background: 'rgba(17, 17, 19, 0.75)',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
            borderRadius: '20px',
            padding: '28px',
            overflow: 'hidden'
          }} className="glass-panel cyber-corners">

            {/* Glowing Planet & Orbit Rings */}
            <div style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
              flexWrap: 'wrap',
              gap: '20px'
            }}>

              {/* Glowing Mars Planet Visualization */}
              <div style={{
                position: 'relative',
                width: '130px',
                height: '130px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Orbit Ring 1 */}
                <div style={{
                  position: 'absolute',
                  inset: '-18px',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255, 90, 54, 0.3)',
                  animation: 'orbitRotate 20s linear infinite'
                }}>
                  {/* Satellite beacon */}
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    left: '50%',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#FFF',
                    boxShadow: '0 0 8px #FF5A36'
                  }} />
                </div>

                {/* Orbit Ring 2 */}
                <div style={{
                  position: 'absolute',
                  inset: '-6px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  animation: 'reverseOrbit 14s linear infinite'
                }} />

                {/* Mars Planet Sphere */}
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #FF7A59 0%, #D84315 50%, #7F1D1D 90%, #200505 100%)',
                  boxShadow: '0 0 35px rgba(232, 74, 42, 0.55), inset -8px -8px 20px rgba(0,0,0,0.8)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '20%',
                    width: '18px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'rgba(90, 15, 15, 0.45)',
                    transform: 'rotate(-25deg)'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '25%',
                    right: '25%',
                    width: '26px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'rgba(90, 15, 15, 0.4)'
                  }} />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    boxShadow: 'inset 2px 2px 6px rgba(255, 200, 180, 0.6)'
                  }} />
                </div>
              </div>

              {/* MISSION HEALTH Circular Score Indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ position: 'relative', width: '92px', height: '92px' }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="url(#marsGrad)"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - 0.92)}
                      strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0 0 6px #FF5A36)' }}
                    />
                    <defs>
                      <linearGradient id="marsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#35D07F" />
                        <stop offset="100%" stopColor="#FF5A36" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#FFF'
                    }}>
                      92%
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.1em',
                    color: 'var(--text-secondary, #94A3B8)'
                  }}>
                    MISSION HEALTH
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--green-safe, #35D07F)',
                    letterSpacing: '0.04em'
                  }}>
                    OPTIMAL
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted, #64748B)',
                    fontFamily: 'var(--font-tech)'
                  }}>
                    SOL 147 • 32 SENSORS ACTIVE
                  </div>
                </div>
              </div>
            </div>

            {/* 6 Small Health Indicators */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px'
            }}>
              {/* 1. Cardiovascular Health */}
              <div style={{
                background: 'rgba(24, 24, 27, 0.7)',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary, #94A3B8)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  <Activity size={13} color="var(--orange-accent, #FF5A36)" />
                  CARDIOVASCULAR
                </div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.9rem', fontWeight: 700, color: '#FFF', marginTop: '3px' }}>
                  72 BPM <span style={{ color: 'var(--green-safe, #35D07F)', fontSize: '0.72rem' }}>OPTIMAL</span>
                </div>
              </div>

              {/* 2. Oxygen Level */}
              <div style={{
                background: 'rgba(24, 24, 27, 0.7)',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary, #94A3B8)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  <Wind size={13} color="var(--blue-info, #38BDF8)" />
                  OXYGEN LEVEL
                </div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.9rem', fontWeight: 700, color: '#FFF', marginTop: '3px' }}>
                  98% <span style={{ color: 'var(--green-safe, #35D07F)', fontSize: '0.72rem' }}>SpO2</span>
                </div>
              </div>

              {/* 3. Bone Health */}
              <div style={{
                background: 'rgba(24, 24, 27, 0.7)',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary, #94A3B8)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  <Bone size={13} color="var(--orange-accent, #FF5A36)" />
                  BONE DENSITY
                </div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.9rem', fontWeight: 700, color: '#FFF', marginTop: '3px' }}>
                  98% <span style={{ color: 'var(--green-safe, #35D07F)', fontSize: '0.72rem' }}>STABLE</span>
                </div>
              </div>

              {/* 4. Mental Wellness */}
              <div style={{
                background: 'rgba(24, 24, 27, 0.7)',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary, #94A3B8)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  <Brain size={13} color="var(--yellow-warning, #FACC15)" />
                  MENTAL WELLNESS
                </div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.9rem', fontWeight: 700, color: '#FFF', marginTop: '3px' }}>
                  85% <span style={{ color: 'var(--green-safe, #35D07F)', fontSize: '0.72rem' }}>BALANCED</span>
                </div>
              </div>

              {/* 5. Radiation Exposure */}
              <div style={{
                background: 'rgba(24, 24, 27, 0.7)',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary, #94A3B8)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  <Radio size={13} color="var(--green-safe, #35D07F)" />
                  RADIATION
                </div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.9rem', fontWeight: 700, color: '#FFF', marginTop: '3px' }}>
                  0.42 <span style={{ color: 'var(--green-safe, #35D07F)', fontSize: '0.72rem' }}>mSv (LOW)</span>
                </div>
              </div>

              {/* 6. Sleep & Recovery */}
              <div style={{
                background: 'rgba(24, 24, 27, 0.7)',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary, #94A3B8)', fontSize: '0.72rem', fontFamily: 'var(--font-tech)' }}>
                  <Moon size={13} color="var(--blue-info, #38BDF8)" />
                  SLEEP & RECOVERY
                </div>
                <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.9rem', fontWeight: 700, color: '#FFF', marginTop: '3px' }}>
                  87% <span style={{ color: 'var(--green-safe, #35D07F)', fontSize: '0.72rem' }}>GOOD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: FUTURISTIC AUTHENTICATION CARD ================= */}
        <div style={{
          background: 'var(--card-bg, rgba(16, 20, 28, 0.85))',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
          borderRadius: '24px',
          padding: '36px',
          position: 'relative',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)'
        }} className="glass-panel cyber-corners">

          {/* Back to Landing Page Link */}
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94A3B8',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-tech)',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              marginBottom: '16px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--cosmic-cyan, #28B8E8)'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          >
            <ArrowLeft size={14} />
            <span>BACK TO LANDING PAGE</span>
          </Link>

          {/* Card Header */}
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <span className="badge-status badge-orange" style={{ marginBottom: '10px' }}>
              SECURITY LEVEL 4 • GOOGLE OAUTH & BIOMETRIC ENCRYPTED
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '0.04em'
            }}>
              WELCOME TO ASTRA HEALTH
            </h2>
            <p style={{
              color: 'var(--text-secondary, #94A3B8)',
              fontSize: '0.85rem',
              marginTop: '4px',
              fontFamily: 'var(--font-body)'
            }}>
              Authenticate with your Google account to access your mission health dashboard.
            </p>
          </div>

          {/* Supabase Status Pill */}
          {isConfigured ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(53, 208, 127, 0.1)',
              border: '1px solid rgba(53, 208, 127, 0.25)',
              fontSize: '0.76rem',
              fontFamily: 'var(--font-tech)',
              color: 'var(--green-safe, #35D07F)',
              marginBottom: '20px'
            }}>
              <ShieldCheck size={14} />
              <span>SUPABASE OAUTH GATEWAY CONNECTED & SECURED</span>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(245, 185, 66, 0.1)',
              border: '1px solid rgba(245, 185, 66, 0.25)',
              fontSize: '0.76rem',
              fontFamily: 'var(--font-tech)',
              color: 'var(--yellow-warning, #FACC15)',
              marginBottom: '20px'
            }}>
              <KeyRound size={14} />
              <span>Supabase credentials not detected in .env</span>
            </div>
          )}

          {/* Circular Biometric Scanner Component */}
          <div style={{ marginBottom: '22px' }}>
            <BiometricScanner
              isScanning={googleLoading || isSubmitting}
              compact={true}
            />
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div style={{
              background: 'rgba(255, 75, 75, 0.15)',
              border: '1px solid var(--red-emergency, #FF4B4B)',
              color: 'var(--red-emergency, #FF4B4B)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '18px',
              fontFamily: 'var(--font-tech)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} style={{ shrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= PRIMARY ACTION: REAL GOOGLE OAUTH ================= */}
          <div style={{ marginBottom: '20px' }}>
            <GoogleLoginButton
              onClick={handleGoogleLogin}
              loading={googleLoading}
              disabled={isSubmitting}
              text="CONTINUE WITH GOOGLE"
            />
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
            gap: '12px'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color, rgba(255, 255, 255, 0.1))' }} />
            <span style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-tech)',
              color: 'var(--text-secondary, #94A3B8)',
              letterSpacing: '0.08em'
            }}>
              OR OPERATOR CREDENTIALS
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color, rgba(255, 255, 255, 0.1))' }} />
          </div>

          {/* Operator Credentials Form */}
          <form onSubmit={handleEmailLogin}>
            {/* Work Email Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-tech)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-secondary, #94A3B8)',
                letterSpacing: '0.08em',
                marginBottom: '8px'
              }}>
                OPERATIONAL EMAIL
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{ position: 'absolute', left: '14px', color: 'var(--orange-accent, #FF5A36)' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@astrahealth.gov"
                  disabled={googleLoading || isSubmitting}
                  style={{
                    width: '100%',
                    background: 'rgba(24, 24, 27, 0.8)',
                    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                    borderRadius: '10px',
                    padding: '12px 14px 12px 42px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.95rem',
                    letterSpacing: '0.06em',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--orange-accent, #FF5A36)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color, rgba(255, 255, 255, 0.1))'}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-tech)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text-secondary, #94A3B8)',
                letterSpacing: '0.08em',
                marginBottom: '8px'
              }}>
                SECURITY CIPHER / PASSWORD
              </label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{ position: 'absolute', left: '14px', color: 'var(--orange-accent, #FF5A36)' }}>
                  <Key size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter cryptographic key"
                  disabled={googleLoading || isSubmitting}
                  style={{
                    width: '100%',
                    background: 'rgba(24, 24, 27, 0.8)',
                    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                    borderRadius: '10px',
                    padding: '12px 42px 12px 42px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-tech)',
                    fontSize: '0.95rem',
                    letterSpacing: '0.06em',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--orange-accent, #FF5A36)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color, rgba(255, 255, 255, 0.1))'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary, #94A3B8)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Authenticate Button */}
            <button
              type="submit"
              disabled={isSubmitting || googleLoading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isSubmitting || googleLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#FFF',
                    borderRadius: '50%',
                    animation: 'orbitRotate 0.8s linear infinite'
                  }} />
                  <span>VERIFYING CIPHER...</span>
                </>
              ) : (
                <>
                  <span>SIGN IN WITH EMAIL</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Badges */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-tech)',
            color: 'var(--text-secondary, #94A3B8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green-safe, #35D07F)' }} />
              <span>SYSTEM STATUS: <strong style={{ color: 'var(--green-safe, #35D07F)' }}>ONLINE</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted, #64748B)' }}>
              <Lock size={12} color="var(--orange-accent, #FF5A36)" />
              <span>ENCRYPTED SECURE ACCESS</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
