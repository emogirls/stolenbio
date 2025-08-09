import React, { useState, useEffect } from 'react'
import { AuthForm } from './components/AuthForm'
import { Dashboard } from './components/Dashboard'
import { PublicProfile } from './components/PublicProfile'
import { createClient } from '@supabase/supabase-js'
import { supabaseUrl, publicAnonKey } from './utils/supabase/info'

const supabase = createClient(
  supabaseUrl,
  publicAnonKey
)

type User = {
  id: string
  email: string
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'auth' | 'dashboard' | 'profile'>('auth')
  const [profileUsername, setProfileUsername] = useState<string>('')

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!
          })
          setCurrentView('dashboard')
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Check URL for profile view
    const path = window.location.pathname
    if (path.startsWith('/profile/')) {
      const username = path.split('/profile/')[1]
      if (username) {
        setProfileUsername(username)
        setCurrentView('profile')
        setLoading(false)
      }
    } else if (path === '/dashboard' && user) {
      setCurrentView('dashboard')
    }
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    setCurrentView('dashboard')
    window.history.pushState({}, '', '/dashboard')
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setCurrentView('auth')
      window.history.pushState({}, '', '/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const viewProfile = (username: string) => {
    setProfileUsername(username)
    setCurrentView('profile')
    window.history.pushState({}, '', `/profile/${username}`)
  }

  const goToDashboard = () => {
    setCurrentView('dashboard')
    window.history.pushState({}, '', '/dashboard')
  }

  const goToAuth = () => {
    setCurrentView('auth')
    window.history.pushState({}, '', '/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (currentView === 'profile') {
    return (
      <PublicProfile 
        username={profileUsername} 
        onGoHome={goToAuth}
      />
    )
  }

  if (currentView === 'dashboard' && user) {
    return (
      <Dashboard 
        user={user} 
        onLogout={handleLogout}
        onViewProfile={viewProfile}
      />
    )
  }

  return (
    <AuthForm 
      onLogin={handleLogin}
      onViewProfile={viewProfile}
    />
  )
}