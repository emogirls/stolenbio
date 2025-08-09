import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Label } from './ui/label'
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

interface AuthFormProps {
  onLogin: (user: User) => void
  onViewProfile: (username: string) => void
}

export function AuthForm({ onLogin, onViewProfile }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [profileUsername, setProfileUsername] = useState('')

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: ''
  })

  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  })

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Create account via our backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-26e0ccc2/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(signUpData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create account')
      }

      // Sign in the user
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: signUpData.email,
        password: signUpData.password
      })

      if (signInError) {
        throw new Error(signInError.message)
      }

      if (session?.user) {
        onLogin({
          id: session.user.id,
          email: session.user.email!
        })
      }
    } catch (error: any) {
      console.error('Sign up error:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password
      })

      if (error) {
        throw new Error(error.message)
      }

      if (session?.user) {
        onLogin({
          id: session.user.id,
          email: session.user.email!
        })
      }
    } catch (error: any) {
      console.error('Sign in error:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (profileUsername.trim()) {
      onViewProfile(profileUsername.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">BioLink</h1>
          <p className="text-gray-600 mt-2">Create your personalized link hub</p>
        </div>

        {/* View Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>View a Profile</CardTitle>
            <CardDescription>
              Enter a username to view their biolink page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleViewProfile} className="space-y-4">
              <div>
                <Label htmlFor="profile-username">Username</Label>
                <Input
                  id="profile-username"
                  type="text"
                  placeholder="Enter username"
                  value={profileUsername}
                  onChange={(e) => setProfileUsername(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                View Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Auth Forms */}
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Choose a unique username"
                      value={signUpData.username}
                      onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Your biolink will be available at /profile/{signUpData.username}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="signup-displayname">Display Name</Label>
                    <Input
                      id="signup-displayname"
                      type="text"
                      placeholder="Your display name"
                      value={signUpData.displayName}
                      onChange={(e) => setSignUpData({ ...signUpData, displayName: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}