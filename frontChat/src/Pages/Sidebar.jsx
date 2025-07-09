import { useNavigate } from "react-router-dom";
import { User, MessageCircle, Phone, Bot, Settings,Gamepad, Sun, Moon } from "lucide-react";

export default function Sidebar({ activeSidebar, setActiveSidebar, onProfileClick, theme, toggleTheme }) {
  const navigate = useNavigate();

  const sidebarIcons = [
    { icon: User, label: "Profile", onClick: onProfileClick },
    { icon: MessageCircle, label: "Chat", route: "/ChatPage" },
    { icon: Phone, label: "Calls", route: "/calls" },
    { icon: Gamepad, label: "Games", route:"/games"},
    { icon: Bot, label: "Bot" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="flex flex-col items-center justify-between py-6 px-2 bg-[#183642] text-cyan-300 shadow-lg min-h-screen w-16">
      <div className="flex flex-col items-center gap-6">
        {sidebarIcons.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeSidebar === idx;

          const handleClick = () => {
            setActiveSidebar(idx);
            if (item.onClick) item.onClick();
            if (item.route) navigate(item.route);
          };

          return (
            <button
              key={item.label}
              onClick={handleClick}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-150
                ${isActive ? "bg-cyan-600 text-white shadow-md" : "hover:bg-cyan-800 hover:text-white text-cyan-300"}`}
              title={item.label}
            >
              <Icon className="w-7 h-7" />
              <span className="sr-only">{item.label}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={toggleTheme}
        className="mt-8 mb-2 p-2 rounded-full hover:bg-cyan-800 transition flex items-center justify-center"
        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? <Moon className="w-7 h-7 text-cyan-300" /> : <Sun className="w-7 h-7 text-yellow-300" />}
      </button>
    </nav>
  );
}
