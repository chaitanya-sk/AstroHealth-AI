import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { ShieldCheck, AlertCircle, CheckCircle2, ArrowRight, Flame } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [errorStatus, setErrorStatus] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    let mounted = true;

    const processAuthCallback = async () => {
      try {
        // 1. Check for OAuth error parameters in query string or hash
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        const error = searchParams.get('error') || hashParams.get('error');
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

        if (error) {
          let message = 'Google authentication was not completed.';
          if (error === 'access_denied' || errorDescription?.includes('denied')) {
            message = 'Google sign-in was cancelled by the user.';
          } else if (errorDescription) {
            message = decodeURIComponent(errorDescription.replace(/\+/g, ' '));
          }
          if (mounted) setErrorStatus(message);
          return;
        }

        // 2. If PKCE authorization code is present in URL
        const code = searchParams.get('code');
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('Error exchanging OAuth code:', exchangeError);
            if (mounted) setErrorStatus(exchangeError.message);
            return;
          }

          if (data.session && data.user && mounted) {
            const meta = data.user.user_metadata || {};
            const name = meta.full_name || meta.name || data.user.email?.split('@')[0] || 'Astronaut';
            const avatar = meta.avatar_url || meta.picture || null;
            setUserName(name);
            setUserAvatar(avatar);

            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 600);
            return;
          }
        }

        // 3. Inspect active session directly (e.g. hash fragments automatically processed by supabase)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          if (mounted) setErrorStatus(sessionError.message);
          return;
        }

        if (session?.user && mounted) {
          const meta = session.user.user_metadata || {};
          const name = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Astronaut';
          const avatar = meta.avatar_url || meta.picture || null;
          setUserName(name);
          setUserAvatar(avatar);

          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 600);
          return;
        }

        // 4. Listen to onAuthStateChange in case session is being processed asynchronously
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user && mounted) {
            const meta = session.user.user_metadata || {};
            const name = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Astronaut';
            setUserName(name);
            navigate('/dashboard', { replace: true });
          }
        });

        // 5. Fallback safety timeout if no session arrives
        const timeoutId = setTimeout(() => {
          if (mounted && !userName) {
            setErrorStatus('Authentication timed out or no active session was returned. Please try signing in again.');
          }
        }, 8000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeoutId);
        };
      } catch (err) {
        if (mounted) {
          setErrorStatus(err.message || 'An unexpected error occurred during Google authentication callback.');
        }
      }
    };

    processAuthCallback();

    return () => {
      mounted = false;
    };
  }, [navigate]);

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
        overflow: 'hidden',
      }}
      className="space-bg-grid"
    >
      {/* Background ambient radial glows */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(40, 184, 232, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 90, 54, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
        }}
      />

      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          background: 'var(--card-bg, rgba(16, 20, 28, 0.85))',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
          borderRadius: '24px',
          padding: '36px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.65)',
          position: 'relative',
          zIndex: 10,
        }}
        className="glass-panel cyber-corners"
      >
        {/* Brand header */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF5A36 0%, #E84A2A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 90, 54, 0.5)',
            }}
          >
            <Flame size={24} color="#FFF" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.25rem',
                letterSpacing: '0.08em',
                lineHeight: 1.1,
              }}
            >
              ASTRA <span style={{ color: 'var(--orange-accent, #FF5A36)' }}>HEALTH</span>
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-tech)',
                letterSpacing: '0.08em',
                color: 'var(--text-secondary, #94A3B8)',
              }}
            >
              Google OAuth Handshake
            </div>
          </div>
        </div>

        {errorStatus ? (
          <div>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'rgba(255, 75, 75, 0.15)',
                border: '1px solid var(--red-emergency, #FF4B4B)',
                color: 'var(--red-emergency, #FF4B4B)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
              }}
            >
              <AlertCircle size={32} />
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#FFF',
                marginBottom: '8px',
              }}
            >
              AUTHENTICATION FAILED
            </h2>
            <p
              style={{
                fontSize: '0.84rem',
                color: 'var(--text-secondary, #94A3B8)',
                marginBottom: '24px',
                lineHeight: 1.5,
              }}
            >
              {errorStatus}
            </p>

            <button
              onClick={() => navigate('/login', { replace: true })}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>RETURN TO LOGIN</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div>
            {userAvatar ? (
              <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 18px' }}>
                <img
                  src={userAvatar}
                  alt={userName || 'Astronaut'}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    objectCover: 'cover',
                    border: '2px solid var(--cosmic-cyan, #28B8E8)',
                    boxShadow: '0 0 20px rgba(40, 184, 232, 0.4)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--green-safe, #35D07F)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #090B10',
                  }}
                >
                  <CheckCircle2 size={14} color="#000" />
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'rgba(40, 184, 232, 0.15)',
                  border: '1px solid var(--cosmic-cyan, #28B8E8)',
                  color: 'var(--cosmic-cyan, #28B8E8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <ShieldCheck size={32} />
              </div>
            )}

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#FFF',
                marginBottom: '8px',
              }}
            >
              {userName ? `Welcome, ${userName}` : 'Verifying Google Credentials...'}
            </h2>
            <p
              style={{
                fontSize: '0.84rem',
                color: 'var(--text-secondary, #94A3B8)',
                marginBottom: '20px',
              }}
            >
              Establishing secure cryptographic session & redirecting to mission dashboard.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                background: 'rgba(40, 184, 232, 0.1)',
                border: '1px solid rgba(40, 184, 232, 0.25)',
                color: 'var(--cosmic-cyan, #28B8E8)',
                fontFamily: 'var(--font-tech)',
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid rgba(40, 184, 232, 0.3)',
                  borderTopColor: 'var(--cosmic-cyan, #28B8E8)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <span>INITIALIZING FLIGHT TELEMETRY...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
