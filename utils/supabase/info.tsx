// Supabase configuration
// These values should be set in your environment variables

// Get environment variables with fallbacks
const getSupabaseUrl = (): string => {
  // Try to get from Vite environment variables
  try {
    return import.meta.env?.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co'
  } catch {
    return 'https://your-project-id.supabase.co'
  }
}

const getSupabaseAnonKey = (): string => {
  // Try to get from Vite environment variables
  try {
    return import.meta.env?.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
  } catch {
    return 'your-anon-key'
  }
}

const getProjectId = (): string => {
  // Try to get from environment variable first
  try {
    const envProjectId = import.meta.env?.VITE_SUPABASE_PROJECT_ID
    if (envProjectId) return envProjectId
  } catch {
    // Fall through to URL extraction
  }
  
  // Extract from URL
  try {
    const url = getSupabaseUrl()
    const match = url.match(/https:\/\/([^.]+)\.supabase\.co/)
    return match ? match[1] : 'your-project-id'
  } catch {
    return 'your-project-id'
  }
}

export const supabaseUrl = getSupabaseUrl()
export const publicAnonKey = getSupabaseAnonKey()
export const projectId = getProjectId()