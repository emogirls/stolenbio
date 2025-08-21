import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createClient } from '@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Utility function to validate invite code
async function validateInviteCode(code: string): Promise<boolean> {
  try {
    const inviteData = await kv.get(`invite:${code}`);
    return inviteData !== null && inviteData.active === true;
  } catch (error) {
    console.error('Error validating invite code:', error);
    return false;
  }
}

// Utility function to mark invite code as used
async function markInviteCodeUsed(code: string): Promise<void> {
  try {
    const inviteData = await kv.get(`invite:${code}`);
    if (inviteData) {
      await kv.set(`invite:${code}`, { 
        ...inviteData, 
        active: false, 
        usedAt: new Date().toISOString() 
      });
    }
  } catch (error) {
    console.error('Error marking invite code as used:', error);
  }
}

// Utility function to get user from token
async function getUserFromToken(authorizationHeader: string) {
  const token = authorizationHeader?.split(' ')[1];
  if (!token) {
    throw new Error('Authorization token required');
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw new Error('Invalid authorization token');
  }

  return user;
}

// Route: Register new user
app.post('/auth/register', async (c) => {
  try {
    const { email, password, inviteCode } = await c.req.json();

    // Validate input
    if (!email || !password || !inviteCode) {
      return c.json({ error: 'Email, password, and invite code are required' }, 400);
    }

    // Validate invite code
    const isValidInvite = await validateInviteCode(inviteCode);
    if (!isValidInvite) {
      return c.json({ error: 'Invalid or expired invite code' }, 400);
    }

    // Create user with Supabase
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { 
        inviteCode: inviteCode,
        joinedAt: new Date().toISOString()
      },
      email_confirm: true
    });

    if (error) {
      console.error('Error creating user:', error);
      return c.json({ error: 'Failed to create user account' }, 400);
    }

    if (data.user) {
      // Mark invite code as used
      await markInviteCodeUsed(inviteCode);
      
      // Store user profile data
      await kv.set(`user:${data.user.id}`, {
        id: data.user.id,
        email: data.user.email,
        createdAt: new Date().toISOString(),
        inviteCode: inviteCode
      });

      // Initialize default biolink data
      const defaultBiolink = {
        link: data.user.email.split('@')[0],
        title: '',
        description: '',
        layout: '1',
        muteBackground: 'enable',
        borderEffect: 'none',
        address: '',
        favicon: '',
        enterText: 'Click to Enter',
        customTitle: '',
        toggleBadges: 'enable',
        avatar: '',
        background: '',
        banner: '',
        socialLinks: [],
        effects: {
          accentColor: '#ffffff',
          textColor: '#ffffff',
          backgroundColor: '#000000',
          iconColor: '#ffffff'
        },
        premium: {
          aliases: '',
          badges: []
        }
      };

      await kv.set(`biolink:${data.user.id}`, defaultBiolink);

      return c.json({ 
        message: 'Account created successfully',
        user: {
          id: data.user.id,
          email: data.user.email
        }
      });
    }

    return c.json({ error: 'Failed to create user' }, 500);
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Internal server error during registration' }, 500);
  }
});

// Route: Login user
app.post('/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error('Login error:', error);
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    if (data.user && data.session) {
      return c.json({
        message: 'Login successful',
        user: {
          id: data.user.id,
          email: data.user.email
        },
        access_token: data.session.access_token
      });
    }

    return c.json({ error: 'Login failed' }, 401);
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Internal server error during login' }, 500);
  }
});

