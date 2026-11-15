import React from 'react';
import { 
  Rocket, 
  Satellite, 
  Radio, 
  ChevronRight, 
  Sparkles, 
  Users, 
  Activity, 
  AlertTriangle, 
  Database,
  ArrowUpRight 
} from 'lucide-react';
import { SummaryStat } from '../../types/dashboard';
import { AstronautProfile } from '../../types/dashboard';
import { StatusBadge, TierBadge } from '../ui/Badge';
import { CURRENT_MISSION, SUMMARY_STATS } from '../../data/dashboardDemoData';
import { cn } from '../../lib/utils';

interface WelcomeSectionProps {
  selectedAstronaut: AstronautProfile;
  onAstronautSelect?: () => void;
  onStatClick?: (statId: string) => void;
  stats?: SummaryStat[];
  domainStatuses?: Record<string, string>;
  overallStatus?: string;
  dataFreshness?: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  selectedAstronaut,
  onAstronautSelect,
  onStatClick,
  stats,
  domainStatuses = {},
  overallStatus = 'INSUFFICIENT_DATA',
  dataFreshness = 'Telemetry Stream'
}) => {
  const activeStats = stats || SUMMARY_STATS;

  // Real domain assessments
  const cardioStatus = domainStatuses['cardiovascular'] || 'INSUFFICIENT_DATA';
  const immuneStatus = domainStatuses['immune'] || 'INSUFFICIENT_DATA';
  const behavioralStatus = domainStatuses['behavioral'] || 'INSUFFICIENT_DATA';
  const environmentStatus = domainStatuses['environment'] || 'INSUFFICIENT_DATA';

  return (
    <section className="w-full flex flex-col gap-4 pt-1">
      {/* Top Banner Row: Heading & Quick Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Welcome & Subtitle */}
        <div className="flex flex-col space-y-0.5 min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-black tracking-tight text-[#171717] leading-tight">
            Welcome to <span className="whitespace-nowrap">AstroHealth AI</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E6E] font-medium truncate">
            Integrated Astronaut Health Monitoring & Decision Support
          </p>
        </div>

        {/* Right Side: Real Summary Numbers */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 self-start lg:self-auto bg-[#FFFDF5] px-3.5 sm:px-4 py-2 rounded-2xl border border-stone-200/60 shadow-soft shrink-0">
          {activeStats.map((stat: SummaryStat) => (
            <div 
              key={stat.id}
              onClick={() => onStatClick?.(stat.id)}
              className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group"
            >
              <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[#F4F0E5] group-hover:bg-[#F7D85B] text-[#292929] flex items-center justify-center transition-colors shrink-0">
                {stat.id === 'active-astronauts' && <Users className="h-3 sm:h-3.5 w-3 sm:w-3.5" />}
                {stat.id === 'health-assessments' && <Activity className="h-3 sm:h-3.5 w-3 sm:w-3.5" />}
                {stat.id === 'active-alerts' && <AlertTriangle className="h-3 sm:h-3.5 w-3 sm:w-3.5" />}
                {stat.id === 'research-datasets' && <Database className="h-3 sm:h-3.5 w-3 sm:w-3.5" />}
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg lg:text-xl font-black text-[#171717] tracking-tight group-hover:text-amber-800 transition-colors leading-none">
                  {stat.value}
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium text-[#929292] leading-tight whitespace-nowrap mt-0.5">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Context Pill & Operational Domain Statuses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        {/* Mission Status Badge Pill */}
        <div className="lg:col-span-5 xl:col-span-4 flex items-center justify-between bg-[#FFFDF5] px-3.5 py-2.5 rounded-2xl border border-stone-200/60 shadow-soft">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-2 w-2 rounded-full bg-[#83A997] animate-pulse shrink-0" />
            <span className="text-xs font-bold text-[#171717] truncate">{selectedAstronaut.mission || CURRENT_MISSION.name}</span>
            <span className="text-xs text-[#929292]">•</span>
            <span className="text-xs text-[#6E6E6E] font-medium shrink-0">Sol {selectedAstronaut.flightDay || 1}</span>
            <span className="text-[10px] font-mono text-[#8A6A00] bg-[#F7D85B]/30 px-1.5 py-0.5 rounded shrink-0 hidden sm:inline">
              {selectedAstronaut.id}
            </span>
          </div>
          <TierBadge tier={selectedAstronaut.tier} subtle className="text-[9px] shrink-0 ml-2" />
        </div>

        {/* Operational Multi-System Status Readout */}
        <div className="lg:col-span-7 xl:col-span-8 bg-[#FFFDF5] p-2 rounded-2xl border border-stone-200/60 shadow-soft grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
          {/* Segment 1: Cardiovascular */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex justify-between items-center text-[10px] font-semibold text-[#6E6E6E] px-1 truncate">
              <span>Cardiovascular</span>
            </div>
            <div className={cn(
              "h-6 rounded-lg text-[10px] font-bold flex items-center justify-center uppercase px-2",
              cardioStatus === 'NORMAL' ? "bg-[#292929] text-white" : "bg-[#F7D85B] text-[#292929]"
            )}>
              {cardioStatus}
            </div>
          </div>

          {/* Segment 2: Immune Surveillance */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex justify-between items-center text-[10px] font-semibold text-[#6E6E6E] px-1 truncate">
              <span>Immune</span>
            </div>
            <div className={cn(
              "h-6 rounded-lg text-[10px] font-bold flex items-center justify-center uppercase px-2",
              immuneStatus === 'NORMAL' ? "bg-[#292929] text-white" : "bg-[#F4F0E5] text-[#8E8E8E] border border-stone-200"
            )}>
              {immuneStatus === 'INSUFFICIENT_DATA' ? 'NO DATA' : immuneStatus}
            </div>
          </div>

          {/* Segment 3: Behavioral Health */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex justify-between items-center text-[10px] font-semibold text-[#6E6E6E] px-1 truncate">
              <span>Behavioral</span>
            </div>
            <div className={cn(
              "h-6 rounded-lg text-[10px] font-bold flex items-center justify-center uppercase px-2",
              behavioralStatus === 'NORMAL' ? "bg-[#292929] text-white" : "bg-[#F4F0E5] text-[#8E8E8E] border border-stone-200"
            )}>
              {behavioralStatus === 'INSUFFICIENT_DATA' ? 'NO DATA' : behavioralStatus}
            </div>
          </div>

          {/* Segment 4: Overall Status */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex justify-between items-center text-[10px] font-semibold text-[#6E6E6E] px-1 truncate">
              <span>Overall Evaluation</span>
            </div>
            <div className="h-6 rounded-lg bg-[#FFFDF5] border border-stone-300 text-[#171717] text-[10px] font-black flex items-center justify-center uppercase shadow-inner px-1 truncate">
              {overallStatus}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
