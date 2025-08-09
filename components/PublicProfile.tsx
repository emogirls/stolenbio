import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { ExternalLink, Home } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

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

interface PublicProfileProps {
  username: string
  onGoHome: () => void
}

export function PublicProfile({ username, onGoHome }: PublicProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-26e0ccc2/profile/${username}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Profile not found')
        }
        throw new Error('Failed to load profile')
      }

      const profileData = await response.json()
      setProfile(profileData)
    } catch (error: any) {
      console.error('Load profile error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLinkClick = (url: string) => {
    // Ensure the URL has a protocol
    let finalUrl = url
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl
    }
    window.open(finalUrl, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error === 'Profile not found' 
              ? `The username "${username}" doesn't exist or the profile is not available.`
              : 'Something went wrong while loading this profile.'
            }
          </p>
          <Button onClick={onGoHome}>
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: profile.backgroundColor,
        color: profile.textColor 
      }}
    >
      {/* Header */}
      <div className="p-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onGoHome}
          className="mb-4"
          style={{ 
            borderColor: profile.textColor + '30',
            color: profile.textColor 
          }}
        >
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
      </div>

      {/* Profile Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            {/* Avatar Placeholder */}
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
              style={{ 
                backgroundColor: profile.accentColor,
                color: profile.backgroundColor 
              }}
            >
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
            
            <h1 className="text-2xl font-bold mb-2">
              {profile.displayName}
            </h1>
            
            <p className="text-sm opacity-75 mb-2">
              @{profile.username}
            </p>
            
            {profile.description && (
              <p className="text-sm opacity-90 leading-relaxed">
                {profile.description}
              </p>
            )}
          </div>

          {/* Links */}
          <div className="space-y-3">
            {profile.links.length === 0 ? (
              <div className="text-center py-8 opacity-75">
                <p>No links added yet</p>
              </div>
            ) : (
              profile.links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.url)}
                  className="w-full p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-between group"
                  style={{ 
                    borderColor: profile.accentColor,
                    backgroundColor: profile.backgroundColor + '10',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <span className="font-medium flex-1 text-left">
                    {link.title}
                  </span>
                  <ExternalLink 
                    className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity" 
                    style={{ color: profile.accentColor }}
                  />
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-12 opacity-50">
            <p className="text-xs">
              Powered by BioLink
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}