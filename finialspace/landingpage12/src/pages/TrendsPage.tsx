import React, { useState, useEffect } from 'react';
import { 
  LineChart as LineChartIcon, 
  Activity, 
  Clock, 
  Database, 
  AlertCircle,
  HeartPulse,
  ShieldCheck,
  Dumbbell,
  Brain,
  Radiation,
  Wind,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useAstronaut } from '../contexts/AstronautContext';
import { healthService } from '../services/api/healthService';
import { HealthRecordResponse } from '../types/api';
import { StatusBadge, TierBadge } from '../components/ui/Badge';

export const TrendsPage: React.FC = () => {
  const { activeAstronautId, activeAstronaut } = useAstronaut();

  const [records, setRecords] = useState<HealthRecordResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDomain, setSelectedDomain] = useState<string>('cardiovascular');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await healthService.getAstronautData(activeAstronautId);
      setRecords(data || []);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [activeAstronautId]);

  const domainRecords = records
    .filter(r => r.domain === selectedDomain)
    .sort((a, b) => new Date(a.timestamp || (a as any).recorded_at || a.created_at).getTime() - new Date(b.timestamp || (b as any).recorded_at || b.created_at).getTime());

  const chartData = domainRecords.map(r => {
    const rawTime = r.timestamp || (r as any).recorded_at || r.created_at;
    const d = new Date(rawTime);
    return {
      timestamp: isNaN(d.getTime()) ? rawTime : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullTime: rawTime,
      value: r.value,
      indicator: r.indicator,
      unit: r.unit,
      provenance: r.source || r.data_type || 'Operational Telemetry'
    };
  });

  const activeIndicator = domainRecords[0]?.indicator || 'Observation';
  const activeUnit = domainRecords[0]?.unit || '';
  const activeProvenance = domainRecords[0]?.source || domainRecords[0]?.data_type || 'Operational Telemetry Ingest';

  const domainTabs = [
    { id: 'cardiovascular', name: 'Cardiovascular', icon: <HeartPulse className="h-4 w-4" /> },
    { id: 'immune', name: 'Immune System', icon: <ShieldCheck className="h-4 w-4" /> },
    { id: 'bone_muscle', name: 'Bone & Muscle', icon: <Dumbbell className="h-4 w-4" /> },
    { id: 'behavioral', name: 'Behavioral & Sleep', icon: <Brain className="h-4 w-4" /> },
    { id: 'radiation', name: 'Radiation Exposure', icon: <Radiation className="h-4 w-4" /> },
    { id: 'environment', name: 'Cabin Atmosphere', icon: <Wind className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E7E9E5] shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-[#FAFAF7] border border-[#E7E9E5] text-[#20272D] flex items-center justify-center shrink-0">
              <LineChartIcon className="h-6 w-6 text-[#087DC0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#20272D] tracking-tight">
                  Longitudinal Health Trends
                </h1>
                <TierBadge tier={activeAstronaut.tier} />
              </div>
              <p className="text-xs text-[#78818A] font-mono mt-0.5">
                Evidence-based time-series plots derived from real downlink observations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#78818A]">
            <span>Subject: <strong className="text-[#20272D]">{activeAstronaut.name}</strong></span>
            <span>•</span>
            <span>Total Ingest: <strong className="text-[#32A889]">{records.length} records</strong></span>
          </div>
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
        {domainTabs.map(tab => {
          const isSel = selectedDomain === tab.id;
          const count = records.filter(r => r.domain === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedDomain(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium font-mono transition-all border flex items-center gap-2 whitespace-nowrap ${
                isSel
                  ? 'bg-[#20272D] text-white border-[#20394B] shadow-pill font-semibold'
                  : 'bg-white text-[#78818A] border-[#E7E9E5] hover:text-[#20272D]'
              }`}
            >
              <span>{tab.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                count > 0 ? 'bg-[#32A889]/20 text-[#32A889]' : 'bg-[#E7E9E5] text-[#78818A]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Chart Card */}
      {chartData.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#E7E9E5] p-6 shadow-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E7E9E5]">
            <div>
              <span className="text-xs font-mono font-bold text-[#78818A] uppercase">
                ACTIVE TIME-SERIES INDICATOR
              </span>
              <h3 className="text-base font-bold text-[#20272D]">
                {activeIndicator.replace(/_/g, ' ')} ({activeUnit})
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#78818A]">Provenance:</span>
              <span className="text-[#20272D] font-semibold">{activeProvenance}</span>
            </div>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 25, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2EE" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#78818A" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#E7E9E5' }} 
                />
                <YAxis 
                  stroke="#78818A" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#E7E9E5' }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-[#E7E9E5] p-3 rounded-xl shadow-float text-xs font-mono space-y-1">
                          <p className="font-bold text-[#20272D]">{data.indicator.replace(/_/g, ' ')}: {data.value} {data.unit}</p>
                          <p className="text-[#78818A] text-[10px]">Timestamp: {data.fullTime}</p>
                          <p className="text-[#32A889] text-[10px]">Provenance: {data.provenance}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#087DC0" 
                  strokeWidth={2.5} 
                  dot={{ fill: '#087DC0', stroke: '#FFFFFF', strokeWidth: 2, r: 5 }}
                  activeDot={{ fill: '#E9C95A', stroke: '#20272D', strokeWidth: 2, r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 border border-[#E7E9E5] shadow-card text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-[#FAFAF7] border border-[#E7E9E5] text-[#78818A] flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[#20272D]">
            No Longitudinal Measurements for {selectedDomain.replace(/_/g, ' ')}
          </h3>
          <p className="text-xs text-[#78818A] max-w-sm mx-auto leading-relaxed">
            Data integrity rule: Graphs are rendered only with verified timestamped observations. Synthetic or interpolated time-series data is strictly prevented.
          </p>
        </div>
      )}
    </div>
  );
};
