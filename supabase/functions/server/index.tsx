import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/middleware';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting middleware
const rateLimit = (maxRequests: number, windowMs: number) => {
  return async (c: any, next: any) => {
    const clientIp = c.req.header('cf-connecting-ip') || 
                     c.req.header('x-forwarded-for') || 
                     c.req.header('x-real-ip') || 
                     'unknown';
    
    const now = Date.now();
    const key = `${clientIp}:${c.req.path}`;
    
    const record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return await next();
    }
    
    if (record.count >= maxRequests) {
      return c.json({ error: 'Too many requests. Please try again later.' }, 429);
    }
    
    record.count++;
    return await next();
  };
};

// Input validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

const sanitizeString = (str: string, maxLength: number = 500): string => {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
};

const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Middleware
app.use('*', cors({
  origin: (origin) => {
    // Allow localhost for development
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return true;
    }
    // Add your production domains here
    const allowedOrigins = [
      'https://yourdomain.com',
      'https://www.yourdomain.com'
    ];
    return allowedOrigins.includes(origin);
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use('*', logger(console.log));

// Apply rate limiting to auth endpoints
app.use('/make-server-69c4ff4c/signup', rateLimit(5, 15 * 60 * 1000)); // 5 signups per 15 minutes
app.use('/make-server-69c4ff4c/profile/*', rateLimit(100, 60 * 1000)); // 100 profile requests per minute

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper function to verify authorization
async function verifyAuth(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const accessToken = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user?.id) {
    return null;
  }
  
  return user.id;
}

// User signup with enhanced validation
app.post('/make-server-69c4ff4c/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, username } = body;
    
    // Validate inputs
    if (!email || !password || !username) {
      return c.json({ error: 'Email, password, and username are required' }, 400);
    }
    
    if (!validateEmail(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }
    
    if (!validateUsername(username)) {
      return c.json({ error: 'Username must be 3-30 characters and contain only letters, numbers, and underscores' }, 400);
    }
    
    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }
    
    // Check for reserved usernames
    const reservedUsernames = ['admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'root', 'support', 'info', 'help', 'about', 'contact'];
    if (reservedUsernames.includes(username.toLowerCase())) {
      return c.json({ error: 'Username is reserved' }, 400);
    }
    
    // Check if username is already taken
    const existingUser = await kv.get(`profile:${username.toLowerCase()}`);
    if (existingUser) {
      return c.json({ error: 'Username already taken' }, 400);
    }
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      user_metadata: { username: username.toLowerCase() },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });
    
    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: 'Failed to create user: ' + error.message }, 400);
    }
    
    // Create default profile with sanitized data
    const defaultProfile = {
      id: data.user.id,
      username: username.toLowerCase(),
      avatar: '',
      description: sanitizeString('Welcome to my biolink page!', 500),
      badges: [],
      socialLinks: [],
      viewCount: 0,
      backgroundMedia: '',
      backgroundType: 'image',
      accentColor: '#6366f1',
      textColor: '#ffffff',
      createdAt: new Date().toISOString()
    };
    
    // Store profile data
    await kv.set(`profile:${username.toLowerCase()}`, defaultProfile);
    await kv.set(`user:${data.user.id}`, { username: username.toLowerCase() });
    
    return c.json({ user: data.user, profile: defaultProfile });
  } catch (error) {
    console.log('Signup server error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get profile by username (public) with enhanced validation
app.get('/make-server-69c4ff4c/profile/:username', async (c) => {
  try {
    const username = c.req.param('username');
    
    if (!validateUsername(username)) {
      return c.json({ error: 'Invalid username format' }, 400);
    }
    
    const profile = await kv.get(`profile:${username.toLowerCase()}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    // Increment view count with throttling (max 1 per IP per hour)
    const clientIp = c.req.header('cf-connecting-ip') || 
                     c.req.header('x-forwarded-for') || 
                     c.req.header('x-real-ip') || 
                     'unknown';
    
    const viewKey = `view:${username.toLowerCase()}:${clientIp}`;
    const lastView = await kv.get(viewKey);
    const now = Date.now();
    
    if (!lastView || (now - lastView.timestamp > 60 * 60 * 1000)) { // 1 hour throttle
      profile.viewCount = (profile.viewCount || 0) + 1;
      await kv.set(`profile:${username.toLowerCase()}`, profile);
      await kv.set(viewKey, { timestamp: now });
    }
    
    return c.json({ profile });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update profile (authenticated) with enhanced validation
app.put('/make-server-69c4ff4c/profile', async (c) => {
  try {
    const userId = await verifyAuth(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userData = await kv.get(`user:${userId}`);
    if (!userData?.username) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    const updates = await c.req.json();
    const currentProfile = await kv.get(`profile:${userData.username}`);
    
    if (!currentProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    // Validate and sanitize updates
    const sanitizedUpdates: any = {};
    
    if (updates.avatar !== undefined) {
      if (updates.avatar && !validateUrl(updates.avatar)) {
        return c.json({ error: 'Invalid avatar URL' }, 400);
      }
      sanitizedUpdates.avatar = sanitizeString(updates.avatar, 500);
    }
    
    if (updates.description !== undefined) {
      sanitizedUpdates.description = sanitizeString(updates.description, 500);
    }
    
    if (updates.socialLinks !== undefined) {
      if (!Array.isArray(updates.socialLinks) || updates.socialLinks.length > 20) {
        return c.json({ error: 'Invalid social links data' }, 400);
      }
      
      sanitizedUpdates.socialLinks = updates.socialLinks.map((link: any) => ({
        id: sanitizeString(link.id, 50),
        platform: sanitizeString(link.platform, 50),
        url: validateUrl(link.url) ? sanitizeString(link.url, 500) : '',
        icon: sanitizeString(link.icon, 100)
      })).filter((link: any) => link.url); // Remove invalid URLs
    }
    
    if (updates.accentColor !== undefined) {
      const colorRegex = /^#[0-9A-Fa-f]{6}$/;
      if (colorRegex.test(updates.accentColor)) {
        sanitizedUpdates.accentColor = updates.accentColor;
      }
    }
    
    if (updates.textColor !== undefined) {
      const colorRegex = /^#[0-9A-Fa-f]{6}$/;
      if (colorRegex.test(updates.textColor)) {
        sanitizedUpdates.textColor = updates.textColor;
      }
    }
    
    if (updates.backgroundMedia !== undefined) {
      // For file uploads, you'd want to implement proper file validation here
      sanitizedUpdates.backgroundMedia = sanitizeString(updates.backgroundMedia, 500);
    }
    
    if (updates.backgroundType !== undefined) {
      const validTypes = ['image', 'gif', 'video'];
      if (validTypes.includes(updates.backgroundType)) {
        sanitizedUpdates.backgroundType = updates.backgroundType;
      }
    }
    
    // Merge updates with current profile
    const updatedProfile = {
      ...currentProfile,
      ...sanitizedUpdates,
      id: userId, // Ensure ID doesn't change
      username: userData.username, // Ensure username doesn't change
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`profile:${userData.username}`, updatedProfile);
    
    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Get current user profile (authenticated)
app.get('/make-server-69c4ff4c/me', async (c) => {
  try {
    const userId = await verifyAuth(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userData = await kv.get(`user:${userId}`);
    if (!userData?.username) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    const profile = await kv.get(`profile:${userData.username}`);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    return c.json({ profile });
  } catch (error) {
    console.log('Get current user error:', error);
    return c.json({ error: 'Failed to fetch user profile' }, 500);
  }
});

// Admin: Assign badges (requires admin privileges)
app.post('/make-server-69c4ff4c/admin/badges', async (c) => {
  try {
    const userId = await verifyAuth(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Check if user is admin (you can implement your own admin logic)
    const adminList = await kv.get('admins') || [];
    if (!adminList.includes(userId)) {
      return c.json({ error: 'Admin privileges required' }, 403);
    }
    
    const { username, badges } = await c.req.json();
    
    const profile = await kv.get(`profile:${username}`);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    profile.badges = badges;
    profile.updatedAt = new Date().toISOString();
    
    await kv.set(`profile:${username}`, profile);
    
    return c.json({ profile });
  } catch (error) {
    console.log('Admin assign badges error:', error);
    return c.json({ error: 'Failed to assign badges' }, 500);
  }
});

// Health check
app.get('/make-server-69c4ff4c/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);