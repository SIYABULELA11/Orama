import { NavLink } from "react-router-dom";
import { 
  Calendar, 
  BookOpen, 
  Bell, 
  Clock, 
  Settings, 
  HelpCircle
} from "lucide-react";

const sidebarItems = [
  { name: "My Schedules", path: "/schedules", icon: Calendar },
  { name: "Study Planner", path: "/study-planner", icon: BookOpen },
  { name: "Reminders", path: "/reminders", icon: Bell },
  { name: "AI Assistant", path: "/ai-assistant", icon: ({ className }: { className?: string }) => <img src="/icon/icon.png" alt="Ora" className={`h-5 w-5 brightness-0 invert ${className || ''}`} /> },
  { name: "Upcoming Deadlines", path: "/deadlines", icon: Clock },
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "FAQ", path: "/faq", icon: HelpCircle },
];

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  return (
    <aside className={`fixed top-header bottom-0 left-0 bg-sidebar z-40 flex flex-col pt-6 transition-all duration-300 overflow-y-auto ${collapsed ? 'w-[70px]' : 'w-sidebar'}`}>
  <nav className="flex-1 space-y-6 px-1">
      {sidebarItems.map((item) => {
        const IconComponent = item.icon;
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
  );
};

export default Sidebar;
