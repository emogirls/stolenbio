import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', logger(console.log))
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Create storage buckets on startup
async function initializeStorage() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketName = 'make-dfdc0213-media'
  
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false })
  }
}
initializeStorage()

// Helper function to verify user authorization
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1]
  if (!accessToken) {
    return null
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken)
  if (error || !user?.id) {
    return null
  }
  
  return user
}

// User registration
app.post('/make-server-dfdc0213/signup', async (c) => {
  try {
    const { email, password, name, username } = await c.req.json()
    
    // Check if username is already taken
    const existingUser = await kv.get(`username:${username}`)
    if (existingUser) {
      return c.json({ error: 'Username already taken' }, 400)
    }
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, username },
      email_confirm: true // Automatically confirm since email server isn't configured
    })
    
    if (error) {
      console.log('User creation error:', error)
      return c.json({ error: error.message }, 400)
    }
    
    // Store username mapping and create default biolink
    await kv.set(`username:${username}`, data.user.id)
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      username,
      isAdmin: false,
      createdAt: new Date().toISOString()
    })
    
    // Create default biolink settings
    const defaultSettings = {
      username: `@${username}`,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      description: 'Welcome to my biolink page!',
      badges: [],
      socialLinks: [],
      backgroundColor: '#0f0f0f',
      squareColor: '#1a1a1a',
      textColor: '#ffffff',
      accentColor: '#3b82f6',
      fontFamily: 'Inter, sans-serif',
      musicEnabled: false,
      musicUrl: '',
      backgroundMedia: null,
      overlayText: 'Click to Enter',
      overlayEnabled: false
    }
    
    await kv.set(`biolink:${data.user.id}`, defaultSettings)
    
    return c.json({ 
      success: true, 
      user: data.user,
      username 
    })
    
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

// Get user profile and biolink settings
app.get('/make-server-dfdc0213/profile', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userProfile = await kv.get(`user:${user.id}`)
    const biolinkSettings = await kv.get(`biolink:${user.id}`)
    
    return c.json({
      user: userProfile,
      settings: biolinkSettings
    })
    
  } catch (error) {
    console.log('Profile fetch error:', error)
    return c.json({ error: 'Error fetching profile' }, 500)
  }
})

// Update biolink settings
app.post('/make-server-dfdc0213/update-biolink', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const settings = await c.req.json()
    await kv.set(`biolink:${user.id}`, settings)
    
    return c.json({ success: true })
    
  } catch (error) {
    console.log('Biolink update error:', error)
    return c.json({ error: 'Error updating biolink settings' }, 500)
  }
})

// Get biolink by username (public endpoint)
app.get('/make-server-dfdc0213/biolink/:username', async (c) => {
  try {
    const { username } = c.req.param()
    
    const userId = await kv.get(`username:${username}`)
    if (!userId) {
      return c.json({ error: 'Biolink not found' }, 404)
    }
    
    const biolinkSettings = await kv.get(`biolink:${userId}`)
    const userProfile = await kv.get(`user:${userId}`)
    
    // Increment view count
    const viewKey = `views:${userId}`
    const currentViews = await kv.get(viewKey) || 0
    await kv.set(viewKey, currentViews + 1)
    
    return c.json({
      settings: biolinkSettings,
      user: { username: userProfile.username },
      views: currentViews + 1
    })
    
  } catch (error) {
    console.log('Biolink fetch error:', error)
    return c.json({ error: 'Error fetching biolink' }, 500)
  }
})

// Upload media file
app.post('/make-server-dfdc0213/upload-media', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }
    
    // Validate file type
    const allowedTypes = ['image/png', 'image/gif', 'video/mp4']
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only PNG, GIF, and MP4 files are allowed.' }, 400)
    }
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('make-dfdc0213-media')
      .upload(fileName, file)
    
    if (error) {
      console.log('Upload error:', error)
      return c.json({ error: 'Upload failed' }, 500)
    }
    
    // Get signed URL
    const { data: urlData } = await supabase.storage
      .from('make-dfdc0213-media')
      .createSignedUrl(fileName, 60 * 60 * 24 * 7) // 7 days
    
    return c.json({
      success: true,
      url: urlData?.signedUrl,
      fileName: data.path
    })
    
  } catch (error) {
    console.log('Media upload error:', error)
    return c.json({ error: 'Error uploading media' }, 500)
  }
})

// Admin: Get all available badges
app.get('/make-server-dfdc0213/admin/badges', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userProfile = await kv.get(`user:${user.id}`)
    if (!userProfile?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403)
    }
    
    const badges = await kv.get('admin:badges') || []
    return c.json({ badges })
    
  } catch (error) {
    console.log('Admin badges fetch error:', error)
    return c.json({ error: 'Error fetching badges' }, 500)
  }
})

// Admin: Create or update badge
app.post('/make-server-dfdc0213/admin/badges', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userProfile = await kv.get(`user:${user.id}`)
    if (!userProfile?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403)
    }
    
    const { name, icon, color } = await c.req.json()
    const badges = await kv.get('admin:badges') || []
    
    const newBadge = {
      id: Date.now().toString(),
      name,
      icon,
      color,
      createdAt: new Date().toISOString()
    }
    
    badges.push(newBadge)
    await kv.set('admin:badges', badges)
    
    return c.json({ success: true, badge: newBadge })
    
  } catch (error) {
    console.log('Badge creation error:', error)
    return c.json({ error: 'Error creating badge' }, 500)
  }
})

// Admin: Assign badge to user
app.post('/make-server-dfdc0213/admin/assign-badge', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userProfile = await kv.get(`user:${user.id}`)
    if (!userProfile?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403)
    }
    
    const { userId, badgeId } = await c.req.json()
    
    const targetUserBiolink = await kv.get(`biolink:${userId}`)
    if (!targetUserBiolink) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    const badges = await kv.get('admin:badges') || []
    const badge = badges.find((b: any) => b.id === badgeId)
    
    if (!badge) {
      return c.json({ error: 'Badge not found' }, 404)
    }
    
    // Add badge to user's biolink
    if (!targetUserBiolink.badges.find((b: any) => b.id === badgeId)) {
      targetUserBiolink.badges.push(badge)
      await kv.set(`biolink:${userId}`, targetUserBiolink)
    }
    
    return c.json({ success: true })
    
  } catch (error) {
    console.log('Badge assignment error:', error)
    return c.json({ error: 'Error assigning badge' }, 500)
  }
})

// Get all users (admin only)
app.get('/make-server-dfdc0213/admin/users', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userProfile = await kv.get(`user:${user.id}`)
    if (!userProfile?.isAdmin) {
      return c.json({ error: 'Admin access required' }, 403)
    }
    
    const users = await kv.getByPrefix('user:')
    return c.json({ users })
    
  } catch (error) {
    console.log('Users fetch error:', error)
    return c.json({ error: 'Error fetching users' }, 500)
  }
})

Deno.serve(app.fetch)