import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Database, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  AlertCircle,
  Code,
  Settings
} from 'lucide-react';

interface SupabaseSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupabaseSetup({ isOpen, onClose }: SupabaseSetupProps) {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyToClipboard = (text: string, step: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-black border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl text-white heading-elegant">Supabase Setup</h2>
                  <p className="text-slate-400 text-sm text-mono-elegant">Connect your database for full functionality</p>
                </div>
                <Badge className="ml-auto bg-yellow-500/20 border-yellow-500/50 text-yellow-400">
                  Required
                </Badge>
              </div>

              {/* Current Status */}
              <Card className="bg-yellow-500/10 border-yellow-500/30 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-yellow-400 text-sm font-medium">Demo Mode Active</p>
                      <p className="text-yellow-400/70 text-xs">Using mock data - profiles won't be saved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Setup Steps */}
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-medium">
                      1
                    </div>
                    <h3 className="text-white subheading-elegant">Create Supabase Project</h3>
                  </div>
                  
                  <div className="ml-9 space-y-2">
                    <p className="text-slate-400 text-sm">
                      Go to Supabase and create a new project
                    </p>
                    <Button
                      onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                      className="btn-elegant flex items-center gap-2 h-8 text-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open Supabase Dashboard
                    </Button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-medium">
                      2
                    </div>
                    <h3 className="text-white subheading-elegant">Get Project Credentials</h3>
                  </div>
                  
                  <div className="ml-9 space-y-2">
                    <p className="text-slate-400 text-sm">
                      Copy your Project URL and anon key from Settings → API
                    </p>
                    <div className="bg-black/50 border border-white/10 rounded p-3 text-mono-elegant text-white/80">
                      <div className="text-slate-400 mb-1">Project URL example:</div>
                      <code className="text-emerald-400">https://abcdefghijk.supabase.co</code>
                      <div className="text-slate-400 mb-1 mt-2">Anon key example:</div>
                      <code className="text-emerald-400 break-all">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</code>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-medium">
                      3
                    </div>
                    <h3 className="text-white subheading-elegant">Create Environment File</h3>
                  </div>
                  
                  <div className="ml-9 space-y-2">
                    <p className="text-slate-400 text-sm">
                      Create a <code className="bg-white/10 px-1 rounded text-emerald-400">.env</code> file in your project root
                    </p>
                    <div className="bg-black/50 border border-white/10 rounded overflow-hidden">
                      <div className="flex items-center justify-between bg-white/5 px-3 py-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Code className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-400 text-xs text-mono-elegant">.env</span>
                        </div>
                        <Button
                          onClick={() => copyToClipboard(envContent, 'env')}
                          className="bg-transparent border-none text-slate-400 hover:text-white p-1 h-auto"
                        >
                          {copiedStep === 'env' ? (
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      <pre className="p-3 text-xs text-white/80 text-mono-elegant overflow-x-auto">
                        {envContent}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-medium">
                      4
                    </div>
                    <h3 className="text-white subheading-elegant">Run Database Migration</h3>
                  </div>
                  
                  <div className="ml-9 space-y-2">
                    <p className="text-slate-400 text-sm">
                      Copy and run the SQL migration in your Supabase SQL Editor
                    </p>
                    <Button
                      onClick={() => copyToClipboard('/supabase/migrations/001_initial_schema.sql', 'migration')}
                      className="btn-elegant flex items-center gap-2 h-8 text-xs"
                    >
                      {copiedStep === 'migration' ? (
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      Copy Migration Path
                    </Button>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-xs font-medium">Migration includes:</span>
                      </div>
                      <ul className="text-blue-400/80 text-xs space-y-1 ml-6">
                        <li>• User profiles and settings tables</li>
                        <li>• Invite code system with NEPTUNE_TESTING_PURPOSES</li>
                        <li>• Leaderboards and stats tracking</li>
                        <li>• Row Level Security policies</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-medium">
                      5
                    </div>
                    <h3 className="text-white subheading-elegant">Restart Application</h3>
                  </div>
                  
                  <div className="ml-9 space-y-2">
                    <p className="text-slate-400 text-sm">
                      Restart your dev server to load the new environment variables
                    </p>
                    <div className="bg-black/50 border border-white/10 rounded p-3 text-mono-elegant text-white/80">
                      <code className="text-emerald-400">npm run dev</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-slate-400 text-xs caption-elegant">
                    Need help? Check the README.md
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={onClose}
                      variant="ghost"
                      className="text-white hover:bg-white/5 h-8 text-xs"
                    >
                      Continue Demo Mode
                    </Button>
                    <Button
                      onClick={() => window.location.reload()}
                      className="btn-primary-elegant h-8 text-xs"
                    >
                      Refresh App
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}