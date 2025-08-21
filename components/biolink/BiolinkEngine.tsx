import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../ui/tooltip';
import { 
  Eye, VolumeX, Volume2, Lock, MousePointer, ExternalLink, 
  Crown, Star, Shield, Zap, Heart, Trophy, Flame, Diamond,
  Sword, Bolt, Skull
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';

interface BiolinkSettings {
  title: string;
  customLink: string;
  avatar: string;
  description: string;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    type?: 'achievement' | 'status' | 'special' | 'premium';
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: any;
    name: string;
  }>;
  customLinks: Array<{
    id: string;
    title: string;
    url: string;
    icon?: string;
    color?: string;
    featured?: boolean;
  }>;
  backgroundColor: string;
  squareColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  musicEnabled: boolean;
  musicUrl: string;
  backgroundMedia?: {
    url: string;
    type: 'image' | 'video';
    fileName: string;
  } | null;
  overlayEnabled: boolean;
  enterText: string;
  address?: string;
  showBadges: boolean;
  viewCounterEnabled: boolean;
  viewCounterPosition: string;
  layoutType: 'square' | 'rectangular';
  layout: 'minimal' | 'standard' | 'advanced' | 'premium';
  theme: 'clean' | 'glass' | 'neon' | 'gradient';
  animations: boolean;
  borderGlow: boolean;
  particlesEnabled: boolean;
}

interface BiolinkEngineProps {
  settings: BiolinkSettings;
  viewCount?: number;
  isPreview?: boolean;
}

