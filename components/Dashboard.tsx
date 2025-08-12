import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { Slider } from './ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion } from 'motion/react';
import { 
  User, 
  Link, 
  Settings,
  Plus,
  X,
  Upload,
  Loader2,
  LogOut,
  Eye,
  Sparkles,
  Palette,
  Music,
  Share2,
  Crown,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Github,
  Facebook,
  Linkedin,
  Twitch,
  Video,
  MessageCircle,
  Music,
  Apple,
  Phone,
  Mail,
  MapPin,
  Heart,
  Camera,
  Gamepad2,
  Headphones,
  Tv,
  Briefcase,
  GraduationCap,
  ShoppingBag,
  Zap,
  Coffee,
  Code,
  Paintbrush,
  Award
} from 'lucide-react';

interface DashboardProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
  onPreview: () => void;
  onLogout: () => void;
  user: any;
  accessToken: string;
}

// Comprehensive social platforms list
const socialPlatforms = [
  { name: 'Instagram', icon: Instagram, value: 'instagram', placeholder: '@username or full URL' },
  { name: 'Twitter/X', icon: Twitter, value: 'twitter', placeholder: '@username or full URL' },
  { name: 'YouTube', icon: Youtube, value: 'youtube', placeholder: 'Channel URL or @username' },
  { name: 'TikTok', icon: Video, value: 'tiktok', placeholder: '@username or full URL' },
  { name: 'Discord', icon: MessageCircle, value: 'discord', placeholder: 'Server invite or username#0000' },
  { name: 'Twitch', icon: Twitch, value: 'twitch', placeholder: '@username or channel URL' },
  { name: 'GitHub', icon: Github, value: 'github', placeholder: 'username or full URL' },
  { name: 'LinkedIn', icon: Linkedin, value: 'linkedin', placeholder: 'Profile URL or username' },
  { name: 'Facebook', icon: Facebook, value: 'facebook', placeholder: 'Page or profile URL' },
  { name: 'Spotify', icon: Music, value: 'spotify', placeholder: 'Artist/playlist URL' },
  { name: 'Apple Music', icon: Apple, value: 'apple-music', placeholder: 'Artist or playlist URL' },
  { name: 'Website', icon: Globe, value: 'website', placeholder: 'https://yoursite.com' },
  { name: 'Email', icon: Mail, value: 'email', placeholder: 'your@email.com' },
  { name: 'Phone', icon: Phone, value: 'phone', placeholder: '+1234567890' },
  { name: 'Location', icon: MapPin, value: 'location', placeholder: 'City, Country' },
  { name: 'OnlyFans', icon: Heart, value: 'onlyfans', placeholder: '@username or full URL' },
  { name: 'Photography', icon: Camera, value: 'photography', placeholder: 'Portfolio URL' },
  { name: 'Gaming', icon: Gamepad2, value: 'gaming', placeholder: 'Gaming profile URL' },
  { name: 'Music', icon: Headphones, value: 'music', placeholder: 'Music platform URL' },
  { name: 'Streaming', icon: Tv, value: 'streaming', placeholder: 'Stream URL' },
  { name: 'Business', icon: Briefcase, value: 'business', placeholder: 'Company URL' },
  { name: 'Education', icon: GraduationCap, value: 'education', placeholder: 'Course or school URL' },
  { name: 'Store', icon: ShoppingBag, value: 'store', placeholder: 'Shop URL' }
];

const fontOptions = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Nunito', value: 'Nunito, sans-serif' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Oswald', value: 'Oswald, sans-serif' },
  { name: 'Raleway', value: 'Raleway, sans-serif' }
];

