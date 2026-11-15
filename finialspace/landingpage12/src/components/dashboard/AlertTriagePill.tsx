import React from 'react';
import { cn } from '../../lib/utils';

interface AlertTriagePillProps {
  activeCount?: number;
  totalCount?: number;
  className?: string;
  onClick?: () => void;
}

export const AlertTriagePill: React.FC<AlertTriagePillProps> = ({
  activeCount = 0,
  totalCount = 0,
  className,
  onClick
}) => {
  const clearedPercentage = totalCount === 0 ? 100 : Math.max(0, Math.round(((totalCount - activeCount) / totalCount) * 100));

  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-[#FFFDF5] rounded-3xl p-3 sm:p-3.5 border border-stone-200/60 shadow-soft h-[80px] flex flex-col justify-between transition-all duration-300 hover:shadow-float cursor-pointer select-none",
        className
      )}
    >
      {/* Title & Percentage Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#171717]">Alert Triage Status</span>
        <span className="text-xs font-black text-[#171717]">
          {totalCount === 0 ? "100% Nominal" : `${clearedPercentage}% Cleared`}
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="flex items-center gap-1.5 h-6">
        {totalCount === 0 ? (
          <div className="h-full bg-[#83A997]/20 border border-[#83A997]/40 rounded-lg px-2 flex items-center justify-between flex-1 text-[9px] font-bold text-[#4A725F]">
            <span>0 Active Threshold Excursions</span>
            <span>All Clear</span>
          </div>
        ) : (
          <>
            <div className="h-full bg-[#F7D85B] rounded-lg px-2 flex items-center justify-between flex-1 text-[9px] font-black text-[#292929] shadow-2xs">
              <span>Active</span>
              <span>{activeCount}</span>
            </div>
            <div className="h-full bg-[#292929] rounded-lg px-2 flex items-center justify-between flex-1 text-[9px] font-bold text-white shadow-2xs">
              <span>Cleared</span>
              <span>{totalCount - activeCount}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

