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
    <div className="space-y-6 sm:space-y-8">
      {/* Main Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-orama-primary mb-3 sm:mb-4">
          ORAMA
        </h1>
        <p className="text-base sm:text-xl text-muted-foreground px-4">
          Your complete academic scheduling and planning solution
        </p>
      </div>

      {/* Quick Tutorial Section */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orama-primary text-white p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            Quick Tutorial Guide
          </CardTitle>
          <CardDescription className="text-orama-light-blue text-sm sm:text-base">
            Learn how to use this platform effectively
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-semibold mb-2 sm:mb-3 text-orama-primary text-sm sm:text-base">Getting Started</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>• Set up your class schedule in "My Schedules"</li>
                <li>• Create study plans using "Study Planner"</li>
                <li>• Set important reminders for assignments</li>
                <li>• Track upcoming deadlines</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 sm:mb-3 text-orama-primary text-sm sm:text-base">Advanced Features</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
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
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-white shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-orama-primary text-base sm:text-lg">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
              Help Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
            <div className="space-y-2 sm:space-y-3">
              <div className="border-l-4 border-orama-primary pl-3 sm:pl-4">
                <h4 className="font-semibold text-orama-primary mb-1 text-sm sm:text-base">How to Create Your Schedule</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Learn to set up your class timetable and manage events effectively.</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-3 sm:pl-4">
                <h4 className="font-semibold text-blue-600 mb-1 text-sm sm:text-base">Study Planning Tips</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Organize your study sessions and maximize your productivity.</p>
              </div>
              <div className="border-l-4 border-green-400 pl-3 sm:pl-4">
                <h4 className="font-semibold text-green-600 mb-1 text-sm sm:text-base">Managing Deadlines</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Never miss an assignment with our deadline tracking features.</p>
              </div>
              <div className="border-l-4 border-orange-400 pl-3 sm:pl-4">
                <h4 className="font-semibold text-orange-600 mb-1 text-sm sm:text-base">Using AI Assistant</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Get personalized help and recommendations from our AI.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orama-primary text-white shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
              <img src="/icon/icon.png" alt="Ora" className="h-5 w-5 sm:h-6 sm:w-6" style={{mixBlendMode: 'multiply'}} />
              Chat to our AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-orama-light-blue mb-4 text-xs sm:text-sm">
              Get instant help with scheduling, study planning, and academic organization. 
              Our AI is available 24/7 to assist you.
            </p>
            <Button 
              variant="secondary" 
              className="bg-white text-orama-primary hover:bg-gray-100 w-full sm:w-auto text-sm"
              onClick={onStartChat}
            >
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer Links */}
      <div className="text-center pt-6 sm:pt-8 border-t border-gray-200">
        <div className="flex justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
          <a href="#" className="hover:text-orama-primary orama-transition">Our Team</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
