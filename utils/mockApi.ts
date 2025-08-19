// Mock API system for stolen.bio development
// Simulates backend functionality without requiring actual server infrastructure

interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    username: string;
    inviteCode?: string;
    membershipTier: string;
  };
}

interface Session {
  access_token: string;
  user: User;
}

interface Profile {
  customLink: string;
  title: string;
  description: string;
  avatar: string;
  socialLinks: Array<{ platform: string; url: string }>;
  badges: string[];
  stealCoins: number;
  membershipTier: string;
  [key: string]: any;
}

interface LeaderboardEntry {
  username: string;
  name: string;
  score: number;
  userId: string;
  membershipTier?: string;
  badge?: string;
}

interface InventoryItem {
  count: number;
  expires: number | null;
}

// Elite invite codes database
const validInviteCodes = [
  'ELITE2024', 'PREMIUM', 'EXCLUSIVE', 'INVITE123', 'STOLEN001', 
  'ALPHA2024', 'BETA2024', 'VIP2024', 'FOUNDER', 'CREATOR',
  // Demo codes for easy testing
  'TESTCODE', 'DEMO2024', 'PREVIEW'
];

// Mock user database
const mockUsers: Map<string, User> = new Map();
const mockProfiles: Map<string, Profile> = new Map();
const mockSessions: Map<string, Session> = new Map();
const mockInventory: Map<string, Record<string, InventoryItem>> = new Map();

// Generate elite leaderboards with membership tiers
const generateEliteLeaderboards = () => {
  const eliteMembers = [
    { name: 'Elite Creator', username: 'elite_creator', tier: 'founder', badge: '👑' },
    { name: 'Premium User', username: 'premium_user', tier: 'elite', badge: '⭐' },
    { name: 'VIP Member', username: 'vip_member', tier: 'vip', badge: '💎' },
    { name: 'Alpha Tester', username: 'alpha_tester', tier: 'alpha', badge: '🚀' },
    { name: 'Beta Member', username: 'beta_member', tier: 'beta', badge: '🔥' },
    { name: 'Exclusive User', username: 'exclusive_user', tier: 'elite', badge: '✨' },
    { name: 'Creator Pro', username: 'creator_pro', tier: 'elite', badge: '🎨' },
    { name: 'Influencer Elite', username: 'influencer_elite', tier: 'elite', badge: '📱' },
  ];

  return {
    views: eliteMembers.map((member, index) => ({
      username: member.username,
      name: member.name,
      score: Math.floor(Math.random() * 50000) + 10000,
      userId: `elite_${index + 1}`,
      membershipTier: member.tier,
      badge: member.badge
    })).sort((a, b) => b.score - a.score),

    affiliates: eliteMembers.map((member, index) => ({
      username: member.username,
      name: member.name,
      score: Math.floor(Math.random() * 100) + 20,
      userId: `elite_${index + 1}`,
      membershipTier: member.tier,
      badge: member.badge
    })).sort((a, b) => b.score - a.score),

    spenders: eliteMembers.map((member, index) => ({
      username: member.username,
      name: member.name,
      score: Math.floor(Math.random() * 10000) + 1000,
      userId: `elite_${index + 1}`,
      membershipTier: member.tier,
      badge: member.badge
    })).sort((a, b) => b.score - a.score)
  };
};

