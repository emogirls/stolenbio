import { Suspense, lazy, useState, useEffect, startTransition, useCallback } from 'react';
import { ProfessionalLoader } from './components/ProfessionalLoader';
import { SupabaseSetup } from './components/SupabaseSetup';
import { SupabaseVerification } from './components/SupabaseVerification';
import { supabase, auth, db, isSupabaseConfigured } from './utils/supabase/client';

// Fixed lazy imports - use correct syntax for default exports
const AuthForm = lazy(() => import('./components/auth/AuthForm'));
const BiolinkPage = lazy(() => import('./components/BiolinkPage'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const InviteOnlyLanding = lazy(() => import('./components/InviteOnlyLanding'));

type ViewMode = 'loading' | 'invite-gate' | 'auth' | 'dashboard' | 'preview';

// Exclusive platform notices with magenta theme
const SupabaseSetupNotice = ({ onDismiss, onVerify }: { 
  onSetupClick?: () => void; 
  onDismiss: () => void; 
  onVerify: () => void;
}) => (
  <div className="fixed top-4 right-4 z-40 max-w-sm">
    <div className="bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 border border-fuchsia-500/30 text-fuchsia-400 p-4 rounded text-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">🚀 Elite Database Connected</span>
        <button 
          onClick={onDismiss}
          className="text-fuchsia-400 hover:text-fuchsia-300"
        >
          ×
        </button>
      </div>
      <div className="space-y-2 text-fuchsia-400/80">
        <p>Exclusive platform operational.</p>
        <p>Elite member data secured.</p>
        <div className="flex gap-2 mt-3">
          <button 
            onClick={onVerify}
            className="px-3 py-1 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-500/30 rounded text-fuchsia-400 transition-colors text-xs"
          >
            Test Elite Access
          </button>
          <button 
            onClick={onDismiss}
            className="px-3 py-1 bg-transparent hover:bg-fuchsia-500/10 border border-fuchsia-500/30 rounded text-fuchsia-400 transition-colors text-xs"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
);

const DemoModeNotice = ({ onSetupClick, onDismiss }: { onSetupClick: () => void; onDismiss: () => void }) => (
  <div className="fixed top-4 right-4 z-40 max-w-sm">
    <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-4 rounded text-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">⚠️ Elite Demo Mode</span>
        <button 
          onClick={onDismiss}
          className="text-yellow-400 hover:text-yellow-300"
        >
          ×
        </button>
      </div>
      <div className="space-y-2 text-yellow-400/80">
        <p>Simulating exclusive platform.</p>
        <p>Connect database for full elite access.</p>
        <div className="flex gap-2 mt-3">
          <button 
            onClick={onSetupClick}
            className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded text-yellow-400 transition-colors text-xs"
          >
            Elite Setup
          </button>
          <button 
            onClick={onDismiss}
            className="px-3 py-1 bg-transparent hover:bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400 transition-colors text-xs"
          >
            Continue Demo
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('loading');
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [, setProfile] = useState<any>(null);
  const [showSetupNotice, setShowSetupNotice] = useState(false);
  const [showSupabaseSetup, setShowSupabaseSetup] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  
  // Elite biolink settings for exclusive members with magenta theme
  const [settings, setSettings] = useState({
    // Exclusive Elite Bio-Link Features
    customLink: 'elite-member',
    title: 'Exclusive Elite Member',
    description: 'Welcome to the inner circle ✨',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    backgroundMedia: null,
    musicUrl: '',
    musicEnabled: false,
    address: '',
    favicon: '',
    enterText: 'Enter Elite Space',
    overlayEnabled: true,
    fontFamily: 'Inter, sans-serif',
    customCursor: '',
    titleTabText: 'Elite | stolen.bio',
    showBadges: true,
    badges: [
      { id: 'elite-member', name: 'Elite Member', icon: 'crown', color: '#d946ef' },
      { id: 'founding-member', name: 'Founding Member', icon: 'star', color: '#c026d3' }
    ],
    socialLinks: [],
    customLinks: [],
    layoutType: 'square',
    accentColor: '#d946ef',
    textColor: '#ffffff',
    backgroundColor: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #0f172a 100%)',
    squareColor: '#1e293b',
    iconColor: '#d946ef',
    discordRPC: false,
    discordInvite: '',
    backgroundType: 'gradient',
    descriptionEffect: 'glow',
    borderGlow: true,
    glowType: 'avatar',
    titleType: 'gradient',
    particlesEnabled: true,
    particlesImage: '',
    particlesColor: '#d946ef',
    specialEffects: 'elite',
    viewCounterEnabled: true,
    viewCounterPosition: 'bottom-left',
    mouseTrails: 'elite',
    
    // Exclusive Elite Settings
    aliases: '',
    customBadge: 'Founding Elite',
    avatarDecoration: 'glow',
    membershipTier: 'elite',
    
    // Elite Gamification & Exclusivity
    stealCoinsEnabled: true,
    affiliateCode: '',
    displayRank: true,
    milestoneNotifications: true,
    eliteFeatures: true,
    prioritySupport: true,
    exclusiveAccess: true,
    invitePrivileges: true
  });

  // Exclusive platform routes - all protected
  const protectedRoutes = [
    'dashboard', 'preview', 'elite', 'admin', 'settings', 
    'leaderboard', 'exclusive', 'members', 'invite-manager'
  ];

  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error } = await db.getProfile(userId);
      
      if (error) {
        console.error('Error loading elite profile:', error);
        return;
      }
      
      if (profileData) {
        setProfile(profileData);
        
        // Update settings with elite member data
        setSettings(prevSettings => ({
          ...prevSettings,
          customLink: profileData.username,
          title: profileData.title || 'Elite Member',
          description: profileData.description || 'Exclusive elite member of stolen.bio',
          avatar: profileData.avatar || prevSettings.avatar,
          backgroundMedia: profileData.background_media,
          musicUrl: profileData.music_url,
          address: profileData.address,
          favicon: profileData.favicon,
          enterText: profileData.enter_text || 'Enter Elite Space',
          titleTabText: profileData.title_tab_text || 'Elite | stolen.bio',
          showBadges: profileData.show_badges ?? true,
          badges: profileData.badges || [
            { id: 'elite-member', name: 'Elite Member', icon: 'crown', color: '#d946ef' }
          ],
          socialLinks: profileData.social_links || [],
          customLinks: profileData.custom_links || [],
          layoutType: profileData.layout_type || 'square',
          accentColor: profileData.accent_color || '#d946ef',
          textColor: profileData.text_color || '#ffffff',
          backgroundColor: profileData.background_color || prevSettings.backgroundColor,
          iconColor: profileData.icon_color || '#d946ef',
          backgroundType: profileData.background_type || 'gradient',
          descriptionEffect: profileData.description_effect || 'glow',
          borderGlow: profileData.border_glow ?? true,
          glowType: profileData.glow_type || 'avatar',
          titleType: profileData.title_type || 'gradient',
          particlesEnabled: profileData.particles_enabled ?? true,
          particlesImage: profileData.particles_image || '',
          particlesColor: profileData.particles_color || '#d946ef',
          specialEffects: profileData.special_effects || 'elite',
          viewCounterEnabled: profileData.view_counter_enabled ?? true,
          viewCounterPosition: profileData.view_counter_position || 'bottom-left',
          mouseTrails: profileData.mouse_trails || 'elite',
          aliases: profileData.aliases || '',
          customBadge: profileData.custom_badge || 'Elite',
          avatarDecoration: profileData.avatar_decoration || 'glow',
          membershipTier: profileData.membership_tier || 'elite',
          affiliateCode: profileData.affiliate_code || '',
          displayRank: profileData.display_rank ?? true,
          milestoneNotifications: profileData.milestone_notifications ?? true,
          eliteFeatures: profileData.elite_features ?? true,
          prioritySupport: profileData.priority_support ?? true,
          exclusiveAccess: true,
          invitePrivileges: profileData.membership_tier === 'elite' || profileData.membership_tier === 'founder'
        }));
      }
    } catch (error) {
      console.error('Error loading elite member profile:', error);
    }
  }, []);

  const handleRouting = useCallback(async () => {
    try {
      const path = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get('ref');
      const inviteCode = urlParams.get('invite');
      
      // Store referral/invite codes for exclusive access
      if (referralCode) {
        localStorage.setItem('referralCode', referralCode);
      }
      if (inviteCode) {
        localStorage.setItem('validatedInviteCode', inviteCode);
      }
      
      // Handle root path - show invite gate or dashboard
      if (path === '/') {
        if (session?.user) {
          startTransition(() => {
            setCurrentView('dashboard');
          });
        } else {
          startTransition(() => {
            setCurrentView('invite-gate');
          });
        }
        return;
      }

      // Handle authentication routes
      const pathSegment = path.substring(1);
      
      if (pathSegment === 'auth' || pathSegment === 'login' || pathSegment === 'join') {
        startTransition(() => {
          setCurrentView('auth');
        });
        return;
      }
      
      // Handle protected routes - require authentication
      if (protectedRoutes.includes(pathSegment)) {
        if (session?.user) {
          if (pathSegment === 'dashboard') {
            startTransition(() => {
              setCurrentView('dashboard');
            });
          } else if (pathSegment === 'preview') {
            startTransition(() => {
              setCurrentView('preview');
            });
          } else {
            // Other protected routes go to dashboard for now
            startTransition(() => {
              setCurrentView('dashboard');
            });
          }
        } else {
          // Redirect to auth for protected routes
          startTransition(() => {
            setCurrentView('auth');
          });
          window.history.pushState({}, '', '/auth');
        }
        return;
      }

      // All other routes redirect to invite gate (exclusive access only)
      startTransition(() => {
        setCurrentView('invite-gate');
      });
      window.history.pushState({}, '', '/');

    } catch (error) {
      console.error('Elite routing error:', error);
      startTransition(() => {
        setCurrentView('invite-gate');
      });
    }
  }, [session, protectedRoutes]);

  // Check Supabase configuration on mount
  useEffect(() => {
    console.log('🔧 Elite Database configured:', isSupabaseConfigured);
    
    if (!isSupabaseConfigured) {
      setShowSetupNotice(true);
      console.log('⚠️  Elite database not configured - using demo mode');
    } else {
      console.log('✅ Elite database configured - exclusive access ready');
      setShowSetupNotice(true);
    }
  }, []);

  // Initialize Supabase auth listener for elite members
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { session: initialSession } = await auth.getSession();
        
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          if (isSupabaseConfigured) {
            await loadUserProfile(initialSession.user.id);
          }
          console.log('🎭 Elite member session restored');
        }
      } catch (error) {
        console.error('Failed to restore elite session:', error);
      }
      
      // Complete loading after session check
      setTimeout(() => {
        if (currentView === 'loading') {
          handleRouting();
        }
      }, 1000);
    };

    initializeAuth();

    // Set up auth state listener for elite platform
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🎭 Elite auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session);
          setUser(session.user);
          await loadUserProfile(session.user.id);
          
          startTransition(() => {
            setCurrentView('dashboard');
          });
          window.history.pushState({}, '', '/dashboard');
          console.log('🎉 Elite member signed in');
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          
          startTransition(() => {
            setCurrentView('invite-gate');
          });
          window.history.pushState({}, '', '/');
          console.log('👋 Elite member signed out');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [currentView, handleRouting, loadUserProfile]);

  const handleLoaderComplete = () => {
    handleRouting();
  };

  const handleRequestInvite = () => {
    startTransition(() => {
      setCurrentView('auth');
    });
    window.history.pushState({}, '', '/auth');
  };

  const handleBackToGate = () => {
    startTransition(() => {
      setCurrentView('invite-gate');
    });
    window.history.pushState({}, '', '/');
  };

  const handleAuthSuccess = async (userData: any, accessToken: string) => {
    console.log('🎉 Elite member authentication successful');
    
    setUser(userData);
    setSession({ user: userData, access_token: accessToken });
    
    // Load elite profile if Supabase is configured
    if (isSupabaseConfigured) {
      const { session: currentSession } = await auth.getSession();
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        await loadUserProfile(currentSession.user.id);
      }
    }
    
    // Navigate to elite dashboard
    startTransition(() => {
      setCurrentView('dashboard');
    });
    window.history.pushState({}, '', '/dashboard');
  };

  const handleLogout = async () => {
    try {
      console.log('👋 Elite member logging out...');
      
      const { error } = await auth.signOut();
      if (error) {
        console.error('Elite logout error:', error);
      }
      
      // Clear elite session data
      localStorage.removeItem('referralCode');
      localStorage.removeItem('validatedInviteCode');
      
      setSession(null);
      setUser(null);
      setProfile(null);
      
      startTransition(() => {
        setCurrentView('invite-gate');
      });
      window.history.pushState({}, '', '/');
      
    } catch (error) {
      console.error('Elite logout error:', error);
      // Force logout for elite platform
      setSession(null);
      setUser(null);
      setProfile(null);
      startTransition(() => {
        setCurrentView('invite-gate');
      });
      window.history.pushState({}, '', '/');
    }
  };

  const handleSettingsChange = async (newSettings: typeof settings) => {
    setSettings(newSettings);
    
    // Auto-save elite member settings
    if (session?.user && isSupabaseConfigured) {
      try {
        console.log('💾 Saving elite member settings...');
        
        const profileUpdates = {
          title: newSettings.title,
          description: newSettings.description,
          avatar: newSettings.avatar,
          background_media: newSettings.backgroundMedia,
          music_url: newSettings.musicUrl,
          address: newSettings.address,
          favicon: newSettings.favicon,
          enter_text: newSettings.enterText,
          title_tab_text: newSettings.titleTabText,
          show_badges: newSettings.showBadges,
          badges: newSettings.badges,
          social_links: newSettings.socialLinks,
          custom_links: newSettings.customLinks,
          layout_type: newSettings.layoutType,
          accent_color: newSettings.accentColor,
          text_color: newSettings.textColor,
          background_color: newSettings.backgroundColor,
          icon_color: newSettings.iconColor,
          background_type: newSettings.backgroundType,
          description_effect: newSettings.descriptionEffect,
          border_glow: newSettings.borderGlow,
          glow_type: newSettings.glowType,
          title_type: newSettings.titleType,
          particles_enabled: newSettings.particlesEnabled,
          particles_image: newSettings.particlesImage,
          particles_color: newSettings.particlesColor,
          special_effects: newSettings.specialEffects,
          view_counter_enabled: newSettings.viewCounterEnabled,
          view_counter_position: newSettings.viewCounterPosition,
          mouse_trails: newSettings.mouseTrails,
          aliases: newSettings.aliases,
          custom_badge: newSettings.customBadge,
          avatar_decoration: newSettings.avatarDecoration,
          affiliate_code: newSettings.affiliateCode,
          display_rank: newSettings.displayRank,
          milestone_notifications: newSettings.milestoneNotifications,
          elite_features: newSettings.eliteFeatures,
          priority_support: newSettings.prioritySupport
        };
        
        const { error } = await db.updateProfile(session.user.id, profileUpdates);
        
        if (error) {
          console.error('Failed to save elite settings:', error);
        } else {
          console.log('✅ Elite settings saved successfully');
        }
      } catch (error) {
        console.error('❌ Error saving elite settings:', error);
      }
    } else if (!isSupabaseConfigured) {
      console.log('💾 Elite settings updated (demo mode)');
    }
  };

  const handlePreview = () => {
    startTransition(() => {
      setCurrentView('preview');
    });
    window.history.pushState({}, '', '/preview');
  };

  const handleBackToDashboard = () => {
    startTransition(() => {
      setCurrentView('dashboard');
    });
    window.history.pushState({}, '', '/dashboard');
  };

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      handleRouting();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleRouting]);

  // Render notice based on Supabase configuration
  const renderNotice = () => {
    if (!showSetupNotice) return null;
    
    if (isSupabaseConfigured) {
      return (
        <SupabaseSetupNotice 
          onSetupClick={() => setShowSupabaseSetup(true)}
          onDismiss={() => setShowSetupNotice(false)}
          onVerify={() => setShowVerification(true)}
        />
      );
    } else {
      return (
        <DemoModeNotice 
          onSetupClick={() => setShowSupabaseSetup(true)}
          onDismiss={() => setShowSetupNotice(false)}
        />
      );
    }
  };

  // Loading screen with elite theme
  if (currentView === 'loading') {
    return (
      <>
        <ProfessionalLoader onComplete={handleLoaderComplete} />
        {renderNotice()}
        <SupabaseSetup 
          isOpen={showSupabaseSetup} 
          onClose={() => setShowSupabaseSetup(false)} 
        />
        {showVerification && (
          <SupabaseVerification 
            onClose={() => setShowVerification(false)}
          />
        )}
      </>
    );
  }

  // Invite-only landing gate
  if (currentView === 'invite-gate') {
    return (
      <>
        <Suspense fallback={<ProfessionalLoader onComplete={() => {}} />}>
          <InviteOnlyLanding onRequestInvite={handleRequestInvite} />
        </Suspense>
        {renderNotice()}
        <SupabaseSetup 
          isOpen={showSupabaseSetup} 
          onClose={() => setShowSupabaseSetup(false)} 
        />
        {showVerification && (
          <SupabaseVerification 
            onClose={() => setShowVerification(false)}
          />
        )}
      </>
    );
  }

  // Elite authentication
  if (currentView === 'auth') {
    return (
      <>
        <Suspense fallback={<ProfessionalLoader onComplete={() => {}} />}>
          <AuthForm 
            onAuthSuccess={handleAuthSuccess} 
            onBack={handleBackToGate}
          />
        </Suspense>
        {renderNotice()}
        <SupabaseSetup 
          isOpen={showSupabaseSetup} 
          onClose={() => setShowSupabaseSetup(false)} 
        />
        {showVerification && (
          <SupabaseVerification 
            onClose={() => setShowVerification(false)}
          />
        )}
      </>
    );
  }

  // Private biolink preview (elite members only)
  if (currentView === 'preview') {
    return (
      <>
        <div>
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={handleBackToDashboard}
              className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 border border-fuchsia-500/30 font-medium"
            >
              ← Back to Elite Dashboard
            </button>
          </div>
          
          <Suspense fallback={<ProfessionalLoader onComplete={() => {}} />}>
            <BiolinkPage settings={settings} isPreview={true} />
          </Suspense>
        </div>
        {renderNotice()}
        <SupabaseSetup 
          isOpen={showSupabaseSetup} 
          onClose={() => setShowSupabaseSetup(false)} 
        />
        {showVerification && (
          <SupabaseVerification 
            onClose={() => setShowVerification(false)}
          />
        )}
      </>
    );
  }

  // Elite Dashboard (requires authentication)
  if (!session?.user) {
    return (
      <>
        <Suspense fallback={<ProfessionalLoader onComplete={() => {}} />}>
          <AuthForm 
            onAuthSuccess={handleAuthSuccess} 
            onBack={handleBackToGate}
          />
        </Suspense>
        {renderNotice()}
        <SupabaseSetup 
          isOpen={showSupabaseSetup} 
          onClose={() => setShowSupabaseSetup(false)} 
        />
        {showVerification && (
          <SupabaseVerification 
            onClose={() => setShowVerification(false)}
          />
        )}
      </>
    );
  }

  // Elite Member Dashboard
  return (
    <>
      <Suspense fallback={<ProfessionalLoader onComplete={() => {}} />}>
        <Dashboard 
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onPreview={handlePreview}
          onLogout={handleLogout}
          user={user}
          accessToken={session.access_token}
        />
      </Suspense>
      {renderNotice()}
      <SupabaseSetup 
        isOpen={showSupabaseSetup} 
        onClose={() => setShowSupabaseSetup(false)} 
      />
      {showVerification && (
        <SupabaseVerification 
          onClose={() => setShowVerification(false)}
        />
      )}
    </>
  );
}