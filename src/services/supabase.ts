import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

// Authentication functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Movie related functions
export const getMovies = async (category?: string) => {
  let query = supabase.from('movies').select('*');
  
  if (category && category !== 'All') {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getMovieById = async (id: string) => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// Admin functions
export const addMovie = async (movieData: Database['public']['Tables']['movies']['Insert']) => {
  const { data, error } = await supabase
    .from('movies')
    .insert(movieData)
    .select();

  if (error) throw error;
  return data;
};

export const updateMovie = async (id: string, movieData: Database['public']['Tables']['movies']['Update']) => {
  const { data, error } = await supabase
    .from('movies')
    .update(movieData)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteMovie = async (id: string) => {
  const { error } = await supabase
    .from('movies')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// User profile functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId: string, profileData: Database['public']['Tables']['profiles']['Update']) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select();

  if (error) throw error;
  return data;
};