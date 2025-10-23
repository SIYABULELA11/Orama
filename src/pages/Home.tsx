import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { BookOpen, HelpCircle } from "lucide-react";
import { useOutletContext } from "react-router-dom";

interface OutletContext {
  onStartChat: () => void;
}

const Home = () => {
  const { onStartChat } = useOutletContext<OutletContext>();
  return (
    <div className="space-y-8">
      {/* Main Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-orama-primary mb-4">
          ORAMA
        </h1>
        <p className="text-xl text-muted-foreground">
          Your complete academic scheduling and planning solution
        </p>
      </div>

      {/* Quick Tutorial Section */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orama-primary text-white">
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="h-6 w-6" />
            Quick Tutorial Guide
          </CardTitle>
          <CardDescription className="text-orama-light-blue">
            Learn how to use this platform effectively
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-orama-primary">Getting Started</h3>
              <ul className="space-y-2 text-sm">
                <li>• Set up your class schedule in "My Schedules"</li>
                <li>• Create study plans using "Study Planner"</li>
                <li>• Set important reminders for assignments</li>
                <li>• Track upcoming deadlines</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-orama-primary">Advanced Features</h3>
              <ul className="space-y-2 text-sm">
                <li>• Use AI Assistant for personalized help</li>
                <li>• Customize settings for your preferences</li>
                <li>• Access FAQ for common questions</li>
                <li>• Get support when you need it</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Need Help Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-orama-primary">
              <BookOpen className="h-6 w-6" />
              Help Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-orama-primary pl-4">
                <h4 className="font-semibold text-orama-primary mb-1">How to Create Your Schedule</h4>
                <p className="text-sm text-muted-foreground">Learn to set up your class timetable and manage events effectively.</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-blue-600 mb-1">Study Planning Tips</h4>
                <p className="text-sm text-muted-foreground">Organize your study sessions and maximize your productivity.</p>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-green-600 mb-1">Managing Deadlines</h4>
                <p className="text-sm text-muted-foreground">Never miss an assignment with our deadline tracking features.</p>
              </div>
              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-semibold text-orange-600 mb-1">Using AI Assistant</h4>
                <p className="text-sm text-muted-foreground">Get personalized help and recommendations from our AI.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orama-primary text-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <img src="/icon/icon.png" alt="Ora" className="h-6 w-6" style={{mixBlendMode: 'multiply'}} />
              Chat to our AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orama-light-blue mb-4">
              Get instant help with scheduling, study planning, and academic organization. 
              Our AI is available 24/7 to assist you.
            </p>
            <Button 
              variant="secondary" 
              className="bg-white text-orama-primary hover:bg-gray-100"
              onClick={onStartChat}
            >
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer Links */}
      <div className="text-center pt-8 border-t border-gray-200">
        <div className="flex justify-center gap-8 text-sm text-muted-foreground">
          <a href="#" className="hover:text-orama-primary orama-transition">Our Team</a>
          <span>•</span>
          <a href="#" className="hover:text-orama-primary orama-transition">Privacy & Terms</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
