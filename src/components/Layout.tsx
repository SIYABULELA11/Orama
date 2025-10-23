import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatbotPopup from "./ChatbotPopup";
import FloatingOraButton from "./FloatingOraButton";

const Layout = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const handleOraClick = () => {
    setIsChatbotOpen(true);
  };

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
  };

  // Define pages where floating Ora button should NOT appear
  const excludedPages = ['/home', '/settings', '/faq', '/'];
  const shouldShowFloatingOra = !excludedPages.includes(location.pathname);

  return (
    <div className="min-h-screen w-full bg-background">
      <Header onToggleSidebar={() => setIsSidebarCollapsed(c => !c)} />
      <Sidebar collapsed={isSidebarCollapsed} />
      <main className={`min-h-screen bg-background mt-header p-5 pr-8 transition-all duration-300 ${isSidebarCollapsed ? 'ml-[70px]' : 'ml-sidebar'}`}>
        {/* 👇 This is where your nested routes (Home, Schedules, etc.) will render */}
        <Outlet context={{ onStartChat: handleOraClick }} />
      </main>
      
      {/* Floating Ora button - only on specific pages */}
      {shouldShowFloatingOra && (
        <FloatingOraButton onClick={handleOraClick} />
      )}
      
      {isChatbotOpen && (
        <ChatbotPopup onClose={handleCloseChatbot} />
      )}
    </div>
  );
};

export default Layout;
