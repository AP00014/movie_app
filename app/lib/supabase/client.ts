import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build or when credentials are missing
    console.warn('Supabase credentials not found. Auth features will be disabled.');
    return null;
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
