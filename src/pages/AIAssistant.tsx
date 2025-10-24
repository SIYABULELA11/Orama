import { useState, useRef, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive - only scroll the container
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const quickSuggestions: Suggestion[] = [
    {
      id: 1,
      title: "Create a study schedule for my exams",
      description: "Generate an optimized study plan based on your subjects and deadlines",
      icon: Calendar,
      category: "Planning"
    },
    {
      id: 2,
      title: "Show my upcoming tasks and deadlines",
      description: "View all tasks and reminders for the next week",
      icon: Clock,
      category: "Reminders"
    },
    {
      id: 3,
      title: "Give me study tips for better focus",
      description: "Get personalized study techniques and productivity tips",
      icon: Lightbulb,
      category: "Tips"
    },
    {
      id: 4,
      title: "Add a task to study Mathematics on November 5th",
      description: "Quick example of adding a study task with a deadline",
      icon: BookOpen,
      category: "Example"
    }
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Build message history for API - exclude the initial greeting
      const conversationHistory = messages
        .slice(1) // Skip the initial bot greeting
        .map(msg => ({
          role: msg.isBot ? "assistant" : "user" as "assistant" | "user",
          content: msg.text
        }));

      const chatMessages = [
        ...conversationHistory,
        { role: "user" as const, content: currentInput }
      ];

      console.log('Sending to API:', chatMessages);

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: chatMessages }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API response:', data);
      
      // Handle response
      if (data.error) {
        throw new Error(data.error);
      }

      const botText = data.reply || "I'm here to help!";
      
      const botResponse: Message = {
        id: Date.now(),
        text: botText,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now(),
        text: error instanceof Error 
          ? `Error: ${error.message}` 
          : "Sorry, I'm having trouble connecting right now. Please try again.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-orama-primary flex items-center gap-2 sm:gap-3">
            <img src={oraIcon} alt="Ora" className="h-6 w-6 sm:h-8 sm:w-8 object-contain mix-blend-multiply" />
            Ora AI Assistant
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Your intelligent study companion and scheduling advisor</p>
        </div>
        <Badge className="bg-orama-primary/10 text-orama-primary border-orama-primary/20 whitespace-nowrap">
          <Zap className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-lg h-[500px] sm:h-[600px] flex flex-col">
            <CardHeader className="bg-orama-primary text-white p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            
            {/* Messages */}
            <CardContent ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-orama-primary text-white'
                    }`}
                  >
                    {message.isBot && (
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <img src={oraIcon} alt="Ora" className="h-3 w-3 sm:h-4 sm:w-4 object-contain mix-blend-multiply" />
                        <span className="text-[10px] sm:text-xs font-semibold">Ora</span>
                      </div>
                    )}
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
                    <p className={`text-[10px] sm:text-xs mt-1 sm:mt-2 opacity-70`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <img src={oraIcon} alt="Ora" className="h-3 w-3 sm:h-4 sm:w-4 object-contain mix-blend-multiply" />
                      <span className="text-[10px] sm:text-xs font-semibold mr-2">Ora is typing</span>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-orama-primary hover:bg-orama-primary-light text-white h-10 w-10 sm:h-11 sm:w-11 p-0"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar with suggestions and info */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Suggestions */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-orama-primary flex items-center gap-2 text-base sm:text-lg">
                <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6 pt-0">
              {quickSuggestions.map((suggestion) => {
                const IconComponent = suggestion.icon;
                return (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-2 sm:p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-orama-primary hover:text-white transition-all group"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-orama-primary group-hover:text-white flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-medium text-xs sm:text-sm break-words">{suggestion.title}</h4>
                        <p className="text-[10px] sm:text-xs text-muted-foreground group-hover:text-orama-light-blue mt-1 break-words">
                          {suggestion.description}
                        </p>
                        <Badge 
                          variant="outline" 
                          className="mt-1 sm:mt-2 text-[10px] sm:text-xs border-orama-primary/30 text-orama-primary group-hover:border-white group-hover:text-white"
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

          {/* AI Capabilities */}
          <Card className="bg-orama-primary text-white shadow-lg">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <img src={oraIcon} alt="Ora" className="h-4 w-4 sm:h-5 sm:w-5 object-contain mix-blend-multiply" />
                What I Can Help With
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs sm:text-sm p-4 sm:p-6 pt-0">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Create optimized study schedules</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Set intelligent reminders</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Provide study techniques & tips</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
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
