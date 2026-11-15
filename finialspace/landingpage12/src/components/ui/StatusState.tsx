import React from 'react';
import { 
  Loader2, 
  AlertTriangle, 
  AlertOctagon, 
  Database, 
  Lock, 
  WifiOff, 
  Info,
  RefreshCw 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { TierBadge } from './Badge';

export type StateKind = 
  | 'loading' 
  | 'empty' 
  | 'insufficient_data' 
  | 'error' 
  | 'unauthorized' 
  | 'backend_offline';

interface StatusStateProps {
  kind: StateKind;
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  showSimulatedFallbackNotice?: boolean;
}

export const StatusState: React.FC<StatusStateProps> = ({
  kind,
  title,
  message,
  onRetry,
  className,
  showSimulatedFallbackNotice = false,
}) => {
  const getDetails = () => {
    switch (kind) {
      case 'loading':
        return {
          icon: <Loader2 className="h-8 w-8 text-[#8A6A00] animate-spin" />,
          title: title || 'Synchronizing Aerospace Telemetry...',
          message: message || 'Querying FastAPI backend and telemetry bus buffers.',
          bgColor: 'bg-[#F4F0E5]/60',
          borderColor: 'border-stone-200/60',
        };
      case 'empty':
        return {
          icon: <Database className="h-8 w-8 text-[#929292]" />,
          title: title || 'No Telemetry Records Found',
          message: message || 'No measurement records match the current query parameters.',
          bgColor: 'bg-[#F4F0E5]/40',
          borderColor: 'border-stone-200/60',
        };
      case 'insufficient_data':
        return {
          icon: <AlertTriangle className="h-8 w-8 text-[#C79A00]" />,
          title: title || 'INSUFFICIENT DATA',
          message: message || 'Biomarker stream contains fewer than minimum required samples for clinical inference. Standard safety protocol forbids inferring normal status from missing data.',
          bgColor: 'bg-[#F7D85B]/15',
          borderColor: 'border-[#F7D85B]/40',
        };
      case 'unauthorized':
        return {
          icon: <Lock className="h-8 w-8 text-[#D9534F]" />,
          title: title || 'Access Restricted',
          message: message || 'Active Supabase flight surgeon credentials required to view classified crew medical telemetry.',
          bgColor: 'bg-[#D9534F]/10',
          borderColor: 'border-[#D9534F]/30',
        };
      case 'backend_offline':
        return {
          icon: <WifiOff className="h-8 w-8 text-[#8E8E8E]" />,
          title: title || 'FastAPI Backend Disconnected',
          message: message || 'Unable to connect to http://127.0.0.1:8000. Running in high-fidelity simulated telemetry mode.',
          bgColor: 'bg-[#F4F0E5]',
          borderColor: 'border-stone-300',
        };
      case 'error':
      default:
        return {
          icon: <AlertOctagon className="h-8 w-8 text-[#D9534F]" />,
          title: title || 'Telemetry Acquisition Error',
          message: message || 'An unexpected error occurred while communicating with the analysis pipeline.',
          bgColor: 'bg-[#D9534F]/10',
          borderColor: 'border-[#D9534F]/30',
        };
    }
  };

  const details = getDetails();

  return (
    <div className={cn(
      "rounded-3xl p-8 border flex flex-col items-center justify-center text-center transition-all",
      details.bgColor,
      details.borderColor,
      className
    )}>
      <div className="p-3 bg-white/80 rounded-2xl shadow-xs mb-3">
        {details.icon}
      </div>

      <h3 className="text-base font-extrabold text-[#171717] tracking-tight">
        {details.title}
      </h3>
      
      <p className="text-xs text-[#6E6E6E] max-w-md mt-1 leading-relaxed">
        {details.message}
      </p>

      {showSimulatedFallbackNotice && (
        <div className="mt-3 flex items-center gap-1.5 bg-[#FFFDF5] px-3 py-1 rounded-full border border-stone-200 text-[10px]">
          <TierBadge tier="SIMULATED" subtle />
          <span className="text-[#8E8E8E] font-medium">Demonstration telemetry displayed for evaluation</span>
        </div>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-[#292929] hover:bg-black text-white text-xs font-semibold rounded-full flex items-center gap-2 shadow-xs transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
