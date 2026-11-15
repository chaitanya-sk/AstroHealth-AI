import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { 
  LineChart as LineChartIcon, 
  Clock, 
  Info, 
  AlertCircle,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { TierBadge } from '../ui/Badge';
import { HealthRecordResponse, HealthDomain } from '../../types/api';

interface HealthTrendsSectionProps {
  records: HealthRecordResponse[];
  activeAstronautId: string;
}

export const HealthTrendsSection: React.FC<HealthTrendsSectionProps> = ({
  records,
  activeAstronautId
}) => {
  const domainWithRecords = Array.from(new Set(records.map(r => r.domain)));
  const [selectedDomain, setSelectedDomain] = useState<string>('cardiovascular');

  const domainRecords = records
    .filter(r => r.domain === selectedDomain)
    .sort((a, b) => new Date(a.timestamp || (a as any).recorded_at).getTime() - new Date(b.timestamp || (b as any).recorded_at).getTime());

  // Real timestamped chart points
  const chartData = domainRecords.map(r => {
    const rawTime = r.timestamp || (r as any).recorded_at || r.created_at;
    const d = new Date(rawTime);
    return {
      timestamp: isNaN(d.getTime()) ? rawTime : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullTime: rawTime,
      value: r.value,
      indicator: r.indicator,
      unit: r.unit,
      provenance: r.source || r.data_type || 'Operational Store'
    };
  });

  const activeIndicator = domainRecords[0]?.indicator || 'Observation';
  const activeUnit = domainRecords[0]?.unit || '';
  const activeProvenance = domainRecords[0]?.source || domainRecords[0]?.data_type || 'Operational Store';

  return (
    <div className="bg-white rounded-2xl border border-[#E7E9E5] p-6 sm:p-7 shadow-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7E9E5]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#087DC0] bg-[#EBF8FA] px-2.5 py-0.5 rounded-full border border-[#D0F0F5]">
              LONGITUDINAL TELEMETRY TRENDS
            </span>
          </div>
          <h3 className="text-base font-bold text-[#20272D] leading-tight mt-1">
            Verified Time-Series Observations
          </h3>
          <p className="text-xs text-[#78818A] font-mono leading-tight mt-0.5">
            Real downlink observations plotted against physiological baseline parameters
          </p>
        </div>

        {/* Domain Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['cardiovascular', 'immune', 'bone_muscle', 'behavioral', 'radiation', 'environment'] as HealthDomain[]).map(d => {
            const isSel = selectedDomain === d;
            const hasData = domainWithRecords.includes(d);
            return (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                  isSel 
                    ? 'bg-[#20272D] text-white border-[#20394B] shadow-sm font-semibold' 
                    : 'bg-[#FAFAF7] text-[#78818A] border-[#E7E9E5] hover:text-[#20272D]'
                }`}
              >
                <span>{d.replace('_', ' ')}</span>
                {hasData && (
                  <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-[#32A889] inline-block" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart Area */}
      {chartData.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#20272D] font-mono uppercase">
                {activeIndicator.replace('_', ' ')}
              </span>
              <span className="text-[#78818A] font-mono">({activeUnit})</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#32A889]" />
              <span className="text-[#32A889] font-mono font-medium">{chartData.length} observation point(s)</span>
            </div>
            <div className="text-[11px] font-mono text-[#78818A]">
              Provenance: <span className="text-[#20272D]">{activeProvenance}</span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
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
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-[#E7E9E5] p-3 rounded-xl shadow-float text-xs font-mono space-y-1">
                          <p className="font-bold text-[#20272D]">{data.indicator.replace('_', ' ')}: {data.value} {data.unit}</p>
                          <p className="text-[#78818A] text-[10px]">Timestamp: {data.fullTime}</p>
                          <p className="text-[#32A889] text-[10px]">Source: {data.provenance}</p>
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
                  dot={{ fill: '#087DC0', stroke: '#FFFFFF', strokeWidth: 2, r: 4 }}
                  activeDot={{ fill: '#E9C95A', stroke: '#20272D', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] space-y-2">
          <div className="h-10 w-10 rounded-full bg-[#E7E9E5]/60 text-[#78818A] flex items-center justify-center mx-auto">
            <AlertCircle className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-[#20272D]">
            No verified time-series data for {selectedDomain.replace('_', ' ')}
          </p>
          <p className="text-xs text-[#78818A] max-w-sm mx-auto font-mono">
            Scientific rule: Artificial longitudinal trends are strictly prohibited. Graph will populate as operational sensors stream.
          </p>
        </div>
      )}
    </div>
  );
};
