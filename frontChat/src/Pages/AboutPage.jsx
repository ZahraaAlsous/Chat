import React from "react";
import { Home, MessageCircle, Settings, LogOut, Gamepad, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (route) => location.pathname === route;

  return (
    <div className="min-h-screen flex bg-[#f6fafd] dark:bg-[#1a2a32]">
      <Navbar />
      {/* About Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-8">
        <div className="max-w-2xl w-full bg-white dark:bg-[#233746] rounded-xl shadow-lg p-10 text-center">
          <h1 className="text-3xl font-bold text-[#1797A6] mb-4">About Us</h1>
          <p className="text-lg text-[#183642] dark:text-[#F3F6F9] mb-6">
            Welcome to our company!<br/>
            We are dedicated to providing the best experience for our users. Our mission is to create a safe, supportive, and engaging community for everyone.<br/><br/>
            <span className="font-semibold">Contact us:</span> info@company.com<br/>
            <span className="font-semibold">Location:</span> 123 Main Street, City, Country
          </p>
          <p className="text-md text-gray-500 dark:text-gray-300">
            &copy; {new Date().getFullYear()} Our Company. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
} 