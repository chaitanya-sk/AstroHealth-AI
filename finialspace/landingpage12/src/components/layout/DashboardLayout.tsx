import React from 'react';
import { AppHeader } from './AppHeader';
import { useAstronaut } from '../../contexts/AstronautContext';
import { ShieldCheck, Orbit, CheckCircle2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { activeAstronaut } = useAstronaut();

  return (
    <div className="min-h-screen bg-[#F2F3F1] text-[#20272D] antialiased flex flex-col p-3 sm:p-5 lg:p-6 selection:bg-[#E9C95A]/30 selection:text-[#20272D]">
      {/* 1. Horizontal Navigation Bar (Image 3 Style) */}
      <AppHeader />

      {/* 2. Large Rounded Main Dashboard Container (Image 3 Style) */}
      <div className="flex-1 w-full max-w-[1680px] mx-auto bg-[#FAFAF7] rounded-dashboard border border-[#E7E9E5] dashboard-container-shadow overflow-hidden relative atmospheric-yellow-gradient flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1 p-5 sm:p-7 lg:p-9 min-w-0">
          {children}
        </main>

        {/* Clean, Minimalist Scientific Footer */}
        <footer className="px-6 sm:px-9 py-4 border-t border-[#E7E9E5]/70 bg-white/50 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#78818A] font-mono">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#32A889]" />
            <span className="font-semibold text-[#20272D]">ASTROHEALTH AI</span>
            <span>•</span>
            <span>Aerospace Biomedical Intelligence Platform</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Subject: {activeAstronaut.name} ({activeAstronaut.id})</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>FastAPI: 127.0.0.1:8000</span>
            <span>•</span>
            <span className="text-[#32A889] font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Verified Schema Governance
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
