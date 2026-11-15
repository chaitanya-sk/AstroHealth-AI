import React from 'react';
import { Link } from 'react-router-dom';
import { User, ArrowRight, Activity } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans flex flex-col justify-between selection:bg-[#38bdf8] selection:text-black">
      
      {/* 1. Cinematic Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="/images/space-bg.jpg"
          alt="AstroHealth AI Cinematic Space Background"
          className="w-full h-full object-cover object-[center_bottom] sm:object-center select-none"
        />
        {/* Subtle center atmospheric vignette for maximum typography contrast */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 38%, rgba(0, 5, 18, 0.35) 0%, rgba(0, 5, 18, 0) 70%)'
          }}
        />
      </div>

      {/* 2. Top Floating Navigation Bar */}
      <header className="relative z-40 w-full pt-6 px-4 flex justify-center">
        <nav className="w-full max-w-[780px] h-[54px] px-3 sm:px-6 rounded-full bg-[#080D19]/60 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.65)] flex items-center justify-between transition-all">
          
          {/* Left: Official Astra Health Logo */}
          <div className="flex items-center">
            <img
              src="/images/astra-health-logo.png"
              alt="Astra Health Logo"
              className="h-7 sm:h-8 md:h-[34px] w-auto max-w-[150px] sm:max-w-[190px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.7)] select-none cursor-pointer"
            />
          </div>

          {/* Vertical Divider */}
          <div className="h-4 w-[1px] bg-white/20 mx-1 sm:mx-3" />

          {/* Center Links: Home, Mission, About */}
          <div className="flex items-center gap-4 sm:gap-8">
            {/* Home with active electric-blue glowing line */}
            <a
              href="#"
              className="relative text-white font-medium text-xs sm:text-sm tracking-wide transition-opacity hover:opacity-100"
            >
              <span>Home</span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#38bdf8] rounded-full shadow-[0_0_10px_#38bdf8]" />
            </a>

            <a
              href="#mission"
              className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm tracking-wide font-normal"
            >
              Mission
            </a>

            <a
              href="#about"
              className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm tracking-wide font-normal"
            >
              About
            </a>
          </div>

          {/* Right: Login Button */}
          <div className="flex items-center pl-1 sm:pl-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 rounded-full bg-gradient-to-r from-[#1865ff] via-[#1d74ff] to-[#2aa0ff] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_16px_rgba(24,101,255,0.6)] hover:shadow-[0_0_24px_rgba(24,101,255,0.85)] hover:scale-[1.03] transition-all"
            >
              <User className="w-3.5 h-3.5 text-white" />
              <span>Login</span>
            </Link>
          </div>

        </nav>
      </header>

      {/* 3. Hero Content (Centered Horizontally) */}
      <main className="relative z-30 flex-1 flex flex-col items-center justify-center text-center px-4 pt-10 pb-28 sm:pb-36 max-w-4xl mx-auto">
        
        {/* Small Rounded Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.12)]">
          <Activity className="w-3.5 h-3.5 text-[#38bdf8] animate-pulse" />
          <span className="text-xs sm:text-[13px] text-slate-200 font-medium tracking-wider uppercase">
            Astronaut Health Monitoring
          </span>
        </div>

        {/* Main Heading: AstroHealth (white) + AI (electric blue) */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-bold tracking-tight text-white leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          AstroHealth{' '}
          <span className="text-[#0088ff] bg-gradient-to-r from-[#0084ff] to-[#38bdf8] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,132,255,0.7)]">
            AI
          </span>
        </h1>

        {/* Second Heading: Tagline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-wide mt-3 sm:mt-4 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]">
          Monitor. Predict. Protect.
        </h2>

        {/* Description: 2 centered lines */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-[17px] text-slate-300/85 font-light leading-relaxed max-w-md sm:max-w-xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          Intelligent health monitoring for astronauts<br className="hidden sm:inline" /> in long-duration space missions.
        </p>

        {/* 4. Main Prominent Button */}
        <div className="mt-8 sm:mt-9">
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#1865ff] via-[#1d74ff] to-[#2aa0ff] text-white text-base sm:text-[17px] font-medium tracking-wide shadow-[0_0_32px_rgba(24,101,255,0.65),0_0_16px_rgba(42,160,255,0.45)] hover:shadow-[0_0_48px_rgba(24,101,255,0.9),0_0_24px_rgba(42,160,255,0.7)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
          >
            <span>Login to Dashboard</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

      </main>

      {/* Bottom Spacer to balance composition with Earth Curvature */}
      <div className="relative z-20 h-10 sm:h-16 pointer-events-none" />

    </div>
  );
};
