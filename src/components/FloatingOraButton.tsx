import { useState } from "react";
import oraIcon from "/icon/icon.png";

interface FloatingOraButtonProps {
  onClick: () => void;
}

const FloatingOraButton = ({ onClick }: FloatingOraButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group"
        aria-label="Chat with Ora AI Assistant"
      >
        {/* Floating button with icon.png - white background */}
        <div className={`
          w-16 h-16 rounded-full bg-white shadow-lg border-2 border-gray-200
          flex items-center justify-center cursor-pointer
          transition-all duration-300 ease-in-out
          hover:scale-110 hover:shadow-xl hover:border-orama-primary
          ${isHovered ? 'animate-pulse' : ''}
        `}>
          <img 
            src={oraIcon} 
            alt="Ora AI Assistant" 
            className="w-10 h-10 object-contain"
          />
        </div>
        
        {/* Tooltip */}
        <div className={`
          absolute bottom-20 right-0 mb-2
          bg-gray-900 text-white text-sm px-3 py-2 rounded-lg
          whitespace-nowrap shadow-lg
          transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          Chat with Ora
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
        
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full bg-orama-primary opacity-10 animate-ping"></div>
      </button>
    </div>
  );
};

export default FloatingOraButton;
