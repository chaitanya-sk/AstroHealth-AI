import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Laptop, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle,
  Activity,
  Shield,
  Wind,
  Dumbbell
} from 'lucide-react';
import { DAILY_SCHEDULE_ITEMS } from '../../data/dashboardDemoData';
import { cn } from '../../lib/utils';

export const QuickScheduleTimeline: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('devices');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  // Calendar days matching reference image
  const calendarDays = [
    { day: 'Mon', date: '22', active: false },
    { day: 'Tue', date: '23', active: false },
    { day: 'Wed', date: '24', active: false },
    { day: 'Thu', date: '25', active: true }, // active date
    { day: 'Fri', date: '26', active: false },
    { day: 'Sat', date: '27', active: false },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
      {/* Left Column: Expandable System Panels (Matching reference: Pension contributions, Devices, Compensation) */}
      <div className="lg:col-span-4 bg-[#FFFDF5] rounded-3xl p-5 border border-stone-200/60 shadow-soft flex flex-col justify-between">
        <div className="space-y-3">
          {/* Item 1: Cardiovascular Telemetry */}
          <div className="border-b border-stone-200/70 pb-2.5">
            <button 
              onClick={() => toggleSection('cardio')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-[#6E6E6E]" />
                <span className="text-xs font-bold text-[#171717] group-hover:text-amber-800 transition-colors">
                  Cardiovascular Hemodynamics
                </span>
              </div>
              {expandedSection === 'cardio' ? (
                <ChevronUp className="h-3.5 w-3.5 text-[#929292]" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-[#929292]" />
              )}
            </button>
            {expandedSection === 'cardio' && (
              <div className="mt-2 text-[11px] text-[#6E6E6E] pl-5.5 space-y-1 animate-in fade-in duration-150">
                <p>Stroke Volume: 78 mL • Arterial Tone: 114/72 mmHg</p>
                <p className="text-[#83A997] font-semibold">Pulse wave velocity within nominal range</p>
              </div>
            )}
          </div>

          {/* Item 2: Devices / Bio-Sensors (Expanded in reference: MacBook Air) */}
          <div className="border-b border-stone-200/70 pb-2.5">
            <button 
              onClick={() => toggleSection('devices')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2">
                <Laptop className="h-3.5 w-3.5 text-[#6E6E6E]" />
                <span className="text-xs font-bold text-[#171717] group-hover:text-amber-800 transition-colors">
                  Telemetry Hardware & Sensors
                </span>
              </div>
              {expandedSection === 'devices' ? (
                <ChevronUp className="h-3.5 w-3.5 text-[#929292]" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-[#929292]" />
              )}
            </button>
            {expandedSection === 'devices' && (
              <div className="mt-2.5 bg-[#F4F0E5]/70 p-2.5 rounded-2xl border border-stone-200/60 flex items-center justify-between animate-in fade-in duration-150">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-[#292929] flex items-center justify-center text-[#F7D85B] font-mono text-[10px] font-bold">
                    CPD
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#171717]">BioMonitor Band-04</span>
                    <span className="text-[10px] text-[#8E8E8E]">Firmware v4.8 • 98% Battery</span>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-[#83A997]" title="Sensor Connected" />
              </div>
            )}
          </div>

          {/* Item 3: ECLSS Life Support */}
          <div className="border-b border-stone-200/70 pb-2.5">
            <button 
              onClick={() => toggleSection('eclss')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2">
                <Wind className="h-3.5 w-3.5 text-[#6E6E6E]" />
                <span className="text-xs font-bold text-[#171717] group-hover:text-amber-800 transition-colors">
                  ECLSS Life Support Scrubbing
                </span>
              </div>
              {expandedSection === 'eclss' ? (
                <ChevronUp className="h-3.5 w-3.5 text-[#929292]" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-[#929292]" />
              )}
            </button>
            {expandedSection === 'eclss' && (
              <div className="mt-2 text-[11px] text-[#6E6E6E] pl-5.5 space-y-1 animate-in fade-in duration-150">
                <p>ppCO2: 2.34 mmHg (Target &lt; 3.0 mmHg)</p>
                <p className="text-[#83A997] font-semibold">Dual CDRA scrubbing beds nominal</p>
              </div>
            )}
          </div>

          {/* Item 4: Countermeasures Protocols */}
          <div>
            <button 
              onClick={() => toggleSection('countermeasures')}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2">
                <Dumbbell className="h-3.5 w-3.5 text-[#6E6E6E]" />
                <span className="text-xs font-bold text-[#171717] group-hover:text-amber-800 transition-colors">
                  ARED Countermeasures Regimen
                </span>
              </div>
              {expandedSection === 'countermeasures' ? (
                <ChevronUp className="h-3.5 w-3.5 text-[#929292]" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-[#929292]" />
              )}
            </button>
            {expandedSection === 'countermeasures' && (
              <div className="mt-2 text-[11px] text-[#6E6E6E] pl-5.5 space-y-1 animate-in fade-in duration-150">
                <p>Scheduled: 145kg squat equivalent • 40m cycle</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center & Right Column: Interactive Mission Schedule Calendar (Matching reference: September 2024, Mon 22 - Sat 27, Events) */}
      <div className="lg:col-span-8 bg-[#FFFDF5] rounded-3xl p-5 border border-stone-200/60 shadow-soft flex flex-col justify-between">
        {/* Calendar Month & Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/60">
          <span className="text-xs font-semibold text-[#8E8E8E] cursor-pointer hover:text-[#171717]">
            Sol 41
          </span>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-[#8A6A00]" />
            <h3 className="text-sm font-bold text-[#171717]">November 2026 • Flight Week 6</h3>
          </div>
          <span className="text-xs font-semibold text-[#8E8E8E] cursor-pointer hover:text-[#171717]">
            Sol 43
          </span>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-6 gap-2 my-3 text-center">
          {calendarDays.map((d, i) => (
            <div 
              key={i} 
              className={cn(
                "p-2 rounded-2xl flex flex-col items-center gap-0.5 transition-all cursor-pointer",
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

        {/* Timeline Event Blocks (Directly mirroring reference: Weekly Team Sync, Onboarding Session) */}
        <div className="space-y-2 mt-1">
          {/* Event 1: Dark pill block like "Weekly Team Sync" in reference */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-[#929292] w-14 shrink-0">08:00 UTC</span>
            <div className="bg-[#292929] text-white px-4 py-2.5 rounded-2xl flex items-center justify-between flex-1 shadow-xs hover:bg-black transition-all">
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-tight">Mission Medical Debrief</span>
                <span className="text-[10px] text-white/70">Autonomous AI health summary & crew vitals sync</span>
              </div>
              <div className="flex -space-x-1.5 overflow-hidden ml-3">
                <img 
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-[#292929] object-cover" 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" 
                  alt="Lora" 
                />
                <img 
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-[#292929] object-cover" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                  alt="Marcus" 
                />
              </div>
            </div>
          </div>

          {/* Event 2: Light cream pill block like "Onboarding Session" in reference */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-[#929292] w-14 shrink-0">11:30 UTC</span>
            <div className="bg-white border border-stone-200 text-[#171717] px-4 py-2.5 rounded-2xl flex items-center justify-between flex-1 shadow-soft hover:border-stone-300 transition-all">
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-tight">ARED Countermeasures & T2 Interval</span>
                <span className="text-[10px] text-[#6E6E6E]">Cardiovascular & bone density maintenance protocol</span>
              </div>
              <div className="flex -space-x-1.5 overflow-hidden ml-3">
                <img 
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" 
                  alt="Elena" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

