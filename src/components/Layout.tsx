import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatbotPopup from "./ChatbotPopup";
import FloatingOraButton from "./FloatingOraButton";

const Layout = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const handleOraClick = () => {
    setIsChatbotOpen(true);
  };

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
  };

  const handleToggleSidebar = () => {
    // On mobile, toggle mobile sidebar. On desktop, collapse sidebar
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  // Define pages where floating Ora button should NOT appear
  const excludedPages = ['/home', '/settings', '/faq', '/'];
  const shouldShowFloatingOra = !excludedPages.includes(location.pathname);

  return (
    <div className="min-h-screen w-full bg-background">
      <Header onToggleSidebar={handleToggleSidebar} />
      <Sidebar 
        collapsed={isSidebarCollapsed} 
        mobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      {/* Overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <main className={`min-h-screen bg-background pt-20 sm:pt-24 lg:pt-header p-3 sm:p-5 lg:pr-8 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-[70px]' : 'lg:ml-sidebar'
      }`}>
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
