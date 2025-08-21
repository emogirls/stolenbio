import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, UserPlus, ArrowRight, Mail, Lock, Key } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { toast } from 'sonner';
import { supabase, validateInviteCode } from './utils/supabase/client';
import Dashboard from './components/Dashboard';

type ViewMode = 'main' | 'auth' | 'dashboard';

export default function App() {
  const [view, setView] = useState<ViewMode>('main');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    inviteCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Check for existing session on load
  useEffect(() => {
    // Check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setView('dashboard');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setView('dashboard');
      } else {
        setUser(null);
        setView('main');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Handle login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) {
          throw error;
        }

        setUser(data.user);
        setView('dashboard');
        toast.success('Welcome back!');
      } else {
        // Handle registration
        if (!validateInviteCode(formData.inviteCode)) {
          throw new Error('Invalid invite code. Please check your code and try again.');
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              invite_code: formData.inviteCode
            }
          }
        });

        if (error) {
          throw error;
        }

        if (data.user && !data.session) {
          toast.success('Please check your email to confirm your account.');
        } else {
          toast.success('Account created! Welcome to stolen.bio');
          setUser(data.user);
          setView('dashboard');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setFormData({ email: '', password: '', inviteCode: '' });
    setView('main');
    toast.success('Logged out');
  };

  const handleHome = () => {
    setView('main');
  };

  // Main landing page
  if (view === 'main') {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="flex justify-between items-center p-6 max-w-4xl mx-auto">
          <motion.div 
            className="text-xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            stolen.bio
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              onClick={() => setView('auth')}
              variant="outline"
              className="border-white/20 bg-transparent hover:bg-white/5 text-white"
            >
              Sign In
            </Button>
          </motion.div>
        </header>

        {/* Main content */}
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
          <div className="max-w-2xl text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-medium mb-6 leading-tight">
                One link for
                <br />
                everything you are
              </h1>
              
              <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
                Share your content, build your audience, and connect your world with a single link.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Button 
                onClick={() => setView('auth')}
                className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-full font-medium"
              >
                Get Started
                <ArrowRight size={16} className="ml-2" />
              </Button>
              
              <span className="text-white/40 text-sm">
                Invite only
              </span>
            </motion.div>

            {/* Feature list */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="text-center">
                <h3 className="text-sm font-medium text-white/80 mb-2">Customizable</h3>
                <p className="text-sm text-white/50">
                  Make it yours with custom themes and layouts
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-sm font-medium text-white/80 mb-2">Analytics</h3>
                <p className="text-sm text-white/50">
                  Track your engagement and grow your audience
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-sm font-medium text-white/80 mb-2">Simple</h3>
                <p className="text-sm text-white/50">
                  Easy to set up, easier to share
                </p>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center p-6">
          <p className="text-white/30 text-xs">
            A curated platform for creators
          </p>
        </footer>
      </div>
    );
  }

  // Dashboard view for logged in users
  if (view === 'dashboard') {
    return (
      <Dashboard 
        user={user} 
        onLogout={handleLogout}
        onHome={handleHome}
      />
    );
  }

  // Auth view (login/register)
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-4xl mx-auto w-full">
        <button
          onClick={() => setView('main')}
          className="text-white/60 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <div className="text-xl font-medium">stolen.bio</div>
        <div /> {/* Spacer */}
      </header>

      {/* Auth form */}
      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium mb-2">
              {isLogin ? 'Sign in' : 'Create account'}
            </h1>
            <p className="text-white/60 text-sm">
              {isLogin ? 'Welcome back' : 'Join the community'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-white/80">
                Email
              </Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/20 focus:bg-white/10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-white/80">
                Password
              </Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/20 focus:bg-white/10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Invite code field (registration only) */}
            {!isLogin && (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Label htmlFor="inviteCode" className="text-sm text-white/80">
                  Invite Code
                </Label>
                <div className="relative">
                  <Key size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <Input
                    id="inviteCode"
                    name="inviteCode"
                    type="text"
                    value={formData.inviteCode}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/20 focus:bg-white/10"
                    placeholder="Try: WELCOME1, DEMO123, or STOLEN1"
                  />
                </div>
                <p className="text-xs text-white/40">
                  Valid codes: WELCOME1, BETA2024, EARLY001, TESTCODE, DEMO123, STOLEN1, BIO2024, ALPHA001
                </p>
              </motion.div>
            )}

            {/* Submit button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-white/90 font-medium mt-6"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn size={16} className="mr-2" /> : <UserPlus size={16} className="mr-2" />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </Button>
          </form>

          {/* Toggle login/register */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              {isLogin ? (
                <>Need an account? <span className="underline">Sign up</span></>
              ) : (
                <>Already have an account? <span className="underline">Sign in</span></>
              )}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}