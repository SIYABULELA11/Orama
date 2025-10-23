import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import profileIcon from "@/assets/profile.webp";
import { Menu } from "lucide-react";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear auth/session
    navigate("/", { replace: true }); // redirect to login
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-header bg-header-bg z-50 flex items-center px-6">
      {/* Left section */}
      <div className="flex items-center min-w-fit">
        <Menu 
          className="h-7 w-7 text-header-text mr-6 cursor-pointer" 
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            onToggleSidebar?.();
          }}
          aria-label="Toggle sidebar"
        />
        <div className="relative">
          <img 
            src={logo} 
            alt="Orama" 
            className="h-20 ml-5 transition-transform hover:scale-105 mix-blend-multiply"
          />
        </div>
      </div>

      {/* Middle navigation */}
      <nav className="flex items-center font-roboto text-lg font-medium text-header-text flex-1 justify-center mx-12" style={{ gap: '120px' }}>
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
      <div className="flex items-center min-w-fit gap-6">
        {/* Student number */}
        <div className="flex items-center gap-2 cursor-pointer orama-transition hover:text-nav-hover active:text-nav-active font-roboto text-lg font-medium text-header-text">
          <span>{"{Studentno.}"}</span>
          <img 
            src={profileIcon} 
            alt="Student Profile" 
            className="h-10 w-10 rounded-full border-2 border-white shadow-lg"
          />
        </div>
        <div className="w-px h-10 bg-gray-400 mx-6"></div>
        <button 
          onClick={handleLogout} 
          className="font-bold text-header-text orama-transition hover:text-red-400 active:text-red-600 px-4"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
