import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseConfig.url as string,
  supabaseConfig.anonKey as string
);

// Export auth for convenience
export const auth = supabase.auth;
