import { apiRequest } from './apiClient';

export interface ResearchDatasetSummary {
  id: string;
  name: string;
  study_id: string;
  domain: string;
  type: string;
  tier: string;
  cohort_size: string | number;
  description: string;
  status: string;
  is_terrestrial: boolean;
  isolation_warning?: string;
}

export const FALLBACK_RESEARCH_DATASETS: ResearchDatasetSummary[] = [
  {
    id: "osd-575",
    name: "Inspiration4 Proteomic Baseline & Trajectory",
    study_id: "OSD-575",
    domain: "immune",
    type: "Short-Duration Commercial Human Spaceflight",
    tier: "RESEARCH",
    cohort_size: "4 Crew Members (C001 - C004)",
    description: "Multi-omics plasma proteome profiling across L-92 pre-flight baseline through R+82 post-flight recovery.",
    status: "STRUCTURED",
    is_terrestrial: false,
    isolation_warning: "Small astronaut research cohort (N=4); used for physiological recovery trajectory bounds only."
  },
  {
    id: "osd-569",
    name: "Inspiration4 Circulating Cell-Free DNA (cfDNA)",
    study_id: "OSD-569",
    domain: "radiation",
    type: "Spaceflight Genomic & Mitochondrial Stress",
    tier: "RESEARCH",
    cohort_size: "4 Crew Members",
    description: "cfDNA and mitochondrial cfDNA quantification evaluating acute spaceflight radiation and microgravity cellular damage.",
    status: "STRUCTURED",
    is_terrestrial: false
  },
  {
    id: "osd-656",
    name: "Inspiration4 Cytokine & Chemokine Profile",
    study_id: "OSD-656",
    domain: "immune",
    type: "Spaceflight Immune Dysregulation",
    tier: "RESEARCH",
    cohort_size: "4 Crew Members",
    description: "Multiplex panel of 65 cytokines evaluating systemic inflammation and immune suppression during spaceflight.",
    status: "STRUCTURED",
    is_terrestrial: false
  },
  {
    id: "osd-570",
    name: "Inspiration4 Immune Single-Cell RNA-Seq Summary",
    study_id: "OSD-570",
    domain: "immune",
    type: "Transcriptomic Differential Statistics",
    tier: "RESEARCH",
    cohort_size: "4 Crew Members",
    description: "Differential gene expression statistics in peripheral blood mononuclear cells post-flight.",
    status: "COHORT_SUMMARY_ONLY",
    is_terrestrial: false,
    isolation_warning: "Summary-level differential statistics only; individual astronaut timelines not available."
  },
  {
    id: "osd-571",
    name: "Inspiration4 Epigenomic DNA Methylation Summary",
    study_id: "OSD-571",
    domain: "radiation",
    type: "Epigenetic Age & DNA Repair Markers",
    tier: "RESEARCH",
    cohort_size: "4 Crew Members",
    description: "DNA methylation shifts and epigenetic aging acceleration during commercial orbital spaceflight.",
    status: "COHORT_SUMMARY_ONLY",
    is_terrestrial: false,
    isolation_warning: "Summary-level differential statistics only; individual astronaut timelines not available."
  },
  {
    id: "mmash",
    name: "Multilevel Monitoring of Activity and Sleep in Healthy people (MMASH)",
    study_id: "MMASH-PhysioNet",
    domain: "cardiovascular",
    type: "Ambulatory ECG & Accelerometry (Terrestrial)",
    tier: "RESEARCH",
    cohort_size: "22 Healthy Young Adults",
    description: "Continuous beat-to-beat ECG intervals, actigraphy, and salivary cortisol collected over 24-hour periods on Earth.",
    status: "OFFLINE_VALIDATION",
    is_terrestrial: true,
    isolation_warning: "STRICT ISOLATION PROTOCOL: Terrestrial dataset used solely for autonomic algorithm validation. NEVER represented as astronaut telemetry."
  }
];

export const researchService = {
  async listDatasets(token?: string | null): Promise<ResearchDatasetSummary[]> {
    try {
      const data = await apiRequest<any[]>('/api/analysis/research/datasets', {}, token);
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item): ResearchDatasetSummary => {
          const isTerrestrial = item.data_category === 'terrestrial_ground_research' || 
                                item.dataset_id === 'MMASH' || 
                                Boolean(item.environment?.includes('Terrestrial'));
          const studyId = item.dataset_id || item.study_id || 'RESEARCH';
          const cohortSize = item.cohort_size ? (typeof item.cohort_size === 'number' ? `${item.cohort_size} Participants` : item.cohort_size) : '4 Crew Members';
          
          let isolationWarning: string | undefined = undefined;
          if (isTerrestrial) {
            isolationWarning = 'STRICT ISOLATION PROTOCOL: Terrestrial analog ground data; quarantined from spaceflight telemetry.';
          } else if (item.cohort_size === 4 || studyId.includes('OSD')) {
            isolationWarning = 'Small astronaut research cohort (N=4); used for physiological recovery trajectory bounds only.';
          }

          return {
            id: String(item.dataset_id || item.id || '').toLowerCase(),
            name: item.title || item.name || studyId,
            study_id: studyId,
            domain: Array.isArray(item.connected_domains) ? item.connected_domains.join(', ') : (item.domain || 'Multi-Domain'),
            type: item.environment || item.type || 'NASA Open Science Data',
            tier: 'RESEARCH',
            cohort_size: cohortSize,
            description: item.description || `${item.title || studyId} (${item.environment || 'Open Science Dataset'}). Provenance: NASA GeneLab / OSDR.`,
            status: item.status || 'INTEGRATED',
            is_terrestrial: isTerrestrial,
            isolation_warning: isolationWarning
          };
        });
      }
      return FALLBACK_RESEARCH_DATASETS;
    } catch (e) {
      return FALLBACK_RESEARCH_DATASETS;
    }
  },

  async getDatasetDetails(datasetId: string, token?: string | null): Promise<any> {
    try {
      return await apiRequest<any>(`/api/analysis/research/datasets/${encodeURIComponent(datasetId)}`, {}, token);
    } catch (e) {
      return FALLBACK_RESEARCH_DATASETS.find(d => d.id === datasetId || d.study_id.toLowerCase() === datasetId.toLowerCase()) || null;
    }
  },

  async getDomainEvidence(domain: string, token?: string | null): Promise<any> {
    return apiRequest<any>(`/api/analysis/research/domains/${encodeURIComponent(domain)}`, {}, token);
  },

  async getParticipantTimeline(participantId: string, token?: string | null): Promise<any> {
    return apiRequest<any>(`/api/analysis/research/timeline/${encodeURIComponent(participantId)}`, {}, token);
  },

  async compareOperational(astronautId: string, indicator: string, token?: string | null): Promise<any> {
    return apiRequest<any>(
      `/api/analysis/research/compare/${encodeURIComponent(astronautId)}/${encodeURIComponent(indicator)}`,
      {},
      token
    );
  },

  async getOSDCohortSummary(studyId: string, token?: string | null): Promise<any> {
    return apiRequest<any>(
      `/api/analysis/research/osd/${encodeURIComponent(studyId)}/cohort-summary`,
      {},
      token
    );
  },

  async getOSD575Cohort(token?: string | null): Promise<any> {
    return apiRequest<any>('/api/analysis/research/osd575/cohort', {}, token);
  },

  async getOSD575ParticipantTrajectory(participantId: string, token?: string | null): Promise<any> {
    return apiRequest<any>(
      `/api/analysis/research/osd575/participant/${encodeURIComponent(participantId)}`,
      {},
      token
    );
  }
};
