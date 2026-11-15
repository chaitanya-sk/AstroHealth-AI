import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  AlertOctagon, 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  Filter, 
  FileCode2,
  Lock,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { researchService } from '../services/api/researchService';
import { useAstronaut } from '../contexts/AstronautContext';
import { TierBadge } from '../components/ui/Badge';
import { DataTier } from '../types/dashboard';
import { cn } from '../lib/utils';

interface ProvenanceEntry {
  id: string;
  name: string;
  category: string;
  tier: DataTier;
  sourceDataset: string;
  participants: string;
  timepoints: string;
  indicators: string;
  collectionMethod: string;
  complianceNote: string;
  latency: string;
}

export const ProvenancePage: React.FC = () => {
  const { activeAstronaut } = useAstronaut();
  const [tierFilter, setTierFilter] = useState<'ALL' | DataTier>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [entries, setEntries] = useState<ProvenanceEntry[]>([]);

  const fetchProvenanceData = async () => {
    setLoading(true);
    try {
      const datasets = await researchService.listDatasets();
      
      const detailedEntries: ProvenanceEntry[] = await Promise.all(
        datasets.map(async (ds) => {
          let details: any = null;
          try {
            details = await researchService.getDatasetDetails(ds.study_id);
          } catch {
            // fallback
          }

          let participantsStr = Array.isArray(details?.participants) 
            ? `${details.participants.slice(0, 4).join(', ')}${details.participants.length > 4 ? ` (+${details.participants.length - 4} more)` : ''}`
            : String(ds.cohort_size || 'N=4');

          let timepointsStr = Array.isArray(details?.timepoints)
            ? details.timepoints.join(' • ')
            : (details?.timepoints_covered ? details.timepoints_covered.join(' • ') : 'Standard Study Protocol');

          let indicatorsList = '';
          if (details?.supported_markers && Array.isArray(details.supported_markers)) {
            indicatorsList = details.supported_markers.map((m: any) => `${m.label || m.short_name || m.indicator}${m.unit ? ` (${m.unit})` : ''}`).slice(0, 5).join(', ');
            if (details.supported_markers.length > 5) {
              indicatorsList += ` (+${details.supported_markers.length - 5} more)`;
            }
          } else if (details?.supported_modalities && Array.isArray(details.supported_modalities)) {
            indicatorsList = details.supported_modalities.map((m: any) => m.modality).join(', ');
          } else {
            indicatorsList = 'Domain-specific molecular biomarkers';
          }

          return {
            id: ds.study_id,
            name: ds.name,
            category: ds.is_terrestrial ? 'Terrestrial Analog Research' : 'NASA Spaceflight OSDR',
            tier: 'RESEARCH',
            sourceDataset: `NASA OSDR / GeneLab [${ds.study_id}]`,
            participants: participantsStr,
            timepoints: timepointsStr,
            indicators: indicatorsList,
            collectionMethod: details?.environment || ds.type || 'NASA Open Science Data Repository',
            complianceNote: ds.isolation_warning || 'Quarantined spaceflight research dataset. Used for physiological baseline recovery boundaries.',
            latency: ds.is_terrestrial ? 'Offline Research Cohort' : 'Longitudinal Study Archive'
          };
        })
      );

      // Append current operational spacecraft telemetry stream provenance
      const operationalEntry: ProvenanceEntry = {
        id: "TELEMETRY-STREAM",
        name: `Mission Telemetry Bus (${activeAstronaut.mission || 'Active Flight'})`,
        category: "Operational Biotelemetry Stream",
        tier: activeAstronaut.tier || 'SIMULATED',
        sourceDataset: `AstroHealth Telemetry Ingestion [${activeAstronaut.id}]`,
        participants: `${activeAstronaut.name} (${activeAstronaut.id})`,
        timepoints: `Flight Phase Monitoring (Continuous)`,
        indicators: "Heart Rate (76 bpm, simulated wearable patch), HRV, ECLSS Atmospheric Partial Pressures",
        collectionMethod: "CCSDS Packetized Spacecraft Telemetry Standard",
        complianceNote: activeAstronaut.tier === 'SIMULATED' 
          ? "Synthesized reference telemetry utilizing published NASA-STD-3001 physiological reference intervals. Quarantined from ground analog data." 
          : "Verified operational astronaut downlink telemetry stream.",
        latency: "1.2s round-trip telemetry bus"
      };

      setEntries([operationalEntry, ...detailedEntries]);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvenanceData();
  }, [activeAstronaut.id]);

  const filteredItems = entries.filter(item => {
    if (tierFilter !== 'ALL' && item.tier !== tierFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E7E9E5] shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-[#FAFAF7] border border-[#E7E9E5] text-[#20272D] flex items-center justify-center shrink-0">
              <Layers className="h-6 w-6 text-[#45BFD2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#20272D] tracking-tight">
                  Data Provenance & Telemetry Governance
                </h1>
                <TierBadge tier="RESEARCH" subtle />
              </div>
              <p className="text-xs text-[#78818A] font-mono mt-0.5">
                Multi-tier source verification, synthetic stream isolation, and empirical NASA OSDR provenance
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#FAFAF7] p-1.5 rounded-xl border border-[#E7E9E5] text-xs">
            <Filter className="h-3.5 w-3.5 text-[#78818A] ml-2 mr-1" />
            {(['ALL', 'REAL', 'RESEARCH', 'SIMULATED'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer",
                  tierFilter === t 
                    ? "bg-[#20272D] text-white shadow-pill" 
                    : "text-[#78818A] hover:text-[#20272D]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Strict Compliance Alert */}
      <div className="bg-[#F5F2E9] border border-[#E9C95A]/40 p-5 rounded-2xl flex items-start gap-3.5 shadow-card">
        <AlertOctagon className="h-5 w-5 text-[#E7A83C] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-[#20272D] uppercase tracking-wide font-mono block">
            Terrestrial Research Isolation Protocol
          </span>
          <p className="text-[#78818A] leading-relaxed">
            Terrestrial research benchmarks (including PhysioNet MMASH) are partitioned strictly for offline model validation. In accordance with aerospace flight protocol, terrestrial ground datasets are <strong className="text-[#20272D]">never</strong> represented as astronaut telemetry. Operational flight decisions rely exclusively on verified spacecraft telemetry streams.
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white border border-[#E7E9E5] p-8 rounded-2xl shadow-card text-center space-y-3 animate-pulse">
          <div className="h-8 w-8 border-3 border-[#20272D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono font-bold text-[#20272D]">
            Querying backend data provenance registry and research archives...
          </p>
        </div>
      )}

      {/* Registry Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-[#E7E9E5] hover:border-[#45BFD2] transition-all flex flex-col justify-between space-y-3 shadow-card hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E7E9E5]">
                  <span className="text-[10px] font-mono text-[#20272D] bg-[#FAFAF7] border border-[#E7E9E5] px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                    {item.category}
                  </span>
                  <TierBadge tier={item.tier} />
                </div>

                <h3 className="text-sm font-bold text-[#20272D] mt-2 leading-snug">
                  {item.name}
                </h3>

                <p className="text-xs text-[#78818A] mt-0.5 font-mono">
                  Source: {item.sourceDataset}
                </p>

                <div className="mt-3 text-xs text-[#78818A] space-y-1 font-mono">
                  <div><strong className="text-[#20272D]">Cohort:</strong> {item.participants}</div>
                  <div><strong className="text-[#20272D]">Timepoints:</strong> {item.timepoints}</div>
                  <div><strong className="text-[#20272D]">Measurements:</strong> {item.indicators}</div>
                </div>

                <div className="mt-3.5 p-3 bg-[#FAFAF7] rounded-xl border border-[#E7E9E5] text-xs text-[#78818A] leading-relaxed">
                  <strong className="text-[#20272D] block mb-0.5 font-mono">Governance & Compliance Protocol:</strong>
                  {item.complianceNote}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E7E9E5] flex items-center justify-between text-xs font-mono text-[#78818A]">
                <span className="truncate max-w-[65%]">Method: {item.collectionMethod}</span>
                <span className="text-[#32A889] font-bold text-[10px]">{item.latency}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ProvenancePage;
