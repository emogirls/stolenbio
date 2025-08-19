import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { 
  Crown, Star, Shield, Zap, Heart, Trophy, Flame, Diamond, 
  Sparkles, Award, Target, Users, Eye, Gift, Check, Lock
} from 'lucide-react';

export interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  type: 'achievement' | 'status' | 'special' | 'premium' | 'milestone';
  requirements?: string;
  unlocked?: boolean;
  progress?: number;
  maxProgress?: number;
}

interface BadgeSystemProps {
  badges: BadgeType[];
  layout?: 'grid' | 'inline' | 'compact';
  showLocked?: boolean;
  maxDisplay?: number;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  '👑': Crown,
  '⭐': Star,
  '🛡️': Shield,
  '⚡': Zap,
  '❤️': Heart,
  '🏆': Trophy,
  '🔥': Flame,
  '💎': Diamond,
  '✨': Sparkles,
  '🏅': Award,
  '🎯': Target,
  '👥': Users,
  '👁️': Eye,
  '🎁': Gift,
  '✅': Check,
  '🔒': Lock,
};

const rarityColors = {
  common: '#64748b',
  rare: '#3b82f6', 
  epic: '#8b5cf6',
  legendary: '#f59e0b',
  mythic: '#ef4444',
};

const rarityGradients = {
  common: 'from-slate-400 to-slate-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600', 
  legendary: 'from-amber-400 to-orange-500',
  mythic: 'from-red-400 to-pink-500',
};

export function BadgeSystem({ 
  badges, 
  layout = 'inline', 
  showLocked = false,
  maxDisplay,
  animate = true,
  size = 'md',
  glow = true
}: BadgeSystemProps) {
  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);
  
  const displayBadges = [
    ...unlockedBadges,
    ...(showLocked ? lockedBadges : [])
  ];

  const finalBadges = maxDisplay 
    ? displayBadges.slice(0, maxDisplay)
    : displayBadges;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  if (finalBadges.length === 0) {
    return null;
  }

  const containerClasses = {
    grid: 'grid grid-cols-2 sm:grid-cols-3 gap-2',
    inline: 'flex flex-wrap justify-center gap-2',
    compact: 'flex flex-wrap gap-1'
  };

  return (
    <div className={containerClasses[layout]}>
      {finalBadges.map((badge, index) => (
        <BadgeItem
          key={badge.id}
          badge={badge}
          index={index}
          animate={animate}
          size={size}
          glow={glow}
          sizeClasses={sizeClasses[size]}
          iconSize={iconSizes[size]}
        />
      ))}
    </div>
  );
}

interface BadgeItemProps {
  badge: BadgeType;
  index: number;
  animate: boolean;
  size: 'sm' | 'md' | 'lg';
  glow: boolean;
  sizeClasses: string;
  iconSize: string;
}

