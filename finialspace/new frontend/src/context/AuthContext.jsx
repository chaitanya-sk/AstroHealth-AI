import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { 
  deriveUserProfile, 
  signInWithGoogle as authSignInWithGoogle,
  signInWithPassword as authSignInWithPassword,
  signOut as authSignOut 
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 1. Restore active session on application boot/refresh
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      if (error) {
        console.error('Error restoring Supabase session:', error.message);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setProfile(deriveUserProfile(session?.user ?? null));
      setLoading(false);
    }).catch(err => {
      if (!mounted) return;
      console.error('Session retrieval failed:', err);
      setLoading(false);
    });

    // 2. Real-time auth state changes listener (token refresh, sign-in, sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setProfile(deriveUserProfile(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Google OAuth Sign In
  const signInWithGoogle = async () => {
    return await authSignInWithGoogle('/auth/callback');
  };

  // Email / Password Login
  const login = async (email, password) => {
    const res = await authSignInWithPassword(email, password);
    if (res.success && res.session) {
      setSession(res.session);
      setUser(res.user);
      setProfile(deriveUserProfile(res.user));
    }
    return res;
  };

  // Sign out / Logout
  const logout = async () => {
    await authSignOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const token = session?.access_token || null;
  const isAuthenticated = Boolean(user && session);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        token,
        loading,
        isConfigured: isSupabaseConfigured,
        isAuthenticated,
        signInWithGoogle,
        login,
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

export default AuthContext;
