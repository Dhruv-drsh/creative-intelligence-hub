import { getApiBaseUrl } from '../config';
import type { ApiClient, User, Profile, Project, BrandKit, Template, AuthTokens } from '../types';

const TOKEN_KEY = 'creative_hub_tokens';

const getTokens = (): AuthTokens | null => {
  const stored = localStorage.getItem(TOKEN_KEY);
  return stored ? JSON.parse(stored) : null;
};

const setTokens = (tokens: AuthTokens) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const tokens = getTokens();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  if (tokens?.accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${tokens.accessToken}`;
  }
  
  const response = await fetch(url, { ...options, headers });
  
  // Handle token refresh if needed
  if (response.status === 401 && tokens?.refreshToken) {
    const refreshResponse = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: tokens.refreshToken }),
    });
    
    if (refreshResponse.ok) {
      const newTokens = await refreshResponse.json();
      setTokens({ accessToken: newTokens.access_token, refreshToken: newTokens.refresh_token });
      
      // Retry original request
      (headers as Record<string, string>)['Authorization'] = `Bearer ${newTokens.access_token}`;
      return fetch(url, { ...options, headers });
    } else {
      clearTokens();
    }
  }
  
  return response;
};

// Auth state change listeners
const authListeners = new Set<(event: string, session: unknown) => void>();

const notifyAuthListeners = (event: string, session: unknown) => {
  authListeners.forEach(listener => listener(event, session));
};

export const createFastAPIAdapter = (): ApiClient => {
  const baseUrl = getApiBaseUrl();
  
  return {
    auth: {
      signIn: async (email: string, password: string) => {
        const response = await fetch(`${baseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          return { user: null as unknown as User, error: new Error(error.detail || 'Login failed') };
        }
        
        const data = await response.json();
        setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token });
        
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at,
        };
        
        notifyAuthListeners('SIGNED_IN', { user });
        
        return { user, tokens: { accessToken: data.access_token, refreshToken: data.refresh_token } };
      },
      
      signUp: async (email: string, password: string, fullName?: string) => {
        const response = await fetch(`${baseUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: fullName }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          return { error: new Error(error.detail || 'Registration failed') };
        }
        
        const data = await response.json();
        setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token });
        
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at,
        };
        
        notifyAuthListeners('SIGNED_IN', { user });
        
        return { user };
      },
      
      signOut: async () => {
        await fetch(`${baseUrl}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        clearTokens();
        notifyAuthListeners('SIGNED_OUT', null);
      },
      
      getSession: async () => {
        const tokens = getTokens();
        if (!tokens?.accessToken) {
          return { user: null, session: null };
        }
        
        try {
          const response = await fetchWithAuth(`${baseUrl}/auth/me`);
          if (!response.ok) {
            return { user: null, session: null };
          }
          
          const user = await response.json();
          return { 
            user: { id: user.id, email: user.email, created_at: user.created_at }, 
            session: { access_token: tokens.accessToken } 
          };
        } catch {
          return { user: null, session: null };
        }
      },
      
      onAuthStateChange: (callback) => {
        authListeners.add(callback);
        
        // Check initial state
        const tokens = getTokens();
        if (tokens?.accessToken) {
          fetchWithAuth(`${baseUrl}/auth/me`)
            .then(res => res.ok ? res.json() : null)
            .then(user => {
              if (user) {
                callback('INITIAL_SESSION', { user: { id: user.id, email: user.email } });
              }
            });
        }
        
        return { 
          unsubscribe: () => {
            authListeners.delete(callback);
          } 
        };
      },
    },
    
    profiles: {
      get: async () => {
        const response = await fetchWithAuth(`${baseUrl}/profiles/me`);
        if (!response.ok) throw new Error('Failed to get profile');
        return response.json();
      },
      
      update: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/profiles/me`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update profile');
        return response.json();
      },
    },
    
    projects: {
      list: async () => {
        const response = await fetchWithAuth(`${baseUrl}/projects`);
        if (!response.ok) throw new Error('Failed to list projects');
        return response.json();
      },
      
      get: async (id) => {
        const response = await fetchWithAuth(`${baseUrl}/projects/${id}`);
        if (!response.ok) throw new Error('Failed to get project');
        return response.json();
      },
      
      create: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/projects`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create project');
        return response.json();
      },
      
      update: async (id, data) => {
        const response = await fetchWithAuth(`${baseUrl}/projects/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update project');
        return response.json();
      },
      
      delete: async (id) => {
        const response = await fetchWithAuth(`${baseUrl}/projects/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete project');
      },
    },
    
    brandKits: {
      list: async () => {
        const response = await fetchWithAuth(`${baseUrl}/brand-kits`);
        if (!response.ok) throw new Error('Failed to list brand kits');
        return response.json();
      },
      
      get: async (id) => {
        const response = await fetchWithAuth(`${baseUrl}/brand-kits/${id}`);
        if (!response.ok) throw new Error('Failed to get brand kit');
        return response.json();
      },
      
      create: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/brand-kits`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create brand kit');
        return response.json();
      },
      
      update: async (id, data) => {
        const response = await fetchWithAuth(`${baseUrl}/brand-kits/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update brand kit');
        return response.json();
      },
      
      delete: async (id) => {
        const response = await fetchWithAuth(`${baseUrl}/brand-kits/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete brand kit');
      },
    },
    
    templates: {
      list: async () => {
        const response = await fetchWithAuth(`${baseUrl}/templates`);
        if (!response.ok) throw new Error('Failed to list templates');
        return response.json();
      },
      
      get: async (id) => {
        const response = await fetchWithAuth(`${baseUrl}/templates/${id}`);
        if (!response.ok) throw new Error('Failed to get template');
        return response.json();
      },
      
      create: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/templates`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create template');
        return response.json();
      },
      
      update: async (id, data) => {
        const response = await fetchWithAuth(`${baseUrl}/templates/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update template');
        return response.json();
      },
      
      delete: async (id) => {
        const response = await fetchWithAuth(`${baseUrl}/templates/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete template');
      },
    },
    
    storage: {
      upload: async (file, folder = 'assets') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        
        const tokens = getTokens();
        const response = await fetch(`${baseUrl}/storage/upload`, {
          method: 'POST',
          headers: tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : {},
          body: formData,
        });
        
        if (!response.ok) throw new Error('Failed to upload file');
        return response.json();
      },
      
      delete: async (path) => {
        const response = await fetchWithAuth(`${baseUrl}/storage/${path}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete file');
      },
    },
    
    ai: {
      attentionHeatmap: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/attention-heatmap`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to generate heatmap');
        return response.json();
      },
      
      brandDna: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/brand-dna`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to extract brand DNA');
        return response.json();
      },
      
      campaignSet: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/campaign-set`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to generate campaign set');
        return response.json();
      },
      
      canvasControl: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/canvas-control`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to control canvas');
        return response.json();
      },
      
      colorPsychology: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/color-psychology`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to analyze colors');
        return response.json();
      },
      
      copywriting: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/copywriting`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to generate copy');
        return response.json();
      },
      
      creativeMultiverse: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/creative-multiverse`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to generate variations');
        return response.json();
      },
      
      emotionDesign: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/emotion-design`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to generate emotion design');
        return response.json();
      },
      
      performancePredictions: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/performance-predictions`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to predict performance');
        return response.json();
      },
      
      trendForecast: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/trend-forecast`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to forecast trends');
        return response.json();
      },
      
      typographyHarmony: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/typography-harmony`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to suggest typography');
        return response.json();
      },
      
      visualAuditor: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/visual-auditor`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to audit visual');
        return response.json();
      },
      
      generateBackground: async (data) => {
        const response = await fetchWithAuth(`${baseUrl}/ai/generate-background`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to generate background');
        return response.json();
      },
    },
  };
};