export function BiolinkEngine({ settings, viewCount = 1200, isPreview = false }: BiolinkEngineProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [showOverlay, setShowOverlay] = useState(settings.overlayEnabled && !isPreview);
  const [currentViewCount, setCurrentViewCount] = useState(viewCount);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const holdIntervalRef = useRef<number | null>(null);

  // Determine layout complexity based on content
  const layoutComplexity = useMemo(() => {
    const hasCustomLinks = settings.customLinks?.length > 0;
    const hasMultipleBadges = settings.badges?.length > 3;
    const hasBackgroundMedia = !!settings.backgroundMedia;
    const hasPremiumFeatures = settings.particlesEnabled || settings.borderGlow;
    
    if (settings.layout === 'minimal' || (!hasCustomLinks && !hasMultipleBadges)) {
      return 'minimal';
    } else if (settings.layout === 'premium' || hasPremiumFeatures) {
      return 'premium';
    } else if (hasBackgroundMedia || hasCustomLinks) {
      return 'advanced';
    } else {
      return 'standard';
    }
  }, [settings]);

  // Badge icon mapping
  const badgeIconMap = {
    '👑': Crown,
    '⭐': Star,
    '🛡️': Shield,
    '⚡': Zap,
    '❤️': Heart,
    '🏆': Trophy,
    '🔥': Flame,
    '💎': Diamond,
  };

  // Handle first interaction for view count
  useEffect(() => {
    if (isPreview) return;
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setCurrentViewCount((prev) => prev + 1);
        setHasInteracted(true);
      }
    };
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('scroll', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [hasInteracted, isPreview]);

  // Handle video playback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (!showOverlay) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isMuted, showOverlay]);

  // Hold-to-enter logic
  const startHold = () => {
    if (!showOverlay) return;
    setIsHolding(true);
    setHoldProgress(0);
    const durationMs = 1200;
    const startedAt = performance.now();
    const tick = () => {
      const now = performance.now();
      const pct = Math.min(100, ((now - startedAt) / durationMs) * 100);
      setHoldProgress(pct);
      if (pct >= 100) {
        clearHold(true);
        return;
      }
      holdIntervalRef.current = requestAnimationFrame(tick) as unknown as number;
    };
    holdIntervalRef.current = requestAnimationFrame(tick) as unknown as number;
  };

  const clearHold = (completed = false) => {
    if (holdIntervalRef.current) {
      cancelAnimationFrame(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(completed ? 100 : 0);
    if (completed) {
      setShowOverlay(false);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const formatViewCount = (count: number): string => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
  };

  // Render overlay screen with rage styling
  if (showOverlay) {
    const circumference = 2 * Math.PI * 30;
    const dash = (holdProgress / 100) * circumference;

    return (
      <TooltipProvider>
        <div
          className="min-h-screen relative overflow-hidden flex items-center justify-center rage-gradient-bg"
          style={{ fontFamily: settings.fontFamily }}
        >
          {/* Aggressive animated background */}
          <div className="absolute inset-0">
            {/* Floating particles */}
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full rage-glow"
                style={{
                  width: Math.random() * 8 + 4,
                  height: Math.random() * 8 + 4,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#14b8a6' : '#06b6d4'
                }}
                animate={{
                  opacity: [0, 1, 0.5, 1, 0],
                  scale: [0, 2, 1, 2.5, 0],
                  y: [0, -300],
                  x: [0, Math.random() * 200 - 100]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeOut"
                }}
              />
            ))}

            {/* Background Media with dramatic overlay */}
            {settings.backgroundMedia && (
              <div className="absolute inset-0">
                {settings.backgroundMedia.type === 'video' ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover filter blur-lg scale-110"
                    loop
                    muted
                    playsInline
                  >
                    <source src={settings.backgroundMedia.url} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={settings.backgroundMedia.url}
                    alt="Background"
                    className="w-full h-full object-cover filter blur-lg scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
              </div>
            )}

            {/* Dramatic grid pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, #10b981 1px, transparent 1px),
                  linear-gradient(180deg, #10b981 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
                animation: 'border-run 12s linear infinite'
              }}
            />
          </div>

          <motion.div 
            className="relative z-10 flex flex-col items-center gap-8 p-8 text-center"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
          >
            <motion.div
              animate={{ 
                textShadow: [
                  "0 0 20px #10b981", 
                  "0 0 40px #10b981", 
                  "0 0 20px #10b981"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div 
                className="text-4xl md:text-6xl font-black text-neon-glow mb-4"
                style={{ color: settings.textColor }}
              >
                {settings.enterText || "ENTER THE REALM"}
              </div>
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onMouseDown={startHold}
                    onMouseUp={() => clearHold(false)}
                    onMouseLeave={() => clearHold(false)}
                    onTouchStart={startHold}
                    onTouchEnd={() => clearHold(false)}
                    className="relative rounded-full backdrop-blur-xl shadow-2xl transition-all duration-300 group"
                    style={{
                      background: `radial-gradient(circle, ${settings.accentColor}30, transparent)`,
                      border: `3px solid ${settings.accentColor}`,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-24 h-24 flex items-center justify-center relative">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Lock className="w-10 h-10" style={{ color: settings.textColor }} />
                      </motion.div>
                      
                      {/* Aggressive progress ring */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle 
                          cx="48" 
                          cy="48" 
                          r="30" 
                          stroke={`${settings.accentColor}40`} 
                          strokeWidth="4" 
                          fill="none" 
                        />
                        <motion.circle
                          cx="48"
                          cy="48"
                          r="30"
                          stroke={settings.accentColor}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${dash} ${circumference}`}
                          fill="none"
                          className="transition-all duration-100"
                          animate={isHolding ? { 
                            filter: [
                              "drop-shadow(0 0 10px currentColor)",
                              "drop-shadow(0 0 20px currentColor)",
                              "drop-shadow(0 0 10px currentColor)"
                            ]
                          } : {}}
                        />
                      </svg>

                      {/* Outer glow ring */}
                      <motion.div
                        className="absolute -inset-4 rounded-full opacity-50 blur-xl"
                        style={{ background: `radial-gradient(circle, ${settings.accentColor}, transparent)` }}
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent className="rage-glass-card border-2 border-emerald-500/50 bg-slate-900/90 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <Bolt className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold">Hold to breach the fortress</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </motion.div>

            <motion.div
              className="text-emerald-300 font-bold tracking-wider"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ⚡ HOLD TO INFILTRATE ⚡
            </motion.div>
          </motion.div>
        </div>
      </TooltipProvider>
    );
  }

  // Main biolink content with rage styling
  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className="min-h-screen relative overflow-hidden rage-gradient-bg"
        style={{ fontFamily: settings.fontFamily }}
      >
        {/* Aggressive animated background */}
        <div className="absolute inset-0">
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 4 === 0 ? '#10b981' : i % 4 === 1 ? '#14b8a6' : i % 4 === 2 ? '#06b6d4' : '#8b5cf6'
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -200],
                x: [0, Math.random() * 100 - 50]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Background Media */}
          {settings.backgroundMedia && (
            <div className="absolute inset-0">
              {settings.backgroundMedia.type === 'video' ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  loop
                  muted={isMuted}
                  playsInline
                  autoPlay
                >
                  <source src={settings.backgroundMedia.url} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={settings.backgroundMedia.url} 
                  alt="Background" 
                  className="w-full h-full object-cover" 
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />
            </div>
          )}

          {/* Dramatic grid overlay */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(90deg, #10b981 1px, transparent 1px),
                linear-gradient(180deg, #10b981 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              animation: 'border-run 8s linear infinite'
            }}
          />
        </div>

        {/* Particles Effect */}
        {settings.particlesEnabled && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-current rounded-full rage-glow"
                style={{ 
                  color: settings.accentColor,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -150, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 2, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}

        {/* Music Controls */}
        {settings.musicEnabled && settings.backgroundMedia?.type === 'video' && (
          <motion.div 
            className="absolute top-6 right-6 z-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="rage-glass-card border-2 border-emerald-500/30 backdrop-blur-xl hover:bg-emerald-500/20 transition-all duration-300"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* View Counter */}
        {settings.viewCounterEnabled && (
          <motion.div 
            className="absolute top-6 left-6 z-20 flex items-center gap-3 px-4 py-2 rounded-xl rage-glass-card border-2 border-emerald-500/30 backdrop-blur-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Eye className="h-5 w-5 text-emerald-400" />
            </motion.div>
            <span className="font-bold text-white">
              {formatViewCount(currentViewCount)}
            </span>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          {settings.layoutType === 'square' ? (
            <SquareLayout settings={settings} layoutComplexity={layoutComplexity} />
          ) : (
            <RectangularLayout settings={settings} layoutComplexity={layoutComplexity} />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

// Square Layout Component with rage styling
function SquareLayout({ settings, layoutComplexity }: { settings: BiolinkSettings, layoutComplexity: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, type: "spring", stiffness: 100 }}
      className="w-full max-w-md mx-auto"
    >
      <Card 
        className="rage-glass-card border-2 border-emerald-500/30 p-8 relative overflow-hidden group"
        style={{
          backgroundColor: `${settings.squareColor}80`,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px ${settings.accentColor}20, 0 0 80px ${settings.accentColor}10`,
        }}
      >
        {/* Card glow effect */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 1, -1, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="text-center space-y-8 relative z-10">
          {/* Brand Logo */}
          <motion.div 
            className="flex justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <BrandLogo size={24} className="opacity-70 rage-glow" />
          </motion.div>

          {/* Avatar with dramatic effects */}
          <motion.div 
            className="relative mx-auto w-32 h-32"
            whileHover={{ scale: 1.15, rotate: 10 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <ImageWithFallback
              src={settings.avatar}
              alt={settings.title}
              className="w-32 h-32 rounded-full object-cover border-4 rage-glow"
              style={{ borderColor: settings.accentColor }}
            />
            <motion.div 
              className="absolute -inset-4 rounded-full blur-xl opacity-60 -z-10"
              style={{ background: `radial-gradient(circle, ${settings.accentColor}, transparent)` }}
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 360],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            {/* Orbiting elements */}
            <motion.div
              className="absolute w-4 h-4 bg-emerald-400 rounded-full"
              style={{
                top: '10%',
                right: '10%'
              }}
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.5, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            />
          </motion.div>

          {/* Name & Address with aggressive styling */}
          <div>
            <motion.h1 
              className="text-3xl font-black mb-3 text-neon-glow text-aggressive-shadow"
              style={{ color: settings.textColor }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              animate={{ 
                textShadow: [
                  `0 0 10px ${settings.accentColor}`,
                  `0 0 20px ${settings.accentColor}`,
                  `0 0 10px ${settings.accentColor}`
                ]
              }}
            >
              {settings.title}
            </motion.h1>
            {settings.address && (
              <motion.p 
                className="text-sm opacity-80 font-bold"
                style={{ color: settings.textColor }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📍 {settings.address}
              </motion.p>
            )}
          </div>

          {/* Badges with rage effects */}
          {settings.showBadges && settings.badges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {settings.badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, type: "spring" }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        className="text-sm px-3 py-1 backdrop-blur-sm font-bold rage-glow border-2"
                        style={{
                          backgroundColor: `${badge.color}20`,
                          borderColor: `${badge.color}60`,
                          color: settings.textColor,
                        }}
                      >
                        <span className="mr-2 text-lg">{badge.icon}</span>
                        {badge.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="rage-glass-card border-2 border-emerald-500/50">
                      {badge.name}
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </div>
          )}

          {/* Description with dramatic typography */}
          {settings.description && (
            <motion.p 
              className="text-base opacity-90 leading-relaxed font-medium"
              style={{ color: settings.textColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.8 }}
            >
              {settings.description}
            </motion.p>
          )}

          {/* Music Player with aggressive styling */}
          {settings.musicEnabled && (
            <motion.div 
              className="h-12 rounded-xl border-2 flex items-center justify-center backdrop-blur-sm rage-glass-card"
              style={{ 
                backgroundColor: `${settings.textColor}10`, 
                borderColor: `${settings.accentColor}50` 
              }}
              whileHover={{ scale: 1.02 }}
              animate={{ 
                boxShadow: [
                  `0 0 10px ${settings.accentColor}30`,
                  `0 0 20px ${settings.accentColor}50`,
                  `0 0 10px ${settings.accentColor}30`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span 
                className="text-sm font-bold flex items-center gap-2"
                style={{ color: settings.textColor }}
              >
                🎵 BATTLE ANTHEM READY
              </span>
            </motion.div>
          )}

          {/* Social Links with rage animations */}
          {settings.socialLinks.length > 0 && (
            <div className="flex justify-center gap-4 pt-4">
              {settings.socialLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <motion.div 
                    key={index} 
                    whileHover={{ scale: 1.3, rotate: 15, y: -5 }} 
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 * index }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(link.url, '_blank')}
                      className="rounded-full w-14 h-14 rage-glass-card border-2 border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 group"
                      style={{
                        backgroundColor: `${settings.textColor}15`,
                        color: `${settings.textColor}90`,
                      }}
                    >
                      <IconComponent className="h-6 w-6 group-hover:scale-125 transition-transform duration-300" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// Rectangular Layout Component with rage styling
function RectangularLayout({ settings, layoutComplexity }: { settings: BiolinkSettings, layoutComplexity: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, type: "spring", stiffness: 80 }}
      className="w-full max-w-6xl mx-auto"
    >
      <Card 
        className="rage-glass-card border-2 border-emerald-500/30 p-8 relative overflow-hidden group"
        style={{
          backgroundColor: `${settings.squareColor}75`,
          backdropFilter: 'blur(20px)',
          boxShadow: settings.borderGlow 
            ? `0 0 60px ${settings.accentColor}40, 0 25px 50px -12px rgba(0,0,0,0.8), 0 0 100px ${settings.accentColor}20`
            : `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px ${settings.accentColor}20`,
        }}
      >
        {/* Card glow effect */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
          animate={{ 
            scale: [1, 1.02, 1],
            rotate: [0, 0.5, -0.5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Horizontal Layout - Split into sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
          
          {/* Left Section - Profile Info */}
          <motion.div 
            className="text-center lg:text-left space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <BrandLogo size={20} className="opacity-60 mx-auto lg:mx-0 rage-glow" />
            </motion.div>
            
            <motion.div 
              className="relative mx-auto lg:mx-0 w-28 h-28 lg:w-32 lg:h-32"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <ImageWithFallback
                src={settings.avatar}
                alt={settings.title}
                className="w-full h-full rounded-3xl object-cover border-4 rage-glow"
                style={{ borderColor: settings.accentColor }}
              />
              <motion.div 
                className="absolute -inset-3 rounded-3xl blur-lg opacity-40 -z-10"
                style={{ background: `radial-gradient(circle, ${settings.accentColor}, transparent)` }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            <div>
              <motion.h1 
                className="text-2xl lg:text-3xl font-black text-neon-glow mb-2"
                style={{ color: settings.textColor }}
                whileHover={{ scale: 1.05 }}
                animate={{ 
                  textShadow: [
                    `0 0 10px ${settings.accentColor}`,
                    `0 0 20px ${settings.accentColor}`,
                    `0 0 10px ${settings.accentColor}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {settings.title}
              </motion.h1>
              {settings.address && (
                <motion.p 
                  className="text-sm opacity-70 mt-2 font-bold"
                  style={{ color: settings.textColor }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📍 {settings.address}
                </motion.p>
              )}
            </div>

            {settings.description && (
              <motion.p 
                className="text-sm opacity-85 leading-relaxed font-medium"
                style={{ color: settings.textColor }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ delay: 0.8 }}
              >
                {settings.description}
              </motion.p>
            )}

            {/* Badges in left section for rectangular layout */}
            {settings.showBadges && settings.badges.length > 0 && (
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {settings.badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.1, rotate: 3 }}
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          className="text-xs px-2 py-1 font-bold border rage-glow"
                          style={{
                            backgroundColor: `${badge.color}20`,
                            borderColor: `${badge.color}50`,
                            color: settings.textColor,
                          }}
                        >
                          <span className="mr-1 text-sm">{badge.icon}</span>
                          {badge.name}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="rage-glass-card">{badge.name}</TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Middle Section - Custom Links */}
          <motion.div 
            className="lg:col-span-1 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {settings.customLinks && settings.customLinks.length > 0 ? (
              settings.customLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.03, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => window.open(link.url, '_blank')}
                    className={`w-full h-14 justify-between text-left rage-glass-card border-2 backdrop-blur-sm transition-all duration-300 group font-bold ${
                      link.featured ? 'rage-glow' : ''
                    }`}
                    style={{
                      backgroundColor: link.featured 
                        ? `${settings.accentColor}25` 
                        : `${settings.textColor}10`,
                      borderColor: link.featured 
                        ? `${settings.accentColor}60` 
                        : `${settings.textColor}30`,
                      color: settings.textColor,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {link.icon && <span className="text-xl">{link.icon}</span>}
                      <span className="font-black">{link.title}</span>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ExternalLink className="h-5 w-5 opacity-60 group-hover:opacity-100" />
                    </motion.div>
                  </Button>
                </motion.div>
              ))
            ) : (
              /* Placeholder when no custom links */
              <div className="space-y-4">
                <motion.div 
                  className="h-14 rounded-xl border-2 border-dashed flex items-center justify-center rage-glass-card"
                  style={{ borderColor: `${settings.textColor}30` }}
                  animate={{ 
                    borderColor: [`${settings.textColor}30`, `${settings.accentColor}50`, `${settings.textColor}30`]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span 
                    className="text-sm opacity-60 font-bold"
                    style={{ color: settings.textColor }}
                  >
                    ⚔️ Add custom battle links
                  </span>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Right Section - Social Links */}
          <motion.div 
            className="flex flex-col items-center lg:items-end space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            {settings.socialLinks.length > 0 && (
              <>
                <motion.h3 
                  className="text-sm font-black opacity-70 tracking-wider"
                  style={{ color: settings.textColor }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡ CONNECT WITH THE EMPIRE
                </motion.h3>
                <div className="grid grid-cols-3 lg:grid-cols-2 gap-4">
                  {settings.socialLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <motion.div 
                        key={index} 
                        whileHover={{ scale: 1.2, rotate: 10 }} 
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(link.url, '_blank')}
                          className="rounded-2xl w-16 h-16 rage-glass-card border-2 border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 group"
                          style={{
                            backgroundColor: `${settings.textColor}10`,
                            color: `${settings.textColor}70`,
                          }}
                        >
                          <IconComponent className="h-7 w-7 group-hover:scale-125 transition-transform duration-300" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Music Player in right section for rectangular layout */}
            {settings.musicEnabled && (
              <motion.div 
                className="w-full h-12 rounded-xl border-2 flex items-center justify-center rage-glass-card"
                style={{ 
                  backgroundColor: `${settings.textColor}10`, 
                  borderColor: `${settings.accentColor}50` 
                }}
                whileHover={{ scale: 1.02 }}
                animate={{ 
                  boxShadow: [
                    `0 0 10px ${settings.accentColor}30`,
                    `0 0 20px ${settings.accentColor}50`,
                    `0 0 10px ${settings.accentColor}30`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span 
                  className="text-xs font-bold flex items-center gap-2"
                  style={{ color: settings.textColor }}
                >
                  🎵 EMPIRE SOUNDTRACK
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}