import { useState } from "react";
import { Button } from "@components//ui/button";
import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Avatar } from "@components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Badge } from "@components/ui/badge";
import { 
  Upload, 
  User, 
  Link, 
  Check, 
  Twitter,
  Github,
  Globe,
  Mail,
  Sparkles
} from "lucide-react";

interface CreatePageModalProps {
  onClose: () => void;
}

export function CreatePageModal({ onClose }: CreatePageModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: "",
    pageUrl: "",
    socialLinks: {
      twitter: "",
      github: "",
      website: "",
      email: ""
    }
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    // Create page logic
    console.log("Creating page with data:", formData);
    onClose();
  };

  const generatePageUrl = () => {
    const url = formData.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    setFormData(prev => ({ ...prev, pageUrl: url }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          {/* <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div> */}
          <img src="/back-square-logo.png" alt="Back Logo" className="h-20 mx-auto mb-4" />
          <h1 className="text-2xl mb-2">Create Your Builder Page</h1>
          <p className="text-gray-600">
            Set up your profile to start receiving confidential donations from the community
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step >= stepNum ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepNum ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-12 h-0.5 ${step > stepNum ? 'bg-black' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {step === 1 && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl mb-2">Basic Information</h2>
                <p className="text-gray-600">Tell us about yourself and your work</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell your story... What are you building? What drives you?"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">This will be shown on your public page</p>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl mb-2">Profile & URL</h2>
                <p className="text-gray-600">Choose your avatar and page URL</p>
              </div>
              
              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Avatar
                  </Button>
                </div>

                {/* Page URL */}
                <div>
                  <Label htmlFor="pageUrl">Your Page URL</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">back.crypto/</span>
                    <Input
                      id="pageUrl"
                      placeholder="your-username"
                      value={formData.pageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, pageUrl: e.target.value }))}
                    />
                    <Button variant="outline" size="sm" onClick={generatePageUrl}>
                      Generate
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">This will be your unique page URL</p>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl mb-2">Social Links</h2>
                <p className="text-gray-600">Connect your social profiles (optional)</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="flex items-center space-x-2">
                    <Twitter className="h-4 w-4 text-gray-400" />
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

              {/* Preview */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-4">Preview</h3>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <h4 className="font-medium">{formData.name || "Your Name"}</h4>
                  <p className="text-sm text-gray-600 mt-1">{formData.bio || "Your bio will appear here"}</p>
                  <Badge variant="secondary" className="mt-2">back.crypto/{formData.pageUrl || "username"}</Badge>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          
          {step < 3 ? (
            <Button 
              onClick={handleNext}
              disabled={!formData.name || (step === 2 && !formData.pageUrl)}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              Create My Page
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}