// API Client Types

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  format_id: string;
  format_width: number;
  format_height: number;
  canvas_data: Record<string, unknown>;
  thumbnail_url?: string;
  compliance_score: number;
  brand_kit_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BrandKit {
  id: string;
  user_id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_heading: string;
  font_body: string;
  logo_url?: string;
  guidelines?: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  category: string;
  format_width: number;
  format_height: number;
  canvas_data: Record<string, unknown>;
  thumbnail_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// AI Request/Response Types
export interface AttentionHeatmapRequest {
  elements: Array<{
    type: string;
    left: number;
    top: number;
    width: number;
    height: number;
    colors?: string[];
    text?: string;
    fontSize?: number;
  }>;
  canvasWidth: number;
  canvasHeight: number;
  format: string;
}

export interface BrandDNARequest {
  imageUrl?: string;
  imageBase64?: string;
  brandName?: string;
}

export interface CopywritingRequest {
  productName: string;
  productType: string;
  campaignType: string;
  targetAudience?: string;
  tone?: string;
  existingCopy?: string;
}

export interface GenerateBackgroundRequest {
  prompt: string;
  productContext?: string;
}

// API Client Interface
export interface ApiClient {
  auth: {
    signIn: (email: string, password: string) => Promise<{ user: User; tokens?: AuthTokens; error?: Error }>;
    signUp: (email: string, password: string, fullName?: string) => Promise<{ user?: User; error?: Error }>;
    signOut: () => Promise<void>;
    getSession: () => Promise<{ user: User | null; session: unknown }>;
    onAuthStateChange: (callback: (event: string, session: unknown) => void) => { unsubscribe: () => void };
  };
  
  profiles: {
    get: () => Promise<Profile>;
    update: (data: Partial<Profile>) => Promise<Profile>;
  };
  
  projects: {
    list: () => Promise<Project[]>;
    get: (id: string) => Promise<Project>;
    create: (data: Partial<Project>) => Promise<Project>;
    update: (id: string, data: Partial<Project>) => Promise<Project>;
    delete: (id: string) => Promise<void>;
  };
  
  brandKits: {
    list: () => Promise<BrandKit[]>;
    get: (id: string) => Promise<BrandKit>;
    create: (data: Partial<BrandKit>) => Promise<BrandKit>;
    update: (id: string, data: Partial<BrandKit>) => Promise<BrandKit>;
    delete: (id: string) => Promise<void>;
  };
  
  templates: {
    list: () => Promise<Template[]>;
    get: (id: string) => Promise<Template>;
    create: (data: Partial<Template>) => Promise<Template>;
    update: (id: string, data: Partial<Template>) => Promise<Template>;
    delete: (id: string) => Promise<void>;
  };
  
  storage: {
    upload: (file: File, folder?: string) => Promise<{ url: string }>;
    delete: (path: string) => Promise<void>;
  };
  
  ai: {
    attentionHeatmap: (data: AttentionHeatmapRequest) => Promise<unknown>;
    brandDna: (data: BrandDNARequest) => Promise<unknown>;
    campaignSet: (data: unknown) => Promise<unknown>;
    canvasControl: (data: { prompt: string; canvasState?: unknown }) => Promise<unknown>;
    colorPsychology: (data: unknown) => Promise<unknown>;
    copywriting: (data: CopywritingRequest) => Promise<unknown>;
    creativeMultiverse: (data: unknown) => Promise<unknown>;
    emotionDesign: (data: unknown) => Promise<unknown>;
    performancePredictions: (data: unknown) => Promise<unknown>;
    trendForecast: (data: unknown) => Promise<unknown>;
    typographyHarmony: (data: unknown) => Promise<unknown>;
    visualAuditor: (data: unknown) => Promise<unknown>;
    generateBackground: (data: GenerateBackgroundRequest) => Promise<{ imageUrl: string }>;
  };
}
