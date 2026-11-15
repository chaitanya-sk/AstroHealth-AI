import { apiRequest } from './apiClient';
import { AstronautResponse, AstronautCreate, AstronautUpdate } from '../../types/api';

export const astronautService = {
  async list(params: { skip?: number; limit?: number; mission_id?: string } = {}, token?: string | null): Promise<AstronautResponse[]> {
    const search = new URLSearchParams();
    if (params.skip !== undefined) search.set('skip', String(params.skip));
    if (params.limit !== undefined) search.set('limit', String(params.limit));
    if (params.mission_id) search.set('mission_id', params.mission_id);
    
    const query = search.toString() ? `?${search.toString()}` : '';
    return apiRequest<AstronautResponse[]>(`/api/astronauts${query}`, {}, token);
  },

  async getById(id: string, token?: string | null): Promise<AstronautResponse> {
    return apiRequest<AstronautResponse>(`/api/astronauts/${encodeURIComponent(id)}`, {}, token);
  },

  async create(payload: AstronautCreate, token?: string | null): Promise<AstronautResponse> {
    return apiRequest<AstronautResponse>(`/api/astronauts`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token);
  },

  async update(id: string, payload: AstronautUpdate, token?: string | null): Promise<AstronautResponse> {
    return apiRequest<AstronautResponse>(`/api/astronauts/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, token);
  }
};