function BadgeItem({ badge, index, animate, size, glow, sizeClasses, iconSize }: BadgeItemProps) {
  const IconComponent = iconMap[badge.icon] || Star;
  const isLocked = !badge.unlocked;
  
  const badgeColor = badge.color || rarityColors[badge.rarity];
  const rarityGradient = rarityGradients[badge.rarity];
  
  const motionProps = animate ? {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { 
      duration: 0.3, 
      delay: index * 0.05,
      type: "spring",
      stiffness: 300,
      damping: 30
    },
    whileHover: { 
      scale: 1.05, 
      y: -2,
      transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.95 }
  } : {};

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div {...motionProps}>
          <Badge
            className={`
              ${sizeClasses} 
              relative overflow-hidden cursor-pointer backdrop-blur-sm
              transition-all duration-300 border-2
              ${isLocked ? 'opacity-40 grayscale' : ''}
              ${glow && !isLocked ? 'shadow-lg' : ''}
            `}
            style={{
              backgroundColor: isLocked 
                ? `${badgeColor}10` 
                : `${badgeColor}20`,
              borderColor: isLocked 
                ? `${badgeColor}30` 
                : `${badgeColor}60`,
              color: isLocked ? '#64748b' : '#ffffff',
              boxShadow: glow && !isLocked 
                ? `0 4px 15px ${badgeColor}30, 0 0 20px ${badgeColor}20`
                : undefined,
            }}
          >
            {/* Glow effect for legendary+ badges */}
            {!isLocked && (badge.rarity === 'legendary' || badge.rarity === 'mythic') && glow && (
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(45deg, ${badgeColor}40, transparent, ${badgeColor}40)`
                }}
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}

            {/* Icon */}
            <span className="relative z-10 flex items-center gap-1.5">
              {/* Use emoji if it's a simple emoji, otherwise use icon component */}
              {badge.icon.length <= 2 ? (
                <motion.span 
                  className="inline-block"
                  animate={!isLocked && animate ? { 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                >
                  {badge.icon}
                </motion.span>
              ) : (
                <motion.div
                  animate={!isLocked && animate ? { 
                    rotate: [0, 5, -5, 0] 
                  } : {}}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: index * 0.2 
                  }}
                >
                  <IconComponent className={iconSize} />
                </motion.div>
              )}
              
              <span className="font-medium">
                {isLocked ? '???' : badge.name}
              </span>

              {/* Progress indicator for milestone badges */}
              {badge.type === 'milestone' && badge.progress !== undefined && badge.maxProgress && (
                <div className="ml-1">
                  <div className="w-8 h-1 bg-black/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-current"
                      initial={{ width: 0 }}
                      animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              )}
            </span>

            {/* Rarity border animation for epic+ badges */}
            {!isLocked && badge.rarity !== 'common' && badge.rarity !== 'rare' && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${rarityGradient} opacity-20 pointer-events-none`}
                animate={{ 
                  opacity: [0.1, 0.3, 0.1] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              />
            )}
          </Badge>
        </motion.div>
      </TooltipTrigger>
      
      <TooltipContent className="max-w-xs">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            {badge.icon.length <= 2 ? (
              <span className="text-lg">{badge.icon}</span>
            ) : (
              <IconComponent className="h-5 w-5" />
            )}
            <span className="font-semibold">
              {isLocked ? 'Locked Badge' : badge.name}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {isLocked ? 'Requirements not met' : badge.description}
          </p>
          
          <div className="flex items-center justify-center gap-2 pt-1">
            <Badge 
              variant="secondary" 
              className={`text-xs bg-gradient-to-r ${rarityGradient} text-white border-0`}
            >
              {badge.rarity.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {badge.type.toUpperCase()}
            </Badge>
          </div>

          {/* Progress for milestone badges */}
          {badge.type === 'milestone' && badge.progress !== undefined && badge.maxProgress && (
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{badge.progress}/{badge.maxProgress}</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${rarityGradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          )}

          {/* Requirements for locked badges */}
          {isLocked && badge.requirements && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Requirements:</strong> {badge.requirements}
              </p>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// Predefined badge collections
export const PRESET_BADGES: Record<string, BadgeType[]> = {
  starter: [
    {
      id: 'first-visit',
      name: 'First Steps',
      description: 'Created your first biolink',
      icon: '🚀',
      color: '#3b82f6',
      rarity: 'common',
      type: 'achievement',
      unlocked: true
    },
    {
      id: 'first-100-views',
      name: 'Getting Noticed',
      description: 'Reached 100 profile views',
      icon: '👁️',
      color: '#10b981',
      rarity: 'rare',
      type: 'milestone',
      unlocked: false,
      requirements: 'Reach 100 total views'
    }
  ],
  
  social: [
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Added 5+ social media links',
      icon: '🦋',
      color: '#8b5cf6',
      rarity: 'rare',
      type: 'achievement',
      unlocked: false,
      requirements: 'Add 5 social media links'
    },
    {
      id: 'influencer',
      name: 'Influencer',
      description: 'Verified across multiple platforms',
      icon: '⭐',
      color: '#f59e0b',
      rarity: 'epic',
      type: 'status',
      unlocked: false,
      requirements: 'Verification on 3+ platforms'
    }
  ],

  premium: [
    {
      id: 'vip',
      name: 'VIP Member',
      description: 'Premium subscription holder',
      icon: '👑',
      color: '#f59e0b',
      rarity: 'legendary',
      type: 'premium',
      unlocked: false,
      requirements: 'Active premium subscription'
    },
    {
      id: 'early-adopter',
      name: 'Early Adopter',
      description: 'One of the first 1000 users',
      icon: '🏆',
      color: '#ef4444',
      rarity: 'mythic',
      type: 'special',
      unlocked: false,
      requirements: 'Be among the first 1000 users'
    }
  ],

  engagement: [
    {
      id: 'popular',
      name: 'Popular',
      description: 'Reached 1K+ profile views',
      icon: '🔥',
      color: '#ef4444',
      rarity: 'epic',
      type: 'milestone',
      unlocked: false,
      requirements: 'Reach 1,000 total views'
    },
    {
      id: 'viral',
      name: 'Viral',
      description: 'Reached 10K+ profile views',
      icon: '💫',
      color: '#ef4444',
      rarity: 'mythic',
      type: 'milestone',
      unlocked: false,
      requirements: 'Reach 10,000 total views'
    }
  ]
};