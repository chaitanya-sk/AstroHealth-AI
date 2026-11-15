import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  Database,
  Info,
  ShieldCheck
} from 'lucide-react';
import { StatusBadge, TierBadge } from '../ui/Badge';
import { AlertResponse, IntegratedHealthSummary } from '../../types/api';

interface InvestigationQueueSectionProps {
  alerts: AlertResponse[];
  analysis: IntegratedHealthSummary | null;
  loading: boolean;
  activeAstronautId: string;
}

export const InvestigationQueueSection: React.FC<InvestigationQueueSectionProps> = ({
  alerts,
  analysis,
  loading,
  activeAstronautId
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E7E9E5] p-6 sm:p-7 shadow-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E9E5]">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-[#FAFAF7] border border-[#E7E9E5] flex items-center justify-center text-[#E7A83C]">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#20272D] leading-tight">
              Biomedical Investigation Queue
            </h3>
            <p className="text-xs text-[#78818A] font-mono leading-tight mt-0.5">
              Evidence-backed findings requiring clinical attention or follow-up protocol
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#78818A]">
            Active Findings: <strong className="text-[#20272D]">{alerts.length}</strong>
          </span>
          <Link
            to="/app/alerts"
            className="text-xs font-semibold text-[#20272D] hover:text-[#087DC0] flex items-center gap-1 transition-colors ml-2"
          >
            <span>Full Investigation Protocol</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#E9C95A]" />
          </Link>
        </div>
      </div>

      {/* Content */}
      {alerts.length > 0 ? (
        <div className="space-y-2.5">
          {alerts.map(alert => (
            <div 
              key={alert.id}
              className="p-4 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#20272D]">{alert.title}</span>
                  <StatusBadge status={alert.severity} size="sm" />
                </div>
                <p className="text-xs text-[#78818A] mt-1">{alert.explanation || (alert as any).message}</p>
              </div>
              <span className="text-[11px] font-mono text-[#78818A] shrink-0">
                {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Recent'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] text-center space-y-2">
          <div className="h-9 w-9 rounded-full bg-[#EBF6F3] text-[#32A889] flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-[#20272D]">
            Zero Active Clinical Alerts in Verified Database
          </p>
          <p className="text-[11px] text-[#78818A] font-mono max-w-sm mx-auto">
            Zero recorded alerts must not be presented as proof of good health. Observational triage will trigger autonomously as cross-domain anomalies are downlinked.
          </p>
        </div>
      )}
    </div>
  );
};
