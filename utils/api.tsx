const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id') || supabaseAnonKey.includes('your-anon-key')) {
  console.warn('⚠️  API client created with missing or placeholder Supabase credentials');
}

const projectId = supabaseUrl?.replace('https://', '').replace('.supabase.co', '') || '';
const API_BASE_URL = supabaseUrl ? `${supabaseUrl}/functions/v1/make-server-69c4ff4c` : '';

export interface Profile {
  id: string;
  username: string;
  avatar: string;
  description: string;
  badges: string[];
  socialLinks: SocialLink[];
  viewCount: number;
  backgroundMedia?: string;
  backgroundType?: 'image' | 'gif' | 'video';
  accentColor?: string;
  textColor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error(`API Error (${response.status}):`, data);
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  private async authenticatedRequest(endpoint: string, accessToken: string, options: RequestInit = {}) {
    return this.request(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  // Auth methods
  async signup(email: string, password: string, username: string) {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  }

  // Profile methods
  async getProfile(username: string): Promise<{ profile: Profile }> {
    return this.request(`/profile/${username}`);
  }

  async getCurrentUserProfile(accessToken: string): Promise<{ profile: Profile }> {
    return this.authenticatedRequest('/me', accessToken);
  }

  async updateProfile(accessToken: string, updates: Partial<Profile>): Promise<{ profile: Profile }> {
    return this.authenticatedRequest('/profile', accessToken, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Admin methods
  async assignBadges(accessToken: string, username: string, badges: string[]): Promise<{ profile: Profile }> {
    return this.authenticatedRequest('/admin/badges', accessToken, {
      method: 'POST',
      body: JSON.stringify({ username, badges }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const api = new ApiClient();