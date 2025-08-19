import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}));

// Logger middleware
app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize storage buckets
const initializeBuckets = async () => {
  const buckets = ['make-dfdc0213-avatars', 'make-dfdc0213-media', 'make-dfdc0213-decorations'];
  
  for (const bucketName of buckets) {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
      console.log(`Created bucket: ${bucketName}`);
    }
  }
};

// Initialize on startup
initializeBuckets();

// Helper functions
const getUserFromToken = async (token: string) => {
  if (!token) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  
  return user;
};

const generateAffiliateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const addStealCoins = async (userId: string, amount: number, reason: string) => {
  try {
    // Get current coins
    const coinsData = await kv.get(`steal_coins:${userId}`);
    const currentCoins = coinsData ? parseInt(coinsData) : 0;
    const newCoins = currentCoins + amount;
    
    // Update coins
    await kv.set(`steal_coins:${userId}`, newCoins.toString());
    
    // Log transaction
    const transactionId = crypto.randomUUID();
    await kv.set(`transaction:${transactionId}`, JSON.stringify({
      userId,
      amount,
      reason,
      timestamp: Date.now(),
      type: 'earn'
    }));
    
    // Add to user's transaction history
    const historyKey = `transaction_history:${userId}`;
    const history = await kv.get(historyKey);
    const transactions = history ? JSON.parse(history) : [];
    transactions.unshift(transactionId);
    await kv.set(historyKey, JSON.stringify(transactions.slice(0, 100))); // Keep last 100
    
    return newCoins;
  } catch (error) {
    console.error('Error adding steal coins:', error);
    return 0;
  }
};

const spendStealCoins = async (userId: string, amount: number, reason: string) => {
  try {
    // Get current coins
    const coinsData = await kv.get(`steal_coins:${userId}`);
    const currentCoins = coinsData ? parseInt(coinsData) : 0;
    
    if (currentCoins < amount) {
      return { success: false, message: 'Insufficient coins' };
    }
    
    const newCoins = currentCoins - amount;
    
    // Update coins
    await kv.set(`steal_coins:${userId}`, newCoins.toString());
    
    // Log transaction
    const transactionId = crypto.randomUUID();
    await kv.set(`transaction:${transactionId}`, JSON.stringify({
      userId,
      amount: -amount,
      reason,
      timestamp: Date.now(),
      type: 'spend'
    }));
    
    // Add to user's transaction history
    const historyKey = `transaction_history:${userId}`;
    const history = await kv.get(historyKey);
    const transactions = history ? JSON.parse(history) : [];
    transactions.unshift(transactionId);
    await kv.set(historyKey, JSON.stringify(transactions.slice(0, 100)));
    
    return { success: true, newBalance: newCoins };
  } catch (error) {
    console.error('Error spending steal coins:', error);
    return { success: false, message: 'Transaction failed' };
  }
};

// Routes

// Health check
app.get('/make-server-dfdc0213/health', (c) => {
  return c.json({ status: 'healthy', timestamp: Date.now() });
});

