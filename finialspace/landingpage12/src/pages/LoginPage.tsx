import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Orbit, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ShieldCheck, 
  ChevronLeft, 
  KeyRound, 
  UserPlus, 
  LogIn, 
  Eye, 
  EyeOff, 
  MailCheck, 
  Check 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, signUp, signInWithGoogle, isConfigured, loading } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Where to redirect after login (defaults to /app/dashboard)
  const from = (location.state as any)?.from?.pathname || '/app/dashboard';

  // Check URL search params or location state for errors (e.g. from OAuth redirect cancellation)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error_description') || params.get('error');
    const stateError = (location.state as any)?.error;

    if (oauthError) {
      setErrorMessage(decodeURIComponent(oauthError.replace(/\+/g, ' ')));
    } else if (stateError) {
      setErrorMessage(stateError);
    }
  }, [location]);

  // Automatically redirect if already signed in
  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    const res = await signInWithGoogle();
    if (!res.success) {
      setGoogleLoading(false);
      setErrorMessage(res.error || 'Failed to start Google sign-in.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (mode === 'signup') {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setErrorMessage('Please enter your full name and title (minimum 2 characters).');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }

      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your password confirmation.');
        return;
      }

      setSubmitting(true);
      const res = await signUp(email, password, fullName);
      setSubmitting(false);

      if (res.success) {
        if (res.requiresEmailVerification) {
          setSuccessNotice(
            res.message || 'Registration successful! A verification link has been sent to your email. Please verify before signing in.'
          );
          setMode('signin');
          setPassword('');
          setConfirmPassword('');
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    } else {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        return;
      }

      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }

      setSubmitting(true);
      const res = await login(email, password);
      setSubmitting(false);

      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F3F1] p-3 sm:p-6 md:p-8 flex items-center justify-center select-none text-[#20272D]">
      {/* Centered Modal-like Canvas */}
      <div className="w-full max-w-lg bg-white rounded-[28px] shadow-dashboard border border-[#E7E9E5] p-6 sm:p-9 relative overflow-hidden atmospheric-yellow-gradient transition-all">

        {/* Back Link */}
        <Link 
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#78818A] hover:text-[#20272D] mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>BACK TO MISSION OVERVIEW</span>
        </Link>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-11 w-11 rounded-xl bg-[#20272D] text-white flex items-center justify-center shadow-sm">
            <Orbit className="h-5 w-5 text-[#E9C95A] animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono text-[#20272D] tracking-tight">
              AstroHealth AI Portal
            </h1>
            <p className="text-xs text-[#78818A] font-mono">
              Flight Surgeon & Biomedical Operations Sign In
            </p>
          </div>
        </div>

        {/* Supabase Status / Guidance Box */}
        {isConfigured ? (
          <div className="bg-[#32A889]/10 border border-[#32A889]/30 p-3.5 rounded-xl mb-4 text-xs font-mono text-[#32A889] flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[#32A889] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-[#20272D] block">Supabase Client Connected</span>
              <p className="text-[11px] text-[#78818A]">
                OAuth identity providers and encrypted sessions are active.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#F5F2E9] border border-[#E9C95A]/40 p-4 rounded-xl mb-4 text-xs font-mono text-[#20272D] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#E7A83C] uppercase tracking-wider text-[11px]">
              <KeyRound className="h-4 w-4 text-[#E7A83C]" />
              <span>Supabase Authentication</span>
            </div>
            <p className="text-[11px] text-[#78818A] leading-relaxed font-sans">
              Sign in with your configured identity provider or test credentials.
            </p>
          </div>
        )}

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex items-center p-1 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] mb-4 font-mono">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); setSuccessNotice(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signin' ? 'bg-[#20272D] text-white shadow-pill' : 'text-[#78818A] hover:text-[#20272D]'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessNotice(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signup' ? 'bg-[#20272D] text-white shadow-pill' : 'text-[#78818A] hover:text-[#20272D]'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Register Operator</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-[#D95C5C]/10 border border-[#D95C5C]/30 p-3 rounded-xl text-xs font-mono text-[#D95C5C] flex items-start gap-2 mb-4 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successNotice && (
          <div className="bg-[#32A889]/10 border border-[#32A889]/30 p-3.5 rounded-xl text-xs font-mono text-[#32A889] flex items-start gap-2.5 mb-4 animate-in fade-in">
            <MailCheck className="h-5 w-5 text-[#32A889] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#20272D] block">Confirmation Email Sent</span>
              <p className="text-[11px] text-[#78818A] leading-relaxed">{successNotice}</p>
            </div>
          </div>
        )}

        {/* Google OAuth Action Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || submitting}
          className="w-full py-2.5 px-4 bg-white hover:bg-[#FAFAF7] border border-[#E7E9E5] hover:border-[#20272D] rounded-xl text-xs font-mono font-bold text-[#20272D] flex items-center justify-center gap-2.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer mb-4"
        >
          {googleLoading ? (
            <div className="h-4 w-4 border-2 border-[#20272D] border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          )}
          <span>{googleLoading ? 'Redirecting to Google...' : (mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google')}</span>
        </button>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E7E9E5]" />
          </div>
          <span className="relative px-3 bg-white text-[10px] font-mono font-bold text-[#78818A] uppercase tracking-wider">
            OR CONTINUE WITH EMAIL
          </span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-[#20272D] mb-1.5">
                FULL NAME & TITLE <span className="text-[#D95C5C]">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Lora Piterson, Flight Surgeon"
                className="w-full px-4 py-2.5 bg-[#FAFAF7] border border-[#E7E9E5] rounded-xl text-xs text-[#20272D] placeholder-[#78818A]/60 focus:outline-none focus:border-[#20272D] transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#20272D] mb-1.5">
              WORK EMAIL ADDRESS <span className="text-[#D95C5C]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78818A]">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@astrohealth.nasa.gov"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAF7] border border-[#E7E9E5] rounded-xl text-xs text-[#20272D] placeholder-[#78818A]/60 focus:outline-none focus:border-[#20272D] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20272D] mb-1.5">
              PASSWORD {mode === 'signup' && <span className="text-[#78818A] font-normal">(min 6 characters)</span>} <span className="text-[#D95C5C]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78818A]">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#FAFAF7] border border-[#E7E9E5] rounded-xl text-xs text-[#20272D] placeholder-[#78818A]/60 focus:outline-none focus:border-[#20272D] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#78818A] hover:text-[#20272D] transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-[#20272D] mb-1.5">
                CONFIRM PASSWORD <span className="text-[#D95C5C]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78818A]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAFAF7] border border-[#E7E9E5] rounded-xl text-xs text-[#20272D] placeholder-[#78818A]/60 focus:outline-none focus:border-[#20272D] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#78818A] hover:text-[#20272D] transition-colors cursor-pointer"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || loading || googleLoading}
            className="w-full py-3 bg-[#20272D] hover:bg-[#323D47] text-white text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-2 shadow-pill transition-all disabled:opacity-50 mt-3 cursor-pointer"
          >
            <span>
              {submitting 
                ? (mode === 'signin' ? 'AUTHENTICATING...' : 'REGISTERING...') 
                : (mode === 'signin' ? 'SIGN IN TO OPERATIONS PORTAL' : 'REGISTER OPERATOR ACCOUNT')}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-[#E9C95A]" />
          </button>
        </form>

        {/* Security and Architectural Notice */}
        <div className="mt-6 pt-4 border-t border-[#E7E9E5] text-[10px] font-mono text-[#78818A] leading-normal flex items-start gap-1.5">
          <Info className="h-3.5 w-3.5 text-[#45BFD2] shrink-0 mt-0.5" />
          <span>
            Protected with Supabase PKCE tokens & row-level security. Never exposes <code className="text-[#E7A83C]">service_role</code> keys.
          </span>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
