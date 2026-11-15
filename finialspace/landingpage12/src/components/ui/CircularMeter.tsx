import React, { useState } from 'react';
import { Play, Pause, RotateCw, Activity, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CircularMeterProps {
  title?: string;
  value?: number; // 0 - 100
  label?: string;
  sublabel?: string;
  timeString?: string;
  className?: string;
  onExpand?: () => void;
}

export const CircularMeter: React.FC<CircularMeterProps> = ({
  title = "Autonomic Recovery",
  value = 74,
  label = "Recovery Index",
  timeString = "68 bpm",
  className,
  onExpand
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Compact radius that comfortably fits all column widths
  const radius = 54;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // Generate 36 tick marks around dial
  const ticks = Array.from({ length: 36 }, (_, i) => {
    const angle = (i * 360) / 36;
    const isMajor = i % 3 === 0;
    return { angle, isMajor };
  });

  return (
    <div className={cn(
      "bg-[#FFFDF5] rounded-3xl p-5 border border-stone-200/60 shadow-soft flex flex-col justify-between h-[340px] transition-all duration-300 hover:shadow-float relative group",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm sm:text-base font-bold text-[#171717] truncate">{title}</h3>
        <button 
          onClick={onExpand}
          className="h-7 w-7 rounded-full bg-[#F4F0E5]/80 hover:bg-[#F7D85B] text-[#292929] flex items-center justify-center transition-colors shrink-0"
          title="Inspect Telemetry"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Circular Gauge Center */}
      <div className="relative flex items-center justify-center my-auto py-2">
        {/* Subtle radial ticks */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-36 h-36" viewBox="0 0 140 140">
            {ticks.map(({ angle, isMajor }, idx) => (
              <line
                key={idx}
                x1="70"
                y1={isMajor ? "10" : "13"}
                x2="70"
                y2="17"
                stroke={isMajor ? "#929292" : "#D4D2C9"}
                strokeWidth={isMajor ? "1.5" : "1"}
                strokeLinecap="round"
                transform={`rotate(${angle} 70 70)`}
              />
            ))}
          </svg>
        </div>

        {/* SVG Progress Arc */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="rotate-[-90deg] drop-shadow-xs"
        >
          {/* Background track */}
          <circle
            stroke="#F0ECE1"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Active colored arc */}
          <circle
            stroke="#F7D85B"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[#171717]">
            {timeString}
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#8E8E8E] mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
        <div className="flex items-center gap-1.5 bg-[#F4F0E5] rounded-full p-1 border border-stone-200/50">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-6 w-6 rounded-full bg-white hover:bg-[#F7D85B] text-[#171717] flex items-center justify-center transition-all shadow-xs"
            title={isPlaying ? "Pause Stream" : "Resume Stream"}
          >
            {isPlaying ? (
              <Pause className="h-3 w-3 fill-[#171717]" />
            ) : (
              <Play className="h-3 w-3 fill-[#171717] ml-0.5" />
            )}
          </button>
          <button 
            onClick={() => {}}
            className="h-6 w-6 rounded-full hover:bg-white/80 text-[#6E6E6E] hover:text-[#171717] flex items-center justify-center transition-all"
            title="Reset Buffer"
          >
            <RotateCw className="h-2.5 w-2.5" />
          </button>
        </div>

        <div className="h-7 w-7 rounded-full bg-[#292929] text-white flex items-center justify-center shadow-xs">
          <Activity className="h-3.5 w-3.5 text-[#F7D85B]" />
        </div>
      </div>
    </div>
  );
};