// User signup
app.post('/make-server-dfdc0213/signup', async (c) => {
  try {
    const { email, password, name, username, affiliateCode } = await c.req.json();

    // Check if username is available
    const existingUser = await kv.get(`username:${username}`);
    if (existingUser) {
      return c.json({ error: 'Username already taken' }, 400);
    }

    // Create user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, username },
      email_confirm: true
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    const user = data.user;
    
    // Store username mapping
    await kv.set(`username:${username}`, user.id);
    await kv.set(`user:${user.id}`, JSON.stringify({
      id: user.id,
      email,
      name,
      username,
      created_at: Date.now(),
      affiliate_code: generateAffiliateCode(),
      referred_by: affiliateCode || null
    }));

    // Initialize user data
    await kv.set(`profile:${user.id}`, JSON.stringify({
      customLink: username,
      title: name || username,
      description: 'Welcome to my biolink! 🚀',
      avatar: null,
      badges: [],
      socialLinks: [],
      settings: {
        accentColor: '#10b981',
        textColor: '#ffffff',
        backgroundColor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        viewCounterEnabled: true
      }
    }));

    // Initialize steal coins (welcome bonus)
    await addStealCoins(user.id, 100, 'Welcome bonus');

    // Process affiliate referral
    if (affiliateCode) {
      const referrerData = await kv.getByPrefix('user:');
      const referrer = referrerData.find(([_, userData]) => {
        const user = JSON.parse(userData);
        return user.affiliate_code === affiliateCode;
      });

      if (referrer) {
        const [referrerKey, referrerInfo] = referrer;
        const referrerId = referrerKey.split(':')[1];
        
        // Award referrer
        await addStealCoins(referrerId, 50, `Referred ${username}`);
        
        // Track referral
        const referralId = crypto.randomUUID();
        await kv.set(`referral:${referralId}`, JSON.stringify({
          referrerId,
          referredId: user.id,
          timestamp: Date.now(),
          status: 'completed'
        }));
        
        // Add to referrer's referral list
        const referralListKey = `referrals:${referrerId}`;
        const referralList = await kv.get(referralListKey);
        const referrals = referralList ? JSON.parse(referralList) : [];
        referrals.push(referralId);
        await kv.set(referralListKey, JSON.stringify(referrals));
      }
    }

    return c.json({ 
      message: 'User created successfully',
      user: { id: user.id, email, name, username }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Get user profile
app.get('/make-server-dfdc0213/profile', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'No authorization' }, 401);
  
  const token = authHeader.split(' ')[1];
  const user = await getUserFromToken(token);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  try {
    const profile = await kv.get(`profile:${user.id}`);
    const userData = await kv.get(`user:${user.id}`);
    const stealCoins = await kv.get(`steal_coins:${user.id}`) || '0';

    return c.json({
      profile: profile ? JSON.parse(profile) : null,
      user: userData ? JSON.parse(userData) : null,
      stealCoins: parseInt(stealCoins)
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update user profile
app.put('/make-server-dfdc0213/profile', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'No authorization' }, 401);
  
  const token = authHeader.split(' ')[1];
  const user = await getUserFromToken(token);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  try {
    const updates = await c.req.json();
    const currentProfile = await kv.get(`profile:${user.id}`);
    const profile = currentProfile ? JSON.parse(currentProfile) : {};
    
    const updatedProfile = { ...profile, ...updates };
    await kv.set(`profile:${user.id}`, JSON.stringify(updatedProfile));

    return c.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Get public biolink
app.get('/make-server-dfdc0213/biolink/:username', async (c) => {
  try {
    const username = c.req.param('username');
    const userId = await kv.get(`username:${username}`);
    
    if (!userId) {
      return c.json({ error: 'User not found' }, 404);
    }

    const profile = await kv.get(`profile:${userId}`);
    const userData = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Increment view count
    const viewKey = `views:${userId}`;
    const currentViews = await kv.get(viewKey);
    const views = currentViews ? parseInt(currentViews) + 1 : 1;
    await kv.set(viewKey, views.toString());

    // Track daily/weekly/monthly views
    const today = new Date().toISOString().split('T')[0];
    const week = `${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`;
    const month = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;

    await kv.set(`views:${userId}:daily:${today}`, '1');
    await kv.set(`views:${userId}:weekly:${week}`, '1');
    await kv.set(`views:${userId}:monthly:${month}`, '1');

    // Check for milestone badges
    await checkViewMilestones(userId, views);

    return c.json({
      profile: JSON.parse(profile),
      user: userData ? JSON.parse(userData) : null,
      views
    });

  } catch (error) {
    console.error('Biolink fetch error:', error);
    return c.json({ error: 'Failed to fetch biolink' }, 500);
  }
});

// Daily steal coins claim
app.post('/make-server-dfdc0213/claim-daily', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'No authorization' }, 401);
  
  const token = authHeader.split(' ')[1];
  const user = await getUserFromToken(token);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  try {
    const today = new Date().toISOString().split('T')[0];
    const lastClaimKey = `daily_claim:${user.id}`;
    const lastClaim = await kv.get(lastClaimKey);

    if (lastClaim === today) {
      return c.json({ error: 'Already claimed today' }, 400);
    }

    // Award daily coins (base 10, can vary)
    const coinsAwarded = 10;
    const newBalance = await addStealCoins(user.id, coinsAwarded, 'Daily claim');
    
    // Update last claim date
    await kv.set(lastClaimKey, today);

    return c.json({ 
      message: 'Daily coins claimed!',
      coinsAwarded,
      newBalance
    });

  } catch (error) {
    console.error('Daily claim error:', error);
    return c.json({ error: 'Failed to claim daily coins' }, 500);
  }
});

// Purchase with steal coins
app.post('/make-server-dfdc0213/purchase', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'No authorization' }, 401);
  
  const token = authHeader.split(' ')[1];
  const user = await getUserFromToken(token);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  try {
    const { item, cost } = await c.req.json();
    
    // Define purchasable items
    const items = {
      'premium_badge': { cost: 500, description: 'Premium user badge' },
      'custom_domain': { cost: 1000, description: 'Custom domain access (30 days)' },
      'textbox_feature': { cost: 200, description: 'Advanced textbox feature' },
      'rainbow_decoration': { cost: 150, description: 'Rainbow text decoration' },
      'particle_effects': { cost: 300, description: 'Particle background effects' },
      'music_player': { cost: 250, description: 'Embedded music player' },
      'analytics_pro': { cost: 400, description: 'Advanced analytics (30 days)' }
    };

    if (!items[item]) {
      return c.json({ error: 'Invalid item' }, 400);
    }

    const itemData = items[item];
    const result = await spendStealCoins(user.id, itemData.cost, `Purchased ${itemData.description}`);

    if (!result.success) {
      return c.json({ error: result.message }, 400);
    }

    // Add item to user's inventory
    const inventoryKey = `inventory:${user.id}`;
    const inventory = await kv.get(inventoryKey);
    const userInventory = inventory ? JSON.parse(inventory) : {};
    
    if (!userInventory[item]) {
      userInventory[item] = { count: 0, expires: null };
    }
    
    userInventory[item].count += 1;
    
    // Set expiration for time-limited items
    if (item.includes('domain') || item.includes('analytics')) {
      userInventory[item].expires = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
    }
    
    await kv.set(inventoryKey, JSON.stringify(userInventory));

    return c.json({ 
      message: `Purchased ${itemData.description}!`,
      newBalance: result.newBalance,
      inventory: userInventory
    });

  } catch (error) {
    console.error('Purchase error:', error);
    return c.json({ error: 'Failed to process purchase' }, 500);
  }
});

// Get leaderboards
app.get('/make-server-dfdc0213/leaderboards', async (c) => {
  try {
    const { type = 'views', period = 'all' } = c.req.query();
    
    // Get all user data for leaderboard
    const users = await kv.getByPrefix('user:');
    const leaderboard = [];

    for (const [userKey, userData] of users) {
      const userId = userKey.split(':')[1];
      const user = JSON.parse(userData);
      
      let score = 0;
      
      if (type === 'views') {
        if (period === 'all') {
          const views = await kv.get(`views:${userId}`);
          score = views ? parseInt(views) : 0;
        } else {
          // Handle weekly/monthly views
          const viewsData = await kv.getByPrefix(`views:${userId}:${period}:`);
          score = viewsData.length;
        }
      } else if (type === 'affiliates') {
        const referrals = await kv.get(`referrals:${userId}`);
        score = referrals ? JSON.parse(referrals).length : 0;
      } else if (type === 'spenders') {
        const transactions = await kv.get(`transaction_history:${userId}`);
        if (transactions) {
          const transactionIds = JSON.parse(transactions);
          let totalSpent = 0;
          for (const txId of transactionIds) {
            const tx = await kv.get(`transaction:${txId}`);
            if (tx) {
              const transaction = JSON.parse(tx);
              if (transaction.type === 'spend') {
                totalSpent += Math.abs(transaction.amount);
              }
            }
          }
          score = totalSpent;
        }
      }

      if (score > 0) {
        leaderboard.push({
          username: user.username,
          name: user.name,
          score,
          userId
        });
      }
    }

    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);

    return c.json({
      type,
      period,
      leaderboard: leaderboard.slice(0, 50) // Top 50
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    return c.json({ error: 'Failed to get leaderboard' }, 500);
  }
});

// File upload for avatars/media
app.post('/make-server-dfdc0213/upload', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'No authorization' }, 401);
  
  const token = authHeader.split(' ')[1];
  const user = await getUserFromToken(token);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'avatar', 'media', 'decoration'
    
    if (!file || !type) {
      return c.json({ error: 'Missing file or type' }, 400);
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: 'File too large (5MB max)' }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type' }, 400);
    }

    const bucket = `make-dfdc0213-${type}s`;
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: 'Upload failed' }, 500);
    }

    // Create signed URL for access
    const { data: urlData } = await supabase.storage
      .from(bucket)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

    return c.json({ 
      message: 'File uploaded successfully',
      url: urlData?.signedUrl,
      fileName: data.path
    });

  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Helper function to check view milestones
