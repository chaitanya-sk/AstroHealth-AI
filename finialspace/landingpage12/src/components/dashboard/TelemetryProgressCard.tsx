import React from 'react';
import { ArrowUpRight, Activity, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { HealthRecordResponse, SystemStatus } from '../../types/api';
import { DataTier } from '../../types/dashboard';
import { TierBadge } from '../ui/Badge';

interface TelemetryProgressCardProps {
  onExpand?: () => void;
  className?: string;
  records?: HealthRecordResponse[];
  status?: SystemStatus | string;
  measuredValue?: string;
  indicatorLabel?: string;
  tier?: DataTier;
}

export const TelemetryProgressCard: React.FC<TelemetryProgressCardProps> = ({ 
  onExpand, 
  className,
  records = [],
  status = 'NORMAL',
  measuredValue,
  indicatorLabel = 'Heart Rate',
  tier = 'SIMULATED'
}) => {
  const isInsufficient = status === 'INSUFFICIENT_DATA' || (!measuredValue && records.length === 0);

  return (
    <div className={cn(
      "bg-[#FFFDF5] rounded-3xl p-5 border border-stone-200/60 shadow-soft flex flex-col justify-between h-[340px] transition-all duration-300 hover:shadow-float relative group",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-[#171717]">Vitals & Workload</h3>
          <TierBadge tier={tier} subtle className="text-[9px]" />
        </div>
        <button 
          onClick={onExpand}
          className="h-8 w-8 rounded-full bg-[#F4F0E5]/80 hover:bg-[#F7D85B] text-[#292929] flex items-center justify-center transition-colors"
          title="Open Trends"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {isInsufficient ? (
        <div className="my-auto flex flex-col items-center justify-center text-center p-4 space-y-2.5">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-[#8A6A00] flex items-center justify-center shadow-xs">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
              Insufficient Vitals Telemetry
            </span>
            <p className="text-[11px] text-[#6E6E6E] mt-1 max-w-[210px] leading-relaxed">
              No cardiovascular telemetry recorded. Sensor synchronization required to evaluate autonomic tone.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#8A6A00] bg-amber-100/60 px-2.5 py-0.5 rounded-full border border-amber-200/60">
            INSUFFICIENT_DATA
          </span>
        </div>
      ) : (
        <>
          {/* Main Metric Stat */}
          <div className="flex items-baseline gap-2.5 my-1">
            <span className="text-3xl font-extrabold text-[#171717] tracking-tight">
              {measuredValue || `${records[0]?.value ?? '--'} ${records[0]?.unit ?? ''}`}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#171717]">{indicatorLabel}</span>
                <TierBadge tier={tier} subtle className="text-[8px] py-0 px-1.5" />
              </div>
              <span className="text-[10px] text-[#83A997] font-semibold">{status} Baseline</span>
            </div>
          </div>

          {/* Calibrated Telemetry Readout */}
          <div className="relative pt-4 pb-1">
            <div className="flex items-center justify-between text-[11px] text-[#6E6E6E] pb-2 border-b border-stone-100">
              <span>Telemetry Source</span>
              <span className="font-mono text-[#171717] font-semibold">{records[0]?.source || 'wearable_ecg_patch'}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#6E6E6E] py-2 border-b border-stone-100">
              <span>Latest Downlink</span>
              <span className="font-mono text-[#171717] font-semibold">
                {records[0]?.timestamp ? new Date(records[0].timestamp).toLocaleTimeString() : 'Current Pass'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#6E6E6E] pt-2">
              <span>Aerospace Reference</span>
              <span className="text-[#8A6A00] font-semibold">NASA-STD-3001 Guidelines</span>
            </div>
          </div>
        </>
      )}

      {/* Bottom Footer Note */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-[#8E8E8E]">
        <span>Domain: Cardiovascular</span>
        <span className="font-mono">{isInsufficient ? '0 Records' : `${records.length || 1} Valid Records`}</span>
      </div>
    </div>
  );
};

