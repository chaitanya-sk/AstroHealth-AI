export const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export interface ApiError {
  status: number;
  message: string;
  detail?: any;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let detailMsg = `HTTP Error ${res.status}`;
      try {
        const errorBody = await res.json();
        detailMsg = errorBody.detail || errorBody.message || JSON.stringify(errorBody);
      } catch (e) {
        detailMsg = await res.text();
      }

      const err: ApiError = {
        status: res.status,
        message: detailMsg || res.statusText,
      };
      throw err;
    }

    return (await res.json()) as T;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    // Network failure / server offline
    const networkErr: ApiError = {
      status: 0,
      message: error.message || 'FastAPI Backend unreachable at ' + API_BASE_URL,
    };
    throw networkErr;
  }
}