const checkViewMilestones = async (userId: string, views: number) => {
  const milestones = [100, 500, 1000, 2500, 5000, 10000];
  const profile = await kv.get(`profile:${userId}`);
  
  if (!profile) return;
  
  const profileData = JSON.parse(profile);
  const badges = profileData.badges || [];
  
  for (const milestone of milestones) {
    if (views >= milestone) {
      const badgeId = `views_${milestone}`;
      
      // Check if badge already exists
      if (!badges.some((badge: any) => badge.id === badgeId)) {
        badges.push({
          id: badgeId,
          name: `${milestone.toLocaleString()} Views`,
          description: `Reached ${milestone.toLocaleString()} total views`,
          icon: '👁️',
          earned_at: Date.now(),
          rarity: milestone >= 5000 ? 'legendary' : milestone >= 1000 ? 'epic' : 'rare'
        });
        
        // Award coins for milestone
        const coinsReward = milestone >= 5000 ? 200 : milestone >= 1000 ? 100 : 50;
        await addStealCoins(userId, coinsReward, `${milestone} views milestone`);
      }
    }
  }
  
  // Update profile with new badges
  profileData.badges = badges;
  await kv.set(`profile:${userId}`, JSON.stringify(profileData));
};

// Get user inventory
app.get('/make-server-dfdc0213/inventory', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'No authorization' }, 401);
  
  const token = authHeader.split(' ')[1];
  const user = await getUserFromToken(token);
  if (!user) return c.json({ error: 'Invalid token' }, 401);

  try {
    const inventory = await kv.get(`inventory:${user.id}`);
    const userInventory = inventory ? JSON.parse(inventory) : {};
    
    // Clean up expired items
    const now = Date.now();
    for (const [item, data] of Object.entries(userInventory)) {
      if (data.expires && data.expires < now) {
        delete userInventory[item];
      }
    }
    
    await kv.set(`inventory:${user.id}`, JSON.stringify(userInventory));
    
    return c.json({ inventory: userInventory });

  } catch (error) {
    console.error('Inventory error:', error);
    return c.json({ error: 'Failed to get inventory' }, 500);
  }
});

Deno.serve(app.fetch);