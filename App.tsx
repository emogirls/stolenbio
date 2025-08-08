import { useState, useEffect } from "react";
import { AuthForm } from "./components/AuthForm";
import { Dashboard } from "./components/Dashboard";
import { PublicBiolink } from "./components/PublicBiolink";
import { getSupabaseClient } from "./utils/supabase/client";
import { api, Profile } from "./utils/api";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "./components/ui/alert";

type AppState = 'loading' | 'setup' | 'public' | 'auth' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  // Check for existing session on app load
  useEffect(() => {
    checkSetupAndSession();
  }, []);

  const checkSetupAndSession = async () => {
    // Check if environment variables are properly set
    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl.includes('your-project-id') || 
        supabaseAnonKey.includes('your-anon-key')) {
      setAppState('setup');
      return;
    }

    // Environment is configured, check session
    await checkSession();
  };

  const checkSession = async () => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setAppState('setup');
        return;
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        setAppState('public');
        return;
      }
      
      if (session?.access_token) {
        // User is signed in, load their profile
        await handleAuthSuccess(session.user, session.access_token);
      } else {
        // No session, show public page
        setAppState('public');
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setAppState('public');
    }
  };

  const handleAuthSuccess = async (user: any, token: string) => {
    try {
      setUser(user);
      setAccessToken(token);
      
      // Load user profile
      const { profile } = await api.getCurrentUserProfile(token);
      setUserProfile(profile);
      setAppState('dashboard');
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // If profile loading fails, sign out the user
      handleSignOut();
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setAccessToken(null);
    setUserProfile(null);
    setAppState('public');
  };

  const navigateToAuth = () => {
    setAppState('auth');
  };

  const navigateToPublic = () => {
    setAppState('public');
  };

  // Loading state
  if (appState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Setup state
  if (appState === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Setup Required</h1>
            <p className="text-muted-foreground">
              Your Biolink app needs to be configured with Supabase credentials to work properly.
            </p>
          </div>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <div>
                <strong>To get started:</strong>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">supabase.com</a></li>
                <li>Go to Settings → API in your project dashboard</li>
                <li>Copy your Project URL and anon/public key</li>
                <li>Update the <code className="bg-muted px-1 rounded">.env.local</code> file with your credentials</li>
                <li>Restart the development server</li>
              </ol>
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Check Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authentication form
  if (appState === 'auth') {
    return (
      <AuthForm 
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // User dashboard
  if (appState === 'dashboard' && userProfile && accessToken) {
    return (
      <Dashboard
        accessToken={accessToken}
        initialProfile={userProfile}
        onSignOut={handleSignOut}
      />
    );
  }

  // Public biolink viewer / landing page
  return (
    <PublicBiolink 
      onNavigateToAuth={navigateToAuth}
    />
  );
}