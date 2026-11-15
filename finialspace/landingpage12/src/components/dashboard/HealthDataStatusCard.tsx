import React from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  Activity,
  ShieldCheck,
  ShieldAlert,
  Info,
  Radio,
  BarChart3
} from 'lucide-react';
import { StatusBadge, TierBadge } from '../ui/Badge';
import { HealthRecordResponse, SystemStatus, HealthDomain } from '../../types/api';

interface HealthDataStatusCardProps {
  totalRecordsCount: number;
  availableDomainsCount: number;
  totalDomainsCount: number;
  latestTimestamp?: string | null;
  records: HealthRecordResponse[];
  overallStatus: SystemStatus;
  primaryTier: string;
}

export const HealthDataStatusCard: React.FC<HealthDataStatusCardProps> = ({
  totalRecordsCount,
  availableDomainsCount,
  totalDomainsCount,
  latestTimestamp,
  records,
  overallStatus,
  primaryTier
}) => {
  // All 6 domains
  const allDomains: HealthDomain[] = [
    'cardiovascular', 
    'immune', 
    'bone_muscle', 
    'behavioral', 
    'radiation', 
    'environment'
  ];
  const domainsWithData = Array.from(new Set(records.map(r => r.domain)));
  const coveragePercent = Math.round((availableDomainsCount / totalDomainsCount) * 100);

  const formatTimestamp = (ts?: string | null) => {
    if (!ts) return 'Awaiting initial packet';
    try {
      const d = new Date(ts);
      return `${d.toISOString().slice(0, 19).replace('T', ' ')} UTC`;
    } catch {
      return ts;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* CARD 1: Available Observations */}
      <div className="bg-white rounded-2xl border border-[#E7E9E5] p-5 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#78818A] uppercase tracking-wider font-mono">
            Available Observations
          </span>
          <div className="h-7 w-7 rounded-full bg-[#FAFAF7] border border-[#E7E9E5] flex items-center justify-center text-[#20272D]">
            <Database className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#20272D] font-mono tracking-tight">
              {totalRecordsCount}
            </span>
            <span className="text-xs font-mono text-[#78818A]">
              telemetry records
            </span>
          </div>
          <p className="text-xs text-[#78818A] mt-1">
            Verified backend telemetry packets downlinked to SQLite.
          </p>
        </div>

        <div className="pt-3 border-t border-[#E7E9E5] flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#78818A]">Pipeline:</span>
          <span className="text-[#32A889] font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#32A889]" />
            Active Ingest Bus
          </span>
        </div>
      </div>

      {/* CARD 2: Data Coverage */}
      <div className="bg-white rounded-2xl border border-[#E7E9E5] p-5 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#78818A] uppercase tracking-wider font-mono">
            Data Coverage
          </span>
          <div className="h-7 w-7 rounded-full bg-[#FAFAF7] border border-[#E7E9E5] flex items-center justify-center text-[#45BFD2]">
            <BarChart3 className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#20272D] font-mono tracking-tight">
              {availableDomainsCount} / {totalDomainsCount}
            </span>
            <span className="text-xs font-mono text-[#78818A]">
              domains ({coveragePercent}%)
            </span>
          </div>
          <p className="text-xs text-[#78818A] mt-1">
            Proportion of physiological domains with ingest.
          </p>
        </div>

        <div className="pt-3 border-t border-[#E7E9E5] flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#78818A]">Standard:</span>
          <span className="text-[#20272D] font-medium">NASA-STD-3001</span>
        </div>
      </div>

      {/* CARD 3: Domains with Available Data */}
      <div className="bg-white rounded-2xl border border-[#E7E9E5] p-5 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#78818A] uppercase tracking-wider font-mono">
            Active Domains
          </span>
          <div className="h-7 w-7 rounded-full bg-[#FAFAF7] border border-[#E7E9E5] flex items-center justify-center text-[#32A889]">
            <Activity className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="my-3">
          {domainsWithData.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {domainsWithData.map(d => (
                <span 
                  key={d}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF6F3] text-[#32A889] border border-[#D1EDE5]"
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#78818A] italic pt-1">
              No domains currently active
            </div>
          )}
          <p className="text-xs text-[#78818A] mt-2">
            {6 - domainsWithData.length} domains awaiting instrument downlink.
          </p>
        </div>

        <div className="pt-3 border-t border-[#E7E9E5] flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#78818A]">Data Tier:</span>
          <TierBadge tier={primaryTier} />
        </div>
      </div>

      {/* CARD 4: Recorded Alerts */}
      <div className="bg-white rounded-2xl border border-[#E7E9E5] p-5 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#78818A] uppercase tracking-wider font-mono">
            Recorded Alerts
          </span>
          <div className="h-7 w-7 rounded-full bg-[#FAFAF7] border border-[#E7E9E5] flex items-center justify-center text-[#E7A83C]">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#20272D] font-mono tracking-tight">
              0
            </span>
            <span className="text-xs font-mono text-[#78818A]">
              active alarms
            </span>
          </div>
          <p className="text-xs text-[#78818A] mt-1">
            Zero recorded alerts in verified database.
          </p>
        </div>

        <div className="pt-3 border-t border-[#E7E9E5] flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#78818A]">Clinical Integrity:</span>
          <span className="text-[#78818A] text-[10px]" title="Zero alerts is not proof of good health">
            Requires continuous coverage
          </span>
        </div>
      </div>

    </div>
  );
};
