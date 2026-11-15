import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Extracts a normalized user profile from Supabase user data and metadata
 */
export const deriveUserProfile = (user) => {
  if (!user) return null;
  const email = user.email || '';
  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || email.split('@')[0] || 'Astronaut';
  const role = meta.role || (email.includes('surgeon') ? 'Flight Surgeon' : 'Mission Specialist');
  const callsign = meta.callsign || 'ASTRA-1';
  const avatarUrl = meta.avatar_url || meta.picture || null;

  return {
    id: user.id,
    email,
    name,
    role,
    callsign,
    avatarUrl,
  };
};

/**
 * Initiates Google OAuth redirect via Supabase
 */
export const signInWithGoogle = async (redirectPath = '/auth/callback') => {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase credentials are not configured. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    };
  }

  try {
    const origin = window.location.origin;
    const redirectTo = `${origin}${redirectPath}`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Failed to initiate Google authentication.',
    };
  }
};

/**
 * Sign in with email and password
 */
export const signInWithPassword = async (email, password) => {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase credentials are not configured.',
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
        friendly = 'Email not confirmed yet. Please verify your email before logging in.';
      } else if (lower.includes('invalid login credentials')) {
        friendly = 'Invalid email or password. Please verify credentials.';
      }
      return { success: false, error: friendly };
    }

    return { success: true, session: data.session, user: data.user };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during sign in.',
    };
  }
};

/**
 * Sign out of active Supabase session
 */
export const signOut = async () => {
  try {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    return { success: true };
  } catch (err) {
    console.error('Error during sign out:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Retrieve current active session
 */
export const getCurrentSession = async () => {
  if (!isSupabaseConfigured) return { session: null, user: null };
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return { session: null, user: null };
  }
  return { session, user: session?.user || null };
};
