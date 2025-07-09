 

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { Send } from "lucide-react";
import axios from "axios";

export default function BotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/mood/chatBot", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);
      } catch (err) {
        console.error("Failed to load bot messages", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/mood/bot",
        { text: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { userMessage, botReply } = res.data;

      setMessages((prev) => [...prev, userMessage, botReply]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen flex bg-[#f6fafd] dark:bg-[#1a2a32]">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen bg-gray-100 dark:bg-[#183642]">
        <div className="w-full max-w-2xl flex flex-col h-[70vh] bg-white dark:bg-[#233746] rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-[#1797A6] mb-4 text-center">
            AI Bot Chat
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
            
            {Array.isArray(messages) &&
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender?.userName === "bot"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-lg ${
                      msg.sender?.userName === "bot"
                        ? "bg-gray-200 dark:bg-[#183642] text-[#183642] dark:text-[#F3F6F9] rounded-bl-none"
                        : "bg-[#1797A6] text-white rounded-br-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-full border border-[#1797A6] focus:outline-none focus:ring-2 focus:ring-[#1797A6] bg-white dark:bg-[#183642] text-[#183642] dark:text-[#F3F6F9]"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="p-2 rounded-full bg-[#1797A6] text-white hover:bg-cyan-600 transition"
              onClick={sendMessage}
              title="Send"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
