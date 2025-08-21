import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Simple KV store using Deno.env for demo
const kv = {
  get: (key: string) => {
    // Check for test invite codes
    const testCodes = ['WELCOME1', 'BETA2024', 'EARLY001', 'TESTCODE', 'DEMO123'];
    if (key.startsWith('invite:') && testCodes.includes(key.replace('invite:', ''))) {
      return Promise.resolve({ active: true, code: key.replace('invite:', '') });
    }
    return Promise.resolve(null);
  },
  set: (key: string, value: any) => {
    console.log(`Setting ${key}:`, value);
    return Promise.resolve();
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname.replace('/functions/v1/server/', '')

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Auth endpoints
    if (path === 'auth/register') {
      const { email, password, inviteCode } = await req.json()
      
      if (!email || !password || !inviteCode) {
        return new Response(
          JSON.stringify({ error: 'Email, password, and invite code are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Validate invite code
      const inviteData = await kv.get(`invite:${inviteCode}`)
      if (!inviteData || !inviteData.active) {
        return new Response(
          JSON.stringify({ error: 'Invalid or expired invite code' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create user
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { inviteCode, joinedAt: new Date().toISOString() },
        email_confirm: true
      })

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to create user account' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Mark invite as used
      await kv.set(`invite:${inviteCode}`, { ...inviteData, active: false, usedAt: new Date().toISOString() })

      // Initialize default biolink
      const defaultBiolink = {
        link: email.split('@')[0],
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
      }

      await kv.set(`biolink:${data.user.id}`, defaultBiolink)

      return new Response(
        JSON.stringify({
          message: 'Account created successfully',
          user: { id: data.user.id, email: data.user.email }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (path === 'auth/login') {
      const { email, password } = await req.json()

      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: 'Email and password are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Invalid email or password' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({
          message: 'Login successful',
          user: { id: data.user.id, email: data.user.email },
          access_token: data.session.access_token
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Biolink endpoints
    if (path === 'biolink/config') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authorization required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const token = authHeader.split(' ')[1]
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const biolinkData = await kv.get(`biolink:${user.id}`) || {
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
      }

      return new Response(
        JSON.stringify(biolinkData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (path === 'biolink/save') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authorization required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const token = authHeader.split(' ')[1]
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const configData = await req.json()
      const existingConfig = await kv.get(`biolink:${user.id}`) || {}
      
      const updatedConfig = {
        ...existingConfig,
        ...configData,
        updatedAt: new Date().toISOString()
      }
      
      await kv.set(`biolink:${user.id}`, updatedConfig)

      return new Response(
        JSON.stringify({
          message: 'Configuration saved successfully',
          config: updatedConfig
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (path === 'biolink/social/add' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authorization required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const token = authHeader.split(' ')[1]
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { type, url, icon } = await req.json()
      
      if (!type || !url) {
        return new Response(
          JSON.stringify({ error: 'Type and URL are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      const biolinkData = await kv.get(`biolink:${user.id}`) || {}
      const socialLinks = biolinkData.socialLinks || []
      
      const newSocialLink = {
        id: Date.now().toString(),
        type,
        url,
        icon: icon || `simple-icons:${type.toLowerCase()}`,
        position: socialLinks.length + 1
      }
      
      socialLinks.push(newSocialLink)
      biolinkData.socialLinks = socialLinks
      
      await kv.set(`biolink:${user.id}`, biolinkData)

      return new Response(
        JSON.stringify({
          message: 'Social link added successfully',
          socialLinks
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (path.startsWith('biolink/social/') && req.method === 'DELETE') {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authorization required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const token = authHeader.split(' ')[1]
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const socialId = path.split('/')[2]
      const biolinkData = await kv.get(`biolink:${user.id}`) || {}
      const socialLinks = biolinkData.socialLinks || []
      
      const updatedSocialLinks = socialLinks.filter((link: any) => link.id !== socialId)
      biolinkData.socialLinks = updatedSocialLinks
      
      await kv.set(`biolink:${user.id}`, biolinkData)

      return new Response(
        JSON.stringify({
          message: 'Social link removed successfully',
          socialLinks: updatedSocialLinks
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (path === 'health') {
      return new Response(
        JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})