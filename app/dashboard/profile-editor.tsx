import { useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Avatar } from "@components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Switch } from "@components/ui/switch";
import { Card } from "@components/ui/card";
import { 
  Upload, 
  Save, 
  X,
  Twitter,
  Github,
  Globe,
  Mail,
  Eye,
  Settings,
  Palette,
  Shield
} from "lucide-react";

interface ProfileEditorProps {
  profile: any;
  onClose: () => void;
  onSave: (profile: any) => void;
}

export function ProfileEditor({ profile, onClose, onSave }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio,
    avatar: profile.avatar,
    socialLinks: { ...profile.socialLinks },
    settings: {
      showDonationAmount: true,
      showRecentDonors: false,
      allowMessages: true,
      minDonation: 0.01,
      publicPage: true
    }
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={6}
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
                </div>
              </div>

              <div>
                <Label>Profile Picture</Label>
                <div className="mt-2 flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <img src={formData.avatar} alt={formData.name} />
                  </Avatar>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New
                    </Button>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <Card className="p-6 bg-gray-50">
              <h3 className="text-sm font-medium mb-4 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </h3>
              <div className="text-center max-w-md mx-auto">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <img src={formData.avatar} alt={formData.name} />
                </Avatar>
                <h4 className="text-xl mb-2">{formData.name}</h4>
                <p className="text-gray-600 text-sm">{formData.bio}</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6 mt-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <div className="flex items-center space-x-2">
                  <Twitter className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">@</span>
                  <Input
                    id="twitter"
                    placeholder="username"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="github">GitHub</Label>
                <div className="flex items-center space-x-2">
                  <Github className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">github.com/</span>
                  <Input
                    id="github"
                    placeholder="username"
                    value={formData.socialLinks.github}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, github: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    placeholder="https://your-website.com"
                    value={formData.socialLinks.website}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, website: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Contact Email</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    placeholder="your@email.com"
                    type="email"
                    value={formData.socialLinks.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, email: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4 flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Page Appearance
                </h3>
                <p className="text-gray-600 mb-4">Customize how your page looks to visitors</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Theme</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div className="p-3 border-2 border-black rounded-lg cursor-pointer">
                        <div className="h-16 bg-white border rounded mb-2"></div>
                        <p className="text-xs text-center">Light</p>
                      </div>
                      <div className="p-3 border-2 border-gray-200 rounded-lg cursor-pointer">
                        <div className="h-16 bg-gray-900 rounded mb-2"></div>
                        <p className="text-xs text-center">Dark</p>
                      </div>
                      <div className="p-3 border-2 border-gray-200 rounded-lg cursor-pointer">
                        <div className="h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded mb-2"></div>
                        <p className="text-xs text-center">Gradient</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Accent Color</Label>
                    <div className="mt-2 grid grid-cols-6 gap-2">
                      {['bg-black', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500'].map((color) => (
                        <div key={color} className={`w-10 h-10 ${color} rounded-lg cursor-pointer border-2 border-gray-200`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Privacy Settings
                </h3>
                <p className="text-gray-600 mb-6">Control what information is visible on your page</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Show Donation Amounts</h4>
                    <p className="text-sm text-gray-600">Display individual donation amounts on your page</p>
                  </div>
                  <Switch 
                    checked={formData.settings.showDonationAmount}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, showDonationAmount: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Show Recent Donors</h4>
                    <p className="text-sm text-gray-600">Display list of recent supporters (non-anonymous only)</p>
                  </div>
                  <Switch 
                    checked={formData.settings.showRecentDonors}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, showRecentDonors: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Allow Messages</h4>
                    <p className="text-sm text-gray-600">Let supporters include messages with donations</p>
                  </div>
                  <Switch 
                    checked={formData.settings.allowMessages}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, allowMessages: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Public Page</h4>
                    <p className="text-sm text-gray-600">Make your page discoverable in search</p>
                  </div>
                  <Switch 
                    checked={formData.settings.publicPage}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, publicPage: checked }
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="minDonation">Minimum Donation (ETH)</Label>
                  <Input
                    id="minDonation"
                    type="number"
                    step="0.001"
                    value={formData.settings.minDonation}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, minDonation: parseFloat(e.target.value) }
                    }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">Set minimum amount for donations</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}