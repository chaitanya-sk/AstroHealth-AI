import React from 'react';
import { HealthStatus, DataTier, AlertSeverity } from '../../types/dashboard';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: HealthStatus | AlertSeverity | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  className,
  showDot = true 
}) => {
  const norm = String(status).toUpperCase().replace('_', ' ');

  const getColors = () => {
    switch (norm) {
      case 'NORMAL':
      case 'AVAILABLE':
      case 'LOW':
      case 'RESOLVED':
        return {
          bg: 'bg-[#EBF6F3]',
          text: 'text-[#32A889]',
          border: 'border-[#D1EDE5]',
          dot: 'bg-[#32A889]'
        };
      case 'MONITOR':
      case 'MEDIUM':
      case 'SIMULATED DATA':
      case 'SIMULATED':
        return {
          bg: 'bg-[#FDF6EB]',
          text: 'text-[#E7A83C]',
          border: 'border-[#F9E6C4]',
          dot: 'bg-[#E7A83C]'
        };
      case 'REVIEW REQUIRED':
      case 'HIGH':
      case 'CRITICAL':
      case 'ACTIVE':
        return {
          bg: 'bg-[#FBEEEE]',
          text: 'text-[#D95C5C]',
          border: 'border-[#F6D0D0]',
          dot: 'bg-[#D95C5C]'
        };
      case 'RESEARCH DATA':
      case 'RESEARCH':
        return {
          bg: 'bg-[#EBF8FA]',
          text: 'text-[#087DC0]',
          border: 'border-[#D0F0F5]',
          dot: 'bg-[#45BFD2]'
        };
      case 'INSUFFICIENT DATA':
      case 'MODEL UNAVAILABLE':
      default:
        return {
          bg: 'bg-[#F5F5F2]',
          text: 'text-[#78818A]',
          border: 'border-[#E7E9E5]',
          dot: 'bg-[#A0A7AF]'
        };
    }
  };

  const colors = getColors();
  
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-0.5 font-semibold tracking-wide',
    lg: 'text-sm px-3 py-1 font-semibold'
  }[size];

  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors select-none font-mono',
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses,
        className
      )}
    >
      {showDot && (
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', colors.dot)} />
      )}
      <span>{norm}</span>
    </span>
  );
};

interface TierBadgeProps {
  tier: DataTier | string;
  className?: string;
  subtle?: boolean;
}

export const TierBadge: React.FC<TierBadgeProps> = ({ 
  tier, 
  className,
  subtle = false 
}) => {
  const norm = String(tier || 'SIMULATED').toUpperCase().replace('_', ' ');

  const getStyles = () => {
    switch (norm) {
      case 'REAL':
        return 'bg-[#EBF6F3] text-[#32A889] border-[#D1EDE5]';
      case 'RESEARCH':
        return 'bg-[#EBF8FA] text-[#087DC0] border-[#D0F0F5]';
      case 'AI PREDICTION':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SIMULATED':
      default:
        return 'bg-[#FDF6EB] text-[#E7A83C] border-[#F9E6C4]';
    }
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-md border font-semibold select-none',
        getStyles(),
        className
      )}
      title={`Data Tier: ${norm}`}
    >
      {norm}
    </span>
  );
};
