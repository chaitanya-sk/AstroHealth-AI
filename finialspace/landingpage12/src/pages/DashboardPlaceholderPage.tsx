import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Orbit, LogOut, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPlaceholderPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-[#070B14] text-white font-sans flex flex-col justify-between selection:bg-[#38bdf8] selection:text-black relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(24, 101, 255, 0.12) 0%, rgba(7, 11, 20, 0) 70%)'
          }}
        />
      </div>

      {/* Top Header */}
      <header className="relative z-20 w-full px-6 py-5 flex items-center justify-between border-b border-white/10 bg-[#0A101D]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-sky-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.25)]">
            <Orbit className="w-4 h-4 text-[#38bdf8]" />
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">
            AstroHealth AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Authenticated: <span className="text-slate-200">{user.email}</span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Placeholder Container */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 py-16 max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center mb-6 shadow-[0_0_24px_rgba(56,189,248,0.2)]">
          <Shield className="w-7 h-7 text-[#38bdf8]" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
          AstroHealth AI Dashboard
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-light mb-8 max-w-md">
          Mission dashboard is currently under development.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-sm text-slate-200 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Landing Page</span>
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#1865ff] to-[#2aa0ff] text-white text-sm font-medium shadow-[0_0_20px_rgba(24,101,255,0.4)] hover:shadow-[0_0_28px_rgba(24,101,255,0.6)] transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full py-4 text-center border-t border-white/5 text-xs text-slate-500 font-mono">
        AstroHealth AI • Astronaut Health Monitoring Platform
      </footer>

    </div>
  );
};
