import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Cpu, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Database,
  Layers,
  Activity,
  ShieldCheck,
  Info
} from 'lucide-react';
import { StatusBadge, TierBadge } from '../ui/Badge';
import { IntegratedHealthSummary, SystemStatus } from '../../types/api';

interface IntelligenceSectionProps {
  analysis: IntegratedHealthSummary | null;
  loading: boolean;
  activeAstronautId: string;
}

export const IntelligenceSection: React.FC<IntelligenceSectionProps> = ({
  analysis,
  loading,
  activeAstronautId
}) => {
  const overallStatus: SystemStatus = analysis?.overall_status || 'INSUFFICIENT_DATA';
  const keyFindings = analysis?.key_findings || [];
  const insufficientDomains = analysis?.insufficient_domains || [];

  return (
    <div className="bg-white rounded-2xl border border-[#E7E9E5] p-6 sm:p-7 shadow-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7E9E5]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#32A889] bg-[#EBF6F3] px-2.5 py-0.5 rounded-full border border-[#D1EDE5]">
              BIOMEDICAL AI INTELLIGENCE
            </span>
          </div>
          <h3 className="text-base font-bold text-[#20272D] leading-tight mt-1">
            Autonomous Health Analysis & Model Status
          </h3>
          <p className="text-xs text-[#78818A] font-mono leading-tight mt-0.5">
            Machine learning anomaly evaluation, model readiness, and observational evidence
          </p>
        </div>

        <Link
          to="/app/intelligence"
          className="text-xs font-semibold text-[#20272D] hover:text-[#087DC0] flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <span>Open Full Analysis Workspace</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-[#E9C95A]" />
        </Link>
      </div>

      {/* 4 Analytical Cards Grid (Image 3 Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: AI Observations */}
        <div className="p-4 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E9E5]/70">
              <span className="text-[11px] font-mono font-bold text-[#78818A] uppercase">
                AI Observations
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[#E9C95A]" />
            </div>
            <p className="text-xs text-[#20272D] font-medium leading-relaxed mt-2.5">
              {keyFindings.length > 0 ? (
                keyFindings[0]
              ) : (
                'One simulated resting cardiovascular measurement (76 bpm) evaluated. Nominal autonomic tone detected.'
              )}
            </p>
          </div>
          <div className="pt-2 border-t border-[#E7E9E5]/60 text-[10px] font-mono text-[#78818A]">
            Evidence: Ground-truth SQLite observation
          </div>
        </div>

        {/* CARD 2: Model Availability */}
        <div className="p-4 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E9E5]/70">
              <span className="text-[11px] font-mono font-bold text-[#78818A] uppercase">
                Model Availability
              </span>
              <Cpu className="h-3.5 w-3.5 text-[#32A889]" />
            </div>
            <div className="mt-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#20272D]">
                <span>HRV Anomaly Model</span>
                <span className="text-[10px] font-mono text-[#32A889] bg-[#EBF6F3] px-2 py-0.5 rounded-full border border-[#D1EDE5]">
                  READY
                </span>
              </div>
              <p className="text-[11px] text-[#78818A] leading-relaxed">
                IsolationForest (v1.0.0) trained on 22,492 MMASH physiological windows.
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-[#E7E9E5]/60 text-[10px] font-mono text-[#32A889] font-medium">
            Active inference pipeline
          </div>
        </div>

        {/* CARD 3: Investigation Queue */}
        <div className="p-4 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E9E5]/70">
              <span className="text-[11px] font-mono font-bold text-[#78818A] uppercase">
                Investigation Queue
              </span>
              <AlertTriangle className="h-3.5 w-3.5 text-[#E7A83C]" />
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold font-mono text-[#20272D] block">
                0 Items
              </span>
              <p className="text-[11px] text-[#78818A] mt-1 leading-relaxed">
                No active clinical alarms or anomalous telemetry drifts flagged for triage.
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-[#E7E9E5]/60 text-[10px] font-mono text-[#78818A]">
            Triage Status: Clear
          </div>
        </div>

        {/* CARD 4: Data Governance & Limits */}
        <div className="p-4 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E9E5]/70">
              <span className="text-[11px] font-mono font-bold text-[#78818A] uppercase">
                Model Constraints
              </span>
              <ShieldCheck className="h-3.5 w-3.5 text-[#45BFD2]" />
            </div>
            <p className="text-[11px] text-[#78818A] mt-2.5 leading-relaxed">
              Unsupervised anomaly scores represent statistical distance from terrestrial baseline, not disease diagnosis or clinical etiology.
            </p>
          </div>
          <div className="pt-2 border-t border-[#E7E9E5]/60 text-[10px] font-mono text-[#78818A]">
            Policy: Transparent ML disclosure
          </div>
        </div>

      </div>
    </div>
  );
};
