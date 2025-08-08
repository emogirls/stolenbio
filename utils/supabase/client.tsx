import { createClient } from '@supabase/supabase-js';

let supabaseInstance: any = null;

function createSupabaseClient() {
  const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id') || supabaseAnonKey.includes('your-anon-key')) {
    console.error('⚠️  Missing or invalid Supabase environment variables');
    console.error('Please update your .env.local file with your actual Supabase credentials');
    console.error('1. Go to https://supabase.com/dashboard');
    console.error('2. Select your project');
    console.error('3. Go to Settings > API');
    console.error('4. Copy the Project URL and anon/public key to .env.local');
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Lazy getter for supabase client
export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
};

// For backward compatibility
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error('Supabase client not initialized. Please configure your environment variables.');
    }
    return client[prop];
  }
});