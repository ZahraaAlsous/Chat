import React from "react";
import { MessageCircle, LogOut, Gamepad, Info, HeartPulse, User, Phone, Users, Bot, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (route) => location.pathname === route;

  return (
    <nav className="h-screen bg-[#183642] flex flex-col items-center py-8 shadow-lg" style={{ width: '6vw', minWidth: 0 }}>
      <div className="flex flex-col items-center gap-8" style={{ height: '60%' }}>
        <User className={`${isActive('/profile') ? 'text-[#1797A6] w-9 h-9' : 'text-[#F3F6F9] w-7 h-7'} cursor-pointer transition-all`} title="Profile" onClick={() => navigate('/profile')} />
        <MessageCircle className={`${isActive('/ChatPage') ? 'text-[#1797A6] w-9 h-9' : 'text-[#F3F6F9] w-7 h-7'} cursor-pointer transition-all`} title="Chats" onClick={() => navigate('/ChatPage')} />
        <Gamepad className={`${isActive('/games') ? 'text-[#1797A6] w-9 h-9' : 'text-[#F3F6F9] w-7 h-7'} cursor-pointer transition-all`} title="Games" onClick={() => navigate('/games')} />
        <HeartPulse className={`${isActive('/therapy') ? 'text-[#1797A6] w-9 h-9' : 'text-[#F3F6F9] w-7 h-7'} cursor-pointer transition-all`} title="Therapy" onClick={() => navigate('/therapy')} />
        {/* <Phone className={`${isActive('/calls') ? 'text-[#1797A6] w-9 h-9' : 'text-[#F3F6F9] w-7 h-7'} cursor-pointer transition-all`} title="Calls" onClick={() => navigate('/calls')} /> */}
        {/* <Users className={`${isActive('/contacts') ? 'text-[#1797A6] w-9 h-9' : 'text-[#F3F6F9] w-7 h-7'} cursor-pointer transition-all`} title="Contacts" onClick={() => navigate('/contacts')} /> */}
        <Bot className={`${isActive('/bot') ? 'text-[#1797A6] w-9 h-9' : 'text-[#F3F6F9] w-7 h-7'} cursor-pointer transition-all`} title="Bot" onClick={() => navigate('/bot')} />
        <Info className={`${isActive('/about') ? 'text-[#1797A6] w-9 h-9' : 'text-[#F3F6F9] w-7 h-7'} cursor-pointer transition-all`} title="About Us" onClick={() => navigate('/about')} />
      </div>
      <div className="mt-auto mb-2">
        <LogOut className="w-7 h-7 text-[#F3F6F9] cursor-pointer" title="Logout" onClick={() => navigate('/')} />
      </div>
    </nav>
  );
} 