// Route: Get biolink configuration
app.get('/biolink/config', async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization') || '');
    const biolinkData = await kv.get(`biolink:${user.id}`);
    
    if (!biolinkData) {
      // Return default configuration if none exists
      const defaultConfig = {
        link: user.email.split('@')[0],
        title: '',
        description: '',
        layout: '1',
        muteBackground: 'enable',
        borderEffect: 'none',
        address: '',
        favicon: '',
        enterText: 'Click to Enter',
        customTitle: '',
        toggleBadges: 'enable',
        avatar: '',
        background: '',
        banner: '',
        socialLinks: [],
        effects: {
          accentColor: '#ffffff',
          textColor: '#ffffff',
          backgroundColor: '#000000',
          iconColor: '#ffffff'
        },
        premium: {
          aliases: '',
          badges: []
        }
      };
      
      await kv.set(`biolink:${user.id}`, defaultConfig);
      return c.json(defaultConfig);
    }

    return c.json(biolinkData);
  } catch (error) {
    console.error('Error fetching biolink config:', error);
    return c.json({ error: 'Failed to fetch configuration' }, 500);
  }
});

// Route: Save biolink configuration
app.post('/biolink/save', async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization') || '');
    const configData = await c.req.json();
    
    // Get existing config to merge
    const existingConfig = await kv.get(`biolink:${user.id}`) || {};
    
    // Merge with existing data
    const updatedConfig = {
      ...existingConfig,
      ...configData,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`biolink:${user.id}`, updatedConfig);
    
    return c.json({ 
      message: 'Configuration saved successfully',
      config: updatedConfig 
    });
  } catch (error) {
    console.error('Error saving biolink config:', error);
    return c.json({ error: error.message || 'Failed to save configuration' }, 500);
  }
});

// Route: Add social link
app.post('/biolink/social/add', async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization') || '');
    const { type, url, icon } = await c.req.json();
    
    if (!type || !url) {
      return c.json({ error: 'Type and URL are required' }, 400);
    }
    
    const biolinkData = await kv.get(`biolink:${user.id}`) || {};
    const socialLinks = biolinkData.socialLinks || [];
    
    const newSocialLink = {
      id: Date.now().toString(),
      type,
      url,
      icon: icon || `simple-icons:${type.toLowerCase()}`,
      position: socialLinks.length + 1
    };
    
    socialLinks.push(newSocialLink);
    biolinkData.socialLinks = socialLinks;
    
    await kv.set(`biolink:${user.id}`, biolinkData);
    
    return c.json({ 
      message: 'Social link added successfully',
      socialLinks
    });
  } catch (error) {
    console.error('Error adding social link:', error);
    return c.json({ error: error.message || 'Failed to add social link' }, 500);
  }
});

// Route: Remove social link
app.delete('/biolink/social/:id', async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization') || '');
    const socialId = c.req.param('id');
    
    const biolinkData = await kv.get(`biolink:${user.id}`) || {};
    const socialLinks = biolinkData.socialLinks || [];
    
    biolinkData.socialLinks = socialLinks.filter((link: any) => link.id !== socialId);
    
    await kv.set(`biolink:${user.id}`, biolinkData);
    
    return c.json({ 
      message: 'Social link removed successfully',
      socialLinks: biolinkData.socialLinks
    });
  } catch (error) {
    console.error('Error removing social link:', error);
    return c.json({ error: error.message || 'Failed to remove social link' }, 500);
  }
});

// Route: Create invite codes (for admin use)
app.post('/admin/create-invite', async (c) => {
  try {
    // Generate a random invite code
    const inviteCode = crypto.randomUUID().slice(0, 8).toUpperCase();
    
    await kv.set(`invite:${inviteCode}`, {
      code: inviteCode,
      active: true,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    });

    return c.json({ 
      message: 'Invite code created successfully',
      inviteCode: inviteCode 
    });
  } catch (error) {
    console.error('Error creating invite code:', error);
    return c.json({ error: 'Failed to create invite code' }, 500);
  }
});

// Route: Get user profile
app.get('/user/profile', async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization') || '');
    
    // Get user profile from KV store
    const userProfile = await kv.get(`user:${user.id}`);
    
    return c.json({
      user: {
        id: user.id,
        email: user.email,
        ...userProfile
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);