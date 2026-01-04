import { supabase } from '@/integrations/supabase/client';
import type { ApiClient, User, Profile, Project, BrandKit, Template } from '../types';

export const createSupabaseAdapter = (): ApiClient => {
  return {
    auth: {
      signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { user: null as unknown as User, error: error as Error };
        return { 
          user: { 
            id: data.user?.id || '', 
            email: data.user?.email || '', 
            created_at: data.user?.created_at || '' 
          }
        };
      },
      
      signUp: async (email: string, password: string, fullName?: string) => {
        const redirectUrl = `${window.location.origin}/`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { full_name: fullName },
          },
        });
        if (error) return { error: error as Error };
        return { 
          user: data.user ? { 
            id: data.user.id, 
            email: data.user.email || '', 
            created_at: data.user.created_at || '' 
          } : undefined 
        };
      },
      
      signOut: async () => {
        await supabase.auth.signOut();
      },
      
      getSession: async () => {
        const { data } = await supabase.auth.getSession();
        return { 
          user: data.session?.user ? {
            id: data.session.user.id,
            email: data.session.user.email || '',
            created_at: data.session.user.created_at || '',
          } : null,
          session: data.session 
        };
      },
      
      onAuthStateChange: (callback) => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          callback(event, session);
        });
        return { unsubscribe: () => subscription.unsubscribe() };
      },
    },
    
    profiles: {
      get: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        return data as Profile;
      },
      
      update: async (updateData) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        const { data, error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        return data as Profile;
      },
    },
    
    projects: {
      list: async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        return data as Project[];
      },
      
      get: async (id) => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data as Project;
      },
      
      create: async (projectData) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        const { data, error } = await supabase
          .from('projects')
          .insert({ ...projectData, user_id: user.id } as never)
          .select()
          .single();
        
        if (error) throw error;
        return data as Project;
      },
      
      update: async (id, updateData) => {
        const { data, error } = await supabase
          .from('projects')
          .update(updateData as never)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data as Project;
      },
      
      delete: async (id) => {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      },
    },
    
    brandKits: {
      list: async () => {
        const { data, error } = await supabase
          .from('brand_kits')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        return data as BrandKit[];
      },
      
      get: async (id) => {
        const { data, error } = await supabase
          .from('brand_kits')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data as BrandKit;
      },
      
      create: async (kitData) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        const { data, error } = await supabase
          .from('brand_kits')
          .insert({ ...kitData, user_id: user.id } as never)
          .select()
          .single();
        
        if (error) throw error;
        return data as BrandKit;
      },
      
      update: async (id, updateData) => {
        const { data, error } = await supabase
          .from('brand_kits')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data as BrandKit;
      },
      
      delete: async (id) => {
        const { error } = await supabase
          .from('brand_kits')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      },
    },
    
    templates: {
      list: async () => {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        return data as Template[];
      },
      
      get: async (id) => {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data as Template;
      },
      
      create: async (templateData) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        const { data, error } = await supabase
          .from('templates')
          .insert({ ...templateData, user_id: user.id } as never)
          .select()
          .single();
        
        if (error) throw error;
        return data as Template;
      },
      
      update: async (id, updateData) => {
        const { data, error } = await supabase
          .from('templates')
          .update(updateData as never)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data as Template;
      },
      
      delete: async (id) => {
        const { error } = await supabase
          .from('templates')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      },
    },
    
    storage: {
      upload: async (file, folder = 'assets') => {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${folder}/${fileName}`;
        
        const { error } = await supabase.storage
          .from('assets')
          .upload(filePath, file);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);
        
        return { url: publicUrl };
      },
      
      delete: async (path) => {
        const { error } = await supabase.storage
          .from('assets')
          .remove([path]);
        
        if (error) throw error;
      },
    },
    
    ai: {
      attentionHeatmap: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('ai-attention-heatmap', { body: data });
        if (error) throw error;
        return result;
      },
      
      brandDna: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('ai-brand-dna', { body: data });
        if (error) throw error;
        return result;
      },
      
      campaignSet: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('ai-campaign-set', { body: data });
        if (error) throw error;
        return result;
      },
      
      canvasControl: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('ai-canvas-control', { body: data });
        if (error) throw error;
        return result;
      },
      
      colorPsychology: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('ai-color-psychology', { body: data });
        if (error) throw error;
        return result;
      },
      
      copywriting: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('ai-copywriting', { body: data });
        if (error) throw error;
        return result;
      },
      
      creativeMultiverse: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('ai-creative-multiverse', { body: data });
        if (error) throw error;
        return result;
      },
      
      emotionDesign: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('ai-emotion-design', { body: data });
        if (error) throw error;
        return result;
      },
      
      performancePredictions: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('ai-performance-predictions', { body: data });
        if (error) throw error;
        return result;
      },
      
      trendForecast: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('ai-trend-forecast', { body: data });
        if (error) throw error;
        return result;
      },
      
      typographyHarmony: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('ai-typography-harmony', { body: data });
        if (error) throw error;
        return result;
      },
      
      visualAuditor: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('ai-visual-auditor', { body: data });
        if (error) throw error;
        return result;
      },
      
      generateBackground: async (data) => {
        const { data: result, error } = await supabase.functions.invoke('generate-background', { body: data });
        if (error) throw error;
        return result;
      },
    },
  };
};
