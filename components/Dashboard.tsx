import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Plus, Trash2, Upload, Eye, Settings, Palette, Link, Save, LogOut, Loader2 } from "lucide-react";
import { BiolinkPage } from "./BiolinkPage";
import { api, Profile } from "../utils/api";
import { getSupabaseClient } from "../utils/supabase/client";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

interface DashboardProps {
  accessToken: string;
  initialProfile: Profile;
  onSignOut: () => void;
}

export function Dashboard({ accessToken, initialProfile, onSignOut }: DashboardProps) {
  const [userData, setUserData] = useState<Profile>(initialProfile);
  const [newLink, setNewLink] = useState({ platform: '', url: '' });
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const updateUserData = (updates: Partial<Profile>) => {
    setUserData(prev => ({ ...prev, ...updates }));
  };

  const addSocialLink = () => {
    if (newLink.platform && newLink.url) {
      const link: SocialLink = {
        id: Date.now().toString(),
        platform: newLink.platform,
        url: newLink.url,
        icon: ''
      };
      updateUserData({
        socialLinks: [...userData.socialLinks, link]
      });
      setNewLink({ platform: '', url: '' });
    }
  };

  const removeSocialLink = (id: string) => {
    updateUserData({
      socialLinks: userData.socialLinks.filter(link => link.id !== id)
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video/') ? 'video' : 
                   file.type === 'image/gif' ? 'gif' : 'image';
      updateUserData({
        backgroundMedia: url,
        backgroundType: type
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    
    try {
      const { profile } = await api.updateProfile(accessToken, userData);
      setUserData(profile);
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      console.error('Save error:', error);
      setSaveMessage(`Error: ${error.message}`);
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
      onSignOut();
    } catch (error) {
      console.error('Sign out error:', error);
      onSignOut(); // Sign out anyway
    }
  };

  if (showPreview) {
    return (
      <div className="relative">
        <Button
          onClick={() => setShowPreview(false)}
          className="fixed top-4 left-4 z-30 bg-black/50 backdrop-blur-sm"
          variant="secondary"
        >
          ← Back to Dashboard
        </Button>
        <BiolinkPage {...userData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Customize your biolink page: /{userData.username}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {saveMessage && (
          <div className={`mb-4 p-3 rounded ${
            saveMessage.startsWith('Error') 
              ? 'bg-destructive/10 text-destructive' 
              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
          }`}>
            {saveMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Profile Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={userData.username}
                        disabled
                        placeholder="Your username"
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Username cannot be changed after account creation
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        value={userData.avatar}
                        onChange={(e) => updateUserData({ avatar: e.target.value })}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={userData.description}
                        onChange={(e) => updateUserData({ description: e.target.value })}
                        placeholder="Tell people about yourself..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Badges (Admin assigned)</Label>
                      <div className="flex flex-wrap gap-2">
                        {userData.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary">
                            {badge}
                          </Badge>
                        ))}
                        {userData.badges.length === 0 && (
                          <p className="text-sm text-muted-foreground">No badges assigned</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Design Customization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accentColor"
                          type="color"
                          value={userData.accentColor || '#ffffff'}
                          onChange={(e) => updateUserData({ accentColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={userData.accentColor || '#ffffff'}
                          onChange={(e) => updateUserData({ accentColor: e.target.value })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="textColor"
                          type="color"
                          value={userData.textColor || '#ffffff'}
                          onChange={(e) => updateUserData({ textColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={userData.textColor || '#ffffff'}
                          onChange={(e) => updateUserData({ textColor: e.target.value })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="links" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      Social Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {userData.socialLinks.map((link) => (
                        <div key={link.id} className="flex items-center gap-2 p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium capitalize">{link.platform}</p>
                            <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                          </div>
                          <Button
                            onClick={() => removeSocialLink(link.id)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Platform (e.g., twitter)"
                          value={newLink.platform}
                          onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                        />
                        <Input
                          placeholder="URL"
                          value={newLink.url}
                          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        />
                        <Button onClick={addSocialLink}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Background Media
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="background">Upload Background (.gif, .mp4, .png)</Label>
                      <Input
                        id="background"
                        type="file"
                        accept=".gif,.mp4,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                    </div>

                    {userData.backgroundMedia && (
                      <div className="space-y-2">
                        <Label>Current Background</Label>
                        <div className="border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">
                            Type: {userData.backgroundType}
                          </p>
                          {userData.backgroundType === 'video' ? (
                            <video
                              src={userData.backgroundMedia}
                              className="w-full h-32 object-cover rounded mt-2"
                              muted
                              loop
                            />
                          ) : (
                            <img
                              src={userData.backgroundMedia}
                              alt="Background preview"
                              className="w-full h-32 object-cover rounded mt-2"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Mini Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  See how your biolink page will look
                </p>
              </CardHeader>
              <CardContent>
                <div className="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-gray-800">
                    <div className="flex items-center justify-center h-full">
                      <div 
                        className="bg-black/90 rounded-xl p-4 w-48 h-72 flex flex-col items-center justify-center text-white text-xs space-y-2"
                        style={{
                          transform: 'perspective(400px) rotateX(2deg) rotateY(-1deg)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
                        }}
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={userData.avatar} />
                          <AvatarFallback>{userData.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-center">{userData.username}</p>
                        {userData.badges.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {userData.badges.slice(0, 2).map((badge, i) => (
                              <span key={i} className="px-1 py-0.5 bg-white/20 rounded text-xs">
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-center text-xs opacity-80 px-2 line-clamp-3">
                          {userData.description}
                        </p>
                        <div className="flex gap-1 mt-auto">
                          {userData.socialLinks.slice(0, 4).map((link, i) => (
                            <div key={i} className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">
                              🔗
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowPreview(true)}
                  className="w-full mt-4"
                  variant="outline"
                >
                  Full Preview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}