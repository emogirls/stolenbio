import { useState, useEffect } from "react";
import { BiolinkPage } from "./BiolinkPage";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, User, AlertCircle, Loader2, Rocket, Star, Globe, Zap, ArrowRight, Sparkles } from "lucide-react";
import { api, Profile } from "../utils/api";

interface PublicBiolinkProps {
  username?: string;
  onNavigateToAuth: () => void;
}

export function PublicBiolink({ username: initialUsername, onNavigateToAuth }: PublicBiolinkProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchUsername, setSearchUsername] = useState(initialUsername || '');

  const loadProfile = async (username: string) => {
    if (!username.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { profile } = await api.getProfile(username.trim());
      setProfile(profile);
    } catch (error: any) {
      console.error('Load profile error:', error);
      setError(error.message === 'Profile not found' ? 'User not found' : 'Failed to load profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      loadProfile(searchUsername);
    }
  };

  useEffect(() => {
    if (initialUsername) {
      loadProfile(initialUsername);
    }
  }, [initialUsername]);

  // If we have a profile, show it
  if (profile) {
    return (
      <div className="relative">
        {/* Navigation controls */}
        <div className="fixed top-4 left-4 z-30 flex gap-2">
          <Button
            onClick={() => {
              setProfile(null);
              setSearchUsername('');
              setError(null);
            }}
            variant="secondary"
            size="sm"
            className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300"
          >
            ← Back to Search
          </Button>
        </div>
        
        <div className="fixed top-4 right-4 z-30">
          <Button
            onClick={onNavigateToAuth}
            variant="outline"
            size="sm"
            className="bg-black/50 backdrop-blur-sm border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all duration-300"
          >
            Create Your Biolink
          </Button>
        </div>

        <BiolinkPage {...profile} />
      </div>
    );
  }

  // Space-themed landing page
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated space background */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                opacity: 0.3 + Math.random() * 0.7,
              }}
            />
          ))}
        </div>
        
        {/* Floating cosmic orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          {/* Main title with glowing effect */}
          <div className="relative mb-8">
            <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
              Bio<span className="text-cyan-300">Link</span>
            </h1>
            <div className="absolute inset-0 text-7xl md:text-8xl font-bold text-cyan-400/20 blur-sm -z-10 animate-pulse">
              Bio<span className="text-cyan-300/20">Link</span>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Launch your digital presence into the cosmos. Create stunning, futuristic biolink pages with 
            <span className="text-cyan-400 font-semibold"> 3D floating elements</span>, 
            <span className="text-purple-400 font-semibold"> cosmic backgrounds</span>, and 
            <span className="text-pink-400 font-semibold"> cyber aesthetics</span>.
          </p>
          
          <Button
            onClick={onNavigateToAuth}
            size="lg"
            className="group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-12 py-4 text-lg font-semibold rounded-xl border border-cyan-500/50 hover:border-cyan-400/70 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
            Launch Your Biolink
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Search Section - Floating Card */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="relative group">
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
            
            <div className="relative bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/30 shadow-2xl">
              <div className="text-center mb-8">
                <div className="relative mb-6">
                  <User className="h-16 w-16 text-cyan-400 mx-auto animate-pulse" />
                  <div className="absolute inset-0 h-16 w-16 mx-auto">
                    <div className="w-full h-full border border-cyan-500/50 rounded-full animate-ping" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                  Explore the Galaxy
                </h2>
                <p className="text-gray-300 text-lg">Enter a cosmic navigator's username to discover their biolink</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-6">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 h-5 w-5 z-10" />
                  <Input
                    type="text"
                    placeholder="Enter username (e.g., spacetraveler)"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    className="pl-12 pr-4 py-4 bg-black/30 border-2 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20 rounded-xl text-lg transition-all duration-300 group-hover:border-cyan-400/50"
                    disabled={loading}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white py-4 text-lg font-semibold rounded-xl border border-cyan-500/50 hover:border-cyan-400/70 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={loading || !searchUsername.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Scanning the cosmos...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Discover Biolink
                      <Sparkles className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl flex items-center gap-3 text-red-300 backdrop-blur-sm">
                  <AlertCircle className="h-6 w-6 flex-shrink-0" />
                  <span className="text-lg">{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section - Floating Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Globe className="h-8 w-8" />,
              title: "3D Floating Design",
              description: "Stunning floating cards with cosmic 3D effects that make your profile orbit in style",
              gradient: "from-cyan-500 to-blue-500",
              bgGradient: "from-cyan-500/10 to-blue-500/10",
            },
            {
              icon: <Star className="h-8 w-8" />,
              title: "Cosmic Backgrounds",
              description: "Upload stellar GIFs, nebula videos, or galactic images for dynamic, space-themed backgrounds",
              gradient: "from-purple-500 to-pink-500",
              bgGradient: "from-purple-500/10 to-pink-500/10",
            },
            {
              icon: <Zap className="h-8 w-8" />,
              title: "Quantum Links",
              description: "Connect all your digital dimensions in one beautiful, cyber-enhanced shareable portal",
              gradient: "from-pink-500 to-orange-500",
              bgGradient: "from-pink-500/10 to-orange-500/10",
            },
          ].map((feature, index) => (
            <div key={index} className="relative group">
              {/* Glowing hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500`} />
              
              <div className="relative bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/10 group-hover:border-white/20 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2">
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:animate-pulse`}>
                  {feature.icon}
                </div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent mb-4 text-center`}>
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed text-center">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}