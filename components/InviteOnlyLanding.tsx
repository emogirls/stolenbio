import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Shield, 
  Crown, 
  Zap, 
  Lock,
  Key,
  Users,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface InviteOnlyLandingProps {
  onRequestInvite: () => void;
}

export default function InviteOnlyLanding({ onRequestInvite }: InviteOnlyLandingProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [showCode, setShowCode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const validateInviteCode = async (code: string) => {
    if (!code.trim()) return;
    
    setIsValidating(true);
    
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check against known test codes
    const validCodes = ['NEPTUNE_TESTING_PURPOSES', 'ELITE_ACCESS', 'FOUNDER_MEMBER'];
    const isValid = validCodes.includes(code.toUpperCase());
    
    setValidationStatus(isValid ? 'valid' : 'invalid');
    setIsValidating(false);
    
    if (isValid) {
      localStorage.setItem('validatedInviteCode', code);
      setTimeout(() => {
        onRequestInvite();
      }, 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateInviteCode(inviteCode);
  };

  const features = [
    {
      icon: Crown,
      title: 'Elite Membership',
      description: 'Exclusive access to premium biolink features and customizations'
    },
    {
      icon: Shield,
      title: 'Private Network',
      description: 'Connect with verified elite members in a secure environment'
    },
    {
      icon: Zap,
      title: 'Advanced Features',
      description: 'Cutting-edge biolink tools and elite customization options'
    },
    {
      icon: Sparkles,
      title: 'Priority Support',
      description: 'Direct access to our development team and priority assistance'
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background with magenta theme */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(217, 70, 239, 0.1) 0%, transparent 50%)`,
            transition: 'background-image 0.1s ease'
          }}
        />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(217, 70, 239, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 70, 239, 0.02) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Floating particles with magenta theme */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-fuchsia-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo and branding with magenta theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-400 to-purple-400 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-black" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-white">stolen.bio</h1>
                <Badge className="bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-400 text-xs">
                  Invite Only
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Hero content with magenta gradient */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Exclusive Elite
              <span className="block bg-gradient-to-r from-fuchsia-400 via-purple-400 to-magenta-400 bg-clip-text text-transparent">
                Biolink Platform
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              An invitation-only platform for elite creators, entrepreneurs, and visionaries. 
              Access requires an exclusive invite code.
            </p>
          </motion.div>

          {/* Invite code form with magenta accents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="glass-card max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-5 h-5 text-fuchsia-400" />
                  <h3 className="text-white font-medium">Enter Invite Code</h3>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showCode ? "text" : "password"}
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="Your exclusive invite code"
                      className="elegant-input pr-10"
                      disabled={isValidating}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-fuchsia-400 transition-colors"
                    >
                      {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {validationStatus === 'invalid' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Invalid invite code. Access denied.
                      </motion.div>
                    )}
                    
                    {validationStatus === 'valid' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 text-fuchsia-400 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Elite access granted. Welcome.
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <Button
                    type="submit"
                    disabled={!inviteCode.trim() || isValidating}
                    className="w-full btn-primary-elegant h-12 flex items-center gap-2"
                  >
                    {isValidating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                        />
                        Validating Access...
                      </>
                    ) : (
                      <>
                        Access Elite Platform
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-slate-400 text-xs text-center">
                    Don't have an invite code? Elite membership is by invitation only.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features grid with magenta theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="feature-card h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-fuchsia-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Status and stats with magenta accents */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center justify-center gap-8 text-slate-400 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse" />
              Platform Status: Elite
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Exclusive Members Only
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Secure & Private
            </div>
          </motion.div>

          {/* Test hint for demo with magenta accent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-8"
          >
            <Card className="bg-fuchsia-500/5 border-fuchsia-500/20 max-w-md mx-auto">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-fuchsia-400 text-sm">
                  <Key className="w-4 h-4" />
                  <span className="font-medium">Demo Access:</span>
                  <code className="bg-fuchsia-500/20 px-2 py-1 rounded text-xs">
                    NEPTUNE_TESTING_PURPOSES
                  </code>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}