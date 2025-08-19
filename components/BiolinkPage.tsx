import { useState, useEffect, useRef, useMemo } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { Eye, VolumeX, Volume2, Lock, MousePointer } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BiolinkEngine } from './biolink/BiolinkEngine';

interface BiolinkPageProps {
  settings: {
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
    customLinks?: Array<{
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
    viewCounterPosition: 'top-right' | 'bottom-left' | 'disabled' | string;
    layout?: 'minimal' | 'standard' | 'advanced' | 'premium';
    theme?: 'clean' | 'glass' | 'neon' | 'gradient';
    animations?: boolean;
    borderGlow?: boolean;
    particlesEnabled?: boolean;
  };
  viewCount?: number;
  isPreview?: boolean;
}

export default function BiolinkPage({ settings, viewCount = 1200, isPreview = false }: BiolinkPageProps) {
  // Convert old settings format to new BiolinkEngine format
  const engineSettings = {
    ...settings,
    customLinks: settings.customLinks || [],
    layout: settings.layout || 'standard',
    theme: settings.theme || 'clean',
    animations: settings.animations !== false,
    borderGlow: settings.borderGlow || false,
    particlesEnabled: settings.particlesEnabled || false,
  };

  return (
    <BiolinkEngine 
      settings={engineSettings}
      viewCount={viewCount}
      isPreview={isPreview}
    />
  );
}