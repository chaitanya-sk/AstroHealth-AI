import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  callsign: string;
  avatarUrl?: string;
}

export interface SignUpResult {
  success: boolean;
  error?: string;
  message?: string;
  requiresEmailVerification?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  token: string | null;
  loading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<SignUpResult>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to extract clean user profile from metadata/email
  const deriveProfile = (usr: User | null): UserProfile | null => {
    if (!usr) return null;
    const email = usr.email || '';
    const name = usr.user_metadata?.full_name || usr.user_metadata?.name || email.split('@')[0];
    const role = usr.user_metadata?.role || (email.includes('surgeon') ? 'Flight Surgeon' : 'Biomedical Operations');
    const callsign = usr.user_metadata?.callsign || 'Valkyrie-1';
    const avatarUrl = usr.user_metadata?.avatar_url || usr.user_metadata?.picture || undefined;

    return {
      id: usr.id,
      email,
      name,
      role,
      callsign,
      avatarUrl,
    };
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 1. Restore active session on application refresh
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error restoring Supabase session:', error.message);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setProfile(deriveProfile(session?.user ?? null));
      setLoading(false);
    });

    // 2. Real-time auth state listener (handles token refresh, sign-in, sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setProfile(deriveProfile(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Supabase Sign In with Password
  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase credentials are not configured yet. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        let friendly = error.message;
        const lower = error.message.toLowerCase();
        if (lower.includes('email not confirmed')) {
          friendly = 'Email not confirmed yet. Please check your inbox and verify your email before logging in.';
        } else if (lower.includes('invalid login credentials')) {
          friendly = 'Invalid email or password. Please verify your credentials and try again.';
        }
        return { success: false, error: friendly };
      }

      setSession(data.session);
      setUser(data.user);
      setProfile(deriveProfile(data.user));
      return { success: true };
    } catch (err: any) {
      return { 
        success: false, 
        error: err.message || 'An unexpected authentication error occurred.' 
      };
    }
  };

  // Supabase Sign Up for new operators
  const signUp = async (email: string, password: string, name?: string): Promise<SignUpResult> => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase credentials are not configured yet. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name?.trim() || email.split('@')[0],
            role: 'Flight Surgeon',
            callsign: 'Astro-Surgeon'
          }
        }
      });

      if (error) {
        let friendly = error.message;
        const lower = error.message.toLowerCase();
        if (lower.includes('rate limit')) {
          friendly = 'Supabase email rate limit reached. Free projects limit verification emails per hour. Please wait a few minutes before trying again or log in with an existing account.';
        } else if (lower.includes('user already registered')) {
          friendly = 'An account with this email address is already registered. Please switch to the Sign In tab.';
        }
        return { success: false, error: friendly };
      }

      const requiresEmailVerification = !data.session && !!data.user;

      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
        setProfile(deriveProfile(data.user));
      }

      return { 
        success: true, 
        requiresEmailVerification,
        message: requiresEmailVerification 
          ? `Registration successful! A verification email has been sent to ${email.trim()}. Please verify your account before logging in.`
          : 'Registration successful! You are now logged in.'
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  // Supabase Google OAuth Sign In
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase credentials are not configured yet. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to initiate Google authentication.',
      };
    }
  };

  // Supabase Sign Out
  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const token = session?.access_token || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        token,
        loading,
        isConfigured: isSupabaseConfigured,
        login,
        signUp,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
