import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Bot, Send, MessageSquare, Lightbulb, Calendar, BookOpen, Clock, Zap } from "lucide-react";
import oraIcon from "/icon/icon.png";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'suggestion' | 'reminder' | 'tip';
}

interface Suggestion {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Ora, your AI Assistant for Orama. I can help you with study planning, deadline management, scheduling optimization, and academic guidance. What would you like assistance with today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  const quickSuggestions: Suggestion[] = [
    {
      id: 1,
      title: "Create Study Schedule",
      description: "Generate an optimized study plan based on your subjects and deadlines",
      icon: Calendar,
      category: "Planning"
    },
    {
      id: 2,
      title: "Deadline Reminders",
      description: "Set smart reminders for upcoming assignments and exams",
      icon: Clock,
      category: "Reminders"
    },
    {
      id: 3,
      title: "Study Tips",
      description: "Get personalized study techniques and productivity tips",
      icon: Lightbulb,
      category: "Tips"
    },
    {
      id: 4,
      title: "Subject Guidance",
      description: "Ask for help with specific subjects or topics",
      icon: BookOpen,
      category: "Academic"
    }
  ];

  const recentInteractions = [
    "How can I better manage my calculus study schedule?",
    "Set a reminder for my physics exam next week",
    "What's the best way to prepare for multiple exams?",
    "Help me organize my assignment priorities"
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    // Simulate AI response based on input
    let botResponse = "I understand you're asking about: " + inputValue + ". ";
    
    if (inputValue.toLowerCase().includes('schedule')) {
      botResponse += "I can help you create an optimized study schedule. Would you like me to analyze your current courses and suggest time blocks for each subject? I can also factor in your upcoming deadlines and preferred study times.";
    } else if (inputValue.toLowerCase().includes('reminder')) {
      botResponse += "I can set up smart reminders for you. Just tell me what you need to be reminded about and when, and I'll make sure you never miss an important deadline or study session.";
    } else if (inputValue.toLowerCase().includes('study')) {
      botResponse += "Here are some evidence-based study techniques I recommend: 1) Use the Pomodoro Technique (25-min focused sessions), 2) Practice active recall instead of passive reading, 3) Space out your learning over time, and 4) Use the Feynman Technique to test your understanding.";
    } else {
      botResponse += "I'm here to help with scheduling, study planning, deadline management, and academic guidance. Feel free to ask me about any aspect of your academic organization!";
    }

    const aiMessage: Message = {
      id: messages.length + 2,
      text: botResponse,
      isBot: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
    setInputValue("");
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInputValue(suggestion.title);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orama-primary flex items-center gap-3">
            <img src={oraIcon} alt="Ora" className="h-8 w-8 object-contain mix-blend-multiply" />
            Ora AI Assistant
          </h1>
          <p className="text-muted-foreground mt-2">Your intelligent study companion and scheduling advisor</p>
        </div>
        <Badge className="bg-orama-primary/10 text-orama-primary border-orama-primary/20">
          <Zap className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-lg h-[600px] flex flex-col">
            <CardHeader className="bg-orama-primary text-white">
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5" />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-orama-primary text-white'
                    }`}
                  >
                    {message.isBot && (
                      <div className="flex items-center gap-2 mb-2">
                        <img src={oraIcon} alt="Ora" className="h-4 w-4 object-contain mix-blend-multiply" />
                        <span className="text-xs font-semibold">Ora</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-2 opacity-70`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about scheduling, studying, or deadlines..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-orama-primary hover:bg-orama-primary-light text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar with suggestions and info */}
        <div className="space-y-6">
          {/* Quick Suggestions */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-orama-primary flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickSuggestions.map((suggestion) => {
                const IconComponent = suggestion.icon;
                return (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-orama-primary hover:text-white transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-5 w-5 mt-0.5 text-orama-primary group-hover:text-white" />
                      <div>
                        <h4 className="font-medium text-sm">{suggestion.title}</h4>
                        <p className="text-xs text-muted-foreground group-hover:text-orama-light-blue mt-1">
                          {suggestion.description}
                        </p>
                        <Badge 
                          variant="outline" 
                          className="mt-2 text-xs border-orama-primary/30 text-orama-primary group-hover:border-white group-hover:text-white"
                        >
                          {suggestion.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Interactions */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-orama-primary flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentInteractions.map((interaction, index) => (
                <div
                  key={index}
                  onClick={() => setInputValue(interaction)}
                  className="p-2 text-sm text-muted-foreground hover:text-orama-primary cursor-pointer hover:bg-gray-50 rounded transition-colors"
                >
                  "{interaction}"
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card className="bg-orama-primary text-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <img src={oraIcon} alt="Ora" className="h-5 w-5 object-contain mix-blend-multiply" />
                What I Can Help With
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Create optimized study schedules</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Set intelligent reminders</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Provide study techniques & tips</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span>Analyze your academic patterns</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
