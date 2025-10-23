import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Save, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    studentNumber: "",
    phone: "",
    bio: "",
    profileVisibility: "private",
    shareStudyProgress: false,
    allowAnalytics: true,
  });

  type ProfileKey = keyof typeof profile;
  type ProfileValue = typeof profile[ProfileKey];

  const handleInputChange = (key: ProfileKey, value: ProfileValue) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Profile Saved",
      description: "Your profile information has been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orama-primary flex items-center gap-3">
            <User className="h-8 w-8" />
            Profile
          </h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and visibility</p>
        </div>
        <Button onClick={handleSave} className="bg-orama-primary hover:bg-orama-primary-light text-white">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-orama-primary text-white">
              <CardTitle className="flex items-center gap-3">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Profile Picture (coming soon)</p>
                  <p className="text-xs">We'll allow uploading an avatar in a future update.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={profile.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="studentNumber">Student Number</Label>
                  <Input id="studentNumber" value={profile.studentNumber} onChange={(e) => handleInputChange('studentNumber', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={profile.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={profile.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={profile.bio} onChange={(e) => handleInputChange('bio', e.target.value)} rows={3} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {/* Privacy & Security */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-orama-primary text-white">
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select value={profile.profileVisibility} onValueChange={(value) => handleInputChange('profileVisibility', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Share Study Progress</Label>
                  <p className="text-sm text-muted-foreground">Let others see your achievements</p>
                </div>
                <Switch checked={profile.shareStudyProgress} onCheckedChange={(c) => handleInputChange('shareStudyProgress', c)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">Help improve our service</p>
                </div>
                <Switch checked={profile.allowAnalytics} onCheckedChange={(c) => handleInputChange('allowAnalytics', c)} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
