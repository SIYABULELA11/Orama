import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Bell, Palette, Globe, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [studentNumber, setStudentNumber] = useState("");
  const [studentNumberLocked, setStudentNumberLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reminderSound: true,
    reminderFrequency: "15",
    theme: "light",
    language: "en",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    defaultStudyDuration: "60",
    weekStartsOn: "monday",
    academicYear: "2025",
    semester: "1",
  });

  const applyTheme = (mode: string) => {
    const root = document.documentElement;
    if (mode === 'auto') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      if (mql.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Load student number from localStorage on mount
  useEffect(() => {
    const storedStudentNumber = localStorage.getItem('student_number');
    if (storedStudentNumber) {
      setStudentNumber(storedStudentNumber);
      setStudentNumberLocked(true);
      // Auto-load settings
      loadSettings(storedStudentNumber);
    }
  }, []);

  useEffect(() => {
    if (settings.theme !== 'auto') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('auto');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [settings.theme]);

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const loadSettings = async (studentNum: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/settings/${studentNum}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to load settings");
      }
      
      setSettings({
        emailNotifications: data.emailNotifications,
        smsNotifications: data.smsNotifications,
        pushNotifications: data.pushNotifications,
        reminderSound: data.reminderSound,
        reminderFrequency: data.reminderFrequency,
        theme: data.theme,
        language: data.language,
        dateFormat: data.dateFormat,
        timeFormat: data.timeFormat,
        defaultStudyDuration: data.defaultStudyDuration,
        weekStartsOn: data.weekStartsOn,
        academicYear: data.academicYear,
        semester: data.semester,
      });
    } catch (err: any) {
      console.error("Failed to fetch settings:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  type SettingsKey = keyof typeof settings;
  type SettingsValue = typeof settings[SettingsKey];

  const handleInputChange = (key: SettingsKey, value: SettingsValue) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLoadSettings = async () => {
    if (!studentNumber || studentNumber.trim() === "") {
      toast({
        title: "Student Number Required",
        description: "Please enter your student number to load settings.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('student_number', studentNumber);
    setStudentNumberLocked(true);
    
    await loadSettings(studentNumber);
    
    toast({
      title: "Settings Loaded",
      description: "Your settings have been loaded successfully.",
    });
  };

  const handleSave = async () => {
    if (!studentNumber || studentNumber.trim() === "") {
      toast({
        title: "Student Number Required",
        description: "Please enter your student number.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("http://localhost:5000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentNumber,
          ...settings
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save settings");
      }

      // Save to localStorage
      localStorage.setItem('student_number', studentNumber);
      setStudentNumberLocked(true);
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (err: any) {
      console.error("Error saving settings:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUnlock = () => {
    setStudentNumberLocked(false);
    setStudentNumber("");
    localStorage.removeItem('student_number');
    setSettings({
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      reminderSound: true,
      reminderFrequency: "15",
      theme: "light",
      language: "en",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "24h",
      defaultStudyDuration: "60",
      weekStartsOn: "monday",
      academicYear: "2025",
      semester: "1",
    });
  };

  if (loading && studentNumberLocked) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-orama-primary flex items-center gap-2 sm:gap-3">
            <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Customize your Orama experience</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
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
            className="bg-orama-primary hover:bg-orama-primary-light text-white w-full sm:w-auto text-sm"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Student Number Entry */}
      {!studentNumberLocked && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">Enter Your Student Number</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Enter your student number to load or save settings for your profile.
                </p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g., 12345678" 
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    className="max-w-xs"
                    onKeyPress={(e) => e.key === 'Enter' && handleLoadSettings()}
                  />
                  <Button 
                    onClick={handleLoadSettings}
                    disabled={loading}
                    className="bg-orama-primary hover:bg-orama-primary-light text-white"
                  >
                    {loading ? "Loading..." : "Load Settings"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Notification Settings */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-orama-primary text-white p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  disabled={!studentNumberLocked}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get text message alerts</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                  disabled={!studentNumberLocked}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
                  disabled={!studentNumberLocked}
                />
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reminderFrequency">Reminder Frequency</Label>
                  <Select 
                    value={settings.reminderFrequency} 
                    onValueChange={(value) => handleInputChange('reminderFrequency', value)}
                    disabled={!studentNumberLocked}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes before</SelectItem>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                      <SelectItem value="1440">1 day before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reminder Sound</Label>
                    <p className="text-sm text-muted-foreground">Play sound for alerts</p>
                  </div>
                  <Switch
                    checked={settings.reminderSound}
                    onCheckedChange={(checked) => handleInputChange('reminderSound', checked)}
                    disabled={!studentNumberLocked}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Settings */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-orama-primary text-white">
              <CardTitle className="flex items-center gap-3">
                <Globe className="h-5 w-5" />
                Academic Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select 
                    value={settings.academicYear} 
                    onValueChange={(value) => handleInputChange('academicYear', value)}
                    disabled={!studentNumberLocked}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="semester">Current Semester</Label>
                  <Select 
                    value={settings.semester} 
                    onValueChange={(value) => handleInputChange('semester', value)}
                    disabled={!studentNumberLocked}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">First Semester</SelectItem>
                      <SelectItem value="2">Second Semester</SelectItem>
                      <SelectItem value="summer">Summer Session</SelectItem>
                      <SelectItem value="winter">Winter Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="defaultStudyDuration">Default Study Session Duration</Label>
                  <Select 
                    value={settings.defaultStudyDuration} 
                    onValueChange={(value) => handleInputChange('defaultStudyDuration', value)}
                    disabled={!studentNumberLocked}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25 minutes (Pomodoro)</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="weekStartsOn">Week Starts On</Label>
                  <Select 
                    value={settings.weekStartsOn} 
                    onValueChange={(value) => handleInputChange('weekStartsOn', value)}
                    disabled={!studentNumberLocked}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-orama-primary text-white">
              <CardTitle className="flex items-center gap-3">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => handleInputChange('theme', value)}
                  disabled={!studentNumberLocked}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => handleInputChange('language', value)}
                  disabled={!studentNumberLocked}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="af">Afrikaans</SelectItem>
                    <SelectItem value="zu">Zulu</SelectItem>
                    <SelectItem value="xh">Xhosa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select 
                  value={settings.dateFormat} 
                  onValueChange={(value) => handleInputChange('dateFormat', value)}
                  disabled={!studentNumberLocked}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeFormat">Time Format</Label>
                <Select 
                  value={settings.timeFormat} 
                  onValueChange={(value) => handleInputChange('timeFormat', value)}
                  disabled={!studentNumberLocked}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 Hour</SelectItem>
                    <SelectItem value="24h">24 Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {studentNumberLocked && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-green-600 font-medium">
                    ✓ Settings linked to student: {studentNumber}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;