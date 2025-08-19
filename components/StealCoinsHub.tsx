import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Coins, 
  Gift, 
  Crown, 
  Star, 
  Trophy, 
  Users, 
  Eye, 
  Zap,
  Sparkles,
  Calendar,
  ShoppingCart,
  Award,
  Target,
  TrendingUp,
  Flame,
  Copy,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface StealCoinsHubProps {
  accessToken: string;
  userId: string;
}

interface LeaderboardEntry {
  username: string;
  name: string;
  score: number;
  userId: string;
}

interface InventoryItem {
  count: number;
  expires: number | null;
}

interface UserProfile {
  stealCoins: number;
  username: string;
  affiliateCode: string;
  affiliateReferrals: number;
  affiliateEarnings: number;
  dailyStreak: number;
}

const createPlaceholderLeaderboard = (type: 'views' | 'affiliates' | 'spenders'): LeaderboardEntry[] => {
  const typeLabels = {
    views: ['Top Creator', 'Popular User', 'Rising Star'],
    affiliates: ['Network Builder', 'Community Leader', 'Growth Expert'],
    spenders: ['Power User', 'Premium Member', 'Feature Explorer']
  };

  return typeLabels[type].map((name, index) => ({
    username: name.toLowerCase().replace(' ', '_'),
    name,
    score: 0,
    userId: `placeholder-${type}-${index + 1}`
  }));
};

