import React from 'react';
import { 
  Database, 
  ShieldCheck, 
  AlertOctagon, 
  Layers, 
  ExternalLink,
  CheckCircle2,
  FileCode2,
  Lock
} from 'lucide-react';
import { DATA_PROVENANCE_REGISTRY } from '../../data/dashboardDemoData';
import { TierBadge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export const DataProvenance: React.FC = () => {
  return (
    <section className="bg-[#FFFDF5] rounded-3xl p-6 border border-stone-200/60 shadow-soft space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#F4F0E5] text-[#292929] flex items-center justify-center shadow-xs">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-[#171717] tracking-tight">
                Data Provenance & Telemetry Integrity
              </h3>
              <TierBadge tier="SIMULATED" subtle className="text-[9px]" />
            </div>
            <p className="text-xs text-[#6E6E6E] font-medium mt-0.5">
              Multi-tiered source validation, synthetic stream governance, and isolation boundaries
            </p>
          </div>
        </div>

        {/* Legend / Tiers pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#F4F0E5] px-3 py-1.5 rounded-full border border-stone-200/60 text-xs">
          <span className="font-semibold text-[#6E6E6E]">Tiers:</span>
          <TierBadge tier="REAL" subtle className="text-[9px]" />
          <TierBadge tier="RESEARCH" subtle className="text-[9px]" />
          <TierBadge tier="SIMULATED" subtle className="text-[9px]" />
        </div>
      </div>

      {/* Strict Compliance Banner: MMASH Isolation Notice */}
      <div className="bg-[#F7D85B]/20 border border-[#F7D85B]/60 p-4 rounded-2xl flex items-start gap-3">
        <AlertOctagon className="h-5 w-5 text-[#8A6A00] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-[#171717] uppercase tracking-wide">
            Terrestrial Research Isolation Protocol Active
          </span>
          <p className="text-[#6E6E6E] leading-relaxed">
            Terrestrial research benchmarks (such as PhysioNet MMASH) are strictly isolated for offline machine-learning validation. In accordance with aerospace flight protocol, terrestrial ground datasets are <span className="font-bold text-[#171717]">never</span> represented as flight astronaut telemetry.
          </p>
        </div>
      </div>

      {/* Registry Table / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {DATA_PROVENANCE_REGISTRY.map((item) => (
          <div 
            key={item.id}
            className="bg-[#F4F0E5]/50 hover:bg-[#F4F0E5] p-4.5 rounded-2xl border border-stone-200/60 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              {/* Card Top: Tier Badge & Category */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-[#8E8E8E] uppercase tracking-wider">
                  {item.category}
                </span>
                <TierBadge tier={item.tier} />
              </div>

              {/* Name & Source */}
              <h4 className="text-sm font-bold text-[#171717] mt-1.5">
                {item.name}
              </h4>
              <p className="text-xs text-[#6E6E6E] mt-0.5 font-mono">
                Source: {item.sourceDataset}
              </p>

              {/* Compliance Note */}
              <p className="text-xs text-[#292929] mt-2.5 bg-white p-2.5 rounded-xl border border-stone-200/60 leading-relaxed">
                {item.complianceNote}
              </p>
            </div>

            {/* Bottom: Method & Latency */}
            <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-[#8E8E8E]">
              <span className="truncate max-w-[65%]">
                Method: {item.collectionMethod}
              </span>
              <span className="font-mono text-[#171717] font-semibold shrink-0">
                {item.latency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

