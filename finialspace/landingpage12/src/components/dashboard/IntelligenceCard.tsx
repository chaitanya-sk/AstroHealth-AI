import React from 'react';
import { 
  Sparkles, 
  Clock, 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle,
  FileText,
  Info
} from 'lucide-react';
import { INTELLIGENCE_DATA } from '../../data/dashboardDemoData';
import { StatusBadge, TierBadge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export const IntelligenceCard: React.FC = () => {
  return (
    <div className="bg-[#FFFDF5] rounded-3xl p-6 border border-stone-200/60 shadow-soft relative overflow-hidden">
      {/* Decorative Warm Yellow Glow in Corner */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#F7D85B]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200/60">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#292929] text-[#F7D85B] flex items-center justify-center shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-[#171717] tracking-tight">
                Integrated Health Intelligence
              </h3>
              <TierBadge tier="SIMULATED" subtle className="text-[9px]" />
            </div>
            <p className="text-xs text-[#6E6E6E] font-medium mt-0.5">
              Multi-domain autonomous sensor fusion & physiological decision support
            </p>
          </div>
        </div>

        {/* Status & Timestamp Capsule */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#F4F0E5] px-3 py-1.5 rounded-full border border-stone-200/60 text-xs font-mono text-[#6E6E6E]">
            <Clock className="h-3.5 w-3.5 text-[#929292]" />
            <span>Cycle: {INTELLIGENCE_DATA.lastAssessmentTimestamp}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#6E6E6E]">Overall Status:</span>
            <StatusBadge status={INTELLIGENCE_DATA.overallAssessment} size="md" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: Explainable Summary & Domain Badges (Col 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          {/* Explainable Summary Box */}
          <div className="bg-[#F4F0E5]/60 p-4.5 rounded-2xl border border-stone-200/60 relative">
            <div className="flex items-center gap-2 text-xs font-bold text-[#171717] uppercase tracking-wider mb-2">
              <Brain className="h-4 w-4 text-[#8A6A00]" />
              <span>Diagnostic Rationale & Explainability</span>
            </div>
            <p className="text-xs sm:text-sm text-[#292929] leading-relaxed font-normal">
              {INTELLIGENCE_DATA.explainableSummary}
            </p>
            <div className="mt-3 pt-2 border-t border-stone-200/40 flex items-center justify-between text-[11px] text-[#8E8E8E]">
              <span>Bio-AI Confidence Score: 94.2%</span>
              <span className="font-mono">{INTELLIGENCE_DATA.assessmentCycle}</span>
            </div>
          </div>

          {/* Domain-wise Status Summary Pills */}
          <div>
            <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-2.5">
              Domain-Wise Status Matrix
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INTELLIGENCE_DATA.domainStatuses.map((ds, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-2.5 rounded-2xl border border-stone-200/70 flex items-center justify-between gap-1 shadow-2xs"
                >
                  <span className="text-xs font-semibold text-[#171717] truncate">
                    {ds.domain}
                  </span>
                  <StatusBadge status={ds.status} size="sm" showDot={false} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Key Observations & Recommended Countermeasures (Col 5) */}
        <div className="lg:col-span-5 bg-[#F4F0E5]/40 p-4.5 rounded-2xl border border-stone-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-[#C79A00]" />
                <span>Primary Findings & Actions</span>
              </h4>
              <span className="text-[10px] font-mono text-[#8E8E8E]">
                3 Findings Logged
              </span>
            </div>

            <div className="space-y-3">
              {INTELLIGENCE_DATA.criticalObservations.map((obs) => (
                <div 
                  key={obs.id} 
                  className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[#171717] leading-snug">
                      {obs.observation}
                    </span>
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded font-mono uppercase shrink-0",
                      obs.severity === 'MEDIUM' ? 'bg-[#F7D85B]/40 text-[#8A6A00]' : 'bg-stone-100 text-[#6E6E6E]'
                    )}>
                      {obs.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6E6E6E] leading-normal">
                    {obs.clinicalRationale}
                  </p>

                  <div className="pt-1.5 mt-1 border-t border-stone-100 flex items-start gap-1.5 text-[11px] text-[#4A725F] font-semibold">
                    <ArrowRight className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>{obs.actionItem}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Notice Disclaimer */}
          <div className="mt-4 pt-3 border-t border-stone-200 text-[10px] text-[#8E8E8E] leading-normal flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 text-[#929292] shrink-0 mt-0.5" />
            <span>
              Decision support outputs are clinical advisory estimates based on simulated astronaut biosensors. Final countermeasure actions require confirmation by Flight Surgeon.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
