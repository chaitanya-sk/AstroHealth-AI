import React, { useState, useEffect } from 'react';
import { useAstronaut } from '../contexts/AstronautContext';
import { analysisService } from '../services/api/analysisService';
import { healthService } from '../services/api/healthService';
import { alertService } from '../services/api/alertService';
import { 
  IntegratedHealthSummary, 
  HealthRecordResponse, 
  AlertResponse, 
  SystemStatus 
} from '../types/api';
import { TierBadge, StatusBadge } from '../components/ui/Badge';
import { Clock, ShieldCheck, Database, Orbit, UserCheck, Activity } from 'lucide-react';

// Biomedical Components
import { HealthDataStatusCard } from '../components/dashboard/HealthDataStatusCard';
import { HumanAnatomyViewer } from '../components/dashboard/HumanAnatomyViewer';
import { SixDomainsSection } from '../components/dashboard/SixDomainsSection';
import { IntelligenceSection } from '../components/dashboard/IntelligenceSection';
import { HealthTrendsSection } from '../components/dashboard/HealthTrendsSection';
import { InvestigationQueueSection } from '../components/dashboard/InvestigationQueueSection';

export const DashboardPage: React.FC = () => {
  const { activeAstronaut, roster, activeAstronautId } = useAstronaut();

  const [analysis, setAnalysis] = useState<IntegratedHealthSummary | null>(null);
  const [records, setRecords] = useState<HealthRecordResponse[]>([]);
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch telemetry from real FastAPI backend
  useEffect(() => {
    let isMounted = true;
    const fetchDashboardTelemetry = async () => {
      setLoading(true);
      try {
        const [analysisRes, dataRes, alertsRes] = await Promise.allSettled([
          analysisService.getIntegratedAnalysis(activeAstronautId),
          healthService.getAstronautData(activeAstronautId),
          alertService.getAlerts(activeAstronautId)
        ]);

        if (isMounted) {
          if (analysisRes.status === 'fulfilled') {
            setAnalysis(analysisRes.value);
          } else {
            setAnalysis(null);
          }

          if (dataRes.status === 'fulfilled') {
            setRecords(dataRes.value);
          } else {
            setRecords([]);
          }

          if (alertsRes.status === 'fulfilled') {
            setAlerts(alertsRes.value);
          } else {
            setAlerts([]);
          }
        }
      } catch (e) {
        console.error('Failed to downlink dashboard telemetry:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (activeAstronautId) {
      fetchDashboardTelemetry();
    }

    return () => {
      isMounted = false;
    };
  }, [activeAstronautId]);

  // Derived real backend metrics
  const overallStatus: SystemStatus = analysis?.overall_status || 'INSUFFICIENT_DATA';
  const domainStatuses: Record<string, SystemStatus> = analysis?.domain_statuses || {};
  const insufficientDomains = analysis?.insufficient_domains || [];
  const evaluatedCount = 6 - insufficientDomains.length;
  const keyFinding = analysis?.key_findings?.[0];
  const latestTimestamp = records[0]?.timestamp || (records[0] as any)?.recorded_at || records[0]?.created_at || null;

  const formatTimestamp = (ts?: string | null) => {
    if (!ts) return 'Awaiting telemetry packet';
    try {
      const d = new Date(ts);
      return `${d.toISOString().slice(0, 19).replace('T', ' ')} UTC`;
    } catch {
      return String(ts);
    }
  };

  return (
    <div className="space-y-7 pb-10">
      {/* ================= 3A. WELCOME AND MISSION HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#E7E9E5]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#32A889] bg-[#EBF6F3] px-2.5 py-0.5 rounded-full border border-[#D1EDE5]">
              BIOMEDICAL MONITORING BUS
            </span>
            <TierBadge tier={activeAstronaut.tier} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20272D] tracking-tight">
            Mission Health Overview
          </h1>
          
          <p className="text-sm text-[#78818A] mt-1 max-w-2xl leading-relaxed">
            Understand astronaut health observations, biological systems and evidence-based intelligence downlinked from verified telemetry feeds.
          </p>
        </div>

        {/* Selected Astronaut / Participant Badge Card */}
        <div className="bg-white rounded-2xl border border-[#E7E9E5] p-3.5 shadow-sm flex items-center gap-3.5 shrink-0 self-start lg:self-auto">
          <img 
            src={activeAstronaut.avatarUrl} 
            alt={activeAstronaut.name} 
            className="h-12 w-12 rounded-xl object-cover border border-[#E7E9E5] shrink-0" 
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#20272D] truncate">
                {activeAstronaut.name}
              </span>
              <span className="text-[10px] font-mono text-[#78818A] bg-[#FAFAF7] px-2 py-0.5 rounded border border-[#E7E9E5]">
                {activeAstronaut.id}
              </span>
            </div>
            
            <p className="text-xs text-[#78818A] mt-0.5 font-mono truncate">
              {activeAstronaut.role} • {activeAstronaut.mission || 'Active Protocol'}
            </p>

            <div className="flex items-center gap-1.5 text-[10px] text-[#78818A] font-mono mt-1">
              <Clock className="h-3 w-3 text-[#32A889]" />
              <span>Observation: {formatTimestamp(latestTimestamp)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3B. HEALTH DATA SUMMARY (4 CARDS) ================= */}
      <section>
        <HealthDataStatusCard 
          totalRecordsCount={records.length}
          availableDomainsCount={evaluatedCount}
          totalDomainsCount={6}
          latestTimestamp={latestTimestamp}
          records={records}
          overallStatus={overallStatus}
          primaryTier={activeAstronaut.tier}
        />
      </section>

      {/* ================= 3C. CENTRAL ANATOMY EXPERIENCE ================= */}
      <section>
        <HumanAnatomyViewer 
          records={records}
          domainStatuses={domainStatuses}
          activeAstronautId={activeAstronautId}
        />
      </section>

      {/* ================= 4. SIX HEALTH SYSTEM CARDS ================= */}
      <section>
        <SixDomainsSection 
          records={records}
          domainStatuses={domainStatuses}
          activeAstronautId={activeAstronautId}
          keyFinding={keyFinding}
          overallStatus={overallStatus}
        />
      </section>

      {/* ================= 5. BIOMEDICAL INTELLIGENCE SECTION ================= */}
      <section>
        <IntelligenceSection 
          analysis={analysis}
          loading={loading}
          activeAstronautId={activeAstronautId}
        />
      </section>

      {/* ================= 6. HEALTH TRENDS SECTION ================= */}
      <section>
        <HealthTrendsSection 
          records={records}
          activeAstronautId={activeAstronautId}
        />
      </section>

      {/* ================= INVESTIGATION QUEUE SECTION ================= */}
      <section>
        <InvestigationQueueSection 
          alerts={alerts}
          analysis={analysis}
          loading={loading}
          activeAstronautId={activeAstronautId}
        />
      </section>
    </div>
  );
};
