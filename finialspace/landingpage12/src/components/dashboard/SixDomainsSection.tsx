import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  ShieldCheck, 
  Dumbbell, 
  Brain, 
  Radiation, 
  Wind, 
  ArrowUpRight,
  Activity,
  Layers,
  Sparkles,
  Info,
  Clock
} from 'lucide-react';
import { StatusBadge, TierBadge } from '../ui/Badge';
import { HealthRecordResponse, SystemStatus } from '../../types/api';
import { cn } from '../../lib/utils';

interface SixDomainsSectionProps {
  records: HealthRecordResponse[];
  domainStatuses: Record<string, SystemStatus>;
  activeAstronautId: string;
  keyFinding?: string;
  overallStatus: SystemStatus;
}

interface DomainConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  expectedIndicators: string[];
  description: string;
  accentBg: string;
  accentText: string;
}

const DOMAINS: DomainConfig[] = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    icon: <HeartPulse className="h-4 w-4" />,
    expectedIndicators: ['heart_rate', 'hrv_rmssd', 'blood_pressure'],
    description: 'Cardiac autonomic regulation, resting hemodynamic telemetry and HRV frequency power.',
    accentBg: 'bg-[#EBF6F3]',
    accentText: 'text-[#32A889]'
  },
  {
    id: 'immune',
    name: 'Immune & Lymphatic',
    icon: <ShieldCheck className="h-4 w-4" />,
    expectedIndicators: ['cytokines', 'wbc_count', 'viral_titers'],
    description: 'In-flight inflammatory signaling, cellular immunity adaptation, and viral latency surveillance.',
    accentBg: 'bg-[#EBF8FA]',
    accentText: 'text-[#45BFD2]'
  },
  {
    id: 'bone_muscle',
    name: 'Bone & Muscle',
    icon: <Dumbbell className="h-4 w-4" />,
    expectedIndicators: ['bone_density_bmd', 'muscle_mass', 'grip_strength'],
    description: 'Microgravity skeletal unloading, bone mineral density loss and postural muscle mass volume.',
    accentBg: 'bg-[#FAF4DF]',
    accentText: 'text-[#E9C95A]'
  },
  {
    id: 'behavioral',
    name: 'Behavioral & Neural',
    icon: <Brain className="h-4 w-4" />,
    expectedIndicators: ['sleep_duration', 'actigraphy_activity', 'cognitive_workload'],
    description: 'Circadian rhythm synchronization, cognitive reaction speed, and sleep architecture consolidation.',
    accentBg: 'bg-[#FDF6EB]',
    accentText: 'text-[#E7A83C]'
  },
  {
    id: 'radiation',
    name: 'Radiation Dosimetry',
    icon: <Radiation className="h-4 w-4" />,
    expectedIndicators: ['radiation_dose_rate', 'cumulative_dose', 'dna_damage_markers'],
    description: 'Solar particle event and galactic cosmic ray ionizing radiation dose absorption.',
    accentBg: 'bg-[#FDF6EB]',
    accentText: 'text-[#E7A83C]'
  },
  {
    id: 'cabin_environment',
    name: 'Cabin Environment',
    icon: <Wind className="h-4 w-4" />,
    expectedIndicators: ['co2_level', 'o2_concentration', 'cabin_pressure', 'temperature'],
    description: 'ECLSS environmental life support, atmospheric partial pressures (ppO2, ppCO2) and habitat pressure.',
    accentBg: 'bg-[#EBF8FA]',
    accentText: 'text-[#45BFD2]'
  }
];

