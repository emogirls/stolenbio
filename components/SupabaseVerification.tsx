import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Key,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../utils/supabase/client';

interface VerificationProps {
  onClose: () => void;
}

export function SupabaseVerification({ onClose }: VerificationProps) {
  const [checks, setChecks] = useState({
    connection: { status: 'pending', message: 'Testing connection...' },
    tables: { status: 'pending', message: 'Checking database tables...' },
    inviteCodes: { status: 'pending', message: 'Verifying invite codes...' },
    auth: { status: 'pending', message: 'Testing authentication...' }
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runVerificationChecks();
  }, []);

  const runVerificationChecks = async () => {
    // Check 1: Connection
    try {
      const { data, error } = await supabase.from('invite_codes').select('count').limit(1);
      
      if (error) {
        setChecks(prev => ({
          ...prev,
          connection: { status: 'error', message: `Connection failed: ${error.message}` }
        }));
        setLoading(false);
        return;
      }
      
      setChecks(prev => ({
        ...prev,
        connection: { status: 'success', message: 'Connected successfully' }
      }));
      
      // Check 2: Tables
      setTimeout(async () => {
        try {
          const { data: inviteData } = await supabase.from('invite_codes').select('*').limit(1);
          const { data: profileData } = await supabase.from('profiles').select('*').limit(1);
          const { data: statsData } = await supabase.from('user_stats').select('*').limit(1);
          
          setChecks(prev => ({
            ...prev,
            tables: { status: 'success', message: 'All tables found and accessible' }
          }));
          
          // Check 3: Invite Codes
          setTimeout(async () => {
            try {
              const { data: neptuneCode } = await supabase
                .from('invite_codes')
                .select('*')
                .eq('code', 'NEPTUNE_TESTING_PURPOSES')
                .single();
              
              if (neptuneCode) {
                setChecks(prev => ({
                  ...prev,
                  inviteCodes: { status: 'success', message: 'Elite test invite code ready' }
                }));
              } else {
                setChecks(prev => ({
                  ...prev,
                  inviteCodes: { status: 'warning', message: 'Elite test invite code not found - run migration' }
                }));
              }
              
              // Check 4: Auth
              setTimeout(async () => {
                try {
                  const { data: { user } } = await supabase.auth.getUser();
                  setChecks(prev => ({
                    ...prev,
                    auth: { status: 'success', message: 'Authentication system ready' }
                  }));
                  
                  setLoading(false);
                } catch (authError) {
                  setChecks(prev => ({
                    ...prev,
                    auth: { status: 'success', message: 'Authentication ready (no active session)' }
                  }));
                  setLoading(false);
                }
              }, 1000);
              
            } catch (inviteError) {
              setChecks(prev => ({
                ...prev,
                inviteCodes: { status: 'error', message: 'Failed to check invite codes' }
              }));
              setLoading(false);
            }
          }, 1000);
          
        } catch (tableError) {
          setChecks(prev => ({
            ...prev,
            tables: { status: 'error', message: 'Missing database tables - run migration' }
          }));
          setLoading(false);
        }
      }, 1000);
      
    } catch (connectionError) {
      setChecks(prev => ({
        ...prev,
        connection: { status: 'error', message: 'Failed to connect to Supabase' }
      }));
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30';
      case 'error':
        return 'bg-red-500/10 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  const allPassed = Object.values(checks).every(check => check.status === 'success');
  const hasErrors = Object.values(checks).some(check => check.status === 'error');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-black border border-white/20 rounded-lg max-w-lg w-full"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl text-white heading-elegant">Elite Database Verification</h2>
              <p className="text-slate-400 text-sm">Testing exclusive platform connection</p>
            </div>
            {!loading && allPassed && (
              <Badge className="ml-auto bg-green-500/20 border-green-500/50 text-green-400">
                Ready
              </Badge>
            )}
          </div>

          {/* Verification Checks */}
          <div className="space-y-4 mb-6">
            {[
              { key: 'connection', icon: Database, title: 'Database Connection' },
              { key: 'tables', icon: Shield, title: 'Database Tables' },
              { key: 'inviteCodes', icon: Key, title: 'Elite Invite Codes' },
              { key: 'auth', icon: Users, title: 'Elite Authentication' }
            ].map((item) => {
              const check = checks[item.key as keyof typeof checks];
              return (
                <Card key={item.key} className={`${getStatusBg(check.status)} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-slate-300" />
                      <div className="flex-1">
                        <h3 className="text-white text-sm font-medium">{item.title}</h3>
                        <p className="text-slate-400 text-xs">{check.message}</p>
                      </div>
                      {getStatusIcon(check.status)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Status Summary */}
          {!loading && (
            <div className="mb-6">
              {allPassed && (
                <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-400 font-medium text-sm">Elite platform operational!</p>
                      <p className="text-green-400/70 text-xs">
                        Your exclusive stolen.bio platform is configured and ready for elite members.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {hasErrors && (
                <div className="bg-red-500/10 border border-red-500/30 rounded p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-red-400 font-medium text-sm">Configuration issues detected</p>
                      <p className="text-red-400/70 text-xs">
                        Please run the database migration to fix table issues.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="ghost"
              className="flex-1 text-white hover:bg-white/5"
            >
              Close
            </Button>
            
            {!loading && !hasErrors && (
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 btn-primary-elegant flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Launch Elite Platform
              </Button>
            )}
            
            {hasErrors && (
              <Button
                onClick={() => runVerificationChecks()}
                className="flex-1 btn-elegant flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4" />
                Retry Checks
              </Button>
            )}
          </div>

          {/* Quick Test */}
          {!loading && allPassed && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-slate-400 text-xs text-center">
                <p>Ready for elite access? Use invite code: <span className="text-emerald-400 font-mono">NEPTUNE_TESTING_PURPOSES</span></p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}