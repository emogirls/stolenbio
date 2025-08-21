import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Zap, 
  ShoppingCart, 
  HeadphonesIcon, 
  Gift,
  User as UserIcon,
  Upload,
  X,
  Plus,
  Trash2,
  Copy,
  Save
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import type { User } from '@supabase/supabase-js';

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
  onHome: () => void;
}

interface BiolinkData {
  link: string;
  title: string;
  description: string;
  layout: string;
  muteBackground: string;
  borderEffect: string;
  address: string;
  favicon: string;
  enterText: string;
  customTitle: string;
  toggleBadges: string;
  avatar: string;
  background: string;
  banner: string;
}

interface SocialLink {
  id: string;
  type: string;
  url: string;
  icon: string;
  position: number;
}

export default function Dashboard({ user, onLogout, onHome }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('biolink');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  
  // Biolink form data
  const [biolinkData, setBiolinkData] = useState<BiolinkData>({
    link: user?.email?.split('@')[0] || 'username',
    title: '',
    description: '',
    layout: '1',
    muteBackground: 'enable',
    borderEffect: 'none',
    address: '',
    favicon: '',
    enterText: 'Click to Enter',
    customTitle: '',
    toggleBadges: 'enable',
    avatar: '',
    background: '',
    banner: ''
  });

  // Misc/Effects data
  const [effectsData, setEffectsData] = useState({
    accentColor: '#ffffff',
    textColor: '#ffffff',
    backgroundColor: '#000000',
    iconColor: '#ffffff',
    discordRpc: 'disable',
    discordBorder: 'enable',
    discordServer: '',
    backgroundEffect: 'default',
    descriptionEffect: 'default',
    border: 'normal',
    borderGlow: 'disabled',
    effect: 'both',
    titleType: 'normal',
    particles: 'enable',
    particleColor: '#ffffff',
    customParticles: '',
    specialEffects: 'none',
    viewsPosition: 'normal',
    badgeColor: 'enabled',
    mouseTrail: 'none',
    mouseColor: '#ffffff',
    mouseEmoji: ''
  });

  // Premium data
  const [premiumData, setPremiumData] = useState({
    aliases: '',
    badge1: '',
    badge1Text: '',
    badge1Position: 'first',
    badge2: '',
    badge2Text: '',
    badge2Position: 'first',
    avatarDecoration: 'none'
  });

  // Social link form
  const [newSocial, setNewSocial] = useState({
    type: '',
    url: '',
    customIcon: ''
  });

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'biolink', icon: Zap, label: 'Bio-Link' },
    { id: 'purchase', icon: ShoppingCart, label: 'Purchase' },
    { id: 'support', icon: HeadphonesIcon, label: 'Support' },
    { id: 'redeem', icon: Gift, label: 'Redeem Codes' }
  ];

  const socialPlatforms = [
    'Instagram', 'Twitter', 'TikTok', 'YouTube', 'Spotify', 'Discord',
    'GitHub', 'LinkedIn', 'Snapchat', 'Reddit', 'Telegram', 'Steam',
    'Roblox', 'PayPal', 'CashApp', 'OnlyFans', 'Custom'
  ];

  // Load initial configuration from localStorage
  useEffect(() => {
    loadBiolinkConfig();
  }, [user]);

  const loadBiolinkConfig = () => {
    try {
      if (!user?.id) return;

      const savedConfig = localStorage.getItem(`biolink_config_${user.id}`);
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setBiolinkData(prev => ({ ...prev, ...config.biolink }));
        setSocialLinks(config.socialLinks || []);
        if (config.effects) {
          setEffectsData(prev => ({ ...prev, ...config.effects }));
        }
        if (config.premium) {
          setPremiumData(prev => ({ ...prev, ...config.premium }));
        }
      } else {
        // Set default username from email
        setBiolinkData(prev => ({
          ...prev,
          link: user.email?.split('@')[0] || 'username'
        }));
      }
    } catch (error) {
      console.error('Error loading biolink config:', error);
      toast.error('Failed to load configuration');
    }
  };

  const saveConfigToStorage = (configUpdate: any) => {
    try {
      if (!user?.id) return;

      const currentConfig = JSON.parse(localStorage.getItem(`biolink_config_${user.id}`) || '{}');
      const updatedConfig = {
        ...currentConfig,
        ...configUpdate,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`biolink_config_${user.id}`, JSON.stringify(updatedConfig));
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  };

  const handleBiolinkChange = (field: string, value: string) => {
    setBiolinkData(prev => ({ ...prev, [field]: value }));
  };

  const handleEffectsChange = (field: string, value: string) => {
    setEffectsData(prev => ({ ...prev, [field]: value }));
  };

  const handlePremiumChange = (field: string, value: string) => {
    setPremiumData(prev => ({ ...prev, [field]: value }));
  };

  const copyBiolinkUrl = () => {
    const url = `https://stolen.bio/${biolinkData.link}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const addSocialLink = () => {
    if (!newSocial.type || !newSocial.url) {
      toast.error('Please fill in all fields');
      return;
    }

    const newSocialLink = {
      id: Date.now().toString(),
      type: newSocial.type,
      url: newSocial.url,
      icon: newSocial.type === 'Custom' ? newSocial.customIcon : newSocial.type,
      position: socialLinks.length
    };
    
    const updatedSocialLinks = [...socialLinks, newSocialLink];
    setSocialLinks(updatedSocialLinks);
    setNewSocial({ type: '', url: '', customIcon: '' });
    
    // Save to localStorage
    saveConfigToStorage({ socialLinks: updatedSocialLinks });
    toast.success('Social link added!');
  };

  const removeSocialLink = (id: string) => {
    const updatedSocialLinks = socialLinks.filter(link => link.id !== id);
    setSocialLinks(updatedSocialLinks);
    
    // Save to localStorage
    saveConfigToStorage({ socialLinks: updatedSocialLinks });
    toast.success('Social link removed!');
  };

  const saveBiolink = () => {
    setIsLoading(true);
    try {
      const success = saveConfigToStorage({ biolink: biolinkData });
      if (success) {
        toast.success('Biolink configuration saved!');
      } else {
        toast.error('Failed to save configuration');
      }
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const saveEffects = () => {
    setIsLoading(true);
    try {
      const success = saveConfigToStorage({ effects: effectsData });
      if (success) {
        toast.success('Effects configuration saved!');
      } else {
        toast.error('Failed to save effects');
      }
    } catch (error) {
      toast.error('Failed to save effects');
    } finally {
      setIsLoading(false);
    }
  };

  const savePremium = () => {
    setIsLoading(true);
    try {
      const success = saveConfigToStorage({ premium: premiumData });
      if (success) {
        toast.success('Premium configuration saved!');
      } else {
        toast.error('Failed to save premium settings');
      }
    } catch (error) {
      toast.error('Failed to save premium settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-black border-r border-white/10 p-6">
        <div className="mb-8">
          <h1 className="text-xl font-medium">stolen.bio</h1>
        </div>

        <nav className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-white/40 mb-4">Main</div>
          {sidebarItems.slice(0, 1).map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}

          <div className="text-xs uppercase tracking-wider text-white/40 mb-4 mt-6">Panel</div>
          {sidebarItems.slice(1).map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors rounded-lg ${
                item.id === 'biolink' 
                  ? 'text-white bg-white/10' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-white/10 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Configuration Panel</h2>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <UserIcon size={16} />
                </div>
                <span className="text-sm text-white/70">{user?.email}</span>
              </div>
              
              <Button
                onClick={onHome}
                variant="outline"
                className="border-white/20 bg-transparent hover:bg-white/5 text-white"
              >
                Home
              </Button>
              
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-white/20 bg-transparent hover:bg-white/5 text-white"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          <Card className="max-w-2xl mx-auto bg-black border-white/10">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full bg-white/5 mb-6">
                  <TabsTrigger value="biolink" className="text-xs">Bio-Link</TabsTrigger>
                  <TabsTrigger value="biosocials" className="text-xs">Bio-Socials</TabsTrigger>
                  <TabsTrigger value="misc" className="text-xs">Misc</TabsTrigger>
                  <TabsTrigger value="premium" className="text-xs">Premium</TabsTrigger>
                </TabsList>

                {/* Bio-Link Tab */}
                <TabsContent value="biolink" className="space-y-4">
                  <div>
                    <Label>Link</Label>
                    <div className="flex mt-2">
                      <span className="inline-flex items-center px-3 text-sm text-white/70 bg-white/5 border border-r-0 border-white/10 rounded-l-md">
                        https://stolen.bio/
                      </span>
                      <Input
                        value={biolinkData.link}
                        onChange={(e) => handleBiolinkChange('link', e.target.value)}
                        className="rounded-l-none bg-white/5 border-white/10"
                        placeholder="username"
                      />
                      <Button
                        onClick={copyBiolinkUrl}
                        size="sm"
                        className="ml-2 bg-white/10 hover:bg-white/20"
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      value={biolinkData.title}
                      onChange={(e) => handleBiolinkChange('title', e.target.value)}
                      className="mt-2 bg-white/5 border-white/10"
                      placeholder="Your title"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={biolinkData.description}
                      onChange={(e) => handleBiolinkChange('description', e.target.value)}
                      className="mt-2 bg-white/5 border-white/10"
                      placeholder="Your bio description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Layout</Label>
                    <Select value={biolinkData.layout} onValueChange={(value) => handleBiolinkChange('layout', value)}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Layout 1</SelectItem>
                        <SelectItem value="2">Layout 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Enter Text</Label>
                    <Input
                      value={biolinkData.enterText}
                      onChange={(e) => handleBiolinkChange('enterText', e.target.value)}
                      className="mt-2 bg-white/5 border-white/10"
                      placeholder="Click to Enter"
                    />
                  </div>

                  <div>
                    <Label>Address</Label>
                    <Input
                      value={biolinkData.address}
                      onChange={(e) => handleBiolinkChange('address', e.target.value)}
                      className="mt-2 bg-white/5 border-white/10"
                      placeholder="Berlin"
                    />
                  </div>

                  <div>
                    <Label>Show Badges</Label>
                    <Select value={biolinkData.toggleBadges} onValueChange={(value) => handleBiolinkChange('toggleBadges', value)}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enable">Yes</SelectItem>
                        <SelectItem value="disable">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={saveBiolink} disabled={isLoading} className="w-full bg-white text-black hover:bg-white/90">
                    <Save size={16} className="mr-2" />
                    {isLoading ? 'Saving...' : 'Save Config'}
                  </Button>
                </TabsContent>

                {/* Bio-Socials Tab */}
                <TabsContent value="biosocials" className="space-y-4">
                  {/* Existing social links */}
                  {socialLinks.length > 0 && (
                    <div className="space-y-2">
                      <Label>Your Social Links</Label>
                      <div className="flex flex-wrap gap-2">
                        {socialLinks.map((social) => (
                          <div key={social.id} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                            <span className="text-sm">{social.type}</span>
                            <button
                              onClick={() => removeSocialLink(social.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Social Platform</Label>
                    <Select value={newSocial.type} onValueChange={(value) => setNewSocial(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10">
                        <SelectValue placeholder="Select Social Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialPlatforms.map((platform) => (
                          <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Social Link URL</Label>
                    <Input
                      value={newSocial.url}
                      onChange={(e) => setNewSocial(prev => ({ ...prev, url: e.target.value }))}
                      className="mt-2 bg-white/5 border-white/10"
                      placeholder="Enter Social Link URL"
                    />
                  </div>

                  {newSocial.type === 'Custom' && (
                    <div>
                      <Label>Custom Icon URL</Label>
                      <Input
                        value={newSocial.customIcon}
                        onChange={(e) => setNewSocial(prev => ({ ...prev, customIcon: e.target.value }))}
                        className="mt-2 bg-white/5 border-white/10"
                        placeholder="Enter Icon URL"
                      />
                    </div>
                  )}

                  <Button onClick={addSocialLink} className="w-full bg-white text-black hover:bg-white/90">
                    <Plus size={16} className="mr-2" />
                    Add Social
                  </Button>
                </TabsContent>

                {/* Misc Tab */}
                <TabsContent value="misc" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Accent Color</Label>
                      <Input
                        type="color"
                        value={effectsData.accentColor}
                        onChange={(e) => handleEffectsChange('accentColor', e.target.value)}
                        className="mt-2 h-10 bg-white/5 border-white/10"
                      />
                    </div>

                    <div>
                      <Label>Text Color</Label>
                      <Input
                        type="color"
                        value={effectsData.textColor}
                        onChange={(e) => handleEffectsChange('textColor', e.target.value)}
                        className="mt-2 h-10 bg-white/5 border-white/10"
                      />
                    </div>

                    <div>
                      <Label>Background Color</Label>
                      <Input
                        type="color"
                        value={effectsData.backgroundColor}
                        onChange={(e) => handleEffectsChange('backgroundColor', e.target.value)}
                        className="mt-2 h-10 bg-white/5 border-white/10"
                      />
                    </div>

                    <div>
                      <Label>Icon Color</Label>
                      <Input
                        type="color"
                        value={effectsData.iconColor}
                        onChange={(e) => handleEffectsChange('iconColor', e.target.value)}
                        className="mt-2 h-10 bg-white/5 border-white/10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Background Effect</Label>
                    <Select value={effectsData.backgroundEffect} onValueChange={(value) => handleEffectsChange('backgroundEffect', value)}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Normal Background</SelectItem>
                        <SelectItem value="pixelated">Pixelated Background</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Description Effect</Label>
                    <Select value={effectsData.descriptionEffect} onValueChange={(value) => handleEffectsChange('descriptionEffect', value)}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Normal Description</SelectItem>
                        <SelectItem value="typing">Typing Effect</SelectItem>
                        <SelectItem value="glitch">Glitch Effect</SelectItem>
                        <SelectItem value="fade">Fade In-Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Special Effects</Label>
                    <Select value={effectsData.specialEffects} onValueChange={(value) => handleEffectsChange('specialEffects', value)}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="bats">Bats Flying</SelectItem>
                        <SelectItem value="christmas">Christmas Snow</SelectItem>
                        <SelectItem value="rain">Rain</SelectItem>
                        <SelectItem value="shootingstars">Shooting Stars</SelectItem>
                        <SelectItem value="glitch">Glitch</SelectItem>
                        <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Mouse Trail</Label>
                    <Select value={effectsData.mouseTrail} onValueChange={(value) => handleEffectsChange('mouseTrail', value)}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="springy">Springy</SelectItem>
                        <SelectItem value="snowflake">Snowflake</SelectItem>
                        <SelectItem value="bubbles">Bubbles</SelectItem>
                        <SelectItem value="ghost">Ghost</SelectItem>
                        <SelectItem value="trail">Trail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={saveEffects} disabled={isLoading} className="w-full bg-white text-black hover:bg-white/90">
                    <Save size={16} className="mr-2" />
                    {isLoading ? 'Saving...' : 'Save Config'}
                  </Button>
                </TabsContent>

                {/* Premium Tab */}
                <TabsContent value="premium" className="space-y-4">
                  <div>
                    <Label>Aliases</Label>
                    <Input
                      value={premiumData.aliases}
                      onChange={(e) => handlePremiumChange('aliases', e.target.value)}
                      className="mt-2 bg-white/5 border-white/10"
                      placeholder="alias1,alias2,alias3"
                    />
                  </div>

                  <div>
                    <Label>Badge 1</Label>
                    <Input
                      value={premiumData.badge1}
                      onChange={(e) => handlePremiumChange('badge1', e.target.value)}
                      className="mt-2 bg-white/5 border-white/10"
                      placeholder="Badge URL Icon"
                    />
                    <Input
                      value={premiumData.badge1Text}
                      onChange={(e) => handlePremiumChange('badge1Text', e.target.value)}
                      className="mt-2 bg-white/5 border-white/10"
                      placeholder="Badge Text"
                    />
                  </div>

                  <div>
                    <Label>Badge 1 Position</Label>
                    <Select value={premiumData.badge1Position} onValueChange={(value) => handlePremiumChange('badge1Position', value)}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first">First</SelectItem>
                        <SelectItem value="last">Last</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Badge 2</Label>
                    <Input
                      value={premiumData.badge2}
                      onChange={(e) => handlePremiumChange('badge2', e.target.value)}
                      className="mt-2 bg-white/5 border-white/10"
                      placeholder="Badge URL Icon"
                    />
                    <Input
                      value={premiumData.badge2Text}
                      onChange={(e) => handlePremiumChange('badge2Text', e.target.value)}
                      className="mt-2 bg-white/5 border-white/10"
                      placeholder="Badge Text"
                    />
                  </div>

                  <div>
                    <Label>Badge 2 Position</Label>
                    <Select value={premiumData.badge2Position} onValueChange={(value) => handlePremiumChange('badge2Position', value)}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first">First</SelectItem>
                        <SelectItem value="last">Last</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Avatar Decoration</Label>
                    <Select value={premiumData.avatarDecoration} onValueChange={(value) => handlePremiumChange('avatarDecoration', value)}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="glow">Glow</SelectItem>
                        <SelectItem value="border">Border</SelectItem>
                        <SelectItem value="sparkles">Sparkles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={savePremium} disabled={isLoading} className="w-full bg-white text-black hover:bg-white/90">
                    <Save size={16} className="mr-2" />
                    {isLoading ? 'Saving...' : 'Save Config'}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}