import { apiRequest } from './apiClient';
import { AlertResponse, RecommendationResponse } from '../../types/api';

export const alertService = {
  async getAlerts(
    astronautId: string, 
    params: { status?: string; domain?: string } = {},
    token?: string | null
  ): Promise<AlertResponse[]> {
    const search = new URLSearchParams();
    if (params.status) search.set('status', params.status);
    if (params.domain) search.set('domain', params.domain);
    const query = search.toString() ? `?${search.toString()}` : '';
    return apiRequest<AlertResponse[]>(`/api/alerts/${encodeURIComponent(astronautId)}${query}`, {}, token);
  },

  async getRecommendations(astronautId: string, token?: string | null): Promise<RecommendationResponse[]> {
    return apiRequest<RecommendationResponse[]>(`/api/recommendations/${encodeURIComponent(astronautId)}`, {}, token);
  }
};
