import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: 'user' | 'editor' | 'admin';
}

// Sign up with email and password
export const signUp = async (email: string, password: string, fullName?: string): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName || '',
        },
      },
    });

    if (error) {
      return { user: null, error: { message: error.message } };
    }

    // Always create/update profile in database for new users
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email || '',
          full_name: fullName || null,
          role: 'user', // Default role for new users
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Try upsert if insert fails (user might already exist)
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email || '',
            full_name: fullName || null,
            role: 'user',
            updated_at: new Date().toISOString(),
          });

        if (upsertError) {
          console.error('Error upserting profile:', upsertError);
        }
      }
    }

    return { user: data.user as User, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return { user: null, error: { message } };
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: { message: error.message } };
    }

    // Check if email is confirmed
    if (data.user && !data.user.email_confirmed_at) {
      // Sign out the user since email is not confirmed
      await supabase.auth.signOut();
      return {
        user: null,
        error: { message: 'Please confirm your email address before signing in. Check your email for the confirmation link.' }
      };
    }

    // Always fetch fresh user data from database after login
    if (data.user) {
      const { user: freshUser, error: fetchError } = await getCurrentUser();
      if (fetchError) {
        console.error('Error fetching user data after login:', fetchError.message);
        // Return basic user data if profile fetch fails
        return { user: data.user as User, error: null };
      }
      return { user: freshUser, error: null };
    }

    return { user: null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return { user: null, error: { message } };
  }
};

// Sign out
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return { error: { message } };
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return { error: { message } };
  }
};

// Update password
export const updatePassword = async (password: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return { error: { message } };
  }
};

// Get current user
export const getCurrentUser = async (): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      // Return a more user-friendly error message for session missing
      if (error.message.includes('Auth session missing') || error.message.includes('JWT')) {
        return { user: null, error: { message: 'Auth session missing!' } };
      }
      return { user: null, error: { message: error.message } };
    }

    if (data.user) {
      // Fetch additional profile data from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', data.user.id)
        .single();

      if (!profileError && profile) {
        // Merge profile data with auth user data
        const enhancedUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: profile.full_name || undefined,
          avatar_url: data.user.user_metadata?.avatar_url,
          role: (profile.role as 'user' | 'editor' | 'admin') || 'user',
        };
        return { user: enhancedUser, error: null };
      }
    }

    return { user: data.user as User, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return { user: null, error: { message } };
  }
};

// Verify email
export const verifyEmail = async (): Promise<{ error: AuthError | null }> => {
  try {
    // This is handled automatically by Supabase when the user clicks the verification link
    // We just need to handle the redirect in our app
    return { error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return { error: { message } };
  }
};

// Get session
export const getSession = async (): Promise<{ session: Session | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return { session: null, error: { message: error.message } };
    }

    return { session: data.session, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return { session: null, error: { message } };
  }
};