import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Laptop, 
  Activity, 
  Wind, 
  Dumbbell, 
  Radio, 
  CheckCircle2, 
  MoreVertical,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { HealthRecordResponse } from '../../types/api';

interface SystemsAccordionProps {
  records?: HealthRecordResponse[];
  domainStatuses?: Record<string, string>;
}

export const SystemsAccordion: React.FC<SystemsAccordionProps> = ({ records = [], domainStatuses = {} }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('devices');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  const hrRecord = records.find(r => r.indicator === 'heart_rate');
  const sensorSource = records[0]?.source || 'wearable_ecg_patch';
  const cardioStatus = domainStatuses['cardiovascular'] || (records.length > 0 ? 'NORMAL' : 'INSUFFICIENT_DATA');
  const eclssStatus = domainStatuses['environment'] || 'INSUFFICIENT_DATA';
  const muscleStatus = domainStatuses['bone_muscle'] || 'INSUFFICIENT_DATA';

  return (
    <div className="bg-[#FFFDF5] rounded-3xl p-5 border border-stone-200/60 shadow-soft flex flex-col justify-between h-[340px] transition-all duration-300 hover:shadow-float">
      <div className="space-y-2.5">
        {/* Item 1: Cardiovascular Hemodynamics */}
        <div className="border-b border-stone-200/70 pb-2">
          <button 
            type="button"
            onClick={() => toggleSection('cardio')}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
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
            <div className="mt-2 text-[11px] text-[#6E6E6E] pl-5 space-y-0.5 animate-in fade-in duration-150">
              {hrRecord ? (
                <>
                  <p>Heart Rate: <strong className="text-[#171717]">{hrRecord.value} {hrRecord.unit}</strong></p>
                  <p className="text-[#83A997] font-semibold">{cardioStatus} Baseline • Telemetry Verified</p>
                </>
              ) : (
                <p className="text-[#8A6A00] font-mono">STATUS: INSUFFICIENT_DATA</p>
              )}
            </div>
          )}
        </div>

        {/* Item 2: Devices / Bio-Sensors */}
        <div className="border-b border-stone-200/70 pb-2">
          <button 
            type="button"
            onClick={() => toggleSection('devices')}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Laptop className="h-3.5 w-3.5 text-[#6E6E6E]" />
              <span className="text-xs font-bold text-[#171717] group-hover:text-amber-800 transition-colors">
                Telemetry Bio-Sensors
              </span>
            </div>
            {expandedSection === 'devices' ? (
              <ChevronUp className="h-3.5 w-3.5 text-[#929292]" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-[#929292]" />
            )}
          </button>
          {expandedSection === 'devices' && (
            <div className="mt-2 bg-[#F4F0E5]/70 p-2.5 rounded-2xl border border-stone-200/60 flex items-center justify-between animate-in fade-in duration-150">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-[#292929] flex items-center justify-center text-[#F7D85B] font-mono text-[10px] font-black shadow-inner">
                  ECG
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#171717]">{sensorSource}</span>
                  <span className="text-[10px] text-[#8E8E8E]">FastAPI Ingest • {records.length > 0 ? 'Active Feed' : 'Pending Downlink'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", records.length > 0 ? "bg-[#83A997] animate-pulse" : "bg-[#C79A00]")} />
                <MoreVertical className="h-3.5 w-3.5 text-[#929292]" />
              </div>
            </div>
          )}
        </div>

        {/* Item 3: ECLSS Life Support Scrubbing */}
        <div className="border-b border-stone-200/70 pb-2">
          <button 
            type="button"
            onClick={() => toggleSection('eclss')}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
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
            <div className="mt-2 text-[11px] text-[#6E6E6E] pl-5 space-y-0.5 animate-in fade-in duration-150">
              <p>Atmospheric Telemetry Status: <strong className="text-[#8A6A00] font-mono">{eclssStatus}</strong></p>
              <p className="text-[10px] text-[#8E8E8E]">NASA-STD-3001 Vol 2 Reference Guidelines</p>
            </div>
          )}
        </div>

        {/* Item 4: ARED Countermeasures Protocols */}
        <div>
          <button 
            type="button"
            onClick={() => toggleSection('countermeasures')}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
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
            <div className="mt-2 text-[11px] text-[#6E6E6E] pl-5 space-y-0.5 animate-in fade-in duration-150">
              <p>Musculoskeletal Telemetry: <strong className="text-[#8A6A00] font-mono">{muscleStatus}</strong></p>
              <p className="text-[10px] text-[#8E8E8E]">Prescribed daily countermeasure schedule active</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom subtle indicator */}
      <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between text-[10px] text-[#8E8E8E]">
        <span>Hardware Bus Status</span>
        <span className="text-[#8A6A00] font-semibold">{records.length > 0 ? 'Telemetry Active' : 'Awaiting Downlink'}</span>
      </div>
    </div>
  );
};

