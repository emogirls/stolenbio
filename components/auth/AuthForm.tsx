import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { supabase, auth, db } from '../../utils/supabase/client';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  KeyRound
} from 'lucide-react';

interface AuthFormProps {
  onAuthSuccess: (user: any, accessToken: string) => void;
  onBack: () => void;
}

export default function AuthForm({ onAuthSuccess, onBack }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check for validated invite code on mount
  useState(() => {
    const validatedCode = localStorage.getItem('validatedInviteCode');
    if (validatedCode) {
      setInviteCode(validatedCode);
    }
  });

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    
    if (!isLogin) {
      if (!inviteCode || inviteCode.length < 6) {
        setError('Valid access code required');
        return false;
      }
      if (!username || !name) {
        setError('Username and name are required');
        return false;
      }
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!isLogin && username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (!isLogin && !/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError('Username can only contain letters, numbers, underscores, and hyphens');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        // Sign in existing user
        const { data, error } = await auth.signIn(email, password);
        
        if (error) {
          throw new Error(error.message);
        }

        if (data.user && data.session) {
          setSuccess('Access granted. Loading dashboard...');
          
          setTimeout(() => {
            onAuthSuccess(data.user, data.session.access_token);
          }, 1500);
        }
      } else {
        // Validate invite code first
        const { valid, error: inviteError } = await db.validateInviteCode(inviteCode);
        
        if (!valid) {
          throw new Error(inviteError || 'Invalid access code');
        }

        // Check if username is already taken
        const { data: existingProfile } = await db.getProfileByUsername(username);
        if (existingProfile) {
          throw new Error('Username is already taken');
        }

        // Sign up new user
        const { data, error } = await auth.signUp(email, password, {
          name,
          username: username.toLowerCase(),
          invite_code: inviteCode,
          membership_tier: 'elite'
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          // Use the invite code
          await db.useInviteCode(inviteCode, data.user.id);

          // Create user profile
          await db.createProfile(data.user.id, {
            username: username.toLowerCase(),
            title: name,
            description: 'Welcome to my exclusive elite biolink ✨',
            membership_tier: 'elite',
            steal_coins: 200,
            elite_features: true,
            priority_support: true
          });

          // Create user stats
          const { error: statsError } = await supabase
            .from('user_stats')
            .insert({
              user_id: data.user.id,
              total_views: 0,
              total_clicks: 0,
              affiliate_referrals: 0,
              affiliate_earnings: 0,
              daily_streak: 0
            });

          if (statsError) {
            console.warn('Failed to create user stats:', statsError);
          }

          setSuccess('Elite account created! Please check your email to verify your account.');
          
          // Clear validated invite code
          localStorage.removeItem('validatedInviteCode');
          
          // If session exists, proceed to dashboard
          if (data.session) {
            setTimeout(() => {
              onAuthSuccess(data.user, data.session.access_token);
            }, 2000);
          }
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setUsername('');
    setName('');
    if (isLogin) {
      const validatedCode = localStorage.getItem('validatedInviteCode');
      if (validatedCode) {
        setInviteCode(validatedCode);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-6">
      {/* Minimal background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="fixed top-6 left-6 z-50 text-slate-500 hover:text-white transition-colors duration-300 text-sm font-mono"
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="h-4 w-4 mr-2 inline" />
        Back
      </motion.button>

      {/* Main Auth Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="border border-white/10 bg-black/50 backdrop-blur-sm p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-2xl font-light text-white mb-2 tracking-wider">
              <AnimatePresence mode="wait">
                <motion.span
                  key={isLogin ? 'login' : 'signup'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLogin ? 'ACCESS' : 'REGISTER'}
                </motion.span>
              </AnimatePresence>
            </div>
            
            <motion.p 
              className="text-slate-500 text-sm font-mono"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isLogin ? 'Restricted portal' : 'Invitation required'}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label className="text-slate-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                  <KeyRound className="h-3 w-3" />
                  Access Code
                </Label>
                <Input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="NEPTUNE_TESTING_PURPOSES"
                  className="bg-transparent border border-white/20 text-white font-mono text-center text-sm h-10 focus:border-white/40 focus:ring-0"
                  disabled={loading}
                />
                <p className="text-xs text-slate-500 font-mono">
                  Try: NEPTUNE_TESTING_PURPOSES
                </p>
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-transparent border border-white/20 text-white text-sm h-10 focus:border-white/40 focus:ring-0"
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <>
                {/* Username */}
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                    <User className="h-3 w-3" />
                    Username
                  </Label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="username"
                    className="bg-transparent border border-white/20 text-white text-sm h-10 focus:border-white/40 focus:ring-0"
                    disabled={loading}
                  />
                  <p className="text-xs text-slate-500 font-mono">
                    stolen.bio/{username || 'username'}
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs font-mono uppercase tracking-wider">
                    Display Name
                  </Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="bg-transparent border border-white/20 text-white text-sm h-10 focus:border-white/40 focus:ring-0"
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <Lock className="h-3 w-3" />
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="bg-transparent border border-white/20 text-white text-sm h-10 pr-10 focus:border-white/40 focus:ring-0"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border border-red-500/30 bg-red-500/10 p-3"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-red-400" />
                    <p className="text-red-400 text-xs font-mono">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border border-green-500/30 bg-green-500/10 p-3"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <p className="text-green-400 text-xs font-mono">{success}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40 disabled:opacity-30 h-10 text-xs font-mono tracking-wider"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isLogin ? 'AUTHENTICATING' : 'CREATING_ACCOUNT'}</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {isLogin ? 'ENTER' : 'REQUEST_ACCESS'}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-slate-500 text-xs font-mono mb-3">
                {isLogin ? "Need access?" : "Already registered?"}
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={toggleMode}
                disabled={loading}
                className="text-white hover:bg-white/5 text-xs font-mono tracking-wider h-8"
              >
                {isLogin ? 'REQUEST_INVITE' : 'SIGN_IN'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}