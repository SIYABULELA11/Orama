import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Accessibility as AccessibilityIcon, Save, Eye, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Accessibility = () => {
  const { toast } = useToast();
  const [studentNumber, setStudentNumber] = useState("");
  const [studentNumberLocked, setStudentNumberLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [a11y, setA11y] = useState({
    highContrast: false,
    textSize: "medium",
    reducedMotion: false,
    dyslexiaFont: false,
    focusOutline: true,
    screenReaderAnnouncements: true,
  });

  type A11yKey = keyof typeof a11y;
  type A11yValue = typeof a11y[A11yKey];

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

  const loadSettings = async (studentNum: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/accessibility/${studentNum}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to load accessibility settings");
      }
      
      setA11y({
        highContrast: data.highContrast,
        textSize: data.textSize,
        reducedMotion: data.reducedMotion,
        dyslexiaFont: data.dyslexiaFont,
        focusOutline: data.focusOutline,
        screenReaderAnnouncements: data.screenReaderAnnouncements,
      });
    } catch (err: any) {
      console.error("Failed to fetch accessibility settings:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load accessibility settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: A11yKey, value: A11yValue) => {
    setA11y(prev => ({ ...prev, [key]: value }));
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
      description: "Your accessibility settings have been loaded successfully.",
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
      const response = await fetch("http://localhost:5000/api/accessibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentNumber,
          ...a11y
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save accessibility settings");
      }

      // Save to localStorage
      localStorage.setItem('student_number', studentNumber);
      setStudentNumberLocked(true);
      
      toast({
        title: "Accessibility Settings Saved",
        description: "Your accessibility preferences have been updated.",
      });
    } catch (err: any) {
      console.error("Error saving accessibility settings:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to save accessibility settings.",
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
    setA11y({
      highContrast: false,
      textSize: "medium",
      reducedMotion: false,
      dyslexiaFont: false,
      focusOutline: true,
      screenReaderAnnouncements: true,
    });
  };

  if (loading && studentNumberLocked) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading accessibility settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orama-primary flex items-center gap-3">
            <AccessibilityIcon className="h-8 w-8" />
            Accessibility
          </h1>
          <p className="text-muted-foreground mt-2">Adjust the interface for better usability and comfort</p>
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

      {/* Student Number Entry */}
      {!studentNumberLocked && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">Enter Your Student Number</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Enter your student number to load or save accessibility settings for your profile.
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Visual Preferences */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-orama-primary text-white">
              <CardTitle className="flex items-center gap-3">
                <Eye className="h-5 w-5" />
                Visual Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch 
                  checked={a11y.highContrast} 
                  onCheckedChange={(c) => handleChange('highContrast', c)}
                  disabled={!studentNumberLocked}
                />
              </div>
              <Separator />
              <div>
                <Label htmlFor="textSize">Text Size</Label>
                <Select 
                  value={a11y.textSize} 
                  onValueChange={(v) => handleChange('textSize', v as A11yValue)}
                  disabled={!studentNumberLocked}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="xlarge">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">Disable most animations</p>
                </div>
                <Switch 
                  checked={a11y.reducedMotion} 
                  onCheckedChange={(c) => handleChange('reducedMotion', c)}
                  disabled={!studentNumberLocked}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dyslexia-Friendly Font</Label>
                  <p className="text-sm text-muted-foreground">Use a more readable font</p>
                </div>
                <Switch 
                  checked={a11y.dyslexiaFont} 
                  onCheckedChange={(c) => handleChange('dyslexiaFont', c)}
                  disabled={!studentNumberLocked}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Focus Outline</Label>
                  <p className="text-sm text-muted-foreground">Show outlines when navigating with keyboard</p>
                </div>
                <Switch 
                  checked={a11y.focusOutline} 
                  onCheckedChange={(c) => handleChange('focusOutline', c)}
                  disabled={!studentNumberLocked}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Screen Reader Announcements</Label>
                  <p className="text-sm text-muted-foreground">Enable ARIA live region messages</p>
                </div>
                <Switch 
                  checked={a11y.screenReaderAnnouncements} 
                  onCheckedChange={(c) => handleChange('screenReaderAnnouncements', c)}
                  disabled={!studentNumberLocked}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-orama-primary text-white">
              <CardTitle className="flex items-center gap-3">
                <AccessibilityIcon className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-sm">
              <p className="text-muted-foreground">Current settings:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Text Size: {a11y.textSize}</li>
                <li>{a11y.highContrast ? 'High contrast colors enabled' : 'Standard contrast'}</li>
                <li>{a11y.reducedMotion ? 'Animations minimized' : 'Animations active'}</li>
                <li>{a11y.dyslexiaFont ? 'Readable font on' : 'Default font'}</li>
                <li>{a11y.focusOutline ? 'Focus outlines visible' : 'Focus outlines hidden'}</li>
                <li>{a11y.screenReaderAnnouncements ? 'Live announcements on' : 'Announcements off'}</li>
              </ul>
              {studentNumberLocked && (
                <p className="text-xs text-green-600 font-medium mt-4">
                  ✓ Settings linked to student: {studentNumber}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;