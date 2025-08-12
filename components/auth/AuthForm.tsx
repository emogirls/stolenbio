import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, ArrowLeft, Sparkles, Link } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthFormProps {
  onAuthSuccess: (user: any, token: string) => void;
  onBack: () => void;
}

export function AuthForm({ onAuthSuccess, onBack }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { createClient } = await import('@supabase/supabase-js');
      
      // Get environment variables
      let supabaseUrl = '';
      let supabaseAnonKey = '';
      
      try {
        const envInfo = await import('../../utils/supabase/info');
        supabaseUrl = `https://${envInfo.projectId}.supabase.co`;
        supabaseAnonKey = envInfo.publicAnonKey;
      } catch (envError) {
        supabaseUrl = process.env.SUPABASE_URL || '';
        supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
      }

      if (!supabaseUrl || !supabaseAnonKey) {
        setError('Configuration error. Please contact support.');
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session?.access_token) {
        onAuthSuccess(data.user, data.session.access_token);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!signupEmail || !signupPassword || !signupName || !signupUsername) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (signupUsername.length < 3) {
      setError('Username must be at least 3 characters');
      setIsLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(signupUsername)) {
      setError('Username can only contain letters, numbers, and underscores');
      setIsLoading(false);
      return;
    }

    try {
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-dfdc0213/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          name: signupName,
          username: signupUsername
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      // After successful signup, automatically log them in
      const { createClient } = await import('@supabase/supabase-js');
      
      // Get environment variables
      let supabaseUrl = '';
      let supabaseAnonKey = '';
      
      try {
        const envInfo = await import('../../utils/supabase/info');
        supabaseUrl = `https://${envInfo.projectId}.supabase.co`;
        supabaseAnonKey = envInfo.publicAnonKey;
      } catch (envError) {
        supabaseUrl = process.env.SUPABASE_URL || '';
        supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: signupEmail,
        password: signupPassword,
      });

      if (loginError) {
        setError('Account created but login failed. Please try logging in manually.');
        setActiveTab('login');
        return;
      }

      if (loginData.session?.access_token) {
        onAuthSuccess(loginData.user, loginData.session.access_token);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #10b981 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 p-6 flex justify-between items-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-slate-300 hover:text-emerald-400 hover:bg-slate-800/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <Link className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            stolen.bio
          </span>
        </div>
      </motion.nav>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-sm border-emerald-500/30 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <motion.div
                className="flex justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="w-12 h-12 text-emerald-400" />
              </motion.div>
              
              <CardTitle className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Welcome to stolen.bio
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Create your professional biolink page
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-emerald-500/30">
                  <TabsTrigger 
                    value="login" 
                    className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <Alert className="bg-red-900/20 border-red-500/30 backdrop-blur-sm">
                      <AlertDescription className="text-red-300">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <TabsContent value="login" className="space-y-4">
                  <motion.form 
                    onSubmit={handleLogin} 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-slate-200">
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-slate-200">
                        Password
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0" 
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
                    </Button>
                  </motion.form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <motion.form 
                    onSubmit={handleSignup} 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-slate-200">
                        Full Name
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-username" className="text-slate-200">
                        Username
                      </Label>
                      <Input
                        id="signup-username"
                        type="text"
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value.toLowerCase())}
                        className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                        placeholder="your-username"
                        required
                      />
                      <p className="text-xs text-slate-400">
                        Your biolink: stolen.bio/{signupUsername || 'username'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-slate-200">
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-slate-200">
                        Password
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0" 
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </motion.form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
