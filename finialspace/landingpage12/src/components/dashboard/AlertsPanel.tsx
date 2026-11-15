import React, { useState } from 'react';
import { 
  Heart, 
  Brain, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  Check, 
  Clock, 
  ExternalLink, 
  ShieldAlert, 
  Radio, 
  Zap, 
  Activity 
} from 'lucide-react';
import { AlertItem } from '../../types/dashboard';
import { ACTIVE_ALERTS } from '../../data/dashboardDemoData';
import { cn } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import { TierBadge } from '../ui/Badge';

interface AlertsPanelProps {
  onViewAllAlerts?: () => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ onViewAllAlerts }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>(ACTIVE_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const toggleAlertStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: a.status === 'ACTIVE' ? 'ACKNOWLEDGED' : 'ACTIVE'
        };
      }
      return a;
    }));
  };

  const getDomainIcon = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'cardiovascular':
        return <Activity className="h-3.5 w-3.5" />;
      case 'behavioral health':
      case 'behavioral':
        return <Brain className="h-3.5 w-3.5" />;
      case 'cabin environment':
      case 'cabin':
        return <Wind className="h-3.5 w-3.5" />;
      default:
        return <Zap className="h-3.5 w-3.5" />;
    }
  };

  const activeCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const totalCount = alerts.length;

  return (
    <div className="flex flex-col gap-2.5 h-full min-h-[360px] justify-between">
      {/* Upper Progress Pill Header (Directly from reference: Onboarding 18%, 30% Task, 25%, 0%) */}
      <div className="bg-[#FFFDF5] rounded-3xl p-3 sm:p-3.5 border border-stone-200/60 shadow-soft shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-[#171717]">Alert Triage Status</span>
          <span className="text-xs font-black text-[#171717]">
            {Math.round(((totalCount - activeCount) / totalCount) * 100)}% Cleared
          </span>
        </div>

        {/* Triple Segmented Progress Pill */}
        <div className="flex items-center gap-1 h-6">
          <div className="h-full bg-[#F7D85B] rounded-lg px-2 flex items-center justify-between flex-1 text-[9px] font-black text-[#292929]">
            <span>Advisory</span>
            <span>67%</span>
          </div>
          <div className="h-full bg-[#292929] rounded-lg px-2 flex items-center justify-between flex-1 text-[9px] font-bold text-white">
            <span>Moderate</span>
            <span>33%</span>
          </div>
          <div className="h-full bg-[#E5E2D6] rounded-lg px-1.5 flex items-center justify-center w-8 text-[9px] font-bold text-[#6E6E6E]">
            <span>0%</span>
          </div>
        </div>
      </div>

      {/* Signature Dark Charcoal Card (Matching Reference Onboarding Task 2/8) */}
      <div className="bg-[#202020] rounded-3xl p-4 text-white shadow-dark-card flex-1 flex flex-col justify-between border border-white/5">
        <div>
          {/* Card Title & Counter */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#F7D85B] animate-ping" />
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">Active Health Alerts</h3>
            </div>
            <span className="text-xs font-extrabold text-white/90 font-mono tracking-tight bg-white/10 px-2 py-0.5 rounded-full">
              {activeCount}/{totalCount}
            </span>
          </div>

          {/* List of Alerts */}
          <div className="mt-2 space-y-1.5">
            {alerts.slice(0, 3).map((alert) => {
              const isAcknowledged = alert.status === 'ACKNOWLEDGED';
              const isResolved = alert.status === 'RESOLVED';
              const isDone = isAcknowledged || isResolved;

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Domain Icon Circle */}
                    <div className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      alert.severity === 'HIGH' || alert.severity === 'CRITICAL'
                        ? "bg-[#D9534F]/20 text-[#D9534F]"
                        : alert.severity === 'MEDIUM'
                          ? "bg-[#F7D85B]/20 text-[#F7D85B]"
                          : "bg-white/10 text-white/80"
                    )}>
                      {getDomainIcon(alert.domain)}
                    </div>

                    {/* Text Details */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold text-white/95 truncate group-hover:text-[#F7D85B] transition-colors leading-tight">
                        {alert.title}
                      </span>
                      <span className="text-[9px] text-white/50 truncate">
                        {alert.domain} • {alert.timestamp.split('(')[0].trim()}
                      </span>
                    </div>
                  </div>

                  {/* Right Checkmark Button */}
                  <button
                    onClick={(e) => toggleAlertStatus(alert.id, e)}
                    className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center transition-all shrink-0 shadow-xs",
                      isDone
                        ? "bg-[#F7D85B] text-[#292929]"
                        : "border-2 border-white/20 hover:border-[#F7D85B]"
                    )}
                    title={isDone ? "Alert acknowledged" : "Click to acknowledge"}
                  >
                    {isDone && <Check className="h-3 w-3 stroke-[3]" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info / quick triage link */}
        <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
          <TierBadge tier="SIMULATED" subtle className="bg-white/10 text-[#F7D85B] border-none text-[8px] py-0 px-1.5" />
          <button 
            onClick={onViewAllAlerts}
            className="hover:text-white transition-colors flex items-center gap-1 font-medium text-[10px]"
          >
            <span>Triage Log</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      {/* Alert Detail Modal */}
      <Modal
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert?.title || "Alert Detail"}
        subtitle={`Telemetry Trigger ID: ${selectedAlert?.id} • Sol 42`}
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#F4F0E5] p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#6E6E6E]">Severity:</span>
                <span className={cn(
                  "text-xs font-extrabold px-2.5 py-0.5 rounded-full",
                  selectedAlert.severity === 'MEDIUM' ? 'bg-[#F7D85B] text-[#292929]' : 'bg-[#D9534F] text-white'
                )}>
                  {selectedAlert.severity}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#6E6E6E]">Domain:</span>
                <span className="text-xs font-bold text-[#171717]">{selectedAlert.domain}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-1">
                Telemetry Observation
              </h4>
              <p className="text-sm text-[#292929] bg-[#FFFDF5] p-3.5 rounded-2xl border border-stone-200">
                {selectedAlert.description}
              </p>
            </div>

            {selectedAlert.recommendedAction && (
              <div>
                <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-1">
                  Clinical Action Protocol
                </h4>
                <p className="text-sm text-[#4A725F] bg-[#83A997]/15 p-3.5 rounded-2xl border border-[#83A997]/30 font-medium">
                  {selectedAlert.recommendedAction}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
