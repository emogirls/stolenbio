import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { createClient } from '@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))

app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Sign up endpoint
app.post('/make-server-26e0ccc2/signup', async (c) => {
  try {
    const { email, password, username, displayName } = await c.req.json()
    
    // Check if username is already taken
    const existingProfile = await kv.get(`profile:${username}`)
    if (existingProfile) {
      return c.json({ error: 'Username already taken' }, 400)
    }
    
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        username,
        display_name: displayName 
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })
    
    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }
    
    // Create initial profile
    const profile = {
      userId: data.user.id,
      username,
      displayName,
      description: '',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      accentColor: '#3b82f6',
      links: [],
      createdAt: new Date().toISOString()
    }
    
    await kv.set(`profile:${username}`, profile)
    await kv.set(`user:${data.user.id}`, { username })
    
    return c.json({ user: data.user })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Failed to create account' }, 500)
  }
})

// Get user profile by username (public)
app.get('/make-server-26e0ccc2/profile/:username', async (c) => {
  try {
    const username = c.req.param('username')
    const profile = await kv.get(`profile:${username}`)
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }
    
    return c.json(profile)
  } catch (error) {
    console.log('Get profile error:', error)
    return c.json({ error: 'Failed to get profile' }, 500)
  }
})

// Get current user's profile (protected)
app.get('/make-server-26e0ccc2/my-profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userRecord = await kv.get(`user:${user.id}`)
    if (!userRecord) {
      return c.json({ error: 'User record not found' }, 404)
    }
    
    const profile = await kv.get(`profile:${userRecord.username}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }
    
    return c.json(profile)
  } catch (error) {
    console.log('Get my profile error:', error)
    return c.json({ error: 'Failed to get profile' }, 500)
  }
})

// Update profile (protected)
app.put('/make-server-26e0ccc2/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userRecord = await kv.get(`user:${user.id}`)
    if (!userRecord) {
      return c.json({ error: 'User record not found' }, 404)
    }
    
    const { displayName, description, backgroundColor, textColor, accentColor } = await c.req.json()
    
    const currentProfile = await kv.get(`profile:${userRecord.username}`)
    if (!currentProfile) {
      return c.json({ error: 'Profile not found' }, 404)
    }
    
    const updatedProfile = {
      ...currentProfile,
      displayName,
      description,
      backgroundColor,
      textColor,
      accentColor,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`profile:${userRecord.username}`, updatedProfile)
    
    return c.json(updatedProfile)
  } catch (error) {
    console.log('Update profile error:', error)
    return c.json({ error: 'Failed to update profile' }, 500)
  }
})

// Add link (protected)
app.post('/make-server-26e0ccc2/links', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userRecord = await kv.get(`user:${user.id}`)
    if (!userRecord) {
      return c.json({ error: 'User record not found' }, 404)
    }
    
    const { title, url } = await c.req.json()
    
    const profile = await kv.get(`profile:${userRecord.username}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }
    
    const newLink = {
      id: crypto.randomUUID(),
      title,
      url,
      createdAt: new Date().toISOString()
    }
    
    const updatedProfile = {
      ...profile,
      links: [...profile.links, newLink],
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`profile:${userRecord.username}`, updatedProfile)
    
    return c.json(newLink)
  } catch (error) {
    console.log('Add link error:', error)
    return c.json({ error: 'Failed to add link' }, 500)
  }
})

// Delete link (protected)
app.delete('/make-server-26e0ccc2/links/:linkId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const userRecord = await kv.get(`user:${user.id}`)
    if (!userRecord) {
      return c.json({ error: 'User record not found' }, 404)
    }
    
    const linkId = c.req.param('linkId')
    
    const profile = await kv.get(`profile:${userRecord.username}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }
    
    const updatedProfile = {
      ...profile,
      links: profile.links.filter((link: any) => link.id !== linkId),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(`profile:${userRecord.username}`, updatedProfile)
    
    return c.json({ success: true })
  } catch (error) {
    console.log('Delete link error:', error)
    return c.json({ error: 'Failed to delete link' }, 500)
  }
})

Deno.serve(app.fetch)