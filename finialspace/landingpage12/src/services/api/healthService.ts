import { apiRequest } from './apiClient';
import { HealthRecordResponse, DataType, HealthDomain } from '../../types/api';

export const healthService = {
  async getAstronautData(
    astronautId: string, 
    params: { 
      domain?: string; 
      indicator?: string; 
      data_type?: string; 
      limit?: number;
      skip?: number;
    } = {},
    token?: string | null
  ): Promise<HealthRecordResponse[]> {
    const search = new URLSearchParams();
    if (params.domain) search.set('domain', params.domain);
    if (params.indicator) search.set('indicator', params.indicator);
    if (params.data_type) search.set('data_type', params.data_type);
    if (params.limit !== undefined) search.set('limit', String(params.limit));
    if (params.skip !== undefined) search.set('skip', String(params.skip));

    const query = search.toString() ? `?${search.toString()}` : '';
    return apiRequest<HealthRecordResponse[]>(`/api/data/${encodeURIComponent(astronautId)}${query}`, {}, token);
  },

  async getDomainData(
    astronautId: string,
    domain: string,
    params: { data_type?: string; limit?: number; skip?: number } = {},
    token?: string | null
  ): Promise<HealthRecordResponse[]> {
    const search = new URLSearchParams();
    if (params.data_type) search.set('data_type', params.data_type);
    if (params.limit !== undefined) search.set('limit', String(params.limit));
    if (params.skip !== undefined) search.set('skip', String(params.skip));

    const query = search.toString() ? `?${search.toString()}` : '';
    return apiRequest<HealthRecordResponse[]>(
      `/api/data/${encodeURIComponent(astronautId)}/domain/${encodeURIComponent(domain)}${query}`,
      {},
      token
    );
  },

  async ingestRecord(payload: any, token?: string | null): Promise<HealthRecordResponse> {
    return apiRequest<HealthRecordResponse>(`/api/data/ingest`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token);
  }
};
