import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  Brain, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Filter, 
  RefreshCw, 
  HeartPulse,
  ShieldAlert,
  Dumbbell,
  Radiation,
  Wind,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAstronaut } from '../contexts/AstronautContext';
import { analysisService } from '../services/api/analysisService';
import { IntegratedHealthSummary, SystemStatus } from '../types/api';
import { StatusBadge, TierBadge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

const DOMAIN_CONFIG: Array<{ key: string; name: string; icon: React.ReactNode }> = [
  { key: 'cardiovascular', name: 'Cardiovascular System', icon: <HeartPulse className="h-4 w-4 text-[#32A889]" /> },
  { key: 'immune', name: 'Immune & Biomarkers', icon: <ShieldAlert className="h-4 w-4 text-[#45BFD2]" /> },
  { key: 'bone_muscle', name: 'Musculoskeletal (Bone & Muscle)', icon: <Dumbbell className="h-4 w-4 text-[#E9C95A]" /> },
  { key: 'behavioral', name: 'Behavioral Health & Sleep', icon: <Brain className="h-4 w-4 text-[#E7A83C]" /> },
  { key: 'radiation', name: 'Radiation Dosimetry', icon: <Radiation className="h-4 w-4 text-[#E7A83C]" /> },
  { key: 'cabin_environment', name: 'Cabin Life Support (ECLSS)', icon: <Wind className="h-4 w-4 text-[#45BFD2]" /> },
];

export const IntelligencePage: React.FC = () => {
  const { activeAstronautId, activeAstronaut } = useAstronaut();

  const [tierFilter, setTierFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [intelligence, setIntelligence] = useState<IntegratedHealthSummary | null>(null);

  const fetchIntelligence = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await analysisService.getIntegratedAnalysis(
        activeAstronautId,
        tierFilter !== 'all' ? tierFilter : undefined
      );
      setIntelligence(data);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to connect to backend intelligence analysis endpoint.');
      setIntelligence(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, [activeAstronautId, tierFilter]);

  const overallStatus: SystemStatus = intelligence?.overall_status || 'INSUFFICIENT_DATA';
  const domainStatuses = intelligence?.domain_statuses || {};
  const domainSummaries = intelligence?.domain_summaries || {};
  const insufficientDomains = intelligence?.insufficient_domains || [];
  const evaluatedCount = 6 - insufficientDomains.length;

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Page Header Hero Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E9E5] shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-[#FAFAF7] border border-[#E7E9E5] text-[#20272D] flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-[#E9C95A]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#20272D] tracking-tight">
                  Integrated Health Intelligence Engine
                </h1>
                <TierBadge tier={activeAstronaut.tier} />
              </div>
              <p className="text-xs text-[#78818A] font-mono mt-0.5">
                Multi-domain sensor fusion, cross-system risk compounding, and explainable clinical intelligence
              </p>
            </div>
          </div>

          {/* Controls: Tier Filter & Refresh */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-[#FAFAF7] p-1 rounded-full border border-[#E7E9E5] text-xs">
              <Filter className="h-3 w-3 text-[#78818A] ml-2 mr-1" />
              {['all', 'real', 'simulated', 'research'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all",
                    tierFilter === t 
                      ? "bg-[#20272D] text-white shadow-sm" 
                      : "text-[#78818A] hover:text-[#20272D]"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={fetchIntelligence}
              className="h-8 w-8 rounded-full bg-[#FAFAF7] border border-[#E7E9E5] flex items-center justify-center text-[#78818A] hover:text-[#20272D] transition-colors"
              title="Refresh Assessment Cycle"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-5 pt-4 border-t border-[#E7E9E5] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 font-mono text-[#78818A]">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#32A889]" />
              <span>Assessment Cycle: {intelligence?.generated_at ? new Date(intelligence.generated_at).toUTCString() : 'Awaiting Cycle'}</span>
            </div>
            <span>•</span>
            <span>Subject: <strong className="text-[#20272D]">{activeAstronaut.name}</strong></span>
            <span>•</span>
            <span>Evaluated: <strong className="text-[#32A889]">{evaluatedCount}/6 Domains</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#78818A]">Overall Status:</span>
            <StatusBadge status={overallStatus} size="md" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white border border-[#E7E9E5] p-8 rounded-2xl shadow-card text-center space-y-3">
          <div className="h-8 w-8 border-2 border-[#20272D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono font-bold text-[#20272D]">
            Evaluating Multimodal Biomedical Analysis for {activeAstronaut.name}...
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && errorMsg && (
        <div className="bg-[#FBEEEE] border border-[#F6D0D0] p-6 rounded-2xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#D95C5C] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#D95C5C]">
                Analysis Service Connection Note
              </h3>
              <p className="text-xs text-[#78818A] leading-relaxed">
                {errorMsg}
              </p>
            </div>
          </div>
          <button
            onClick={fetchIntelligence}
            className="px-3.5 py-1.5 bg-white border border-[#E7E9E5] text-[#20272D] text-xs font-semibold rounded-full hover:bg-[#FAFAF7] transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Grid: Explainability & Domain Statuses */}
      {!loading && !errorMsg && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Key Findings & Cross-Domain Compounding */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Key Findings Box */}
            <div className="bg-white p-6 rounded-2xl border border-[#E7E9E5] shadow-card space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E9E5]">
                <h3 className="text-sm font-bold text-[#20272D] uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Brain className="h-4 w-4 text-[#E9C95A]" />
                  <span>Primary Findings & Physiological Rationale</span>
                </h3>
                <span className="text-[11px] font-mono text-[#78818A]">
                  {intelligence?.key_findings ? `${intelligence.key_findings.length} item(s)` : '0 Findings'}
                </span>
              </div>

              <div className="space-y-2.5">
                {intelligence?.key_findings && intelligence.key_findings.length > 0 ? (
                  intelligence.key_findings.map((finding, idx) => (
                    <div key={idx} className="bg-[#FAFAF7] p-4 rounded-xl border border-[#E7E9E5] flex items-start gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#32A889] mt-1.5 shrink-0" />
                      <p className="text-xs text-[#20272D] leading-relaxed">
                        {finding}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#FAFAF7] p-4 rounded-xl border border-[#E7E9E5] text-xs text-[#78818A] space-y-1">
                    <span className="font-bold text-[#20272D] block font-mono">Telemetry Evaluation Completed</span>
                    <p>
                      {insufficientDomains.length > 0 
                        ? `${insufficientDomains.length} physiological domains currently have INSUFFICIENT DATA. Longitudinal pattern extraction will resume as operational sensors downlink.`
                        : 'No critical anomalies identified in the current downlink window.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cross-Domain Compounding Risks */}
            <div className="bg-white p-6 rounded-2xl border border-[#E7E9E5] shadow-card space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E9E5]">
                <h3 className="text-sm font-bold text-[#20272D] uppercase tracking-wider flex items-center gap-2 font-mono">
                  <ShieldCheck className="h-4 w-4 text-[#087DC0]" />
                  <span>Cross-Domain Compounding Vectors</span>
                </h3>
                <span className="text-[11px] font-mono text-[#78818A]">
                  {((intelligence?.cross_domain_interactions || (intelligence as any)?.cross_domain_risks) || []).length} Vector(s)
                </span>
              </div>

              <div className="space-y-2.5">
                {((intelligence?.cross_domain_interactions || (intelligence as any)?.cross_domain_risks) || []).length > 0 ? (
                  ((intelligence?.cross_domain_interactions || (intelligence as any)?.cross_domain_risks) || []).map((risk: any, idx: number) => (
                    <div key={idx} className="bg-[#FAFAF7] p-4 rounded-xl border border-[#E7E9E5] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#20272D]">{typeof risk === 'string' ? risk : (risk.title || `Risk Vector #${idx + 1}`)}</span>
                        {risk.severity && <StatusBadge status={risk.severity} size="sm" />}
                      </div>
                      {typeof risk !== 'string' && risk.description && (
                        <p className="text-xs text-[#78818A] leading-relaxed">
                          {risk.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-[#FAFAF7] p-4 rounded-xl border border-[#E7E9E5] text-xs text-[#78818A]">
                    No cross-domain compounding risks triggered in the current assessment window.
                  </div>
                )}
              </div>
            </div>

            {/* Structured Recommendations */}
            <div className="bg-white p-6 rounded-2xl border border-[#E7E9E5] shadow-card space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E9E5]">
                <h3 className="text-sm font-bold text-[#20272D] uppercase tracking-wider flex items-center gap-2 font-mono">
                  <CheckCircle2 className="h-4 w-4 text-[#32A889]" />
                  <span>Evidence-Backed Protocol Suggestions</span>
                </h3>
              </div>

              <div className="space-y-2">
                {((intelligence?.integrated_recommendations || (intelligence as any)?.recommendations) || []).length > 0 ? (
                  ((intelligence?.integrated_recommendations || (intelligence as any)?.recommendations) || []).map((rec: string, idx: number) => (
                    <div key={idx} className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#32A889] mt-1.5 shrink-0" />
                      <span className="text-xs text-[#20272D] font-medium leading-relaxed">{rec}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#78818A] italic p-3 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5]">
                    No active countermeasure protocols required at this time.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Six Domain Evaluation Matrix */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#E7E9E5] shadow-card space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E9E5]">
                <h3 className="text-sm font-bold text-[#20272D] uppercase tracking-wider font-mono">
                  Six Domain Status Matrix
                </h3>
                <span className="text-[11px] font-mono text-[#32A889] font-bold">
                  {evaluatedCount}/6 Evaluated
                </span>
              </div>

              <div className="space-y-2.5">
                {DOMAIN_CONFIG.map(({ key, name, icon }) => {
                  const status = domainStatuses[key] || 'INSUFFICIENT_DATA';
                  const summary = domainSummaries[key];

                  return (
                    <div 
                      key={key}
                      className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] space-y-2 hover:border-[#D5D9D2] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {icon}
                          <span className="text-xs font-bold text-[#20272D]">{name}</span>
                        </div>
                        <StatusBadge status={status} size="sm" />
                      </div>

                      <p className="text-[11px] text-[#78818A] leading-relaxed">
                        {summary || (status === 'INSUFFICIENT_DATA' ? 'Awaiting telemetry sensor ingestion.' : 'Nominal bounds maintained.')}
                      </p>

                      <div className="pt-1 flex items-center justify-end">
                        <Link
                          to={`/app/domains/${key.replace(/_/g, '-')}`}
                          className="text-[10px] font-mono font-semibold text-[#20272D] hover:text-[#087DC0] flex items-center gap-1 transition-colors"
                        >
                          <span>Inspect Domain</span>
                          <ArrowUpRight className="h-3 w-3 text-[#E9C95A]" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
