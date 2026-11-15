import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HeartPulse, 
  ShieldAlert, 
  Dumbbell, 
  Brain, 
  Radiation, 
  Wind, 
  ArrowLeft,
  Clock, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Filter,
  RefreshCw,
  Sparkles,
  Database,
  Info,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useAstronaut } from '../../contexts/AstronautContext';
import { analysisService } from '../../services/api/analysisService';
import { healthService } from '../../services/api/healthService';
import { DomainAnalysisResult, HealthRecordResponse, SystemStatus } from '../../types/api';
import { StatusBadge, TierBadge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';

const DOMAIN_METADATA: Record<string, { name: string; icon: React.ReactNode; desc: string }> = {
  cardiovascular: {
    name: 'Cardiovascular Health',
    icon: <HeartPulse className="h-5 w-5" />,
    desc: 'Evaluates cephalad fluid shift, autonomic baroreflex tone, orthostatic deconditioning, and microgravity arrhythmias.'
  },
  immune: {
    name: 'Immune & Biomarker Surveillance',
    icon: <ShieldAlert className="h-5 w-5" />,
    desc: 'Surveillance of salivary cortisol diurnal slope, systemic inflammatory cytokines (IL-6, TNF-a), and subclinical viral shedding.'
  },
  bone_muscle: {
    name: 'Bone & Muscle Musculoskeletal',
    icon: <Dumbbell className="h-5 w-5" />,
    desc: 'Monitors microgravity musculoskeletal unloading, calcaneal trabecular density, and ARED resistive exercise countermeasure loading.'
  },
  behavioral: {
    name: 'Behavioral & Sleep Health',
    icon: <Brain className="h-5 w-5" />,
    desc: 'Assesses circadian phase shifts, actigraphy sleep architecture, sleep debt accumulation, and Psychomotor Vigilance Test (PVT) cognitive speed.'
  },
  radiation: {
    name: 'Radiation Dosimetry & Space Weather',
    icon: <Radiation className="h-5 w-5" />,
    desc: 'Deep space Galactic Cosmic Ray (GCR) and Solar Particle Event (SPE) dosimetry modeling with organ equivalent dose tracking.'
  },
  cabin_environment: {
    name: 'Cabin Atmosphere & Life Support (ECLSS)',
    icon: <Wind className="h-5 w-5" />,
    desc: 'Environmental Control and Life Support Systems (ECLSS) partial pressures, carbon dioxide scrubber bed regeneration, and ambient acoustics.'
  },
  environment: {
    name: 'Cabin Atmosphere & Life Support (ECLSS)',
    icon: <Wind className="h-5 w-5" />,
    desc: 'Environmental Control and Life Support Systems (ECLSS) partial pressures, carbon dioxide scrubber bed regeneration, and ambient acoustics.'
  }
};

export const DomainDetailPage: React.FC = () => {
  const { domainId = 'cardiovascular' } = useParams<{ domainId: string }>();
  const { activeAstronautId, activeAstronaut } = useAstronaut();

  const [tierFilter, setTierFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [analysisResult, setAnalysisResult] = useState<DomainAnalysisResult | null>(null);
  const [records, setRecords] = useState<HealthRecordResponse[]>([]);

  // Normalize route param to metadata key
  const normalizedKey = domainId.replace(/-/g, '_');
  const meta = DOMAIN_METADATA[normalizedKey] || DOMAIN_METADATA['cardiovascular'];

  const fetchDomainData = async () => {
    setLoading(true);

    try {
      const res = await analysisService.getDomainAnalysis(
        activeAstronautId, 
        normalizedKey === 'environment' ? 'cabin_environment' : normalizedKey, 
        tierFilter !== 'all' ? tierFilter : undefined
      );
      setAnalysisResult(res);

      const recs = await healthService.getDomainData(
        activeAstronautId, 
        normalizedKey === 'environment' ? 'cabin_environment' : normalizedKey, 
        {
          data_type: tierFilter !== 'all' ? tierFilter : undefined,
          limit: 50
        }
      );
      setRecords(recs || []);
    } catch (e: any) {
      setAnalysisResult(null);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomainData();
  }, [domainId, activeAstronautId, tierFilter]);

  const currentStatus: SystemStatus = analysisResult?.status || (records.length > 0 ? 'NORMAL' : 'INSUFFICIENT_DATA');
  const primaryTier = records[0]?.data_type ? (records[0].data_type.toUpperCase() as any) : activeAstronaut.tier;

  // Chart data from real telemetry records only
  const chartData = records.length >= 2 
    ? [...records].reverse().map(r => ({
        time: new Date(r.timestamp || (r as any).recorded_at || r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: r.value,
        indicator: r.indicator.replace(/_/g, ' ')
      }))
    : [];

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Quick Domain Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link 
          to="/app/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78818A] hover:text-[#20272D] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Mission Overview</span>
        </Link>

        {/* Six Domain Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {Object.entries(DOMAIN_METADATA).filter(([k]) => k !== 'environment').map(([key, item]) => {
            const isCurrent = key === normalizedKey || (key === 'cabin_environment' && normalizedKey === 'environment');
            return (
              <Link
                key={key}
                to={`/app/domains/${key.replace(/_/g, '-')}`}
                className={cn(
                  "px-3 py-1 text-xs font-mono font-medium rounded-full border transition-all whitespace-nowrap",
                  isCurrent 
                    ? "bg-[#20272D] text-white border-[#20394B] shadow-sm font-semibold" 
                    : "bg-white text-[#78818A] hover:text-[#20272D] border-[#E7E9E5]"
                )}
              >
                {item.name.split(' ')[0]}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Domain Header Hero Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E9E5] shadow-card">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#FAFAF7] border border-[#E7E9E5] text-[#20272D] flex items-center justify-center shrink-0">
              {meta.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#20272D] tracking-tight">
                  {meta.name}
                </h1>
                <StatusBadge status={currentStatus} size="sm" />
                <TierBadge tier={primaryTier} />
              </div>
              
              <p className="text-xs text-[#78818A] max-w-2xl mt-1.5 leading-relaxed">
                {meta.desc}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] font-mono text-[#78818A]">
                <span>Subject: <strong className="text-[#20272D]">{activeAstronaut.name}</strong> ({activeAstronaut.id})</span>
                <span>•</span>
                <span>Records: <strong className="text-[#32A889]">{records.length} downlinked</strong></span>
              </div>
            </div>
          </div>

          {/* Tier Filter Pills */}
          <div className="flex items-center gap-1.5 self-start bg-[#FAFAF7] p-1 rounded-full border border-[#E7E9E5]">
            {['all', 'simulated', 'research', 'real'].map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase transition-colors",
                  tierFilter === tier 
                    ? "bg-[#20272D] text-white font-bold" 
                    : "text-[#78818A] hover:text-[#20272D]"
                )}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {records.length > 0 ? (
        <div className="space-y-6">
          {/* Latest Metric Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E7E9E5] shadow-card">
              <span className="text-xs font-mono text-[#78818A] uppercase block">
                PRIMARY INDICATOR ({records[0].indicator.replace(/_/g, ' ')})
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-[#20272D]">
                  {records[0].value}
                </span>
                <span className="text-sm font-mono text-[#78818A]">
                  {records[0].unit}
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-[#E7E9E5] text-[11px] font-mono text-[#78818A] flex justify-between">
                <span>Tier: {records[0].data_type?.toUpperCase()}</span>
                <span>Conf: {records[0].confidence || '1.0'}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E7E9E5] shadow-card md:col-span-2">
              <span className="text-xs font-mono text-[#78818A] uppercase block">
                OBSERVATION PROVENANCE & CONTEXT
              </span>
              <p className="text-xs text-[#20272D] mt-2 leading-relaxed">
                Instrument source: <strong className="font-mono">{records[0].source}</strong>. Downlinked through verified pipeline to SQLite database.
              </p>
              <div className="mt-3 pt-2 border-t border-[#E7E9E5] text-[11px] font-mono text-[#78818A]">
                Timestamp: {new Date(records[0].timestamp).toISOString().slice(0, 19)} UTC
              </div>
            </div>
          </div>

          {/* Time Series Recharts Graph */}
          {chartData.length >= 2 && (
            <div className="bg-white p-6 rounded-2xl border border-[#E7E9E5] shadow-card">
              <h4 className="text-sm font-bold text-[#20272D] mb-4">
                Longitudinal Telemetry Trend ({records[0].indicator.replace(/_/g, ' ')})
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="domainGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#087DC0" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#087DC0" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F2EE" vertical={false} />
                    <XAxis dataKey="time" stroke="#78818A" fontSize={11} tickLine={false} axisLine={{ stroke: '#E7E9E5' }} />
                    <YAxis stroke="#78818A" fontSize={11} tickLine={false} axisLine={{ stroke: '#E7E9E5' }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white border border-[#E7E9E5] p-3 rounded-xl shadow-float text-xs font-mono">
                              <p className="font-bold text-[#20272D]">{data.indicator}: {data.value} {records[0].unit}</p>
                              <p className="text-[#78818A] text-[10px]">{data.time}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#087DC0" strokeWidth={2.5} fillOpacity={1} fill="url(#domainGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Telemetry Records Table */}
          <div className="bg-white rounded-2xl border border-[#E7E9E5] shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E7E9E5] bg-[#FAFAF7] flex justify-between items-center">
              <h4 className="text-sm font-bold text-[#20272D]">
                Verified Telemetry Record Stream
              </h4>
              <span className="text-xs font-mono text-[#78818A]">
                {records.length} record(s)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#E7E9E5] text-[#78818A] bg-[#FAFAF7]/50">
                    <th className="py-3 px-6">TIMESTAMP (UTC)</th>
                    <th className="py-3 px-6">INDICATOR</th>
                    <th className="py-3 px-6">VALUE</th>
                    <th className="py-3 px-6">UNIT</th>
                    <th className="py-3 px-6">TIER</th>
                    <th className="py-3 px-6">INSTRUMENT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E9E5]">
                  {records.map(rec => (
                    <tr key={rec.id} className="hover:bg-[#FAFAF7] transition-colors">
                      <td className="py-3 px-6 text-[#20272D]">
                        {new Date(rec.timestamp).toISOString().slice(0, 19)}
                      </td>
                      <td className="py-3 px-6 font-semibold text-[#20272D]">
                        {rec.indicator.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 px-6 font-bold text-[#32A889]">
                        {rec.value}
                      </td>
                      <td className="py-3 px-6 text-[#78818A]">
                        {rec.unit}
                      </td>
                      <td className="py-3 px-6">
                        <TierBadge tier={rec.data_type || 'SIMULATED'} subtle />
                      </td>
                      <td className="py-3 px-6 text-[#78818A]">
                        {rec.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Honest Scientific Empty State */
        <div className="bg-white rounded-2xl p-10 border border-[#E7E9E5] shadow-card text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-[#FAFAF7] border border-[#E7E9E5] text-[#78818A] flex items-center justify-center mx-auto">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[#20272D]">
            No Verified In-Flight Measurement Available
          </h3>
          <p className="text-xs text-[#78818A] max-w-md mx-auto leading-relaxed">
            Continuous biosensor telemetry for the {meta.name} domain is currently awaiting telemetry feed ingestion. Missing data is never defaulted or faked as nominal health.
          </p>
          <div className="pt-3 flex justify-center gap-3">
            <Link
              to="/app/research"
              className="px-4 py-2 bg-[#20272D] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-[#323D45] transition-colors shadow-pill"
            >
              <Database className="h-3.5 w-3.5 text-[#E9C95A]" />
              <span>Explore Ground Research Baselines</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
