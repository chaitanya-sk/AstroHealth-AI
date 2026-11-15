import React from 'react';
import { AstronautProfile } from '../../types/dashboard';
import { StatusBadge, TierBadge } from '../ui/Badge';
import { ShieldCheck, Heart, Zap, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AstronautProfileCardProps {
  astronaut: AstronautProfile;
  roster: AstronautProfile[];
  onSelectAstronaut: (astro: AstronautProfile) => void;
  className?: string;
}

export const AstronautProfileCard: React.FC<AstronautProfileCardProps> = ({
  astronaut,
  roster,
  onSelectAstronaut,
  className
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div className={cn(
      "relative h-[340px] rounded-3xl overflow-hidden border border-stone-200/60 shadow-soft group transition-all duration-300 hover:shadow-float flex flex-col justify-end",
      className
    )}>
      {/* Background Image with warm dark gradient overlay */}
      <img
        src={astronaut.avatarUrl}
        alt={astronaut.name}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

      {/* Top Floating Controls & Badges */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        {/* Crew Selector Pill Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs font-semibold hover:bg-black/60 transition-all shadow-md"
          >
            <span>{astronaut.callsign}</span>
            <ChevronDown className="h-3 w-3 text-white/80" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-[#FFFDF5] rounded-2xl border border-stone-200/80 shadow-2xl py-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold text-[#8E8E8E] uppercase tracking-wider border-b border-stone-100">
                Active Crew Roster
              </div>
              {roster.map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    onSelectAstronaut(member);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#F4F0E5] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src={member.avatarUrl} 
                      alt={member.name} 
                      className="h-6 w-6 rounded-full object-cover border border-black/10" 
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#171717]">{member.name}</span>
                      <span className="text-[10px] text-[#6E6E6E]">{member.callsign}</span>
                    </div>
                  </div>
                  {member.id === astronaut.id && (
                    <Check className="h-3.5 w-3.5 text-[#292929]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status & Tier Badges */}
        <div className="flex items-center gap-1.5">
          <TierBadge tier={astronaut.tier} subtle className="bg-black/50 text-white border-white/20 backdrop-blur-md text-[9px]" />
          <StatusBadge status={astronaut.status} size="sm" className="bg-black/50 text-white border-white/20 backdrop-blur-md" />
        </div>
      </div>

      {/* Bottom Content Bar */}
      <div className="relative z-10 p-5 flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-white tracking-tight drop-shadow-sm">
            {astronaut.name}
          </h2>
          <p className="text-xs font-medium text-white/80 drop-shadow-xs">
            {astronaut.role}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-white/70 font-mono">
            <span>Mission: {astronaut.mission}</span>
            <span>•</span>
            <span>Sol {astronaut.flightDay}</span>
          </div>
        </div>

        {/* Right Glass Badge / Pill */}
        <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 text-white flex flex-col items-center shadow-lg shrink-0">
          <span className="text-xs font-bold tracking-tight">{astronaut.id}</span>
          <span className="text-[9px] text-[#F7D85B] font-semibold uppercase tracking-wider">{astronaut.tier}</span>
        </div>
      </div>
    </div>
  );
};