const backgroundPresets = [
  { name: 'Professional Dark', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' },
  { name: 'Emerald Gradient', value: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)' },
  { name: 'Teal Ocean', value: 'linear-gradient(135deg, #134e4a 0%, #0f766e 50%, #14b8a6 100%)' },
  { name: 'Midnight Blue', value: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)' },
  { name: 'Purple Space', value: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)' },
  { name: 'Sunset Orange', value: 'linear-gradient(135deg, #9a3412 0%, #ea580c 50%, #f97316 100%)' },
  { name: 'Rose Gold', value: 'linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #f43f5e 100%)' },
  { name: 'Forest Green', value: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #22c55e 100%)' }
];

const specialEffects = [
  { name: 'None', value: 'none' },
  { name: 'Falling Stars', value: 'falling-stars' },
  { name: 'Floating Particles', value: 'particles' },
  { name: 'Rain', value: 'rain' },
  { name: 'Snow', value: 'snow' },
  { name: 'Glitch', value: 'glitch' },
  { name: 'Cyberpunk', value: 'cyberpunk' },
  { name: 'Flying Stars', value: 'flying-stars' },
  { name: 'Matrix Code', value: 'matrix' }
];

const mouseTrails = [
  { name: 'None', value: 'none', emoji: '' },
  { name: 'Ghost', value: 'ghost', emoji: '👻' },
  { name: 'Cat', value: 'cat', emoji: '🐱' },
  { name: 'Snowflake', value: 'snowflake', emoji: '❄️' },
  { name: 'Bubbles', value: 'bubbles', emoji: '💭' },
  { name: 'Halloween', value: 'halloween', emoji: '🎃' },
  { name: 'Christmas', value: 'christmas', emoji: '🎄' },
  { name: 'Heart', value: 'heart', emoji: '💖' },
  { name: 'Star', value: 'star', emoji: '⭐' }
];

const avatarDecorations = [
  { name: 'None', value: 'none' },
  { name: 'Katana Slice', value: 'katana' },
  { name: 'Fire Glow', value: 'fire' },
  { name: 'Electric Spark', value: 'electric' },
  { name: 'Rainbow Ring', value: 'rainbow' },
  { name: 'Ice Crystal', value: 'ice' },
  { name: 'Golden Aura', value: 'golden' },
  { name: 'Cyber Grid', value: 'cyber' }
];

export function Dashboard({ settings, onSettingsChange, onPreview, onLogout, user, accessToken }: DashboardProps) {
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  const cursorInputRef = useRef<HTMLInputElement>(null);

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const addSocialLink = () => {
    if (newSocialPlatform && newSocialUrl.trim()) {
      const platform = socialPlatforms.find(p => p.value === newSocialPlatform);
      if (platform) {
        updateSetting('socialLinks', [
          ...settings.socialLinks,
          {
            platform: newSocialPlatform,
            url: newSocialUrl.trim(),
            icon: platform.icon,
            name: platform.name
          }
        ]);
        setNewSocialPlatform('');
        setNewSocialUrl('');
      }
    }
  };

  const removeSocialLink = (index: number) => {
    updateSetting('socialLinks', settings.socialLinks.filter((_: any, i: number) => i !== index));
  };

  const handleFileUpload = async (file: File, type: 'background' | 'music' | 'cursor' | 'favicon' | 'particles' | 'badge') => {
    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const { projectId } = await import('../utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-dfdc0213/upload-media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setUploadError(data.error || 'Upload failed');
        return;
      }

      // Update settings based on type
      switch (type) {
        case 'background':
          const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
          updateSetting('backgroundMedia', {
            url: data.url,
            type: mediaType,
            fileName: data.fileName
          });
          break;
        case 'music':
          updateSetting('musicUrl', data.url);
          updateSetting('musicEnabled', true);
          break;
        case 'cursor':
          updateSetting('customCursor', data.url);
          break;
        case 'favicon':
          updateSetting('favicon', data.url);
          break;
        case 'particles':
          updateSetting('particlesImage', data.url);
          break;
        case 'badge':
          updateSetting('customBadge', { ...settings.customBadge, image: data.url });
          break;
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const { projectId } = await import('../utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-dfdc0213/update-biolink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const ColorPicker = ({ color, onChange, label }: { color: string, onChange: (color: string) => void, label: string }) => (
    <div className="space-y-2">
      <Label className="text-slate-200">{label}</Label>
      <Popover open={colorPickerOpen === label} onOpenChange={(open) => setColorPickerOpen(open ? label : null)}>
        <PopoverTrigger asChild>
          <div className="flex gap-2">
            <div
              className="w-12 h-10 rounded-md border-2 border-emerald-500/30 cursor-pointer transition-all hover:scale-105"
              style={{ backgroundColor: color }}
            />
            <Input
              value={color}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#10b981"
              className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-slate-900 border-emerald-500/30">
          <div className="space-y-3">
            <div className="grid grid-cols-6 gap-2">
              {[
                '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#a855f7',
                '#f43f5e', '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e',
                '#ffffff', '#e5e7eb', '#9ca3af', '#6b7280', '#374151', '#1f2937'
              ].map((presetColor) => (
                <div
                  key={presetColor}
                  className="w-8 h-8 rounded cursor-pointer hover:scale-110 transition-transform border border-white/20"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    onChange(presetColor);
                    setColorPickerOpen(null);
                  }}
                />
              ))}
            </div>
            <Input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-5"
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
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto p-6">
          {/* Header */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Link className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  stolen.bio Dashboard
                </h1>
                <p className="text-slate-300 mt-1">
                  Welcome back, {user?.user_metadata?.name} ✨
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={onPreview} 
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button 
                onClick={saveSettings} 
                disabled={isSaving} 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
              <Button 
                onClick={onLogout} 
                variant="outline" 
                className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/30 hover:text-emerald-200"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </motion.div>

          {/* Link Display */}
          <motion.div
            className="mb-8 p-4 bg-slate-900/50 backdrop-blur-sm border border-emerald-500/30 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-emerald-300">Your Biolink URL:</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-400">stolen.bio/</span>
                  <span className="text-white font-semibold">{settings.customLink || 'username'}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(`https://stolen.bio/${settings.customLink}`)}
                className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/30"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Tabs defaultValue="biolink" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-900/80 backdrop-blur-sm border border-emerald-500/30 mb-6">
                  <TabsTrigger 
                    value="biolink" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white text-slate-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Bio-Link
                  </TabsTrigger>
                  <TabsTrigger 
                    value="socials" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white text-slate-300"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Socials
                  </TabsTrigger>
                  <TabsTrigger 
                    value="misc" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white text-slate-300"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Misc
                  </TabsTrigger>
                  <TabsTrigger 
                    value="premium" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white text-slate-300"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Premium
                  </TabsTrigger>
                </TabsList>

                {/* Bio-Link Menu Tab */}
                <TabsContent value="biolink" className="space-y-6">
                  <Card className="bg-slate-900/80 backdrop-blur-sm border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-emerald-400" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customLink" className="text-slate-200">Custom Link</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-emerald-500/30 bg-slate-800/50 text-slate-400 text-sm">
                              stolen.bio/
                            </span>
                            <Input
                              id="customLink"
                              value={settings.customLink}
                              onChange={(e) => updateSetting('customLink', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                              placeholder="username"
                              className="rounded-l-none bg-slate-800/50 border-emerald-500/30 text-white focus:border-emerald-400 focus:ring-emerald-400/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-slate-200">Title (Display Name)</Label>
                          <Input
                            id="title"
                            value={settings.title}
                            onChange={(e) => updateSetting('title', e.target.value)}
                            placeholder="Your Display Name"
                            className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-200">Description</Label>
                        <Textarea
                          id="description"
                          value={settings.description}
                          onChange={(e) => updateSetting('description', e.target.value)}
                          placeholder="Tell people about yourself... 💫"
                          rows={3}
                          className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="avatar" className="text-slate-200">Avatar URL</Label>
                          <Input
                            id="avatar"
                            value={settings.avatar}
                            onChange={(e) => updateSetting('avatar', e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                            className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-slate-200">Address/Location</Label>
                          <Input
                            id="address"
                            value={settings.address}
                            onChange={(e) => updateSetting('address', e.target.value)}
                            placeholder="City, Country 🌍"
                            className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/80 backdrop-blur-sm border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Upload className="w-5 h-5 text-teal-400" />
                        Media & Files
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Background Media */}
                      <div className="space-y-3">
                        <Label className="text-slate-200">Background Media (.gif, .png, .mp4)</Label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-emerald-500/30 border-dashed rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-700/30 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {isUploading ? (
                                <Loader2 className="w-8 h-8 mb-4 text-emerald-400 animate-spin" />
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 mb-4 text-emerald-400" />
                                  <p className="mb-2 text-sm text-slate-300">
                                    <span className="font-semibold">Click to upload background</span>
                                  </p>
                                  <p className="text-xs text-slate-400">PNG, GIF, MP4 files</p>
                                </>
                              )}
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              accept=".png,.gif,.mp4"
                              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'background')}
                              disabled={isUploading}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Music Upload */}
                      <div className="space-y-3">
                        <Label className="text-slate-200">Background Music (.mp3, .wav)</Label>
                        <div className="flex gap-2">
                          <Input
                            value={settings.musicUrl}
                            onChange={(e) => updateSetting('musicUrl', e.target.value)}
                            placeholder="https://example.com/music.mp3 or upload file"
                            className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                          />
                          <Button
                            variant="outline"
                            onClick={() => musicInputRef.current?.click()}
                            className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/30"
                          >
                            <Music className="w-4 h-4" />
                          </Button>
                          <input
                            ref={musicInputRef}
                            type="file"
                            className="hidden"
                            accept=".mp3,.wav"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'music')}
                          />
                        </div>
                      </div>

                      {/* Custom Cursor */}
                      <div className="space-y-3">
                        <Label className="text-slate-200">Custom Cursor (.png, .ico, .cur)</Label>
                        <div className="flex gap-2">
                          <Input
                            value={settings.customCursor}
                            onChange={(e) => updateSetting('customCursor', e.target.value)}
                            placeholder="https://example.com/cursor.png"
                            className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                          />
                          <Button
                            variant="outline"
                            onClick={() => cursorInputRef.current?.click()}
                            className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/30"
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                          <input
                            ref={cursorInputRef}
                            type="file"
                            className="hidden"
                            accept=".png,.ico,.cur"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'cursor')}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/80 backdrop-blur-sm border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-cyan-400" />
                        Page Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="titleTabText" className="text-slate-200">Browser Tab Title</Label>
                          <Input
                            id="titleTabText"
                            value={settings.titleTabText}
                            onChange={(e) => updateSetting('titleTabText', e.target.value)}
                            placeholder="stolen.bio - Your Name"
                            className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="enterText" className="text-slate-200">Enter Overlay Text</Label>
                          <Input
                            id="enterText"
                            value={settings.enterText}
                            onChange={(e) => updateSetting('enterText', e.target.value)}
                            placeholder="Enter My Space ✨"
                            className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-200">Font Family</Label>
                        <Select 
                          value={settings.fontFamily} 
                          onValueChange={(value) => updateSetting('fontFamily', value)}
                        >
                          <SelectTrigger className="bg-slate-800/50 border-emerald-500/30 text-white">
                            <SelectValue placeholder="Select a font" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-emerald-500/30">
                            {fontOptions.map((font) => (
                              <SelectItem key={font.value} value={font.value} className="text-white hover:bg-emerald-900/50">
                                <span style={{ fontFamily: font.value }}>{font.name}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-slate-200">Show Overlay Screen</Label>
                          <p className="text-xs text-slate-400">Display enter screen before revealing biolink</p>
                        </div>
                        <Switch
                          checked={settings.overlayEnabled}
                          onCheckedChange={(checked) => updateSetting('overlayEnabled', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-slate-200">Show Badges</Label>
                          <p className="text-xs text-slate-400">Display earned platform badges</p>
                        </div>
                        <Switch
                          checked={settings.showBadges}
                          onCheckedChange={(checked) => updateSetting('showBadges', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Bio-Socials Tab */}
                <TabsContent value="socials" className="space-y-6">
                  <Card className="bg-slate-900/80 backdrop-blur-sm border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-emerald-400" />
                        Add Social Platform
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-200">Platform</Label>
                          <Select value={newSocialPlatform} onValueChange={setNewSocialPlatform}>
                            <SelectTrigger className="bg-slate-800/50 border-emerald-500/30 text-white">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-emerald-500/30 max-h-60">
                              {socialPlatforms.map((platform) => (
                                <SelectItem 
                                  key={platform.value} 
                                  value={platform.value} 
                                  className="text-white hover:bg-emerald-900/50"
                                >
                                  <div className="flex items-center gap-2">
                                    <platform.icon className="w-4 h-4" />
                                    {platform.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-200">URL or Username</Label>
                          <Input
                            value={newSocialUrl}
                            onChange={(e) => setNewSocialUrl(e.target.value)}
                            placeholder={
                              newSocialPlatform 
                                ? socialPlatforms.find(p => p.value === newSocialPlatform)?.placeholder || "Enter URL or username"
                                : "Enter URL or username"
                            }
                            className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            onClick={addSocialLink}
                            disabled={!newSocialPlatform || !newSocialUrl.trim()}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Social
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/80 backdrop-blur-sm border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Link className="w-5 h-5 text-teal-400" />
                        Your Social Links ({settings.socialLinks.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {settings.socialLinks.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                              <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>No social links added yet</p>
                              <p className="text-sm">Add your first social platform above</p>
                            </div>
                          ) : (
                            settings.socialLinks.map((link: any, index: number) => (
                              <div 
                                key={index} 
                                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <link.icon className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-white font-medium">{link.name}</div>
                                    <div className="text-slate-400 text-sm truncate max-w-xs">
                                      {link.url}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeSocialLink(index)}
                                  className="border-red-500/30 text-red-300 hover:bg-red-900/30 hover:border-red-500/50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Misc Tab */}
                <TabsContent value="misc" className="space-y-6">
                  <Card className="bg-slate-900/80 backdrop-blur-sm border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Palette className="w-5 h-5 text-emerald-400" />
                        Colors & Themes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ColorPicker
                          color={settings.accentColor}
                          onChange={(color) => updateSetting('accentColor', color)}
                          label="Accent Color"
                        />
                        <ColorPicker
                          color={settings.textColor}
                          onChange={(color) => updateSetting('textColor', color)}
                          label="Text Color"
                        />
                        <ColorPicker
                          color={settings.iconColor}
                          onChange={(color) => updateSetting('iconColor', color)}
                          label="Icon Color"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-slate-200">Background Presets</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {backgroundPresets.map((preset) => (
                            <Button
                              key={preset.name}
                              variant="outline"
                              className="h-16 justify-center text-white border-emerald-500/30 hover:bg-emerald-900/30 hover:border-emerald-500/50 overflow-hidden relative"
                              style={{ background: `${preset.value}` }}
                              onClick={() => updateSetting('backgroundColor', preset.value)}
                            >
                              <span className="font-medium drop-shadow-lg text-xs text-center px-2">
                                {preset.name}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-200">Custom Background CSS</Label>
                        <Input
                          value={settings.backgroundColor}
                          onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                          placeholder="linear-gradient(...) or #color or url(...)"
                          className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/80 backdrop-blur-sm border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-teal-400" />
                        Visual Effects
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-slate-200">Background Type</Label>
                            <Select 
                              value={settings.backgroundType} 
                              onValueChange={(value) => updateSetting('backgroundType', value)}
                            >
                              <SelectTrigger className="bg-slate-800/50 border-emerald-500/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-emerald-500/30">
                                <SelectItem value="normal" className="text-white hover:bg-emerald-900/50">Normal</SelectItem>
                                <SelectItem value="pixelated" className="text-white hover:bg-emerald-900/50">Pixelated</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-200">Description Effect</Label>
                            <Select 
                              value={settings.descriptionEffect} 
                              onValueChange={(value) => updateSetting('descriptionEffect', value)}
                            >
                              <SelectTrigger className="bg-slate-800/50 border-emerald-500/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-emerald-500/30">
                                <SelectItem value="normal" className="text-white hover:bg-emerald-900/50">Normal</SelectItem>
                                <SelectItem value="typing" className="text-white hover:bg-emerald-900/50">Typing Animation</SelectItem>
                                <SelectItem value="glitch" className="text-white hover:bg-emerald-900/50">Glitch Effect</SelectItem>
                                <SelectItem value="fade" className="text-white hover:bg-emerald-900/50">Fade In/Out</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-200">Title Type</Label>
                            <Select 
                              value={settings.titleType} 
                              onValueChange={(value) => updateSetting('titleType', value)}
                            >
                              <SelectTrigger className="bg-slate-800/50 border-emerald-500/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-emerald-500/30">
                                <SelectItem value="normal" className="text-white hover:bg-emerald-900/50">Normal Glow</SelectItem>
                                <SelectItem value="rainbow" className="text-white hover:bg-emerald-900/50">Rainbow Text</SelectItem>
                                <SelectItem value="fade" className="text-white hover:bg-emerald-900/50">Fading Animation</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label className="text-slate-200">Border Glow</Label>
                              <p className="text-xs text-slate-400">Add glowing border effect</p>
                            </div>
                            <Switch
                              checked={settings.borderGlow}
                              onCheckedChange={(checked) => updateSetting('borderGlow', checked)}
                            />
                          </div>

                          {settings.borderGlow && (
                            <div className="space-y-2">
                              <Label className="text-slate-200">Glow Type</Label>
                              <Select 
                                value={settings.glowType} 
                                onValueChange={(value) => updateSetting('glowType', value)}
                              >
                                <SelectTrigger className="bg-slate-800/50 border-emerald-500/30 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-emerald-500/30">
                                  <SelectItem value="avatar" className="text-white hover:bg-emerald-900/50">Avatar Only</SelectItem>
                                  <SelectItem value="title" className="text-white hover:bg-emerald-900/50">Title Only</SelectItem>
                                  <SelectItem value="both" className="text-white hover:bg-emerald-900/50">Avatar + Title</SelectItem>
                                  <SelectItem value="none" className="text-white hover:bg-emerald-900/50">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label className="text-slate-200">Special Effects</Label>
                            <Select 
                              value={settings.specialEffects} 
                              onValueChange={(value) => updateSetting('specialEffects', value)}
                            >
                              <SelectTrigger className="bg-slate-800/50 border-emerald-500/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-emerald-500/30">
                                {specialEffects.map((effect) => (
                                  <SelectItem key={effect.value} value={effect.value} className="text-white hover:bg-emerald-900/50">
                                    {effect.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/80 backdrop-blur-sm border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-cyan-400" />
                        Interactive Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-slate-200">Mouse Trails</Label>
                            <Select 
                              value={settings.mouseTrails} 
                              onValueChange={(value) => updateSetting('mouseTrails', value)}
                            >
                              <SelectTrigger className="bg-slate-800/50 border-emerald-500/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-emerald-500/30">
                                {mouseTrails.map((trail) => (
                                  <SelectItem key={trail.value} value={trail.value} className="text-white hover:bg-emerald-900/50">
                                    <div className="flex items-center gap-2">
                                      {trail.emoji && <span>{trail.emoji}</span>}
                                      {trail.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-200">View Counter Position</Label>
                            <Select 
                              value={settings.viewCounterPosition} 
                              onValueChange={(value) => updateSetting('viewCounterPosition', value)}
                            >
                              <SelectTrigger className="bg-slate-800/50 border-emerald-500/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-emerald-500/30">
                                <SelectItem value="top-right" className="text-white hover:bg-emerald-900/50">Top Right</SelectItem>
                                <SelectItem value="bottom-left" className="text-white hover:bg-emerald-900/50">Bottom Left</SelectItem>
                                <SelectItem value="disabled" className="text-white hover:bg-emerald-900/50">Disabled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label className="text-slate-200">Discord RPC</Label>
                              <p className="text-xs text-slate-400">Show Discord profile embed</p>
                            </div>
                            <Switch
                              checked={settings.discordRPC}
                              onCheckedChange={(checked) => updateSetting('discordRPC', checked)}
                            />
                          </div>

                          {settings.discordRPC && (
                            <div className="space-y-2">
                              <Label className="text-slate-200">Discord Server Invite</Label>
                              <Input
                                value={settings.discordInvite}
                                onChange={(e) => updateSetting('discordInvite', e.target.value)}
                                placeholder="abc123 (without discord.gg/)"
                                className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label className="text-slate-200">Particles</Label>
                              <p className="text-xs text-slate-400">Floating particle effects</p>
                            </div>
                            <Switch
                              checked={settings.particlesEnabled}
                              onCheckedChange={(checked) => updateSetting('particlesEnabled', checked)}
                            />
                          </div>

                          {settings.particlesEnabled && (
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <Label className="text-slate-200">Particle Image URL</Label>
                                <Input
                                  value={settings.particlesImage}
                                  onChange={(e) => updateSetting('particlesImage', e.target.value)}
                                  placeholder="https://example.com/particle.png"
                                  className="bg-slate-800/50 border-emerald-500/30 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                                />
                              </div>
                              <ColorPicker
                                color={settings.particlesColor}
                                onChange={(color) => updateSetting('particlesColor', color)}
                                label="Particle Color"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Premium Tab */}
                <TabsContent value="premium" className="space-y-6">
                  <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border-yellow-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        Premium Features
                      </CardTitle>
                      <p className="text-yellow-200 text-sm">
                        Unlock advanced customization options with Premium
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-200">Aliases (Max 3)</Label>
                          <Input
                            value={settings.aliases}
                            onChange={(e) => updateSetting('aliases', e.target.value)}
                            placeholder="alias1, alias2, alias3"
                            className="bg-slate-800/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-400 focus:ring-yellow-400/20"
                          />
                          <p className="text-xs text-slate-400">
                            Example: short, nick, alt → stolen.bio/short will redirect to your main biolink
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-200">Avatar Decoration</Label>
                          <Select 
                            value={settings.avatarDecoration} 
                            onValueChange={(value) => updateSetting('avatarDecoration', value)}
                          >
                            <SelectTrigger className="bg-slate-800/50 border-yellow-500/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-yellow-500/30">
                              {avatarDecorations.map((decoration) => (
                                <SelectItem key={decoration.value} value={decoration.value} className="text-white hover:bg-yellow-900/50">
                                  {decoration.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator className="bg-yellow-500/30" />

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="w-5 h-5 text-yellow-400" />
                          <Label className="text-slate-200">Custom Badge</Label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-200">Badge Image URL</Label>
                            <Input
                              value={settings.customBadge?.image || ''}
                              onChange={(e) => updateSetting('customBadge', { 
                                ...settings.customBadge, 
                                image: e.target.value 
                              })}
                              placeholder="https://example.com/badge.svg"
                              className="bg-slate-800/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-400 focus:ring-yellow-400/20"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-200">Badge Tooltip</Label>
                            <Input
                              value={settings.customBadge?.tooltip || ''}
                              onChange={(e) => updateSetting('customBadge', { 
                                ...settings.customBadge, 
                                tooltip: e.target.value 
                              })}
                              placeholder="Custom Achievement"
                              className="bg-slate-800/50 border-yellow-500/30 text-white placeholder-slate-400 focus:border-yellow-400 focus:ring-yellow-400/20"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-slate-400">
                          Supports .svg, .png, .ico files. Image will be displayed as a small badge next to your username.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/80 backdrop-blur-sm border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Upgrade to Premium</CardTitle>
                      <p className="text-slate-300">Get access to all premium features</p>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white border-0 text-lg py-3">
                        <Crown className="w-5 h-5 mr-2" />
                        Upgrade to Premium - $9/month
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Live Preview Panel */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="bg-slate-900/80 backdrop-blur-sm border-emerald-500/30 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-emerald-400" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[9/16] bg-slate-800 rounded-lg border border-emerald-500/20 overflow-hidden relative">
                    {/* Mini biolink preview */}
                    <div 
                      className="h-full relative"
                      style={{ background: settings.backgroundColor }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div 
                          className="w-full max-w-[200px] rounded-xl p-4 backdrop-blur-sm"
                          style={{ backgroundColor: `${settings.squareColor}dd` }}
                        >
                          <div className="flex flex-col items-center space-y-3">
                            <div 
                              className="w-12 h-12 rounded-full bg-cover bg-center border-2"
                              style={{ 
                                backgroundImage: `url(${settings.avatar})`,
                                borderColor: settings.accentColor
                              }}
                            />
                            <div className="text-center">
                              <div 
                                className="text-sm font-semibold truncate"
                                style={{ color: settings.textColor }}
                              >
                                {settings.title || 'Username'}
                              </div>
                              <div 
                                className="text-xs mt-1 opacity-80 line-clamp-2"
                                style={{ color: settings.textColor }}
                              >
                                {settings.description || 'Your description here'}
                              </div>
                            </div>
                            {settings.socialLinks.length > 0 && (
                              <div className="flex gap-1 flex-wrap justify-center">
                                {settings.socialLinks.slice(0, 6).map((link: any, i: number) => (
                                  <div 
                                    key={i} 
                                    className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center"
                                  >
                                    <link.icon className="w-3 h-3 text-white" />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button
                      onClick={onPreview}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Full Preview
                    </Button>
                    <Button
                      onClick={() => navigator.clipboard.writeText(`https://stolen.bio/${settings.customLink}`)}
                      variant="outline"
                      className="w-full border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/30"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Upload Error Alert */}
          {uploadError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 right-4 z-50"
            >
              <Alert className="bg-red-900/20 border-red-500/30 backdrop-blur-sm">
                <AlertDescription className="text-red-300">{uploadError}</AlertDescription>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadError('')}
                  className="ml-2 text-red-300 hover:text-red-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </Alert>
            </motion.div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}