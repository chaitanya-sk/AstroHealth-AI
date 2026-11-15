import React, { useState } from 'react';
import { 
  Activity, 
  Brain, 
  Wind, 
  ShieldAlert, 
  Check, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  Radio,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import { TierBadge } from '../ui/Badge';

interface AlertCheckItem {
  id: string;
  title: string;
  domain: string;
  time: string;
  status: 'COMPLETED' | 'PENDING';
  severity: 'MODERATE' | 'ADVISORY' | 'NORMAL';
  description: string;
  recommendation: string;
}

const INITIAL_ITEMS: AlertCheckItem[] = [
  {
    id: 'ALT-1',
    title: 'HRV Parasympathetic Suppression',
    domain: 'Cardiovascular',
    time: '28 min ago (22:50 UTC)',
    status: 'COMPLETED', // checked yellow circle
    severity: 'MODERATE',
    description: 'RMSSD dropped below 45ms following high-load EVA egress preparation. Sympathetic tone elevated.',
    recommendation: 'Scheduled 15-minute guided vagal breathing exercise before sleep cycle.'
  },
  {
    id: 'ALT-2',
    title: 'Circadian Phase Delay Observed',
    domain: 'Behavioral Health',
    time: '2 hr ago (21:18 UTC)',
    status: 'COMPLETED', // checked yellow circle
    severity: 'ADVISORY',
    description: 'Actigraphy sleep onset shifted +42 minutes past target mission rest window.',
    recommendation: 'Implement automated blue-attenuated cabin lighting protocol at 21:00 MET.'
  },
  {
    id: 'ALT-3',
    title: 'Cabin ppCO2 Micro-spike Scrubbed',
    domain: 'Cabin Life Support',
    time: '4 hr ago (19:30 UTC)',
    status: 'PENDING', // open circle
    severity: 'ADVISORY',
    description: 'Excursion to 2.8 mmHg in Exercise Bay during simultaneous dual-crew workout.',
    recommendation: 'Dual CDRA beds nominal; CO2 returned to baseline 2.3 mmHg.'
  },
  {
    id: 'ALT-4',
    title: 'SPE Solar Storm Dosimetry Margin',
    domain: 'Radiation Health',
    time: '6 hr ago (17:45 UTC)',
    status: 'PENDING', // open circle
    severity: 'NORMAL',
    description: 'NOAA SWPC space weather quiet. Orion storm shelter ready; ambient flux 46 µGy/hr.',
    recommendation: 'Routine dosimeter badge check on Sol 45.'
  },
  {
    id: 'ALT-5',
    title: 'ARED Resistive Force Target Drift',
    domain: 'Musculoskeletal',
    time: '8 hr ago (15:20 UTC)',
    status: 'PENDING', // open circle
    severity: 'NORMAL',
    description: 'Crew completed 96.4% target volume; peak squat load reached 145kg equivalent.',
    recommendation: 'Maintain current regimen; monitor lumbar strain telemetry.'
  }
];

import { AlertResponse } from '../../types/api';

interface ActiveAlertsCardProps {
  className?: string;
  onViewAll?: () => void;
  alerts?: AlertResponse[];
  loading?: boolean;
}

export const ActiveAlertsCard: React.FC<ActiveAlertsCardProps> = ({ className, onViewAll, alerts, loading }) => {
  const [internalItems, setInternalItems] = useState<AlertCheckItem[]>(INITIAL_ITEMS);
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null);

  // If real alerts are provided from backend, convert them; otherwise fallback
  const isRealAlertsProvided = alerts !== undefined;
  const displayAlerts = isRealAlertsProvided 
    ? alerts.map(a => ({
        id: a.alert_id,
        title: a.title,
        domain: a.domain,
        time: a.timestamp ? new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live',
        status: a.status === 'ACTIVE' ? 'PENDING' : 'COMPLETED',
        severity: a.severity,
        description: a.explanation,
        recommendation: a.recommended_action
      }))
    : internalItems;

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
        };
      }
      return item;
    }));
  };

  const getDomainIcon = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'cardiovascular':
        return <Activity className="h-3.5 w-3.5" />;
      case 'behavioral health':
      case 'behavioral':
        return <Brain className="h-3.5 w-3.5" />;
      case 'cabin life support':
      case 'environment':
      case 'cabin':
        return <Wind className="h-3.5 w-3.5" />;
      case 'radiation health':
      case 'radiation':
        return <Radio className="h-3.5 w-3.5" />;
      default:
        return <ShieldAlert className="h-3.5 w-3.5" />;
    }
  };

  const totalCount = displayAlerts.length;
  const completedCount = displayAlerts.filter(i => i.status === 'COMPLETED').length;

  return (
    <>
      <div 
        className={cn(
          "bg-[#202020] rounded-3xl p-4 sm:p-5 text-white shadow-dark-card flex flex-col justify-between border border-white/5 h-[600px] select-none transition-all duration-300 hover:shadow-2xl",
          className
        )}
      >
        <div>
          {/* Header (Matching 'Onboarding Task 2/8' in reference) */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F7D85B] animate-ping" />
              <h3 className="text-sm font-bold text-white tracking-tight">Active Health Alerts</h3>
            </div>
            {/* Counter Badge (e.g. 2/8 in reference) */}
            <span className="text-sm font-black text-white/90 font-mono tracking-tight bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              {completedCount}/{totalCount}
            </span>
          </div>

          {/* Checklist Items or Nominal State */}
          {displayAlerts.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-[#83A997] flex items-center justify-center">
                <Check className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-tight">
                  Zero Active Health Alerts
                </span>
                <p className="text-[11px] text-white/60 mt-1 max-w-[220px] leading-relaxed">
                  All monitored biotelemetry streams are within nominal aerospace safety boundaries.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#83A997] bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                STATUS: NOMINAL
              </span>
            </div>
          ) : (
            <div className="mt-3.5 space-y-2.5">
              {displayAlerts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveModalItem(item)}
                  className="group p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all flex items-center justify-between gap-3 cursor-pointer"
                >
                  {/* Left: Domain Icon + Title & Subtitle */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#F7D85B] group-hover:text-[#202020] transition-all">
                      {getDomainIcon(item.domain)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={cn(
                        "text-xs font-bold tracking-tight truncate transition-colors",
                        item.status === 'COMPLETED' ? "text-white/80 line-through decoration-white/40" : "text-white group-hover:text-[#F7D85B]"
                      )}>
                        {item.title}
                      </span>
                      <span className="text-[10px] text-white/50 truncate mt-0.5">
                        {item.domain} • {item.time.split('(')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Right: Checkmark Circle */}
                  <button
                    type="button"
                    onClick={(e) => toggleCheck(item.id, e)}
                    className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer"
                    title={item.status === 'COMPLETED' ? 'Mark Active' : 'Mark Cleared'}
                  >
                    {item.status === 'COMPLETED' ? (
                      <div className="h-5 w-5 rounded-full bg-[#F7D85B] flex items-center justify-center text-[#202020] shadow-glow-yellow">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-white/20 group-hover:border-white/50 transition-colors" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Card Footer Action */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-[#83A997]" />
            <span>Autonomous Telemetry Triage</span>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-bold text-[#F7D85B] hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <span>View All Triage</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {activeModalItem && (
        <Modal
          isOpen={Boolean(activeModalItem)}
          onClose={() => setActiveModalItem(null)}
          title={activeModalItem.title}
          subtitle={`Telemetry Alert • ${activeModalItem.domain}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#F4F0E5] rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#171717]">Triage Status:</span>
                <span className={cn(
                  "text-xs font-black px-2 py-0.5 rounded-full",
                  activeModalItem.status === 'COMPLETED' ? "bg-[#83A997]/20 text-[#244234]" : "bg-[#F7D85B]/30 text-[#8A6A00]"
                )}>
                  {activeModalItem.status === 'COMPLETED' ? 'ACKNOWLEDGED / CLEARED' : 'ACTIVE / REQUIRES REVIEW'}
                </span>
              </div>
              <TierBadge tier="SIMULATED" subtle />
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#6E6E6E] uppercase tracking-wider mb-1">
                Telemetry Anomaly Description
              </h4>
              <p className="text-xs text-[#171717] bg-[#FFFDF5] p-3 rounded-2xl border border-stone-200/60 leading-relaxed">
                {activeModalItem.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#6E6E6E] uppercase tracking-wider mb-1">
                Autonomous Bio-Medical Recommendation
              </h4>
              <div className="p-3 bg-[#83A997]/15 rounded-2xl border border-[#83A997]/30 text-xs text-[#244234] font-medium leading-relaxed">
                {activeModalItem.recommendation}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  toggleCheck(activeModalItem.id, {} as any);
                  setActiveModalItem(null);
                }}
                className="px-4 py-2 bg-[#292929] hover:bg-black text-white text-xs font-bold rounded-xl transition-all"
              >
                {activeModalItem.status === 'COMPLETED' ? 'Re-open Alert' : 'Acknowledge & Clear'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
