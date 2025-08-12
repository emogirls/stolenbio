import { useState, useEffect } from 'react';
import { BiolinkPage } from './BiolinkPage';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { Loader2, Link, ArrowLeft, Sparkles } from 'lucide-react';

interface BiolinkRouterProps {
  username: string;
}

export function BiolinkRouter({ username }: BiolinkRouterProps) {
  const [biolinkData, setBiolinkData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBiolink = async () => {
      try {
        const { projectId, publicAnonKey } = await import('../utils/supabase/info');
        
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-dfdc0213/biolink/${username}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Biolink not found');
          return;
        }

        setBiolinkData(data);
      } catch (err) {
        console.error('Error fetching biolink:', err);
        setError('Failed to load biolink');
      } finally {
        setLoading(false);
      }
    };

    fetchBiolink();
  }, [username]);

  if (loading) {
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
          
          {[...Array(8)].map((_, i) => (
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

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-6"
            >
              <Loader2 className="w-16 h-16 text-emerald-400 mx-auto" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">
                Loading Biolink
              </h2>
              <p className="text-slate-300">
                Fetching @{username}'s profile...
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
          
          {[...Array(8)].map((_, i) => (
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
            onClick={() => window.location.href = '/'}
            className="text-slate-300 hover:text-emerald-400 hover:bg-slate-800/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to stolen.bio
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

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            {/* 404 Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/30">
                <span className="text-6xl">🔗</span>
              </div>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Biolink Not Found
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <p className="text-xl md:text-2xl text-slate-300 mb-4">
                The biolink <span className="text-emerald-400 font-semibold">@{username}</span> doesn't exist or has been removed.
              </p>
              <p className="text-lg text-slate-400">
                {error}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={() => window.location.href = '/'}
                className="group relative px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <span className="relative z-10 flex items-center">
                  <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Back to Home
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>

              <Button
                variant="outline"
                onClick={() => window.location.href = '/auth'}
                className="px-8 py-4 text-lg font-semibold border-2 border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 hover:text-emerald-200 rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Create Your Own
              </Button>
            </motion.div>

            {/* Suggestion */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-12 p-6 bg-slate-900/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl"
            >
              <p className="text-slate-300 mb-2">
                <strong className="text-emerald-400">Tip:</strong> Double-check the spelling or try searching for similar usernames.
              </p>
              <p className="text-slate-400 text-sm">
                If you think this is an error, please contact our support team.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>
    );
  }

  return (
    <BiolinkPage 
      settings={biolinkData.settings} 
      viewCount={biolinkData.views}
      isPreview={false}
    />
  );
}