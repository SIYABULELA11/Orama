import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MySchedules from "./pages/MySchedules";
import StudyPlanner from "./pages/StudyPlanner";
import Reminders from "./pages/Reminders";
import AIAssistant from "./pages/AIAssistant";
import UpcomingDeadlines from "./pages/UpcomingDeadlines";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Accessibility from "./pages/Accessibility";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login.tsx";

import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/*" element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="schedules" element={<MySchedules />} />
            <Route path="study-planner" element={<StudyPlanner />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="deadlines" element={<UpcomingDeadlines />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="accessibility" element={<Accessibility />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="logout" element={<Navigate to="/" replace />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
