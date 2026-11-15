import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Check, 
  ChevronRight, 
  Heart, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  Radio,
  Clock,
  FlaskConical,
  Sparkles,
  Info
} from 'lucide-react';
import { useAstronaut } from '../contexts/AstronautContext';
import { StatusBadge, TierBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { AstronautProfile } from '../types/dashboard';
import { cn } from '../lib/utils';

export const AstronautsPage: React.FC = () => {
  const { roster, activeAstronautId, setActiveAstronautId, registerNewAstronaut, apiAstronauts } = useAstronaut();

  const [activeTab, setActiveTab] = useState<'flight' | 'research'>('flight');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    astronaut_id: '',
    name: '',
    mission_id: 'Artemis III',
    role: 'Mission Specialist',
    mission_day: 42,
    blood_type: 'O+',
    resting_hr_baseline: 65,
    resting_bp_sys_baseline: 115,
    resting_bp_dia_baseline: 75,
  });
  const [registering, setRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter research subjects (MMASH)
  const researchCohort = apiAstronauts.filter(
    a => a.mission_id === 'MMASH_TERRESTRIAL_RESEARCH' || a.astronaut_id.toUpperCase().startsWith('MMASH_')
  );

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setErrorMsg(null);

    try {
      await registerNewAstronaut(formData);
      setRegisterModalOpen(false);
      setFormData({
        astronaut_id: '',
        name: '',
        mission_id: 'Artemis III',
        role: 'Mission Specialist',
        mission_day: 42,
        blood_type: 'O+',
        resting_hr_baseline: 65,
        resting_bp_sys_baseline: 115,
        resting_bp_dia_baseline: 75,
      });
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to register astronaut in SQLite database.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E7E9E5] shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-[#FAFAF7] border border-[#E7E9E5] text-[#20272D] flex items-center justify-center shadow-sm shrink-0">
              <Users className="h-6 w-6 text-[#45BFD2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#20272D] tracking-tight">
                  Astronaut Crew Management
                </h1>
                <TierBadge tier="SIMULATED" subtle />
              </div>
              <p className="text-xs text-[#78818A] font-mono mt-0.5">
                Manage registered flight crew profiles, mission assignments, and pre-flight baseline calibrations
              </p>
            </div>
          </div>

          <button
            onClick={() => setRegisterModalOpen(true)}
            className="px-4 py-2.5 bg-[#20272D] hover:bg-[#323D47] text-white text-xs font-mono font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto cursor-pointer"
          >
            <UserPlus className="h-4 w-4 text-[#E9C95A]" />
            <span>Register New Astronaut</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-[#E7E9E5]">
          <button
            onClick={() => setActiveTab('flight')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeTab === 'flight'
                ? "bg-[#20272D] text-white shadow-pill"
                : "bg-[#FAFAF7] border border-[#E7E9E5] text-[#78818A] hover:text-[#20272D] hover:bg-white"
            )}
          >
            <Users className="h-3.5 w-3.5 text-[#45BFD2]" />
            <span>Operational Flight Crew ({roster.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('research')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeTab === 'research'
                ? "bg-[#20272D] text-white shadow-pill"
                : "bg-[#FAFAF7] border border-[#E7E9E5] text-[#78818A] hover:text-[#20272D] hover:bg-white"
            )}
          >
            <FlaskConical className="h-3.5 w-3.5 text-[#32A889]" />
            <span>Terrestrial Research Cohort ({researchCohort.length})</span>
          </button>
        </div>
      </div>

      {/* Governance & Integrity Banner */}
      <div className="p-4 rounded-xl bg-[#F5F2E9] border border-[#E9C95A]/40 flex items-start gap-3">
        <Info className="h-5 w-5 text-[#E7A83C] shrink-0 mt-0.5" />
        <div className="text-xs font-mono text-[#78818A] leading-relaxed">
          <span className="text-[#20272D] font-bold">Aerospace Provenance Protocol: </span>
          Operational flight crew profiles represent active telemetry monitoring targets. Terrestrial research subjects (MMASH) are strictly isolated for reference modeling and are excluded from operational flight telemetry routing.
        </div>
      </div>

      {/* Operational Flight Crew Roster Grid */}
      {activeTab === 'flight' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roster.map((astro) => {
            const isActive = astro.id === activeAstronautId;
            return (
              <div
                key={astro.id}
                onClick={() => setActiveAstronautId(astro.id)}
                className={cn(
                  "rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between group",
                  isActive 
                    ? "bg-white border-[#20272D] ring-2 ring-[#20272D]/20 shadow-card" 
                    : "bg-white border-[#E7E9E5] hover:border-[#45BFD2] shadow-card hover:shadow-md"
                )}
              >
                <div>
                  <div className="relative mb-3">
                    <img
                      src={astro.avatarUrl}
                      alt={astro.name}
                      className="w-full h-36 rounded-xl object-cover object-top border border-[#E7E9E5]"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <StatusBadge status={astro.status} size="sm" />
                    </div>
                    {isActive && (
                      <div className="absolute bottom-2.5 left-2.5 bg-[#20272D]/90 backdrop-blur-sm border border-white/20 text-[#E9C95A] text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                        <Check className="h-3 w-3" />
                        <span>ACTIVE TELEMETRY</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#20272D] font-mono">{astro.name}</h3>
                    <span className="text-[10px] font-mono text-[#20272D] bg-[#FAFAF7] border border-[#E7E9E5] px-1.5 py-0.5 rounded font-bold">
                      {astro.id}
                    </span>
                  </div>

                  <p className="text-xs text-[#78818A] font-mono mt-0.5">{astro.role}</p>

                  <div className="mt-3 pt-3 border-t border-[#E7E9E5] grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-[#FAFAF7] p-2 rounded-lg border border-[#E7E9E5]">
                      <span className="text-[10px] text-[#78818A] block">RESTING HR</span>
                      <span className="font-bold text-[#20272D]">
                        {astro.heartRateCurrent ? `${astro.heartRateCurrent} bpm` : 'UNAVAILABLE'}
                      </span>
                    </div>
                    <div className="bg-[#FAFAF7] p-2 rounded-lg border border-[#E7E9E5]">
                      <span className="text-[10px] text-[#78818A] block">ASSIGNMENT</span>
                      <span className="font-bold text-[#20272D] truncate block">{astro.mission || 'Active Flight'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E7E9E5] flex items-center justify-between text-xs font-mono font-bold text-[#20272D]">
                  <span className="text-[11px] text-[#78818A] group-hover:text-[#20272D] transition-colors">
                    {isActive ? 'CURRENT FOCUS' : 'SELECT FOR TELEMETRY'}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#78818A] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Terrestrial Research Cohort Table/Grid */}
      {activeTab === 'research' && (
        <div className="bg-white rounded-2xl border border-[#E7E9E5] overflow-hidden shadow-card">
          <div className="p-4 border-b border-[#E7E9E5] flex items-center justify-between bg-[#FAFAF7]">
            <div>
              <h3 className="text-sm font-bold font-mono text-[#20272D]">
                MMASH Terrestrial Research Subjects
              </h3>
              <p className="text-[11px] font-mono text-[#78818A]">
                Ground analog study cohort (N={researchCohort.length}) • PhysioNet Gold Dataset • Strictly Quarantined
              </p>
            </div>
            <TierBadge tier="RESEARCH" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
            {researchCohort.map((subject) => (
              <div 
                key={subject.astronaut_id}
                className="p-3.5 rounded-xl bg-[#FAFAF7] border border-[#E7E9E5] font-mono text-xs space-y-1.5 hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#20272D]">{subject.astronaut_id}</span>
                  <span className="text-[10px] text-[#32A889] bg-[#32A889]/10 px-1.5 py-0.5 rounded font-bold">
                    ANALOG
                  </span>
                </div>
                <div className="text-[11px] text-[#78818A]">{subject.name}</div>
                <div className="pt-2 border-t border-[#E7E9E5] flex justify-between text-[10px] text-[#78818A]">
                  <span>HR BASELINE:</span>
                  <span className="text-[#20272D] font-bold">{subject.resting_hr_baseline || 65} bpm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Register New Astronaut Modal */}
      <Modal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title="Register Flight Crew Profile"
        subtitle="Create an operational astronaut record with pre-flight baseline calibrations"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#D95C5C]/10 border border-[#D95C5C]/30 text-xs text-[#D95C5C] font-mono">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="text-[11px] text-[#78818A] block mb-1">ASTRONAUT ID</label>
              <input
                type="text"
                required
                placeholder="e.g. ASTRO-03"
                value={formData.astronaut_id}
                onChange={(e) => setFormData({ ...formData, astronaut_id: e.target.value })}
                className="w-full bg-[#FAFAF7] border border-[#E7E9E5] rounded-lg px-3 py-2 text-[#20272D] focus:outline-none focus:border-[#20272D]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#78818A] block mb-1">FULL NAME</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Jessica Watkins"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#FAFAF7] border border-[#E7E9E5] rounded-lg px-3 py-2 text-[#20272D] focus:outline-none focus:border-[#20272D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="text-[11px] text-[#78818A] block mb-1">MISSION ASSIGNMENT</label>
              <input
                type="text"
                required
                value={formData.mission_id}
                onChange={(e) => setFormData({ ...formData, mission_id: e.target.value })}
                className="w-full bg-[#FAFAF7] border border-[#E7E9E5] rounded-lg px-3 py-2 text-[#20272D] focus:outline-none focus:border-[#20272D]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#78818A] block mb-1">CREW ROLE</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#FAFAF7] border border-[#E7E9E5] rounded-lg px-3 py-2 text-[#20272D] focus:outline-none focus:border-[#20272D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs font-mono pt-2 border-t border-[#E7E9E5]">
            <div>
              <label className="text-[10px] text-[#78818A] block mb-1">RESTING HR (BPM)</label>
              <input
                type="number"
                min="40"
                max="120"
                value={formData.resting_hr_baseline}
                onChange={(e) => setFormData({ ...formData, resting_hr_baseline: Number(e.target.value) })}
                className="w-full bg-[#FAFAF7] border border-[#E7E9E5] rounded-lg px-3 py-2 text-[#20272D] focus:outline-none focus:border-[#20272D]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#78818A] block mb-1">BP SYS BASELINE</label>
              <input
                type="number"
                min="80"
                max="180"
                value={formData.resting_bp_sys_baseline}
                onChange={(e) => setFormData({ ...formData, resting_bp_sys_baseline: Number(e.target.value) })}
                className="w-full bg-[#FAFAF7] border border-[#E7E9E5] rounded-lg px-3 py-2 text-[#20272D] focus:outline-none focus:border-[#20272D]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#78818A] block mb-1">BP DIA BASELINE</label>
              <input
                type="number"
                min="50"
                max="120"
                value={formData.resting_bp_dia_baseline}
                onChange={(e) => setFormData({ ...formData, resting_bp_dia_baseline: Number(e.target.value) })}
                className="w-full bg-[#FAFAF7] border border-[#E7E9E5] rounded-lg px-3 py-2 text-[#20272D] focus:outline-none focus:border-[#20272D]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E7E9E5]">
            <button
              type="button"
              onClick={() => setRegisterModalOpen(false)}
              className="px-4 py-2 bg-[#FAFAF7] hover:bg-slate-200 text-[#20272D] rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={registering}
              className="px-4 py-2 bg-[#20272D] hover:bg-[#323D47] text-white rounded-xl text-xs font-mono font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              {registering ? 'Registering...' : 'Register Profile'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default AstronautsPage;
