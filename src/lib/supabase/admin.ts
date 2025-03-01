import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';

// Create a Supabase client with the service role key for admin operations
export const adminSupabase = createClient(
  supabaseConfig.url as string,
  supabaseConfig.serviceRoleKey as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Export auth admin for convenience
export const adminAuth = adminSupabase.auth;
