import { createClient } from '@supabase/supabase-js';

// Production environment variables - these must be set in your deployment environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Production invite code validation - this should validate against your database
export const validateInviteCode = async (code: string): Promise<boolean> => {
  try {
    // Query the invite_codes table in your Supabase database
    const { data, error } = await supabase
      .from('invite_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error validating invite code:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error validating invite code:', error);
    return false;
  }
};

export default supabase;