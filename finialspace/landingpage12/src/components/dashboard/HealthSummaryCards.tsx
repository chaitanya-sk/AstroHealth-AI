import React from 'react';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Database, 
  ArrowUpRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { SUMMARY_STATS } from '../../data/dashboardDemoData';
import { SummaryStat } from '../../types/dashboard';
import { TierBadge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface HealthSummaryCardsProps {
  onSelectStat?: (statId: string) => void;
  stats?: SummaryStat[];
}

export const HealthSummaryCards: React.FC<HealthSummaryCardsProps> = ({ onSelectStat, stats }) => {
  const activeStats = stats || SUMMARY_STATS;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className="h-5 w-5" />;
      case 'Activity':
        return <Activity className="h-5 w-5" />;
      case 'AlertTriangle':
        return <AlertTriangle className="h-5 w-5" />;
      case 'Database':
        return <Database className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {activeStats.map((stat) => (
        <div
          key={stat.id}
          onClick={() => onSelectStat?.(stat.id)}
          className="bg-[#FFFDF5] rounded-3xl p-5 border border-stone-200/60 shadow-soft hover:shadow-float transition-all duration-300 group cursor-pointer flex flex-col justify-between"
        >
          {/* Card Top: Icon & Tier Badge */}
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-2xl bg-[#F4F0E5] group-hover:bg-[#F7D85B] text-[#292929] flex items-center justify-center transition-colors shadow-xs">
              {getIcon(stat.icon)}
            </div>
            <div className="flex items-center gap-1.5">
              <TierBadge tier={stat.tier} subtle className="text-[9px]" />
              <div className="h-7 w-7 rounded-full bg-transparent group-hover:bg-[#F4F0E5] flex items-center justify-center text-[#929292] group-hover:text-[#171717] transition-all">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Value and Label */}
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
                {stat.value}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#171717] mt-0.5">
              {stat.label}
            </h4>
            <p className="text-xs text-[#6E6E6E] mt-0.5">
              {stat.sublabel}
            </p>
          </div>

          {/* Subtext & Trend pill */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
            <span className="text-[#83A997] font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stat.trend}
            </span>
            <span className="text-[10px] text-[#929292] uppercase font-mono">
              Live Stream
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