export function StealCoinsHub({ accessToken, userId }: StealCoinsHubProps) {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    stealCoins: 0,
    username: '',
    affiliateCode: '',
    affiliateReferrals: 0,
    affiliateEarnings: 0,
    dailyStreak: 0
  });
  const [canClaim, setCanClaim] = useState(false);
  const [inventory, setInventory] = useState<Record<string, InventoryItem>>({});
  const [leaderboards, setLeaderboards] = useState<{
    views: LeaderboardEntry[];
    affiliates: LeaderboardEntry[];
    spenders: LeaderboardEntry[];
  }>({
    views: createPlaceholderLeaderboard('views'),
    affiliates: createPlaceholderLeaderboard('affiliates'),
    spenders: createPlaceholderLeaderboard('spenders')
  });
  const [userRank, setUserRank] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [claimLoading, setClaimLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const shopItems = [
    {
      id: 'premium_badge',
      name: 'Premium Badge',
      description: 'Show off your premium status',
      cost: 500,
      icon: Crown,
      rarity: 'epic',
      category: 'badges'
    },
    {
      id: 'rainbow_decoration',
      name: 'Rainbow Text',
      description: 'Animated rainbow text effect',
      cost: 150,
      icon: Sparkles,
      rarity: 'rare',
      category: 'decorations'
    },
    {
      id: 'particle_effects',
      name: 'Particle Effects',
      description: 'Beautiful floating particles',
      cost: 300,
      icon: Star,
      rarity: 'epic',
      category: 'effects'
    },
    {
      id: 'music_player',
      name: 'Music Player',
      description: 'Embedded music player widget',
      cost: 250,
      icon: Zap,
      rarity: 'rare',
      category: 'widgets'
    },
    {
      id: 'custom_domain',
      name: 'Custom Domain (30 days)',
      description: 'Use your own domain name',
      cost: 1000,
      icon: Crown,
      rarity: 'legendary',
      category: 'premium'
    },
    {
      id: 'analytics_pro',
      name: 'Pro Analytics (30 days)',
      description: 'Advanced visitor analytics',
      cost: 400,
      icon: TrendingUp,
      rarity: 'epic',
      category: 'premium'
    }
  ];

  useEffect(() => {
    fetchData();
    checkDailyClaim();
  }, [accessToken, userId]);

  const fetchData = async () => {
    if (!accessToken) return;
    
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      // Fetch user profile with coins and affiliate data
      const profileResponse = await fetch('/api/profile', { headers });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile({
          stealCoins: profileData.stealCoins || 0,
          username: profileData.profile?.customLink || profileData.username || '',
          affiliateCode: profileData.affiliateCode || generateAffiliateCode(profileData.username),
          affiliateReferrals: profileData.affiliateReferrals || 0,
          affiliateEarnings: profileData.affiliateEarnings || 0,
          dailyStreak: profileData.dailyStreak || 0
        });
      }

      // Fetch inventory
      try {
        const inventoryResponse = await fetch('/api/inventory', { headers });

        if (inventoryResponse.ok) {
          const inventoryData = await inventoryResponse.json();
          setInventory(inventoryData.inventory || {});
        } else if (inventoryResponse.status !== 401) {
          console.warn('Inventory API returned:', inventoryResponse.status);
        }
      } catch (inventoryError) {
        console.warn('Inventory API not available:', inventoryError);
      }

      // Fetch leaderboards with proper authorization
      try {
        const [viewsRes, affiliatesRes, spendersRes] = await Promise.all([
          fetch('/api/leaderboards?type=views', { headers }),
          fetch('/api/leaderboards?type=affiliates', { headers }),
          fetch('/api/leaderboards?type=spenders', { headers })
        ]);

        let views = createPlaceholderLeaderboard('views');
        let affiliates = createPlaceholderLeaderboard('affiliates');
        let spenders = createPlaceholderLeaderboard('spenders');

        // Parse responses
        if (viewsRes.ok) {
          try {
            const viewsData = await viewsRes.json();
            if (Array.isArray(viewsData.leaderboard) && viewsData.leaderboard.length > 0) {
              views = viewsData.leaderboard;
            }
          } catch (e) {
            console.warn('Error parsing views data:', e);
          }
        }

        if (affiliatesRes.ok) {
          try {
            const affiliatesData = await affiliatesRes.json();
            if (Array.isArray(affiliatesData.leaderboard) && affiliatesData.leaderboard.length > 0) {
              affiliates = affiliatesData.leaderboard;
            }
          } catch (e) {
            console.warn('Error parsing affiliates data:', e);
          }
        }

        if (spendersRes.ok) {
          try {
            const spendersData = await spendersRes.json();
            if (Array.isArray(spendersData.leaderboard) && spendersData.leaderboard.length > 0) {
              spenders = spendersData.leaderboard;
            }
          } catch (e) {
            console.warn('Error parsing spenders data:', e);
          }
        }

        // Ensure minimum 3 entries with placeholders
        const ensureMinEntries = (entries: LeaderboardEntry[], type: 'views' | 'affiliates' | 'spenders') => {
          const placeholders = createPlaceholderLeaderboard(type);
          const result = [...entries];
          
          while (result.length < 3) {
            const placeholderIndex = result.length;
            if (placeholderIndex < placeholders.length) {
              result.push(placeholders[placeholderIndex]);
            } else {
              break;
            }
          }
          
          return result;
        };

        setLeaderboards({
          views: ensureMinEntries(views, 'views'),
          affiliates: ensureMinEntries(affiliates, 'affiliates'),
          spenders: ensureMinEntries(spenders, 'spenders')
        });

        // Calculate user ranks
        const viewRank = views.findIndex((entry: LeaderboardEntry) => entry.userId === userId) + 1;
        const affiliateRank = affiliates.findIndex((entry: LeaderboardEntry) => entry.userId === userId) + 1;
        const spenderRank = spenders.findIndex((entry: LeaderboardEntry) => entry.userId === userId) + 1;

        setUserRank({
          views: viewRank || 0,
          affiliates: affiliateRank || 0,
          spenders: spenderRank || 0
        });

      } catch (leaderboardError) {
        console.warn('Leaderboard API error:', leaderboardError);
        // Keep placeholder data
      }

    } catch (networkError) {
      console.error('Error fetching data:', networkError);
      setError('Failed to load coin data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const generateAffiliateCode = (username: string): string => {
    if (!username) return 'NEWUSER';
    return username.toUpperCase().substring(0, 8) + Math.random().toString(36).substring(2, 5).toUpperCase();
  };

  const checkDailyClaim = () => {
    const lastClaim = localStorage.getItem('lastDailyClaim');
    const today = new Date().toISOString().split('T')[0];
    setCanClaim(lastClaim !== today);
  };

  const handleDailyClaim = async () => {
    setClaimLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/claim-daily', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(prev => ({
          ...prev,
          stealCoins: data.newBalance || prev.stealCoins + 10,
          dailyStreak: data.streak || prev.dailyStreak + 1
        }));
        setCanClaim(false);
        localStorage.setItem('lastDailyClaim', new Date().toISOString().split('T')[0]);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to claim daily reward');
      }
    } catch (error) {
      console.error('Error claiming daily coins:', error);
      setError('Network error. Please try again.');
    } finally {
      setClaimLoading(false);
    }
  };

  const handlePurchase = async (itemId: string) => {
    const item = shopItems.find(i => i.id === itemId);
    if (!item || userProfile.stealCoins < item.cost) return;

    setPurchaseLoading(itemId);
    setError(null);

    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item: itemId,
          cost: item.cost
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(prev => ({
          ...prev,
          stealCoins: data.newBalance || prev.stealCoins - item.cost
        }));
        setInventory(data.inventory || inventory);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
      setError('Network error. Please try again.');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const copyAffiliateLink = async () => {
    const link = `https://stolen.bio?ref=${userProfile.affiliateCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const isPlaceholderEntry = (entry: LeaderboardEntry) => {
    return entry.userId.startsWith('placeholder-');
  };

  const nextMilestone = userProfile.stealCoins < 1000 ? 1000 : 
                      userProfile.stealCoins < 5000 ? 5000 : 
                      userProfile.stealCoins < 10000 ? 10000 : 25000;
  const milestoneProgress = (userProfile.stealCoins / nextMilestone) * 100;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="glass-card border border-red-500/50 bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-red-300">{error}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card bg-gradient-to-br from-emerald-950/30 to-emerald-900/20 border border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Coins className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <p className="text-sm text-slate-400">Steal Coins</p>
                <motion.p
                  className="text-2xl font-bold text-emerald-400"
                  key={userProfile.stealCoins}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {userProfile.stealCoins.toLocaleString()}
                </motion.p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-gradient-to-br from-purple-950/30 to-purple-900/20 border border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Best Rank</p>
                <p className="text-2xl font-bold text-purple-400">
                  #{Math.min(...Object.values(userRank).filter(r => r > 0)) || '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-gradient-to-br from-blue-950/30 to-blue-900/20 border border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Items Owned</p>
                <p className="text-2xl font-bold text-blue-400">
                  {Object.values(inventory).reduce((sum, item) => sum + item.count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-gradient-to-br from-orange-950/30 to-orange-900/20 border border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Daily Streak</p>
                <p className="text-2xl font-bold text-orange-400">{userProfile.dailyStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Claim & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card bg-gradient-to-r from-emerald-950/30 via-teal-950/30 to-cyan-950/30 border border-emerald-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-400">
              <Gift className="h-5 w-5" />
              Daily Reward
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <motion.div
                className="w-16 h-16 mx-auto bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center"
                animate={canClaim ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: canClaim ? Infinity : 0 }}
              >
                <Calendar className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <p className="text-xl font-bold text-emerald-400">10 Coins</p>
                <p className="text-sm text-slate-400">Daily bonus available</p>
              </div>
              <Button
                onClick={handleDailyClaim}
                disabled={!canClaim || claimLoading}
                className="w-full btn-professional py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                {claimLoading ? 'Claiming...' : canClaim ? 'Claim Reward' : 'Come Back Tomorrow'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-gradient-to-r from-purple-950/30 via-pink-950/30 to-purple-950/30 border border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Target className="h-5 w-5" />
              Next Milestone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xl font-bold text-purple-400">
                  {nextMilestone.toLocaleString()} Coins
                </p>
                <p className="text-sm text-slate-400">
                  {(nextMilestone - userProfile.stealCoins).toLocaleString()} coins to go
                </p>
              </div>
              <Progress value={milestoneProgress} className="h-2" />
              <div className="flex justify-between text-xs text-slate-400">
                <span>{userProfile.stealCoins.toLocaleString()}</span>
                <span>{nextMilestone.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs - Fixed structure */}
      <Tabs defaultValue="shop" className="space-y-6">
        <TabsList className="glass-card-strong border border-emerald-500/20 p-1 rounded-xl grid grid-cols-4 gap-1">
          <TabsTrigger 
            value="shop" 
            className="glass-card flex items-center justify-center gap-2 px-4 py-3 data-[state=active]:emerald-gradient data-[state=active]:text-white transition-all duration-300"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Shop</span>
          </TabsTrigger>
          <TabsTrigger 
            value="inventory" 
            className="glass-card flex items-center justify-center gap-2 px-4 py-3 data-[state=active]:emerald-gradient data-[state=active]:text-white transition-all duration-300"
          >
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Inventory</span>
          </TabsTrigger>
          <TabsTrigger 
            value="leaderboard" 
            className="glass-card flex items-center justify-center gap-2 px-4 py-3 data-[state=active]:emerald-gradient data-[state=active]:text-white transition-all duration-300"
          >
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Rankings</span>
          </TabsTrigger>
          <TabsTrigger 
            value="affiliate" 
            className="glass-card flex items-center justify-center gap-2 px-4 py-3 data-[state=active]:emerald-gradient data-[state=active]:text-white transition-all duration-300"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Referrals</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopItems.map((item) => {
              const owned = inventory[item.id]?.count || 0;
              const canAfford = userProfile.stealCoins >= item.cost;
              const isPurchasing = purchaseLoading === item.id;
              const ItemIcon = item.icon;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`glass-card relative overflow-hidden transition-all duration-300 h-full ${
                      canAfford ? 'border border-emerald-500/30 hover:border-emerald-500/50' : 'border border-slate-700/30'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${getRarityColor(item.rarity)} opacity-5`} />
                    <CardContent className="p-6 relative h-full flex flex-col">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getRarityColor(item.rarity)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <ItemIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-white truncate">{item.name}</h3>
                            <Badge variant="outline" className="text-xs capitalize">
                              {item.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1 text-emerald-400">
                            <Coins className="h-4 w-4" />
                            <span className="font-bold">{item.cost.toLocaleString()}</span>
                          </div>
                          {owned > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Owned: {owned}
                            </Badge>
                          )}
                        </div>
                        <Button
                          onClick={() => handlePurchase(item.id)}
                          disabled={!canAfford || isPurchasing}
                          className="w-full btn-professional bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-700"
                        >
                          {isPurchasing ? 'Purchasing...' : canAfford ? 'Purchase' : 'Not Enough Coins'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card className="glass-card border border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">Your Items</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(inventory).length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">No items yet. Visit the shop to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(inventory).map(([itemId, itemData]) => {
                    const shopItem = shopItems.find(item => item.id === itemId);
                    if (!shopItem) return null;

                    const isExpired = itemData.expires && itemData.expires < Date.now();
                    const daysLeft = itemData.expires 
                      ? Math.ceil((itemData.expires - Date.now()) / (1000 * 60 * 60 * 24))
                      : null;
                    const ItemIcon = shopItem.icon;

                    return (
                      <motion.div
                        key={itemId}
                        whileHover={{ scale: 1.01 }}
                      >
                        <Card className="glass-card">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 bg-gradient-to-r ${getRarityColor(shopItem.rarity)} rounded-lg flex items-center justify-center`}>
                                <ItemIcon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-white">{shopItem.name}</h4>
                                <p className="text-sm text-slate-400">Quantity: {itemData.count}</p>
                                {daysLeft && !isExpired && (
                                  <p className="text-xs text-yellow-400">{daysLeft} days remaining</p>
                                )}
                                {isExpired && (
                                  <p className="text-xs text-red-400">Expired</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(leaderboards).map(([type, entries]) => (
              <Card key={type} className="glass-card border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 capitalize text-white">
                    {type === 'views' && <Eye className="h-5 w-5" />}
                    {type === 'affiliates' && <Users className="h-5 w-5" />}
                    {type === 'spenders' && <Coins className="h-5 w-5" />}
                    {type === 'views' ? 'Most Viewed' : type === 'affiliates' ? 'Top Referrers' : 'Top Spenders'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {entries.slice(0, 10).map((entry, index) => {
                      const isPlaceholder = isPlaceholderEntry(entry);
                      const isCurrentUser = entry.userId === userId;
                      
                      return (
                        <motion.div
                          key={entry.userId}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                            isCurrentUser ? 'glass-card border border-emerald-500/30' : 
                            isPlaceholder ? 'bg-slate-800/20 border border-slate-700/20' :
                            'bg-slate-800/30 hover:bg-slate-800/50'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * index }}
                          whileHover={!isPlaceholder ? { scale: 1.01, x: 3 } : {}}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-slate-400 text-black' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-slate-600 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className={`font-bold ${isPlaceholder ? 'text-slate-500' : 'text-white'}`}>
                              {entry.name || entry.username}
                            </p>
                            <p className={`text-sm ${isPlaceholder ? 'text-slate-600' : 'text-slate-400'}`}>
                              {isPlaceholder ? (
                                type === 'views' ? 'Awaiting first view' :
                                type === 'affiliates' ? 'No referrals yet' :
                                'No coins spent'
                              ) : (
                                type === 'views' ? `${entry.score.toLocaleString()} views` :
                                type === 'affiliates' ? `${entry.score} referrals` :
                                `${entry.score.toLocaleString()} coins spent`
                              )}
                            </p>
                          </div>
                          {isCurrentUser && (
                            <Badge className="bg-emerald-500 text-white">YOU</Badge>
                          )}
                          {isPlaceholder && (
                            <HelpCircle className="h-4 w-4 text-slate-500" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="affiliate" className="space-y-6">
          <Card className="glass-card border border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5" />
                Referral Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="glass-card bg-gradient-to-r from-emerald-950/30 to-teal-950/30 border border-emerald-500/30 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-emerald-400 mb-3">🚀 Earn Coins by Referring Friends!</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Earn 50 coins for each successful referral</li>
                    <li>• Your friends get a 100 coin welcome bonus</li>
                    <li>• Unlock special referrer badges at milestones</li>
                    <li>• Get up to 60% off Premium with enough coins</li>
                  </ul>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Referral Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`https://stolen.bio?ref=${userProfile.affiliateCode}`}
                      className="flex-1 input-professional text-white"
                    />
                    <Button 
                      onClick={copyAffiliateLink}
                      className="btn-professional bg-emerald-500 hover:bg-emerald-600 px-6"
                    >
                      {copySuccess ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="glass-card bg-slate-800/30 border border-slate-700">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-400">{userProfile.affiliateReferrals}</p>
                      <p className="text-sm text-slate-400">Total Referrals</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card bg-slate-800/30 border border-slate-700">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-purple-400">{userProfile.affiliateEarnings}</p>
                      <p className="text-sm text-slate-400">Coins Earned</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card bg-slate-800/30 border border-slate-700">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-400">
                        {userRank.affiliates > 0 ? `#${userRank.affiliates}` : '—'}
                      </p>
                      <p className="text-sm text-slate-400">Referrer Rank</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}