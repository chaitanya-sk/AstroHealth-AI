import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Filter,
  RefreshCw,
  Check,
  ArrowRight,
  ExternalLink,
  Activity,
  Info,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { useAstronaut } from '../contexts/AstronautContext';
import { alertService } from '../services/api/alertService';
import { AlertResponse, RecommendationResponse, AlertSeverity } from '../types/api';
import { StatusBadge, TierBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { cn } from '../lib/utils';

export const AlertsPage: React.FC = () => {
  const { activeAstronautId, activeAstronaut } = useAstronaut();

  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertResponse | null>(null);

  // Filters
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');

  const fetchAlertsAndRecs = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const liveAlerts = await alertService.getAlerts(activeAstronautId, {
        domain: domainFilter !== 'all' ? domainFilter : undefined
      });
      setAlerts(liveAlerts || []);

      const recs = await alertService.getRecommendations(activeAstronautId);
      setRecommendations(recs || []);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to fetch alerts or recommendations from backend.');
      setAlerts([]);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsAndRecs();
  }, [activeAstronautId, domainFilter]);

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'all') return true;
    return a.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E7E9E5] shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-[#FAFAF7] border border-[#E7E9E5] text-[#E7A83C] flex items-center justify-center shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#20272D] tracking-tight">
                  Biomedical Investigation Queue & Alerts
                </h1>
                <TierBadge tier={activeAstronaut.tier} subtle />
              </div>
              <p className="text-xs text-[#78818A] font-mono mt-0.5">
                Clinical triage, autonomous threshold excursions, and countermeasure protocols
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#78818A]">
              Active Alerts: <strong className="text-[#20272D]">{alerts.length}</strong>
            </span>
            <button
              onClick={fetchAlertsAndRecs}
              className="h-9 w-9 rounded-xl bg-[#FAFAF7] border border-[#E7E9E5] flex items-center justify-center text-[#78818A] hover:text-[#20272D] transition-colors cursor-pointer"
              title="Refresh Alerts"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 pt-4 border-t border-[#E7E9E5] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[#78818A]">
            <Filter className="h-3.5 w-3.5 text-[#45BFD2]" />
            <span className="text-xs mr-1">Severity:</span>
            {['all', 'critical', 'high', 'medium', 'low'].map(s => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] uppercase font-bold transition-all cursor-pointer",
                  severityFilter === s 
                    ? "bg-[#20272D] text-white shadow-pill" 
                    : "text-[#78818A] hover:text-[#20272D] bg-[#FAFAF7] border border-[#E7E9E5]"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-[#78818A]">
            Subject: <strong className="text-[#20272D]">{activeAstronaut.name} ({activeAstronaut.id})</strong>
          </span>
        </div>
      </div>

      {/* Critical Scientific Clarification Banner */}
      <div className="bg-[#F5F2E9] border border-[#E9C95A]/40 p-4 rounded-xl flex items-start gap-3">
        <Info className="h-4 w-4 text-[#E7A83C] shrink-0 mt-0.5" />
        <div className="text-xs text-[#78818A] space-y-0.5 leading-relaxed">
          <strong className="text-[#20272D]">Aerospace Clinical Protocol: </strong>
          Zero active alerts indicates absence of threshold excursions in recorded biotelemetry. It does <strong>not</strong> prove complete physiological health when telemetry is missing or unmonitored.
        </div>
      </div>

      {/* Alerts List or Honest Empty State */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-[#E7E9E5] shadow-card text-center space-y-3">
          <div className="h-12 w-12 rounded-xl bg-[#FAFAF7] border border-[#E7E9E5] text-[#32A889] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-sm font-bold font-mono text-[#20272D]">
              No alerts are currently recorded for this astronaut.
            </h3>
            <p className="text-xs text-[#78818A] leading-relaxed">
              No physiological indicators exceed NASA-STD-3001 critical threshold limits for {activeAstronaut.name} in currently ingested records.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#32A889] bg-[#32A889]/10 px-3 py-1 rounded-md border border-[#32A889]/20 inline-block font-bold">
            STATUS: 0 ACTIVE ANOMALIES STORED
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map(alert => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className="bg-white p-4 rounded-xl border border-[#E7E9E5] hover:border-[#45BFD2] shadow-card transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#20272D]">{alert.title}</span>
                <StatusBadge status={alert.severity} size="sm" />
              </div>
              <p className="text-xs text-[#78818A] leading-relaxed">
                {alert.explanation || (alert as any).message}
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#78818A] pt-2 border-t border-[#E7E9E5]">
                <span>Domain: {alert.domain}</span>
                <span>Created: {new Date(alert.timestamp || (alert as any).created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clinical Countermeasure Recommendations */}
      <div className="bg-white rounded-2xl p-5 border border-[#E7E9E5] shadow-card space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E9E5]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#32A889]" />
            <h3 className="text-sm font-bold text-[#20272D]">
              Clinical Countermeasure Protocols & Recommendations
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#78818A]">
            {recommendations.length} Active Protocol(s)
          </span>
        </div>

        {recommendations.length === 0 ? (
          <p className="text-xs text-[#78818A] italic p-3 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5]">
            No countermeasure recommendations are currently available for this subject.
          </p>
        ) : (
          <div className="space-y-2">
            {recommendations.map(rec => (
              <div key={rec.id} className="p-3.5 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#20272D]">{rec.summary || (rec as any).title}</span>
                  <StatusBadge status={(rec.urgency || (rec as any).priority) as any} size="sm" />
                </div>
                <p className="text-xs text-[#78818A] leading-relaxed">
                  {rec.suggested_actions || (rec as any).action_plan}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default AlertsPage;
