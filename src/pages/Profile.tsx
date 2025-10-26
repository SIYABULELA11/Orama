import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Save, Image as ImageIcon, AlertCircle } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [studentNumberLocked, setStudentNumberLocked] = useState(false);

  type ProfileKey = keyof typeof profile;
  type ProfileValue = typeof profile[ProfileKey];

  const handleInputChange = (key: ProfileKey, value: ProfileValue) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  // Fetch profile when student number is provided
  const handleLoadProfile = async () => {
    if (!profile.studentNumber || profile.studentNumber.trim() === "") {
      toast({
        title: "Student Number Required",
        description: "Please enter your student number to load your profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/profile/${profile.studentNumber}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to load profile");
      }
      
      setProfile(data);
      setStudentNumberLocked(true);
      
      toast({
        title: "Profile Loaded",
        description: "Your profile has been loaded successfully.",
      });
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile.studentNumber || profile.studentNumber.trim() === "") {
      toast({
        title: "Student Number Required",
        description: "Please enter your student number.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save profile");
      }

      setStudentNumberLocked(true);
      
      toast({
        title: "Profile Saved",
        description: "Your profile information has been updated.",
      });
    } catch (err: any) {
      console.error("Error saving profile:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to save profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUnlock = () => {
    setStudentNumberLocked(false);
    setProfile({
      fullName: "",
      email: "",
      studentNumber: "",
      phone: "",
      bio: "",
      profileVisibility: "private",
      shareStudyProgress: false,
      allowAnalytics: true,
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
        <div className="flex gap-2">
          {studentNumberLocked && (
            <Button 
              onClick={handleUnlock} 
              variant="outline"
              className="border-orama-primary text-orama-primary hover:bg-orama-primary/10"
            >
              Change Student Number
            </Button>
          )}
          <Button 
            onClick={handleSave} 
            disabled={saving || !studentNumberLocked}
            className="bg-orama-primary hover:bg-orama-primary-light text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Student Number Entry/Lock */}
      {!studentNumberLocked && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">Enter Your Student Number</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Your student number is used as your unique identifier. Enter it to load or create your profile.
                </p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g., 12345678" 
                    value={profile.studentNumber}
                    onChange={(e) => handleInputChange('studentNumber', e.target.value)}
                    className="max-w-xs"
                    onKeyPress={(e) => e.key === 'Enter' && handleLoadProfile()}
                  />
                  <Button 
                    onClick={handleLoadProfile}
                    disabled={loading}
                    className="bg-orama-primary hover:bg-orama-primary-light text-white"
                  >
                    {loading ? "Loading..." : "Load Profile"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                  <Input 
                    id="fullName" 
                    value={profile.fullName} 
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    disabled={!studentNumberLocked}
                  />
                </div>
                <div>
                  <Label htmlFor="studentNumber">Student Number</Label>
                  <Input 
                    id="studentNumber" 
                    value={profile.studentNumber} 
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!studentNumberLocked}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={profile.phone} 
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!studentNumberLocked}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={profile.bio} 
                  onChange={(e) => handleInputChange('bio', e.target.value)} 
                  rows={3}
                  disabled={!studentNumberLocked}
                />
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
                <Select 
                  value={profile.profileVisibility} 
                  onValueChange={(value) => handleInputChange('profileVisibility', value)}
                  disabled={!studentNumberLocked}
                >
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
                <Switch 
                  checked={profile.shareStudyProgress} 
                  onCheckedChange={(c) => handleInputChange('shareStudyProgress', c)}
                  disabled={!studentNumberLocked}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">Help improve our service</p>
                </div>
                <Switch 
                  checked={profile.allowAnalytics} 
                  onCheckedChange={(c) => handleInputChange('allowAnalytics', c)}
                  disabled={!studentNumberLocked}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;