export const SixDomainsSection: React.FC<SixDomainsSectionProps> = ({
  records,
  domainStatuses,
  activeAstronautId,
  keyFinding,
  overallStatus
}) => {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E7E9E5]">
        <div>
          <h3 className="text-base font-bold text-[#20272D] leading-tight">
            Six Health Monitoring Domains
          </h3>
          <p className="text-xs text-[#78818A] font-mono leading-tight mt-0.5">
            Biomedical Systems Telemetry • Structured Physiological Domain Coverage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#78818A] font-mono">STANDARDS:</span>
          <span className="text-[10px] text-[#20272D] font-mono font-bold bg-white px-2.5 py-1 rounded-full border border-[#E7E9E5]">
            NASA-STD-3001
          </span>
        </div>
      </div>

      {/* Grid of 6 Domain Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOMAINS.map(domain => {
          const domainRecords = records.filter(r => r.domain === domain.id);
          const hasData = domainRecords.length > 0;
          const latest = domainRecords[0];
          const status = domainStatuses[domain.id] || (hasData ? 'NORMAL' : 'INSUFFICIENT_DATA');
          const tier = latest?.data_type?.toUpperCase() || (hasData ? 'SIMULATED' : 'INSUFFICIENT_DATA');

          return (
            <div
              key={domain.id}
              className="bg-white rounded-2xl border border-[#E7E9E5] p-5 shadow-card hover:shadow-float hover:border-[#D5D9D2] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top: Icon & Status */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E9E5]">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 border border-[#E7E9E5]", domain.accentBg, domain.accentText)}>
                      {domain.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#20272D] group-hover:text-[#087DC0] transition-colors leading-tight">
                        {domain.name}
                      </h4>
                      <span className="text-[10px] font-mono text-[#78818A] block mt-0.5">
                        {hasData ? `${domainRecords.length} observation packet` : '0 observations downlinked'}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={status} size="sm" />
                </div>

                {/* Description */}
                <p className="text-xs text-[#78818A] leading-relaxed my-3 line-clamp-2">
                  {domain.description}
                </p>

                {/* Latest Measurement / Empty State */}
                <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#78818A] uppercase">
                    <span>LATEST OBSERVATION:</span>
                    {hasData && latest && <TierBadge tier={tier} subtle />}
                  </div>

                  {hasData && latest ? (
                    <div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="font-mono text-xl font-bold text-[#20272D]">
                          {latest.value}{' '}
                          <span className="text-xs font-normal text-[#78818A]">
                            {latest.unit}
                          </span>
                        </span>
                        <span className="text-[10px] font-mono text-[#32A889] font-medium">
                          {latest.indicator.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#78818A] font-mono pt-1.5 border-t border-[#E7E9E5]/70 mt-1.5 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{new Date(latest.timestamp).toISOString().slice(0, 19)} UTC</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-1">
                      <span className="text-xs text-[#78818A] italic block font-mono">
                        No verified measurement available
                      </span>
                      <span className="text-[10px] font-mono text-[#A0A7AF] block mt-0.5">
                        Awaiting sensor stream deployment
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom: Action Link */}
              <div className="pt-3 border-t border-[#E7E9E5] mt-4 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#78818A]">
                  Route: <span className="text-[#20272D] font-medium">/domains/{domain.id}</span>
                </span>
                <Link
                  to={`/app/domains/${domain.id}`}
                  className="text-xs font-semibold text-[#20272D] hover:text-[#087DC0] flex items-center gap-1 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#E9C95A]" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-Domain Synthesis Banner */}
      <div className="bg-white rounded-2xl border border-[#E7E9E5] p-5 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="h-10 w-10 rounded-full bg-[#FAFAF7] border border-[#E7E9E5] flex items-center justify-center text-[#E9C95A] shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#20272D]">
                Integrated Physiological Assessment
              </h4>
              <StatusBadge status={overallStatus} size="sm" />
            </div>
            <p className="text-xs text-[#78818A] mt-0.5 truncate">
              {keyFinding || 'Awaiting multi-system observations for integrated cross-domain anomaly scoring.'}
            </p>
          </div>
        </div>

        <Link
          to="/app/intelligence"
          className="px-4 py-2 bg-[#20272D] hover:bg-[#323D45] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shrink-0 transition-colors shadow-pill"
        >
          <span>Open AI Intelligence</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-[#E9C95A]" />
        </Link>
      </div>
    </div>
  );
};
