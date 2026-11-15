import React, { useState } from 'react';
import { 
  HeartPulse, 
  ShieldAlert, 
  Dumbbell, 
  Brain, 
  Radiation, 
  Wind, 
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Info
} from 'lucide-react';
import { HealthDomain } from '../../types/dashboard';
import { HEALTH_DOMAINS } from '../../data/dashboardDemoData';
import { StatusBadge, TierBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/utils';

interface HealthDomainCardsProps {
  onSelectDomain?: (domain: HealthDomain) => void;
}

export const HealthDomainCards: React.FC<HealthDomainCardsProps> = ({ onSelectDomain }) => {
  const [selectedDomain, setSelectedDomain] = useState<HealthDomain | null>(null);

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse':
        return <HeartPulse className="h-5 w-5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="h-5 w-5" />;
      case 'Dumbbell':
        return <Dumbbell className="h-5 w-5" />;
      case 'Brain':
        return <Brain className="h-5 w-5" />;
      case 'Radioactive':
      case 'Radiation':
        return <Radiation className="h-5 w-5" />;
      case 'Wind':
        return <Wind className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-amber-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-amber-600" />;
      default:
        return <Minus className="h-3 w-3 text-stone-400" />;
    }
  };

  return (
    <section className="w-full space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
              Six Health Domains
            </h2>
            <TierBadge tier="SIMULATED" subtle className="text-[9px]" />
          </div>
          <p className="text-xs sm:text-sm text-[#6E6E6E] font-medium">
            Continuous deep-space physiological monitoring & anomaly detection
          </p>
        </div>
        <span className="text-xs font-semibold text-[#8E8E8E] self-start sm:self-auto bg-[#FFFDF5] px-3 py-1 rounded-full border border-stone-200">
          6 Modules Active
        </span>
      </div>

      {/* 6 Cards Grid (2 rows x 3 columns on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
        {HEALTH_DOMAINS.map((domain) => (
          <div
            key={domain.id}
            onClick={() => {
              setSelectedDomain(domain);
              onSelectDomain?.(domain);
            }}
            className="bg-[#FFFDF5] rounded-3xl p-5 border border-stone-200/60 shadow-soft hover:shadow-float transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Card Header: Icon, Domain Name, Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#F4F0E5] group-hover:bg-[#F7D85B] text-[#292929] flex items-center justify-center transition-colors shadow-xs">
                    {getDomainIcon(domain.icon)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#171717] tracking-tight group-hover:text-amber-800 transition-colors">
                      {domain.name}
                    </h3>
                    <span className="text-[10px] text-[#929292] font-mono">
                      {domain.dataAvailability}
                    </span>
                  </div>
                </div>

                <StatusBadge status={domain.status} size="sm" />
              </div>

              {/* Description */}
              <p className="text-xs text-[#6E6E6E] mt-3 line-clamp-2 leading-relaxed">
                {domain.description}
              </p>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100">
                {domain.metrics.slice(0, 2).map((m, idx) => (
                  <div key={idx} className="bg-[#F4F0E5]/60 p-2.5 rounded-2xl border border-stone-200/40">
                    <span className="text-[10px] text-[#8E8E8E] font-medium block truncate">
                      {m.label}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-base font-extrabold text-[#171717]">
                        {m.value}
                      </span>
                      {m.unit && (
                        <span className="text-[10px] text-[#6E6E6E] font-semibold">
                          {m.unit}
                        </span>
                      )}
                      <span className="ml-auto">
                        {getTrendIcon(m.trend)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Footer: Summary & Details Action Button */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-[#8E8E8E] flex items-center gap-1 truncate max-w-[70%]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#83A997]" />
                Updated {domain.lastUpdated}
              </span>

              <button
                type="button"
                className="text-xs font-bold text-[#171717] group-hover:text-amber-800 flex items-center gap-1 transition-colors"
              >
                <span>Details</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for detailed domain inspection */}
      <Modal
        isOpen={!!selectedDomain}
        onClose={() => setSelectedDomain(null)}
        title={selectedDomain?.name || "Domain Telemetry"}
        subtitle={`System ID: ${selectedDomain?.id.toUpperCase()} • Telemetry Feed (Simulated)`}
      >
        {selectedDomain && (
          <div className="space-y-4">
            {/* Header info bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#F4F0E5] rounded-2xl">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedDomain.status} />
                <TierBadge tier={selectedDomain.tier} />
              </div>
              <span className="text-xs font-mono text-[#6E6E6E]">
                {selectedDomain.dataAvailability}
              </span>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-1">
                Domain Scope & Protocol
              </h4>
              <p className="text-xs text-[#292929] leading-relaxed">
                {selectedDomain.description}
              </p>
            </div>

            {/* All Metrics Grid */}
            <div>
              <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-2">
                Live Sensor Telemetry
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedDomain.metrics.map((m, idx) => (
                  <div key={idx} className="bg-[#FFFDF5] p-3 rounded-2xl border border-stone-200">
                    <span className="text-[10px] text-[#8E8E8E] font-medium block truncate">
                      {m.label}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-black text-[#171717]">{m.value}</span>
                      {m.unit && <span className="text-xs text-[#6E6E6E]">{m.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Findings List */}
            <div>
              <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Explainable AI Observations
              </h4>
              <ul className="space-y-1.5">
                {selectedDomain.detailedFindings.map((finding, idx) => (
                  <li key={idx} className="text-xs text-[#292929] bg-[#F4F0E5]/60 p-2.5 rounded-xl border border-stone-200/50 flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8A6A00] mt-1.5 shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinical Countermeasure Recommendation */}
            <div className="bg-[#83A997]/15 p-3.5 rounded-2xl border border-[#83A997]/30">
              <h4 className="text-xs font-bold text-[#4A725F] uppercase tracking-wider mb-1">
                Decision Support Protocol
              </h4>
              <p className="text-xs text-[#244234] font-medium">
                {selectedDomain.recommendation}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
