import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Accessibility as AccessibilityIcon, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Accessibility = () => {
  const { toast } = useToast();
  const [a11y, setA11y] = useState({
    highContrast: false,
    textSize: "medium", // small | medium | large | xlarge
    reducedMotion: false,
    dyslexiaFont: false,
    focusOutline: true,
    screenReaderAnnouncements: true,
  });

  type A11yKey = keyof typeof a11y;
  type A11yValue = typeof a11y[A11yKey];

  const handleChange = (key: A11yKey, value: A11yValue) => {
    setA11y(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Accessibility Settings Saved",
      description: "Your accessibility preferences have been updated.",
    });
  };

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
        <Button onClick={handleSave} className="bg-orama-primary hover:bg-orama-primary-light text-white">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

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
                <Switch checked={a11y.highContrast} onCheckedChange={(c) => handleChange('highContrast', c)} />
              </div>
              <Separator />
              <div>
                <Label htmlFor="textSize">Text Size</Label>
                <Select value={a11y.textSize} onValueChange={(v) => handleChange('textSize', v as A11yValue)}>
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
                <Switch checked={a11y.reducedMotion} onCheckedChange={(c) => handleChange('reducedMotion', c)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dyslexia-Friendly Font</Label>
                  <p className="text-sm text-muted-foreground">Use a more readable font</p>
                </div>
                <Switch checked={a11y.dyslexiaFont} onCheckedChange={(c) => handleChange('dyslexiaFont', c)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Focus Outline</Label>
                  <p className="text-sm text-muted-foreground">Show outlines when navigating with keyboard</p>
                </div>
                <Switch checked={a11y.focusOutline} onCheckedChange={(c) => handleChange('focusOutline', c)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Screen Reader Announcements</Label>
                  <p className="text-sm text-muted-foreground">Enable ARIA live region messages</p>
                </div>
                <Switch checked={a11y.screenReaderAnnouncements} onCheckedChange={(c) => handleChange('screenReaderAnnouncements', c)} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-orama-primary text-white">
              <CardTitle className="flex items-center gap-3">
                <AccessibilityIcon className="h-5 w-5" />
                Live Preview (Concept)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-sm">
              <p className="text-muted-foreground">This panel illustrates how your settings could affect the UI.</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Text Size: {a11y.textSize}</li>
                <li>{a11y.highContrast ? 'High contrast colors enabled' : 'Standard contrast'}</li>
                <li>{a11y.reducedMotion ? 'Animations minimized' : 'Animations active'}</li>
                <li>{a11y.dyslexiaFont ? 'Readable font on' : 'Default font'}</li>
                <li>{a11y.focusOutline ? 'Focus outlines visible' : 'Focus outlines hidden'}</li>
                <li>{a11y.screenReaderAnnouncements ? 'Live announcements on' : 'Announcements off'}</li>
              </ul>
              <p className="text-xs text-muted-foreground">(Future enhancement: persist these settings and apply globally)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
