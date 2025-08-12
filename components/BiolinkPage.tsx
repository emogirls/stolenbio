import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { VolumeX, Volume2, Eye } from 'lucide-react';

interface BiolinkPageProps {
  settings: {
    // Use title instead of username for display
    title: string;
    customLink: string;
    avatar: string;
    description: string;
    badges: Array<{
      id: string;
      name: string;
      icon: string;
      color: string;
    }>;
    socialLinks: Array<{
      platform: string;
      url: string;
      icon: any;
      name: string;
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
  };
  viewCount?: number;
  isPreview?: boolean;
}

export function BiolinkPage({ settings, viewCount = 1200, isPreview = false }: BiolinkPageProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [showOverlay, setShowOverlay] = useState(settings.overlayEnabled && !isPreview);
  const [currentViewCount, setCurrentViewCount] = useState(viewCount);
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle first interaction for view count
  useEffect(() => {
    if (isPreview) return;
    
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setCurrentViewCount(prev => prev + 1);
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

  // Handle video playback and muting
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (!showOverlay) {
        videoRef.current.play().catch(console.error);
      }
    }
  }, [isMuted, showOverlay]);

  // Format view count for display
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  // Handle social link clicks
  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handle overlay click to enter
  const handleEnter = () => {
    setShowOverlay(false);
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  };

  // Render overlay screen
  if (showOverlay) {
    return (
      <div 
        className="min-h-screen relative overflow-hidden cursor-pointer flex items-center justify-center"
        style={{ 
          background: settings.backgroundColor,
          fontFamily: settings.fontFamily 
        }}
        onClick={handleEnter}
      >
        {/* Background Media with Blur */}
        {settings.backgroundMedia && (
          <div className="absolute inset-0">
            {settings.backgroundMedia.type === 'video' ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover filter blur-md scale-110"
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
                className="w-full h-full object-cover filter blur-md scale-110"
              />
            )}
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* Overlay Content */}
        <div className="relative z-10 text-center p-8">
          <div 
            className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
            style={{ color: settings.textColor }}
          >
            {settings.enterText}
          </div>
          <div 
            className="text-lg md:text-xl opacity-80 drop-shadow-md"
            style={{ color: settings.textColor }}
          >
            Click anywhere to continue
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        background: settings.backgroundColor,
        fontFamily: settings.fontFamily 
      }}
    >
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
          {/* Semi-transparent overlay for content readability */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* Mute Button - Top Right Corner */}
      {settings.musicEnabled && (
        <div className="absolute top-6 right-6 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={handleMuteToggle}
            className={`backdrop-blur-sm shadow-lg transition-all duration-200 ${
              isMuted 
                ? 'bg-red-100/90 hover:bg-red-200/80 text-red-700 border-red-300' 
                : 'bg-white/90 hover:bg-white/80 text-gray-700 border-gray-300'
            }`}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}

      {/* Main Content Container */}
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        {/* Floating Square Container */}
        <div 
          className="relative rounded-3xl p-8 w-full max-w-md shadow-2xl transform-gpu backdrop-blur-sm"
          style={{ backgroundColor: `${settings.squareColor}dd` }}
        >
          {/* 3D Floating Effect */}
          <div 
            className="absolute inset-0 rounded-3xl transform translate-x-1 translate-y-1 -z-10"
            style={{
              backgroundColor: `${settings.squareColor}aa`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          />
          
          {/* View Count - Conditional Position */}
          {settings.viewCounterEnabled && settings.viewCounterPosition !== 'disabled' && (
            <div 
              className={`absolute flex items-center gap-1 text-sm opacity-70 ${
                settings.viewCounterPosition === 'top-right' ? 'top-4 right-4' : 'bottom-4 left-4'
              }`}
              style={{ color: settings.textColor }}
            >
              <Eye className="h-4 w-4" />
              <span className="transition-all duration-300">{formatViewCount(currentViewCount)}</span>
            </div>
          )}

          {/* User Info Section */}
          <div className="flex flex-col items-center text-center space-y-5 w-full h-full justify-between">
            {/* Top Section: Avatar and Username */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <ImageWithFallback
                  src={settings.avatar}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full border-4 shadow-lg object-cover"
                  style={{ borderColor: `${settings.accentColor}60` }}
                />
                {/* Glow effect around avatar */}
                <div 
                  className="absolute inset-0 rounded-full blur-sm -z-10 scale-110 opacity-30"
                  style={{ backgroundColor: settings.accentColor }}
                />
              </div>
              
              <h1 
                className="text-2xl font-semibold tracking-wide"
                style={{ color: settings.textColor }}
              >
                {settings.title}
              </h1>
            </div>

            {/* Middle Section: Badges, Description, Music Player */}
            <div className="flex flex-col items-center space-y-4 flex-1">
              {/* Address Section */}
              {settings.address && (
                <div className="text-center">
                  <p 
                    className="text-sm opacity-70"
                    style={{ color: settings.textColor }}
                  >
                    📍 {settings.address}
                  </p>
                </div>
              )}

              {/* Badges Section */}
              {settings.showBadges && settings.badges.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 max-w-full">
                  {settings.badges.map((badge, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="transition-all duration-200 flex items-center gap-1"
                      style={{ 
                        backgroundColor: `${badge.color}40`,
                        color: settings.textColor,
                        borderColor: `${badge.color}60`
                      }}
                    >
                      <span className="text-xs">{badge.icon}</span>
                      {badge.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description Section */}
              {settings.description && (
                <div className="max-w-xs">
                  <p 
                    className="text-center leading-relaxed text-sm opacity-80"
                    style={{ color: settings.textColor }}
                  >
                    {settings.description}
                  </p>
                </div>
              )}

              {/* Music Player Space */}
              {settings.musicEnabled && (
                <div 
                  className="w-full max-w-xs h-12 rounded-lg border flex items-center justify-center backdrop-blur-sm"
                  style={{ 
                    backgroundColor: `${settings.textColor}10`,
                    borderColor: `${settings.textColor}20`
                  }}
                >
                  <span 
                    className="text-sm opacity-50"
                    style={{ color: settings.textColor }}
                  >
                    Music Player Area
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Section: Social Links */}
            {settings.socialLinks.length > 0 && (
              <div className="w-full">
                <div className="flex flex-wrap justify-center gap-3 max-w-full">
                  {settings.socialLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSocialClick(link.url)}
                        className="transition-all duration-200 rounded-full w-10 h-10 backdrop-blur-sm hover:scale-110"
                        style={{
                          backgroundColor: `${settings.textColor}10`,
                          borderColor: `${settings.textColor}20`,
                          color: `${settings.textColor}AA`
                        }}
                      >
                        <IconComponent className="h-4 w-4" />
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Background Elements for Depth */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/3 rounded-full blur-3xl" />
      </div>
    </div>
  );
}