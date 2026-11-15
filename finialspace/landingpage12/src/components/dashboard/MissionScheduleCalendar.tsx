import React from 'react';
import { Calendar as CalendarIcon, Clock, Users, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MissionScheduleCalendar: React.FC = () => {
  const calendarDays = [
    { day: 'Mon', date: '22', active: false },
    { day: 'Tue', date: '23', active: false },
    { day: 'Wed', date: '24', active: false },
    { day: 'Thu', date: '25', active: true }, // active date matching reference
    { day: 'Fri', date: '26', active: false },
    { day: 'Sat', date: '27', active: false },
  ];

  return (
    <div className="bg-[#FFFDF5] rounded-3xl p-5 border border-stone-200/60 shadow-soft flex flex-col justify-between h-[340px] transition-all duration-300 hover:shadow-float">
      {/* Calendar Month & Navigation */}
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-200/60">
        <span className="text-xs font-semibold text-[#8E8E8E] cursor-pointer hover:text-[#171717] transition-colors">
          Sol 41
        </span>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-[#8A6A00]" />
          <h3 className="text-sm font-bold text-[#171717]">November 2026 • Flight Week 6</h3>
        </div>
        <span className="text-xs font-semibold text-[#8E8E8E] cursor-pointer hover:text-[#171717] transition-colors">
          Sol 43
        </span>
      </div>

      {/* Days of Week Header (Directly inspired by Mon 22 - Sat 27 in reference) */}
      <div className="grid grid-cols-6 gap-2 my-2 text-center">
        {calendarDays.map((d, i) => (
          <div 
            key={i} 
            className={cn(
              "py-1.5 px-1 rounded-2xl flex flex-col items-center gap-0.5 transition-all cursor-pointer",
              d.active 
                ? "bg-[#F7D85B] shadow-xs text-[#292929] font-black" 
                : "hover:bg-[#F4F0E5] text-[#6E6E6E]"
            )}
          >
            <span className="text-[10px] font-bold uppercase">{d.day}</span>
            <span className="text-xs font-black">{d.date}</span>
          </div>
        ))}
      </div>

      {/* Timeline Event Blocks (Directly mirroring Weekly Team Sync and Onboarding Session in reference) */}
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        {/* Event 1: Dark pill block like "Weekly Team Sync" in reference */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-[#929292] w-14 shrink-0 text-right">08:00 UTC</span>
          <div className="bg-[#292929] text-white px-3.5 py-2 rounded-2xl flex items-center justify-between flex-1 shadow-xs hover:bg-black transition-all">
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold tracking-tight truncate">Mission Medical Debrief</span>
              <span className="text-[10px] text-white/70 truncate">Autonomous AI health summary & crew vitals sync</span>
            </div>
            <div className="flex -space-x-1.5 overflow-hidden ml-2 shrink-0">
              <img 
                className="inline-block h-5 w-5 rounded-full ring-1 ring-white/30 object-cover" 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" 
                alt="Dr. Piterson" 
              />
              <img 
                className="inline-block h-5 w-5 rounded-full ring-1 ring-white/30 object-cover" 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                alt="Astronaut" 
              />
            </div>
          </div>
        </div>

        {/* Event 2: Light cream pill block like "Onboarding Session" in reference */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-[#929292] w-14 shrink-0 text-right">10:30 UTC</span>
          <div className="bg-[#F4F0E5] text-[#171717] px-3.5 py-2 rounded-2xl flex items-center justify-between flex-1 border border-stone-200/80 hover:bg-[#EBE6D8] transition-all">
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold tracking-tight truncate">Neuro-Vestibular Assessment</span>
              <span className="text-[10px] text-[#6E6E6E] truncate">Otolith tilt recalibration protocol</span>
            </div>
            <div className="flex -space-x-1.5 overflow-hidden ml-2 shrink-0">
              <img 
                className="inline-block h-5 w-5 rounded-full ring-1 ring-black/10 object-cover" 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" 
                alt="Crew Member" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between text-[10px] text-[#8E8E8E]">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-[#8A6A00]" />
          <span>Next event in 1h 45m</span>
        </span>
        <span className="font-semibold text-[#8A6A00] hover:underline cursor-pointer">
          Flight Plan Matrix →
        </span>
      </div>
    </div>
  );
};

