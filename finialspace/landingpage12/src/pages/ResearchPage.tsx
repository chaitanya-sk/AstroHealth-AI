import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ExternalLink, 
  Layers, 
  AlertTriangle, 
  FileText, 
  BarChart3, 
  Users, 
  Filter, 
  CheckCircle2, 
  Info,
  Clock,
  ChevronRight,
  ShieldAlert,
  Activity,
  ArrowRight
} from 'lucide-react';
import { researchService, FALLBACK_RESEARCH_DATASETS, ResearchDatasetSummary } from '../services/api/researchService';
import { TierBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { cn } from '../lib/utils';

export const ResearchPage: React.FC = () => {
  const [datasets, setDatasets] = useState<ResearchDatasetSummary[]>(FALLBACK_RESEARCH_DATASETS);
  const [selectedDataset, setSelectedDataset] = useState<ResearchDatasetSummary | null>(null);
  const [datasetDetails, setDatasetDetails] = useState<any | null>(null);
  const [cohortSummary, setCohortSummary] = useState<any | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<string>('C001');
  const [participantTrajectory, setParticipantTrajectory] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'spaceflight' | 'terrestrial'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadDatasets = async () => {
      setLoading(true);
      const data = await researchService.listDatasets();
      setDatasets(data);
      setLoading(false);
    };
    loadDatasets();
  }, []);

  const handleInspectDataset = async (dataset: ResearchDatasetSummary) => {
    setSelectedDataset(dataset);
    setDatasetDetails(null);
    setCohortSummary(null);
    setParticipantTrajectory(null);
    setDetailsLoading(true);

    try {
      const details = await researchService.getDatasetDetails(dataset.study_id);
      setDatasetDetails(details);

      const studyIdClean = dataset.study_id.toUpperCase();
      if (studyIdClean.includes('OSD-575')) {
        const cohort = await researchService.getOSD575Cohort();
        setCohortSummary(cohort);
        setSelectedParticipant('C001');
        const traj = await researchService.getOSD575ParticipantTrajectory('C001');
        setParticipantTrajectory(traj);
      } else if (studyIdClean.includes('OSD')) {
        const summary = await researchService.getOSDCohortSummary(dataset.study_id);
        setCohortSummary(summary);
      } else if (studyIdClean.includes('MMASH')) {
        setCohortSummary({
          study_name: "PhysioNet MMASH Terrestrial Analog Cohort",
          participant_count: 22,
          participants: Array.from({ length: 22 }, (_, i) => `MMASH_USER_${i + 1}`),
          timepoints_covered: ["24-Hour Continuous Monitoring"],
          scientific_significance: "Continuous ground research monitoring of ECG, actigraphy, and salivary markers used exclusively for autonomic baseline modeling. Quarantined from operational astronaut telemetry."
        });
      }
    } catch {
      // Graceful fallback
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSelectParticipant = async (pId: string) => {
    setSelectedParticipant(pId);
    try {
      const traj = await researchService.getOSD575ParticipantTrajectory(pId);
      setParticipantTrajectory(traj);
    } catch {
      setParticipantTrajectory(null);
    }
  };

  const filteredDatasets = datasets.filter(d => {
    if (activeTab === 'spaceflight') return !d.is_terrestrial;
    if (activeTab === 'terrestrial') return d.is_terrestrial;
    return true;
  });

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E7E9E5] shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-[#FAFAF7] border border-[#E7E9E5] text-[#20272D] flex items-center justify-center shrink-0">
              <Database className="h-6 w-6 text-[#45BFD2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#20272D] tracking-tight">
                  NASA Research & Open Science Data (OSDR)
                </h1>
                <TierBadge tier="RESEARCH" subtle />
              </div>
              <p className="text-xs text-[#78818A] font-mono mt-0.5">
                Connected empirical spaceflight datasets, omics archives, and terrestrial analog cohorts
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#FAFAF7] p-1.5 rounded-xl border border-[#E7E9E5] text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer",
                activeTab === 'all' 
                  ? "bg-[#20272D] text-white shadow-pill" 
                  : "text-[#78818A] hover:text-[#20272D]"
              )}
            >
              All Repositories ({datasets.length})
            </button>
            <button
              onClick={() => setActiveTab('spaceflight')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer",
                activeTab === 'spaceflight' 
                  ? "bg-[#20272D] text-white shadow-pill" 
                  : "text-[#78818A] hover:text-[#20272D]"
              )}
            >
              Spaceflight OSDR
            </button>
            <button
              onClick={() => setActiveTab('terrestrial')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer",
                activeTab === 'terrestrial' 
                  ? "bg-[#20272D] text-white shadow-pill" 
                  : "text-[#78818A] hover:text-[#20272D]"
              )}
            >
              Terrestrial Analogs
            </button>
          </div>
        </div>
      </div>

      {/* Critical Data Rules Banner */}
      <div className="bg-[#F5F2E9] p-5 rounded-2xl border border-[#E9C95A]/40 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#20272D] uppercase tracking-wider">
          <Info className="h-4 w-4 text-[#E7A83C]" />
          <span>Research Data Governance & Cohort Integrity Policies</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#78818A]">
          <div className="bg-white p-3.5 rounded-xl border border-[#E7E9E5] space-y-1">
            <strong className="text-[#20272D] block font-mono">Inspiration4 Cohort Bounds (N=4):</strong>
            OSD-575, 569, 570, 571, and 656 comprise a cohort of 4 commercial crew members (C001 - C004); used solely for baseline recovery bounds, not broad population validation.
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E7E9E5] space-y-1">
            <strong className="text-[#20272D] block font-mono">Differential Cohort Statistics:</strong>
            Transcriptomic and epigenomic datasets (OSD-570 & 571) contain summary-level differential statistics only; individual astronaut timelines are not fabricated.
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#E7A83C]/50 space-y-1">
            <strong className="text-[#E7A83C] block font-mono">PhysioNet MMASH Isolation:</strong>
            Terrestrial 24h ground research data (N=22); strictly quarantined from operational astronaut flight telemetry.
          </div>
        </div>
      </div>

      {/* Dataset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDatasets.map((ds) => (
          <div
            key={ds.id}
            onClick={() => handleInspectDataset(ds)}
            className="bg-white p-5 rounded-2xl border border-[#E7E9E5] hover:border-[#45BFD2] transition-all cursor-pointer flex flex-col justify-between group shadow-card hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#E7E9E5]">
                <span className="text-[10px] font-mono text-[#20272D] bg-[#FAFAF7] border border-[#E7E9E5] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {ds.study_id}
                </span>
                <TierBadge tier="RESEARCH" />
              </div>

              <h3 className="text-sm font-bold text-[#20272D] group-hover:text-[#45BFD2] transition-colors leading-snug font-sans">
                {ds.name}
              </h3>

              <p className="text-xs text-[#78818A] mt-2 line-clamp-2 leading-relaxed">
                {ds.description}
              </p>

              {ds.isolation_warning && (
                <div className="mt-3 p-2.5 bg-[#F5F2E9] border border-[#E9C95A]/40 rounded-xl text-[11px] font-mono text-[#78818A] leading-normal">
                  <span className="text-[#E7A83C] font-bold block mb-0.5">Isolation Notice:</span>
                  {ds.isolation_warning}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E7E9E5] flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-[#78818A]">
                Cohort: <strong className="text-[#20272D]">{ds.cohort_size}</strong>
              </span>
              <button 
                type="button" 
                className="text-xs font-mono font-bold text-[#20272D] group-hover:text-[#45BFD2] flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Dataset</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dataset Details Modal */}
      <Modal
        isOpen={!!selectedDataset}
        onClose={() => setSelectedDataset(null)}
        title={selectedDataset?.name || "Dataset Details"}
        subtitle={`Study Identifier: ${selectedDataset?.study_id} • NASA OSDR / Research Tier`}
      >
        {selectedDataset && (
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-xs">
            <div className="flex items-center justify-between bg-[#FAFAF7] p-3 rounded-xl border border-[#E7E9E5]">
              <span className="font-bold text-[#20272D] font-mono">DOMAIN: {selectedDataset.domain.toUpperCase()}</span>
              <span className="font-mono text-[#20272D] bg-white px-2 py-0.5 rounded border border-[#E7E9E5] font-bold">
                {selectedDataset.cohort_size}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold font-mono text-[#20272D] uppercase tracking-wider mb-1">
                Scientific Scope & Methodology
              </h4>
              <p className="text-xs text-[#78818A] leading-relaxed bg-[#FAFAF7] p-3 rounded-xl border border-[#E7E9E5]">
                {selectedDataset.description}
              </p>
            </div>

            {selectedDataset.isolation_warning && (
              <div className="bg-[#F5F2E9] border border-[#E9C95A]/40 p-3 rounded-xl text-xs font-mono text-[#78818A]">
                <strong className="text-[#E7A83C] block mb-0.5">Cohort Quarantine Notice:</strong>
                {selectedDataset.isolation_warning}
              </div>
            )}

            {/* Supported Markers */}
            {datasetDetails?.supported_markers && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-[#20272D] uppercase tracking-wider">
                  Analyzed Biomarkers & Indicators ({datasetDetails.supported_markers.length})
                </h4>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                  {datasetDetails.supported_markers.map((m: any, i: number) => (
                    <div key={i} className="bg-[#FAFAF7] p-2.5 rounded-lg border border-[#E7E9E5] flex flex-col justify-between">
                      <span className="font-bold text-[#20272D]">{m.label || m.indicator || m.short_name}</span>
                      <span className="text-[10px] text-[#78818A] mt-0.5">{m.unit ? `Unit: ${m.unit}` : ''} • Domain: {m.domain}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OSD-575 Participant-Level Trajectory View (N=4) */}
            {selectedDataset.study_id.includes('OSD-575') && (
              <div className="bg-[#FAFAF7] p-4 rounded-xl border border-[#E7E9E5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-[#20272D] uppercase tracking-wider">
                    Inspiration4 Participant Trajectory (N=4)
                  </span>
                  <div className="flex items-center gap-1 font-mono">
                    {['C001', 'C002', 'C003', 'C004'].map((pid) => (
                      <button
                        key={pid}
                        onClick={() => handleSelectParticipant(pid)}
                        className={cn(
                          "px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer",
                          selectedParticipant === pid 
                            ? "bg-[#20272D] text-white shadow-pill" 
                            : "bg-white text-[#78818A] border border-[#E7E9E5] hover:text-[#20272D]"
                        )}
                      >
                        {pid}
                      </button>
                    ))}
                  </div>
                </div>

                {participantTrajectory?.acute_post_flight_shifts_pct && (
                  <div>
                    <span className="text-[11px] font-mono text-[#78818A] block mb-1">
                      Acute R+1 Post-Flight Shifts for Participant <strong className="text-[#20272D]">{selectedParticipant}</strong>:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                      {Object.entries(participantTrajectory.acute_post_flight_shifts_pct).map(([marker, shift]) => (
                        <div key={marker} className="bg-white p-2 rounded-lg border border-[#E7E9E5] flex justify-between">
                          <span className="text-[#78818A] uppercase">{marker}:</span>
                          <span className={Number(shift) >= 0 ? "text-[#E7A83C] font-bold" : "text-[#32A889] font-bold"}>
                            {Number(shift) > 0 ? `+${shift}%` : `${shift}%`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
export default ResearchPage;
