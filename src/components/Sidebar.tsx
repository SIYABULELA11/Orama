import { NavLink } from "react-router-dom";
import { 
  Calendar, 
  BookOpen, 
  Bell, 
  Clock, 
  Settings, 
  HelpCircle,
  Home,
  LifeBuoy,
  User,
  Eye,
  ExternalLink
} from "lucide-react";

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType | ((props: { className?: string }) => JSX.Element);
  external?: boolean;
  mobileOnly?: boolean; // Only show in mobile sidebar
}

const sidebarItems: SidebarItem[] = [
  { name: "Home", path: "/home", icon: Home, mobileOnly: true },
  { name: "My Schedules", path: "/schedules", icon: Calendar },
  { name: "Study Planner", path: "/study-planner", icon: BookOpen },
  { name: "Reminders", path: "/reminders", icon: Bell },
  { name: "AI Assistant", path: "/ai-assistant", icon: ({ className }: { className?: string }) => <img src="/icon/icon.png" alt="Ora" className={`h-5 w-5 brightness-0 invert ${className || ''}`} /> },
  { name: "Upcoming Deadlines", path: "/deadlines", icon: Clock },
  { name: "Profile", path: "/profile", icon: User, mobileOnly: true },
  { name: "Support", path: "/support", icon: LifeBuoy, mobileOnly: true },
  { name: "Accessibility", path: "/accessibility", icon: Eye, mobileOnly: true },
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "FAQ", path: "/faq", icon: HelpCircle },
  { name: "iKamva", path: "https://ikamva.uwc.ac.za", icon: ExternalLink, external: true, mobileOnly: true },
];

interface SidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar = ({ collapsed = false, mobileOpen = false, onMobileClose }: SidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex fixed top-[80px] sm:top-[100px] lg:top-header bottom-0 left-0 bg-sidebar z-40 flex-col pt-6 transition-all duration-300 overflow-y-auto ${collapsed ? 'w-[70px]' : 'w-sidebar'}`}>
        <nav className="flex-1 space-y-6 px-1">
          {sidebarItems.filter(item => !item.mobileOnly).map((item) => {
            const IconComponent = item.icon;
            
            // Handle external links
            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center ${collapsed ? 'justify-center' : ''} px-4 py-4 text-sidebar-foreground text-[0.95rem] tracking-wide font-roboto cursor-pointer rounded-lg orama-transition hover:bg-[var(--overlay-sidebar-hover)] hover:text-white hover:scale-[1.02] hover:shadow-md`}
                >
                  <IconComponent className={`h-5 w-5 ${collapsed ? '' : 'mr-[18px]'}`} />
                  {!collapsed && <span>{item.name}</span>}
                </a>
              );
            }
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center ${collapsed ? 'justify-center' : ''} px-4 py-4 text-sidebar-foreground text-[0.95rem] tracking-wide font-roboto cursor-pointer rounded-lg orama-transition hover:bg-[var(--overlay-sidebar-hover)] hover:text-white hover:scale-[1.02] hover:shadow-md active:text-sidebar-active ${
                    isActive ? 'bg-[var(--overlay-sidebar-active)] text-white font-semibold shadow-sm' : ''
                  }`
                }
              >
                <IconComponent className={`h-5 w-5 ${collapsed ? '' : 'mr-[18px]'}`} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed top-[80px] sm:top-[100px] bottom-0 left-0 bg-sidebar z-40 flex flex-col pt-6 w-64 transition-transform duration-300 overflow-y-auto ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="flex-1 space-y-4 px-2 pb-6">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            
            // Handle external links
            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onMobileClose}
                  className={`flex items-center px-4 py-3 text-sidebar-foreground text-sm tracking-wide font-roboto cursor-pointer rounded-lg orama-transition hover:bg-[var(--overlay-sidebar-hover)] hover:text-white`}
                >
                  <IconComponent className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </a>
              );
            }
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sidebar-foreground text-sm tracking-wide font-roboto cursor-pointer rounded-lg orama-transition hover:bg-[var(--overlay-sidebar-hover)] hover:text-white active:text-sidebar-active ${
                    isActive ? 'bg-[var(--overlay-sidebar-active)] text-white font-semibold shadow-sm' : ''
                  }`
                }
              >
                <IconComponent className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
