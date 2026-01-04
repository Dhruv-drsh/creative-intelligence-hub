// API Configuration
// Set VITE_BACKEND_TYPE to 'local' to use FastAPI backend
// Set VITE_BACKEND_TYPE to 'cloud' (default) to use Lovable Cloud

export type BackendType = 'cloud' | 'local';

export const getBackendType = (): BackendType => {
  return (import.meta.env.VITE_BACKEND_TYPE as BackendType) || 'cloud';
};

export const getApiBaseUrl = (): string => {
  if (getBackendType() === 'local') {
    return import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  }
  return import.meta.env.VITE_SUPABASE_URL || '';
};

export const isLocalBackend = (): boolean => {
  return getBackendType() === 'local';
};

export const isCloudBackend = (): boolean => {
  return getBackendType() === 'cloud';
};
