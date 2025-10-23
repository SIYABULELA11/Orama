import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { HelpCircle, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I create a study schedule?",
      answer: "Go to 'Study Planner' and click 'Add Study Plan'. Fill in your subject, duration, and priority. The AI will help optimize your schedule."
    },
    {
      question: "Can I sync with my university calendar?",
      answer: "Yes! Go to Settings > Academic Preferences to connect your university calendar for automatic class scheduling."
    },
    {
      question: "How do reminder notifications work?",
      answer: "Set reminders in the 'Reminders' section. You'll get notifications via email, SMS, or push notifications based on your preferences in Settings."
    },
    {
      question: "What does the AI Assistant do?",
      answer: "The AI Assistant helps with study planning, deadline management, and provides personalized academic advice. Click the logo to access it anytime."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-orama-primary flex items-center gap-3">
          <HelpCircle className="h-8 w-8" />
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground mt-2">Find answers to common questions about Orama</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index} className="bg-white shadow-lg">
            <Collapsible>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="hover:bg-gray-50 transition-colors">
                  <CardTitle className="flex items-center justify-between text-orama-primary">
                    {faq.question}
                    <ChevronDown className="h-5 w-5" />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
