import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Orbit, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const processAuthCallback = async () => {
      try {
        // 1. Check for OAuth error parameters in query string or URL hash
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
            const meta = data.user.user_metadata;
            const name = meta?.full_name || meta?.name || data.user.email?.split('@')[0] || 'Operator';
            const avatar = meta?.avatar_url || meta?.picture || null;
            setUserName(name);
            setUserAvatar(avatar);

            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 600);
            return;
          }
        }

        // 3. Fallback: inspect active session directly
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          if (mounted) setErrorStatus(sessionError.message);
          return;
        }

        if (session?.user && mounted) {
          const meta = session.user.user_metadata;
          const name = meta?.full_name || meta?.name || session.user.email?.split('@')[0] || 'Operator';
          const avatar = meta?.avatar_url || meta?.picture || null;
          setUserName(name);
          setUserAvatar(avatar);

          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 600);
          return;
        }

        // 4. Listen to onAuthStateChange in case session is being restored asynchronously
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user && mounted) {
            const meta = session.user.user_metadata;
            const name = meta?.full_name || meta?.name || session.user.email?.split('@')[0] || 'Operator';
            setUserName(name);
            navigate('/dashboard', { replace: true });
          }
        });

        // 5. Safety timeout if no auth code or session arrives
        const timeoutId = setTimeout(() => {
          if (mounted && !userName) {
            setErrorStatus('Authentication timed out or no active session was returned. Please try signing in again.');
          }
        }, 8000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeoutId);
        };
      } catch (err: any) {
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
    <div className="min-h-screen bg-[#F2F3F1] text-[#20272D] flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-white rounded-[28px] shadow-dashboard border border-[#E7E9E5] p-8 text-center relative overflow-hidden atmospheric-yellow-gradient animate-in fade-in zoom-in-95 duration-200">

        {errorStatus ? (
          <div className="space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-[#D95C5C]/10 border border-[#D95C5C]/30 text-[#D95C5C] flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold font-mono text-[#20272D] tracking-tight">
                Authentication Unsuccessful
              </h2>
              <p className="text-xs text-[#78818A] leading-relaxed max-w-xs mx-auto font-sans">
                {errorStatus}
              </p>
            </div>

            <button
              onClick={() => navigate('/login', { replace: true })}
              className="mt-4 px-6 py-2.5 bg-[#20272D] hover:bg-[#323D47] text-white text-xs font-mono font-bold rounded-xl inline-flex items-center gap-2 shadow-pill transition-all cursor-pointer"
            >
              <span>RETURN TO LOGIN</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#E9C95A]" />
            </button>
          </div>
        ) : (
          <div className="space-y-4 font-mono">
            {userAvatar ? (
              <div className="relative mx-auto w-16 h-16">
                <img
                  src={userAvatar}
                  alt={userName || 'Operator'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#20272D] shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#32A889] flex items-center justify-center border-2 border-white">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              </div>
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-[#FAFAF7] border border-[#E7E9E5] text-[#20272D] flex items-center justify-center mx-auto shadow-sm">
                <Orbit className="h-7 w-7 text-[#E9C95A] animate-spin-slow" />
              </div>
            )}

            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-[#20272D] tracking-tight">
                {userName ? `Welcome, ${userName}` : 'Authenticating Session...'}
              </h2>
              <p className="text-xs text-[#78818A] font-sans">
                Restoring biomedical operations session & redirecting to dashboard
              </p>
            </div>

            {/* Spinner Progress */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="h-4 w-4 border-2 border-[#20272D] border-t-transparent rounded-full animate-spin" />
              <span className="text-[11px] font-mono font-bold text-[#20272D]">
                INITIALIZING FLIGHT TELEMETRY
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AuthCallbackPage;
