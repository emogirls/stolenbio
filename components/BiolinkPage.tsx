import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Volume2, VolumeX, Eye, ExternalLink } from "lucide-react";
import { useState } from "react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

interface BiolinkPageProps {
  username: string;
  avatar: string;
  description: string;
  badges: string[];
  socialLinks: SocialLink[];
  viewCount: number;
  backgroundMedia?: string;
  backgroundType?: 'image' | 'gif' | 'video';
  accentColor?: string;
  textColor?: string;
}

export function BiolinkPage({
  username,
  avatar,
  description,
  badges,
  socialLinks,
  viewCount,
  backgroundMedia,
  backgroundType = 'image',
  accentColor = '#ffffff',
  textColor = '#ffffff'
}: BiolinkPageProps) {
  const [isMuted, setIsMuted] = useState(true);

  const renderBackground = () => {
    if (!backgroundMedia) {
      return <div className="absolute inset-0 bg-gray-800" />;
    }

    switch (backgroundType) {
      case 'video':
        return (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
          >
            <source src={backgroundMedia} type="video/mp4" />
          </video>
        );
      case 'gif':
        return (
          <img
            src={backgroundMedia}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        );
      default:
        return (
          <img
            src={backgroundMedia}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        );
    }
  };

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      twitter: '🐦',
      youtube: '📺',
      instagram: '📷',
      tiktok: '🎵',
      twitch: '🎮',
      discord: '💬',
      github: '💻',
      linkedin: '💼'
    };
    return icons[platform.toLowerCase()] || '🔗';
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      {renderBackground()}
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Mute button - outside the square */}
      <Button
        onClick={() => setIsMuted(!isMuted)}
        variant="secondary"
        size="sm"
        className="absolute top-8 right-8 z-20 bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4 text-white" />
        ) : (
          <Volume2 className="h-4 w-4 text-white" />
        )}
      </Button>

      {/* Main container */}
      <div className="flex items-center justify-center min-h-screen p-8">
        {/* 3D Floating Black Square */}
        <div 
          className="relative bg-black/90 backdrop-blur-lg border border-white/10 shadow-2xl transform-gpu"
          style={{
            width: '400px',
            height: '600px',
            borderRadius: '24px',
            transform: 'perspective(1000px) rotateX(5deg) rotateY(-2deg)',
            boxShadow: '0 50px 100px rgba(0, 0, 0, 0.8), 0 20px 40px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* View count - top right corner of square */}
          <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-gray-300">
            <Eye className="h-3 w-3" />
            <span>{viewCount.toLocaleString()}</span>
          </div>

          {/* Content inside the square */}
          <div className="p-8 flex flex-col items-center h-full">
            {/* Avatar and Username */}
            <div className="flex flex-col items-center space-y-4 mb-6">
              <Avatar className="w-20 h-20 border-2 border-white/20">
                <AvatarImage src={avatar} alt={username} />
                <AvatarFallback style={{ backgroundColor: accentColor }}>
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h1 
                className="text-2xl font-bold text-center"
                style={{ color: textColor }}
              >
                {username}
              </h1>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {badges.map((badge, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-white/10 text-white border-white/20"
                    style={{ backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40` }}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description */}
            <p 
              className="text-center text-sm leading-relaxed mb-8"
              style={{ color: textColor }}
            >
              {description}
            </p>

            {/* Music Player Space (placeholder) */}
            <div className="w-full h-20 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center mb-8">
              <span className="text-white/50 text-sm">Music Player</span>
            </div>

            {/* Social Links */}
            <div className="mt-auto">
              <div className="flex flex-wrap justify-center gap-3">
                {socialLinks.map((link) => (
                  <Button
                    key={link.id}
                    variant="ghost"
                    size="sm"
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-white transition-all duration-200 hover:scale-110"
                    style={{ 
                      backgroundColor: `${accentColor}20`,
                      borderColor: `${accentColor}40`
                    }}
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <span className="text-lg">
                      {getSocialIcon(link.platform)}
                    </span>
                    <ExternalLink className="h-3 w-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}