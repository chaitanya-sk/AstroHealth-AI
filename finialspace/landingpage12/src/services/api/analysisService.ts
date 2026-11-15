import { apiRequest } from './apiClient';
import { IntegratedHealthSummary, DomainAnalysisResult, HealthDomain, DataType } from '../../types/api';

export const analysisService = {
  async getIntegratedAnalysis(
    astronautId: string, 
    dataType?: string,
    token?: string | null
  ): Promise<IntegratedHealthSummary> {
    const query = dataType && dataType !== 'all' ? `?data_type=${encodeURIComponent(dataType)}` : '';
    return apiRequest<IntegratedHealthSummary>(`/api/analysis/${encodeURIComponent(astronautId)}${query}`, {}, token);
  },

  async getDomainAnalysis(
    astronautId: string,
    domain: HealthDomain | string,
    dataType?: string,
    token?: string | null
  ): Promise<DomainAnalysisResult> {
    const query = dataType && dataType !== 'all' ? `?data_type=${encodeURIComponent(dataType)}` : '';
    return apiRequest<DomainAnalysisResult>(
      `/api/analysis/${encodeURIComponent(astronautId)}/${encodeURIComponent(domain)}${query}`,
      {},
      token
    );
  }
};
