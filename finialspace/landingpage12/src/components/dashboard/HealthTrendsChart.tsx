import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  Activity, 
  Heart, 
  Clock, 
  Calendar, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { HEALTH_TREND_DATA } from '../../data/dashboardDemoData';
import { TierBadge } from '../ui/Badge';
import { cn } from '../../lib/utils';

type RangeOption = '24h' | '7d' | '30d' | 'mission';

export const HealthTrendsChart: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<RangeOption>('24h');
  const [showHR, setShowHR] = useState(true);
  const [showHRV, setShowHRV] = useState(true);
  const [showBaseline, setShowBaseline] = useState(true);

  // Custom Recharts Tooltip styled with our dashboard theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#292929] text-white p-3 rounded-2xl shadow-xl border border-white/10 text-xs space-y-1.5 z-50">
          <div className="flex items-center justify-between gap-4 font-mono text-[11px] text-white/60 pb-1 border-b border-white/10">
            <span>Time: {label} UTC</span>
            <span className="text-[#F7D85B]">Sol 42</span>
          </div>

          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-white/80">
                <span 
                  className="h-2 w-2 rounded-full" 
                  style={{ backgroundColor: entry.color }} 
                />
                {entry.name}:
              </span>
              <span className="font-bold font-mono">
                {entry.value} {entry.name.includes('Heart') ? 'bpm' : 'ms'}
              </span>
            </div>
          ))}

          {payload[0]?.payload?.sleepStage && (
            <div className="pt-1 text-[10px] text-[#F7D85B] font-semibold border-t border-white/10">
              Stage: {payload[0].payload.sleepStage} State
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#FFFDF5] rounded-3xl p-6 border border-stone-200/60 shadow-soft flex flex-col justify-between">
      {/* Chart Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-[#171717] tracking-tight">
              Biotelemetry Trends & Circadian Rhythm
            </h3>
            <TierBadge tier="SIMULATED" subtle className="text-[9px]" />
          </div>
          <p className="text-xs text-[#6E6E6E] font-medium mt-0.5">
            Continuous continuous ambulatory ECG & autonomic parasympathetic tone (RMSSD)
          </p>
        </div>

        {/* Date Range Selector Pill Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Range pills */}
          <div className="flex items-center bg-[#F4F0E5] p-1 rounded-full border border-stone-200/70">
            {(['24h', '7d', '30d', 'mission'] as RangeOption[]).map((range) => {
              const labelMap: Record<RangeOption, string> = {
                '24h': '24 Hours',
                '7d': '7 Days',
                '30d': '30 Days',
                'mission': 'Mission Sol'
              };
              const isActive = selectedRange === range;
              return (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200",
                    isActive
                      ? "bg-[#292929] text-white shadow-xs"
                      : "text-[#6E6E6E] hover:text-[#171717]"
                  )}
                >
                  {labelMap[range]}
                </button>
              );
            })}
          </div>

          {/* Metric Toggle Buttons */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
            <button
              onClick={() => setShowHR(!showHR)}
              className={cn(
                "px-2.5 py-1 text-xs font-bold rounded-full border transition-all flex items-center gap-1",
                showHR 
                  ? "bg-[#292929] text-white border-transparent" 
                  : "bg-white text-[#929292] border-stone-200"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#E06D53]" />
              <span>HR</span>
            </button>
            <button
              onClick={() => setShowHRV(!showHRV)}
              className={cn(
                "px-2.5 py-1 text-xs font-bold rounded-full border transition-all flex items-center gap-1",
                showHRV 
                  ? "bg-[#292929] text-white border-transparent" 
                  : "bg-white text-[#929292] border-stone-200"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#F7D85B]" />
              <span>HRV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={HEALTH_TREND_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Heart Rate Red/Coral Gradient */}
              <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E06D53" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#E06D53" stopOpacity={0.0} />
              </linearGradient>

              {/* HRV Soft Yellow Gradient */}
              <linearGradient id="colorHRV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F7D85B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F7D85B" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE7DC" />

            <XAxis 
              dataKey="time" 
              stroke="#929292" 
              tick={{ fontSize: 11, fill: '#929292' }}
              tickLine={false}
              axisLine={{ stroke: '#EBE7DC' }}
            />

            <YAxis 
              stroke="#929292" 
              tick={{ fontSize: 11, fill: '#929292' }}
              tickLine={false}
              axisLine={false}
              domain={[20, 140]}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Baseline threshold line */}
            {showBaseline && (
              <ReferenceLine 
                y={65} 
                stroke="#83A997" 
                strokeDasharray="4 4" 
                label={{ value: 'Target Baseline (65 bpm)', fill: '#4A725F', fontSize: 10, position: 'insideTopRight' }} 
              />
            )}

            {/* Heart Rate Area */}
            {showHR && (
              <Area
                type="monotone"
                dataKey="heartRate"
                name="Heart Rate"
                stroke="#E06D53"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorHR)"
                activeDot={{ r: 6, fill: '#E06D53', stroke: '#FFFDF5', strokeWidth: 2 }}
              />
            )}

            {/* HRV Area */}
            {showHRV && (
              <Area
                type="monotone"
                dataKey="hrv"
                name="HRV (RMSSD)"
                stroke="#C79A00"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorHRV)"
                activeDot={{ r: 6, fill: '#F7D85B', stroke: '#292929', strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicators */}
      <div className="pt-3 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6E6E6E]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#E06D53]" />
            <span className="font-semibold text-[#171717]">Heart Rate:</span> 68 bpm (Avg 71)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#F7D85B]" />
            <span className="font-semibold text-[#171717]">HRV RMSSD:</span> 44 ms (Dip: -14%)
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[#83A997]">
            • 12:00 UTC Spike: Scheduled ARED Squat Cycle
          </span>
        </div>

        <span className="text-[10px] text-[#929292] font-mono">
          Sampling: 100Hz Telemetry Filtered
        </span>
      </div>
    </div>
  );
};

