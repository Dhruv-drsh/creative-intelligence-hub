import { getBackendType } from './config';
import { createSupabaseAdapter } from './adapters/supabase';
import { createFastAPIAdapter } from './adapters/fastapi';
import type { ApiClient } from './types';

let apiClientInstance: ApiClient | null = null;

export const getApiClient = (): ApiClient => {
  if (!apiClientInstance) {
    const backendType = getBackendType();
    
    if (backendType === 'local') {
      apiClientInstance = createFastAPIAdapter();
    } else {
      apiClientInstance = createSupabaseAdapter();
    }
  }
  
  return apiClientInstance;
};

// Re-export for convenience
export { getBackendType, isLocalBackend, isCloudBackend } from './config';
export type { ApiClient } from './types';
