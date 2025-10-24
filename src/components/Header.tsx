import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import profileIcon from "@/assets/profile.webp";
import { Menu } from "lucide-react";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear auth/session
    navigate("/", { replace: true }); // redirect to login
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-header bg-header-bg z-50 flex items-center px-3 sm:px-6">
      {/* Left section */}
      <div className="flex items-center min-w-fit">
        <Menu 
          className="h-6 w-6 sm:h-7 sm:w-7 text-header-text mr-3 sm:mr-6 cursor-pointer" 
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        />
        <div className="relative">
          <img 
            src={logo} 
            alt="Orama" 
            className="h-12 sm:h-16 lg:h-20 ml-2 sm:ml-5 transition-transform hover:scale-105 mix-blend-multiply"
          />
        </div>
      </div>

      {/* Middle navigation - Hidden on mobile, visible on larger screens */}
      <nav className="hidden xl:flex items-center font-roboto text-base lg:text-lg font-medium text-header-text flex-1 justify-center mx-8 lg:mx-12 gap-8 lg:gap-16 xl:gap-24">
        <NavLink 
          to="/home" 
          className={({ isActive }) => 
            `cursor-pointer orama-transition hover:text-nav-hover active:text-nav-active ${
              isActive ? 'text-nav-active font-semibold' : ''
            }`
          }
        >
          Home
        </NavLink>
        <NavLink 
          to="/support" 
          className={({ isActive }) => 
            `cursor-pointer orama-transition hover:text-nav-hover active:text-nav-active ${
              isActive ? 'text-nav-active font-semibold' : ''
            }`
          }
        >
          Support
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `cursor-pointer orama-transition hover:text-nav-hover active:text-nav-active ${
              isActive ? 'text-nav-active font-semibold' : ''
            }`
          }
        >
          Profile
        </NavLink>
        <NavLink 
          to="/accessibility" 
          className={({ isActive }) => 
            `cursor-pointer orama-transition hover:text-nav-hover active:text-nav-active ${
              isActive ? 'text-nav-active font-semibold' : ''
            }`
          }
        >
          Accessibility
        </NavLink>

        {/* iKamva external link */}
        <a 
          href="https://ikamva.uwc.ac.za" 
          target="_blank" 
          rel="noopener noreferrer"
          className="cursor-pointer orama-transition hover:text-nav-hover active:text-nav-active"
        >
          iKamva
        </a>
      </nav>

      {/* Right section with student info and logout */}
      <div className="flex items-center min-w-fit gap-1 sm:gap-4 lg:gap-6 ml-auto">
        {/* Student number */}
        <div className="flex items-center gap-1 sm:gap-2 cursor-pointer orama-transition hover:text-nav-hover active:text-nav-active font-roboto text-xs sm:text-sm lg:text-lg font-medium text-header-text">
          <span className="hidden md:inline">{"{Studentno.}"}</span>
          <img 
            src={profileIcon} 
            alt="Student Profile" 
            className="h-7 w-7 sm:h-10 sm:w-10 rounded-full border-2 border-white shadow-lg"
          />
        </div>
        <div className="hidden sm:block w-px h-8 lg:h-10 bg-gray-400 mx-2 sm:mx-4 lg:mx-6"></div>
        <button 
          onClick={handleLogout} 
          className="font-bold text-xs sm:text-sm lg:text-base text-header-text orama-transition hover:text-red-400 active:text-red-600 px-1 sm:px-4 whitespace-nowrap"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
