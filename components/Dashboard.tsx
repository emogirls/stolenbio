import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { ExternalLink, Trash2, Eye, LogOut } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { supabaseUrl, publicAnonKey, projectId } from '../utils/supabase/info'

const supabase = createClient(
  supabaseUrl,
  publicAnonKey
)

type User = {
  id: string
  email: string
}

type Link = {
  id: string
  title: string
  url: string
  createdAt: string
}

type Profile = {
  userId: string
  username: string
  displayName: string
  description: string
  backgroundColor: string
  textColor: string
  accentColor: string
  links: Link[]
}

interface DashboardProps {
  user: User
  onLogout: () => void
  onViewProfile: (username: string) => void
}

export function Dashboard({ user, onLogout, onViewProfile }: DashboardProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    description: '',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#3b82f6'
  })

  // Link form state
  const [linkForm, setLinkForm] = useState({
    title: '',
    url: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-26e0ccc2/my-profile`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load profile')
      }

      const profileData = await response.json()
      setProfile(profileData)
      setProfileForm({
        displayName: profileData.displayName,
        description: profileData.description,
        backgroundColor: profileData.backgroundColor,
        textColor: profileData.textColor,
        accentColor: profileData.accentColor
      })
    } catch (error: any) {
      console.error('Load profile error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-26e0ccc2/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(profileForm)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
    } catch (error: any) {
      console.error('Update profile error:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const addLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }

      let url = linkForm.url
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-26e0ccc2/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title: linkForm.title,
          url: url
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add link')
      }

      await loadProfile()
      setLinkForm({ title: '', url: '' })
    } catch (error: any) {
      console.error('Add link error:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteLink = async (linkId: string) => {
    setSaving(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No access token')
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-26e0ccc2/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete link')
      }

      await loadProfile()
    } catch (error: any) {
      console.error('Delete link error:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile</p>
          <Button onClick={loadProfile} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {profile.displayName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(profile.username)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            <TabsTrigger value="links">Manage Links</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Customize your biolink page appearance and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={updateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={profileForm.displayName}
                          onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Tell people about yourself..."
                          value={profileForm.description}
                          onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Username</Label>
                        <div className="flex items-center gap-2">
                          <Input value={profile.username} disabled />
                          <Badge variant="secondary">Cannot be changed</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <div className="flex items-center gap-3">
                          <input
                            id="backgroundColor"
                            type="color"
                            value={profileForm.backgroundColor}
                            onChange={(e) => setProfileForm({ ...profileForm, backgroundColor: e.target.value })}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={profileForm.backgroundColor}
                            onChange={(e) => setProfileForm({ ...profileForm, backgroundColor: e.target.value })}
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="textColor">Text Color</Label>
                        <div className="flex items-center gap-3">
                          <input
                            id="textColor"
                            type="color"
                            value={profileForm.textColor}
                            onChange={(e) => setProfileForm({ ...profileForm, textColor: e.target.value })}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={profileForm.textColor}
                            onChange={(e) => setProfileForm({ ...profileForm, textColor: e.target.value })}
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex items-center gap-3">
                          <input
                            id="accentColor"
                            type="color"
                            value={profileForm.accentColor}
                            onChange={(e) => setProfileForm({ ...profileForm, accentColor: e.target.value })}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={profileForm.accentColor}
                            onChange={(e) => setProfileForm({ ...profileForm, accentColor: e.target.value })}
                            placeholder="#3b82f6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links">
            <div className="space-y-6">
              {/* Add Link Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Link</CardTitle>
                  <CardDescription>
                    Add links to your social media, website, or any other URL
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addLink} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkTitle">Link Title</Label>
                        <Input
                          id="linkTitle"
                          placeholder="e.g., My Website"
                          value={linkForm.title}
                          onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkUrl">URL</Label>
                        <Input
                          id="linkUrl"
                          placeholder="e.g., example.com"
                          value={linkForm.url}
                          onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Adding...' : 'Add Link'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Links List */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Links ({profile.links.length})</CardTitle>
                  <CardDescription>
                    Manage your existing links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profile.links.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No links added yet</p>
                      <p className="text-sm">Add your first link above to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {profile.links.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{link.title}</h3>
                            <p className="text-sm text-gray-600 truncate">{link.url}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(link.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteLink(link.id)}
                              disabled={saving}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}