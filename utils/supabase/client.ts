import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(
  import.meta.env?.VITE_SUPABASE_URL && 
  import.meta.env?.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-key'
)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface User {
  id: string
  email: string
  user_metadata: {
    name?: string
    username?: string
    invite_code?: string
    membership_tier?: string
  }
  created_at: string
}

export interface Profile {
  user_id: string
  username: string
  title: string
  description: string
  avatar: string | null
  background_media: string | null
  music_url: string | null
  address: string | null
  favicon: string | null
  enter_text: string
  title_tab_text: string | null
  show_badges: boolean
  badges: string[]
  social_links: any[]
  custom_links: any[]
  layout_type: string
  accent_color: string
  text_color: string
  background_color: string
  icon_color: string
  background_type: string
  description_effect: string
  border_glow: boolean
  glow_type: string
  title_type: string
  particles_enabled: boolean
  particles_image: string | null
  particles_color: string
  special_effects: string
  view_counter_enabled: boolean
  view_counter_position: string
  mouse_trails: string
  aliases: string | null
  custom_badge: string | null
  avatar_decoration: string
  membership_tier: string
  steal_coins: number
  affiliate_code: string | null
  display_rank: boolean
  milestone_notifications: boolean
  elite_features: boolean
  priority_support: boolean
  created_at: string
  updated_at: string
}

export interface InviteCode {
  id: string
  code: string
  uses_remaining: number | null
  created_by: string | null
  membership_tier: string
  created_at: string
  used_at: string | null
  used_by: string | null
}

// Mock data for when Supabase is not configured
const createMockAuth = () => ({
  async signUp(email: string, password: string, userData: any) {
    if (!isSupabaseConfigured) {
      // Mock successful signup for demo purposes
      return {
        data: {
          user: {
            id: 'demo-user-' + Date.now(),
            email,
            user_metadata: userData
          },
          session: {
            access_token: 'demo-token-' + Date.now()
          }
        },
        error: null
      }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      // Mock successful signin for demo purposes
      return {
        data: {
          user: {
            id: 'demo-user-' + Date.now(),
            email,
            user_metadata: {
              name: 'Demo User',
              username: 'demo-user',
              membership_tier: 'elite'
            }
          },
          session: {
            access_token: 'demo-token-' + Date.now()
          }
        },
        error: null
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signOut() {
    if (!isSupabaseConfigured) {
      return { error: null }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getSession() {
    if (!isSupabaseConfigured) {
      return { session: null, error: null }
    }
    
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  async getUser() {
    if (!isSupabaseConfigured) {
      return { user: null, error: null }
    }
    
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }
})

// Mock database for when Supabase is not configured
const createMockDb = () => ({
  // Invite codes
  async validateInviteCode(code: string) {
    const validCodes = ['NEPTUNE_TESTING_PURPOSES', 'ELITE2024', 'FOUNDER', 'VIP2024', 'PREMIUM', 'EXCLUSIVE']
    
    if (validCodes.includes(code.toUpperCase())) {
      return { 
        valid: true, 
        data: { 
          code: code.toUpperCase(), 
          membership_tier: 'elite',
          uses_remaining: null 
        } 
      }
    }
    
    return { valid: false, error: 'Invalid invite code' }
  },

  async useInviteCode(code: string, userId: string) {
    // Mock usage - always successful for demo
    return { error: null }
  },

  // Profiles
  async createProfile(userId: string, profileData: Partial<Profile>) {
    if (!isSupabaseConfigured) {
      // Return mock profile
      return { 
        data: { 
          user_id: userId, 
          username: profileData.username || 'demo-user',
          ...profileData 
        }, 
        error: null 
      }
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        ...profileData
      })
      .select()
      .single()

    return { data, error }
  },

  async getProfile(userId: string) {
    if (!isSupabaseConfigured) {
      // Return mock profile
      return { 
        data: {
          user_id: userId,
          username: 'demo-user',
          title: 'Elite Demo User',
          description: 'Welcome to my exclusive elite biolink ✨',
          membership_tier: 'elite',
          steal_coins: 200
        }, 
        error: null 
      }
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    return { data, error }
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    if (!isSupabaseConfigured) {
      // Mock successful update
      return { data: { user_id: userId, ...updates }, error: null }
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()

    return { data, error }
  },

  async getProfileByUsername(username: string) {
    if (!isSupabaseConfigured) {
      return { data: null, error: { message: 'Profile not found' } }
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .single()

    return { data, error }
  },

  // Leaderboards
  async getLeaderboards() {
    const mockData = [
      { username: 'elite-user-1', title: 'Elite Member', steal_coins: 1500, membership_tier: 'elite' },
      { username: 'elite-user-2', title: 'Premium Member', steal_coins: 1200, membership_tier: 'premium' },
      { username: 'elite-user-3', title: 'VIP Member', steal_coins: 1000, membership_tier: 'vip' },
    ]

    if (!isSupabaseConfigured) {
      return {
        data: {
          views: mockData,
          affiliates: mockData,
          spenders: mockData
        },
        error: null
      }
    }
    
    const { data: viewsData, error: viewsError } = await supabase
      .from('profiles')
      .select('username, title, steal_coins, membership_tier')
      .order('steal_coins', { ascending: false })
      .limit(10)

    if (viewsError) {
      return { data: null, error: viewsError }
    }

    return {
      data: {
        views: viewsData || [],
        affiliates: viewsData || [],
        spenders: viewsData || []
      },
      error: null
    }
  },

  // User stats
  async incrementViewCount(userId: string) {
    if (!isSupabaseConfigured) {
      return { error: null }
    }
    
    const { error } = await supabase.rpc('increment_view_count', {
      user_id: userId
    })
    return { error }
  },

  async getUserStats(userId: string) {
    if (!isSupabaseConfigured) {
      return { 
        data: { 
          user_id: userId, 
          total_views: 42, 
          total_clicks: 15, 
          affiliate_referrals: 3 
        }, 
        error: null 
      }
    }
    
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    return { data, error }
  }
})

// Create auth and db instances
export const auth = createMockAuth()
export const db = createMockDb()

// Initialize default invite codes (only runs when Supabase is configured)
export const initializeInviteCodes = async () => {
  if (!isSupabaseConfigured) {
    console.log('🔧 Supabase not configured, skipping invite code initialization')
    return
  }
  
  const defaultCodes = [
    {
      code: 'NEPTUNE_TESTING_PURPOSES',
      uses_remaining: null,
      membership_tier: 'elite',
      created_by: null
    },
    {
      code: 'ELITE2024',
      uses_remaining: 100,
      membership_tier: 'elite',
      created_by: null
    },
    {
      code: 'FOUNDER',
      uses_remaining: 10,
      membership_tier: 'founder',
      created_by: null
    },
    {
      code: 'VIP2024',
      uses_remaining: 50,
      membership_tier: 'vip',
      created_by: null
    }
  ]

  for (const code of defaultCodes) {
    await supabase
      .from('invite_codes')
      .upsert(code, { onConflict: 'code' })
  }
}

export default supabase