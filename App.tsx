import { useState, useEffect } from 'react';
import { AuthForm } from './components/auth/AuthForm';
import { BiolinkPage } from './components/BiolinkPage';
import { Dashboard } from './components/Dashboard';
import { BiolinkRouter } from './components/BiolinkRouter';
import { MainPage } from './components/MainPage';
import { ProfessionalLoader } from './components/ProfessionalLoader';
import { Instagram, Twitter, Youtube, Globe, Music, Github } from 'lucide-react';

type ViewMode = 'loading' | 'main' | 'auth' | 'dashboard' | 'preview' | 'biolink';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('loading');
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  
  // Comprehensive biolink settings
  const [settings, setSettings] = useState({
    // Bio-Link Menu
    customLink: 'username',
    title: 'Username',
    description: 'Welcome to my professional biolink! 🚀',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    backgroundMedia: null,
    musicUrl: '',
    musicEnabled: false,
    address: '',
    favicon: '',
    enterText: 'Enter My Space',
    overlayEnabled: false,
    fontFamily: 'Inter, sans-serif',
    customCursor: '',
    titleTabText: 'stolen.bio',
    showBadges: true,
    badges: [],

    // Bio-Socials
    socialLinks: [],

    // Misc Settings
    accentColor: '#10b981',
    textColor: '#ffffff',
    backgroundColor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    squareColor: '#1e293b',
    iconColor: '#10b981',
    discordRPC: false,
    discordInvite: '',
    backgroundType: 'normal',
    descriptionEffect: 'normal',
    borderGlow: false,
    glowType: 'avatar',
    titleType: 'normal',
    particlesEnabled: false,
    particlesImage: '',
    particlesColor: '#10b981',
    specialEffects: 'none',
    viewCounterEnabled: true,
    viewCounterPosition: 'top-right',
    mouseTrails: 'none',

    // Premium Settings
    aliases: '',
    customBadge: null,
    avatarDecoration: 'none'
  });

  // Reserved routes that should not be treated as usernames
  const reservedRoutes = [
    'auth', 'login', 'signup', 'dashboard', 'admin', 'api', 
    'features', 'pricing', 'about', 'contact', 'help', 'support',
    'terms', 'privacy', 'blog', 'docs', 'status'
  ];

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const path = window.location.pathname;
        
        // Handle root path
        if (path === '/') {
          await handleRootRoute();
          return;
        }

        // Handle specific routes
        const pathSegment = path.substring(1); // Remove leading slash
        
        // Check if it's a reserved route
        if (reservedRoutes.includes(pathSegment)) {
          // For now, redirect reserved routes to main page
          // Later you can add specific handlers for each route
          setCurrentView('main');
          return;
        }

        // Check if it looks like a username (alphanumeric, underscore, hyphen, 3-30 chars)
        if (/^[a-zA-Z0-9_-]{3,30}$/.test(pathSegment)) {
          // Treat as username biolink
          setUsername(pathSegment);
          setCurrentView('biolink');
          return;
        }

        // Invalid path format, redirect to main
        setCurrentView('main');

      } catch (error) {
        console.error('Routing error:', error);
        setCurrentView('main');
      }
    };

    const handleRootRoute = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        
        // Get environment variables from our info module
        let supabaseUrl = '';
        let supabaseAnonKey = '';
        
        try {
          const envInfo = await import('./utils/supabase/info');
          supabaseUrl = `https://${envInfo.projectId}.supabase.co`;
          supabaseAnonKey = envInfo.publicAnonKey;
        } catch (envError) {
          // Fallback to process.env if available
          supabaseUrl = process.env.SUPABASE_URL || '';
          supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
        }

        if (!supabaseUrl || !supabaseAnonKey) {
          console.warn('Supabase environment variables not found');
          setTimeout(() => setCurrentView('main'), 100);
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          setUser(session.user);
          setAccessToken(session.access_token);
          
          // Fetch user profile and settings
          await fetchUserProfile(session.access_token);
          setCurrentView('dashboard');
        } else {
          // Show main page after loading
          setTimeout(() => setCurrentView('main'), 100);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setTimeout(() => setCurrentView('main'), 100);
      }
    };

    checkSession();
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const { projectId, publicAnonKey } = await import('./utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-dfdc0213/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLoaderComplete = () => {
    setCurrentView('main');
  };

  const handleGetStarted = () => {
    setCurrentView('auth');
    // Update URL without page reload
    window.history.pushState({}, '', '/auth');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    // Update URL without page reload
    window.history.pushState({}, '', '/');
  };

  const handleAuthSuccess = async (userData: any, token: string) => {
    setUser(userData);
    setAccessToken(token);
    
    // Fetch user settings
    await fetchUserProfile(token);
    setCurrentView('dashboard');
    // Update URL without page reload
    window.history.pushState({}, '', '/dashboard');
  };

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      
      // Get environment variables
      let supabaseUrl = '';
      let supabaseAnonKey = '';
      
      try {
        const envInfo = await import('./utils/supabase/info');
        supabaseUrl = `https://${envInfo.projectId}.supabase.co`;
        supabaseAnonKey = envInfo.publicAnonKey;
      } catch (envError) {
        supabaseUrl = process.env.SUPABASE_URL || '';
        supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      await supabase.auth.signOut();
      setUser(null);
      setAccessToken('');
      setCurrentView('main');
      
      // Update URL and redirect to main
      window.history.pushState({}, '', '/');
      
      // Reset to default professional theme settings
      setSettings({
        // Bio-Link Menu
        customLink: 'username',
        title: 'Username',
        description: 'Welcome to my professional biolink! 🚀',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        backgroundMedia: null,
        musicUrl: '',
        musicEnabled: false,
        address: '',
        favicon: '',
        enterText: 'Enter My Space',
        overlayEnabled: false,
        fontFamily: 'Inter, sans-serif',
        customCursor: '',
        titleTabText: 'stolen.bio',
        showBadges: true,
        badges: [],

        // Bio-Socials
        socialLinks: [],

        // Misc Settings
        accentColor: '#10b981',
        textColor: '#ffffff',
        backgroundColor: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        squareColor: '#1e293b',
        iconColor: '#10b981',
        discordRPC: false,
        discordInvite: '',
        backgroundType: 'normal',
        descriptionEffect: 'normal',
        borderGlow: false,
        glowType: 'avatar',
        titleType: 'normal',
        particlesEnabled: false,
        particlesImage: '',
        particlesColor: '#10b981',
        specialEffects: 'none',
        viewCounterEnabled: true,
        viewCounterPosition: 'top-right',
        mouseTrails: 'none',

        // Premium Settings
        aliases: '',
        customBadge: null,
        avatarDecoration: 'none'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
  };

  const handlePreview = () => {
    setCurrentView('preview');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      // Re-run the routing logic when user uses browser navigation
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Professional loading animation
  if (currentView === 'loading') {
    return <ProfessionalLoader onComplete={handleLoaderComplete} />;
  }

  // Biolink view for public pages
  if (currentView === 'biolink') {
    return <BiolinkRouter username={username} />;
  }

  // Main landing page
  if (currentView === 'main') {
    return <MainPage onGetStarted={handleGetStarted} />;
  }

  // Authentication view
  if (currentView === 'auth') {
    return <AuthForm onAuthSuccess={handleAuthSuccess} onBack={handleBackToMain} />;
  }

  // Preview mode
  if (currentView === 'preview') {
    return (
      <div>
        {/* Back to Dashboard Button */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={handleBackToDashboard}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 border border-emerald-500/30"
          >
            ← Back to Dashboard
          </button>
        </div>
        
        <BiolinkPage settings={settings} isPreview={true} />
      </div>
    );
  }

  // Dashboard view
  return (
    <Dashboard 
      settings={settings}
      onSettingsChange={handleSettingsChange}
      onPreview={handlePreview}
      onLogout={handleLogout}
      user={user}
      accessToken={accessToken}
    />
  );
}