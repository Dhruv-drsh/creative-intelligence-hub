import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { isLocalBackend } from "@/lib/api/config";

interface LocalUser {
  id: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | LocalUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Local backend auth helpers
const LOCAL_TOKEN_KEY = "creato_access_token";
const LOCAL_REFRESH_TOKEN_KEY = "creato_refresh_token";
const LOCAL_USER_KEY = "creato_user";

const getLocalApiUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:8000/api";
};

const saveLocalAuth = (accessToken: string, refreshToken: string, user: LocalUser) => {
  localStorage.setItem(LOCAL_TOKEN_KEY, accessToken);
  localStorage.setItem(LOCAL_REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
};

const clearLocalAuth = () => {
  localStorage.removeItem(LOCAL_TOKEN_KEY);
  localStorage.removeItem(LOCAL_REFRESH_TOKEN_KEY);
  localStorage.removeItem(LOCAL_USER_KEY);
};

const getStoredLocalUser = (): LocalUser | null => {
  const userStr = localStorage.getItem(LOCAL_USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | LocalUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLocalBackend()) {
      // Local FastAPI backend auth
      const storedUser = getStoredLocalUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    } else {
      // Supabase/Lovable Cloud auth
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isLocalBackend()) {
      try {
        const response = await fetch(`${getLocalApiUrl()}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          return { error: new Error(error.detail || "Login failed") };
        }

        const data = await response.json();
        saveLocalAuth(data.access_token, data.refresh_token, data.user);
        setUser(data.user);
        return { error: null };
      } catch (err) {
        return { error: err as Error };
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error as Error | null };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (isLocalBackend()) {
      try {
        const response = await fetch(`${getLocalApiUrl()}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, full_name: fullName }),
        });

        if (!response.ok) {
          const error = await response.json();
          return { error: new Error(error.detail || "Registration failed") };
        }

        const data = await response.json();
        saveLocalAuth(data.access_token, data.refresh_token, data.user);
        setUser(data.user);
        return { error: null };
      } catch (err) {
        return { error: err as Error };
      }
    } else {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { full_name: fullName },
        },
      });
      return { error: error as Error | null };
    }
  };

  const signOut = async () => {
    if (isLocalBackend()) {
      clearLocalAuth();
      setUser(null);
    } else {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export helper for getting auth token (useful for API calls)
export const getAuthToken = (): string | null => {
  if (isLocalBackend()) {
    return localStorage.getItem(LOCAL_TOKEN_KEY);
  }
  return null; // Supabase handles this internally
};