// Mock authentication
export const mockAuth = {
  async signUp({ email, password, options }: any) {
    console.log('🎯 Elite signup attempt:', { email, inviteCode: options?.data?.inviteCode });
    
    // Validate invite code for elite membership
    const inviteCode = options?.data?.inviteCode;
    if (!inviteCode || !validInviteCodes.includes(inviteCode.toUpperCase())) {
      return {
        error: { message: 'Invalid invite code. Elite membership requires valid invitation.' },
        data: null
      };
    }

    // Check if user already exists
    for (const [id, user] of mockUsers) {
      if (user.email === email) {
        return {
          error: { message: 'Elite member already exists with this email' },
          data: null
        };
      }
    }

    // Determine membership tier based on invite code
    let membershipTier = 'elite';
    if (['FOUNDER', 'ALPHA2024'].includes(inviteCode.toUpperCase())) {
      membershipTier = 'founder';
    } else if (['VIP2024', 'PREMIUM'].includes(inviteCode.toUpperCase())) {
      membershipTier = 'vip';
    }

    // Create elite user
    const userId = `elite_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user: User = {
      id: userId,
      email,
      user_metadata: {
        name: options?.data?.name || 'Elite Member',
        username: options?.data?.username || `elite${Math.floor(Math.random() * 1000)}`,
        inviteCode,
        membershipTier
      }
    };

    const accessToken = `elite_token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    const session: Session = { access_token: accessToken, user };

    mockUsers.set(userId, user);
    mockSessions.set(accessToken, session);

    // Create elite profile with premium defaults
    const profile: Profile = {
      customLink: user.user_metadata.username,
      title: user.user_metadata.name,
      description: 'Welcome to my exclusive elite biolink ✨',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      socialLinks: [],
      badges: ['elite-member', membershipTier],
      stealCoins: membershipTier === 'founder' ? 1000 : membershipTier === 'vip' ? 500 : 200,
      membershipTier,
      eliteFeatures: true,
      prioritySupport: true
    };

    mockProfiles.set(userId, profile);

    // Initialize elite inventory with bonus items
    const eliteInventory: Record<string, InventoryItem> = {
      'premium_badge': { count: 1, expires: null },
      'rainbow_decoration': { count: 1, expires: null }
    };

    if (membershipTier === 'founder') {
      eliteInventory['custom_domain'] = { count: 1, expires: Date.now() + (365 * 24 * 60 * 60 * 1000) }; // 1 year
      eliteInventory['analytics_pro'] = { count: 1, expires: null };
    }

    mockInventory.set(userId, eliteInventory);

    console.log('✅ Elite user created successfully:', user);
    return { data: { user, session }, error: null };
  },

  async signInWithPassword({ email, password }: any) {
    console.log('🔑 Elite login attempt:', email);

    // Find elite user
    for (const [userId, user] of mockUsers) {
      if (user.email === email) {
        const accessToken = `elite_token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
        const session: Session = { access_token: accessToken, user };
        mockSessions.set(accessToken, session);

        console.log('✅ Elite login successful:', user);
        return { data: { user, session }, error: null };
      }
    }

    return {
      error: { message: 'Invalid elite credentials or membership not found' },
      data: null
    };
  },

  async getSession() {
    // This would normally check for existing session
    return { data: { session: null }, error: null };
  }
};

// Mock API handlers
const apiHandlers: Record<string, (url: string, init?: RequestInit) => Promise<Response>> = {
  '/api/health': async () => {
    return new Response(JSON.stringify({ status: 'Elite systems operational' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  },

  '/api/profile': async (url: string, init?: RequestInit) => {
    const method = init?.method || 'GET';
    const authHeader = init?.headers?.['Authorization'] as string;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Elite access required' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];
    const session = mockSessions.get(token);

    if (!session) {
      return new Response(JSON.stringify({ error: 'Invalid elite session' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'GET') {
      const profile = mockProfiles.get(session.user.id) || {};
      return new Response(JSON.stringify({ 
        profile,
        stealCoins: profile.stealCoins || 200,
        views: Math.floor(Math.random() * 10000) + 1000,
        rank: Math.floor(Math.random() * 100) + 1,
        affiliateReferrals: Math.floor(Math.random() * 20),
        affiliateEarnings: Math.floor(Math.random() * 500),
        affiliateCode: `ELITE${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        dailyStreak: Math.floor(Math.random() * 30) + 1
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (method === 'PUT') {
      const updatedProfile = JSON.parse(init?.body as string);
      mockProfiles.set(session.user.id, { ...mockProfiles.get(session.user.id), ...updatedProfile });
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  },

  '/api/leaderboards': async (url: string, init?: RequestInit) => {
    const urlObj = new URL(url, 'http://localhost');
    const type = urlObj.searchParams.get('type') || 'views';
    
    const eliteLeaderboards = generateEliteLeaderboards();
    const leaderboard = eliteLeaderboards[type as keyof typeof eliteLeaderboards] || [];

    return new Response(JSON.stringify({ 
      leaderboard: leaderboard.slice(0, 10) // Top 10 elite members
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  },

  '/api/inventory': async (url: string, init?: RequestInit) => {
    const authHeader = init?.headers?.['Authorization'] as string;
    
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Elite authentication required' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];
    const session = mockSessions.get(token);

    if (!session) {
      return new Response(JSON.stringify({ error: 'Invalid elite session' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const inventory = mockInventory.get(session.user.id) || {};
    
    return new Response(JSON.stringify({ inventory }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  },

  '/api/claim-daily': async (url: string, init?: RequestInit) => {
    const authHeader = init?.headers?.['Authorization'] as string;
    
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Elite authentication required' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];
    const session = mockSessions.get(token);

    if (!session) {
      return new Response(JSON.stringify({ error: 'Invalid elite session' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check daily claim eligibility
    const today = new Date().toISOString().split('T')[0];
    const lastClaim = localStorage.getItem('lastDailyClaim');
    
    if (lastClaim === today) {
      return new Response(JSON.stringify({ error: 'Daily reward already claimed today' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Award elite daily bonus (higher than regular users)
    const profile = mockProfiles.get(session.user.id);
    const membershipTier = profile?.membershipTier || 'elite';
    
    let dailyBonus = 25; // Elite base bonus
    if (membershipTier === 'founder') dailyBonus = 50;
    else if (membershipTier === 'vip') dailyBonus = 35;

    const currentCoins = profile?.stealCoins || 0;
    const newBalance = currentCoins + dailyBonus;
    const currentStreak = Math.floor(Math.random() * 30) + 1;

    if (profile) {
      profile.stealCoins = newBalance;
      mockProfiles.set(session.user.id, profile);
    }

    return new Response(JSON.stringify({ 
      newBalance,
      claimed: dailyBonus,
      streak: currentStreak,
      bonus: `Elite ${membershipTier.toUpperCase()} bonus applied!`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  },

  '/api/purchase': async (url: string, init?: RequestInit) => {
    const authHeader = init?.headers?.['Authorization'] as string;
    
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Elite authentication required' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];
    const session = mockSessions.get(token);

    if (!session) {
      return new Response(JSON.stringify({ error: 'Invalid elite session' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { item, cost } = JSON.parse(init?.body as string);
    const profile = mockProfiles.get(session.user.id);
    
    if (!profile || profile.stealCoins < cost) {
      return new Response(JSON.stringify({ error: 'Insufficient Steal Coins for elite purchase' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process elite purchase
    profile.stealCoins -= cost;
    mockProfiles.set(session.user.id, profile);

    // Add to elite inventory
    const inventory = mockInventory.get(session.user.id) || {};
    if (inventory[item]) {
      inventory[item].count++;
    } else {
      inventory[item] = { 
        count: 1, 
        expires: item.includes('30 days') ? Date.now() + (30 * 24 * 60 * 60 * 1000) : null 
      };
    }
    mockInventory.set(session.user.id, inventory);

    return new Response(JSON.stringify({ 
      newBalance: profile.stealCoins,
      inventory,
      message: `Elite ${item} purchased successfully!`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  },

  '/api/validate-invite': async (url: string, init?: RequestInit) => {
    const { inviteCode } = JSON.parse(init?.body as string);
    
    const isValid = validInviteCodes.includes(inviteCode?.toUpperCase());
    
    if (isValid) {
      return new Response(JSON.stringify({ 
        valid: true, 
        message: 'Elite invite code validated',
        tier: ['FOUNDER', 'ALPHA2024'].includes(inviteCode.toUpperCase()) ? 'founder' : 
               ['VIP2024', 'PREMIUM'].includes(inviteCode.toUpperCase()) ? 'vip' : 'elite'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        valid: false, 
        message: 'Invalid invite code. Elite access denied.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

export const mockApi = {
  async handleRequest(url: string, init?: RequestInit): Promise<Response> {
    console.log('🏆 Elite Mock API:', url, init?.method || 'GET');

    // Add slight delay to simulate network
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

    // Find matching handler
    for (const [pattern, handler] of Object.entries(apiHandlers)) {
      if (url.startsWith(pattern)) {
        try {
          return await handler(url, init);
        } catch (error) {
          console.error('Elite API handler error:', error);
          return new Response(JSON.stringify({ 
            error: 'Elite internal server error',
            details: error.message 
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }

    // Fallback for unhandled routes
    return new Response(JSON.stringify({ 
      error: 'Elite endpoint not found',
      availableEndpoints: Object.keys(apiHandlers)
    }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

console.log('🏆 Elite Mock API system initialized');
console.log('📝 Valid invite codes for testing:', validInviteCodes.slice(0, 5), '...');