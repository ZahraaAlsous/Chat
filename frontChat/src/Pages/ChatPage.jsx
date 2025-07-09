import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  MessageCircle,
  Info,
  Settings,
  LogOut,
  Gamepad,
  Search,
  ChevronLeft,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Send,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
import VoiceCall from "../components/VoiceCall";
import { toast } from "react-toastify";

const chatsData = [
  {
    id: 1,
    name: "Support & Welcome",
    last: "Welcome to our community! We're always here to support you. Feel free to reach out anytime.",
    messages: [
      {
        from: "system",
        text: "👋 Welcome to our community! We're truly glad to have you here. If you ever need help, support, or just someone to talk to, our team and members are always here for you. Don't hesitate to reach out at any time!",
      },
      {
        from: "system",
        text: "Tip: You can always find useful resources and connect with others in the chat list.",
      },
    ],
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    id: 2,
    name: "Site Policy & Terms",
    last: "Please read our site policy and terms before using the platform.",
    messages: [
      {
        from: "system",
        text: "📄 Please make sure to read our site policy and terms of use before you start. By using this platform, you agree to follow all our rules and guidelines. Respectful and safe communication is our top priority.",
      },
      {
        from: "system",
        text: "You can find the full policy and terms in the settings or at the bottom of the homepage.",
      },
    ],
    icon: <Info className="w-5 h-5" />,
  },
  {
    id: 3,
    name: "Usage Guidelines",
    last: "Please respect everyone and follow the general guidelines.",
    messages: [
      {
        from: "system",
        text: "✅ Please respect everyone and follow our community guidelines. Do not share your personal information, avoid heated arguments, and always keep the conversation friendly and constructive.",
      },
      {
        from: "system",
        text: "Safety Tip: If you encounter any inappropriate behavior, please report it to our support team immediately.",
      },
    ],
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(chatsData[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState("light");
  const [senderId, setSenderId] = useState("");
  const [chats, setChats] = useState([]);
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeSidebar, setActiveSidebar] = useState(1);
  const bottomRef = useRef(null);
  const [calling, setCalling] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);

  useEffect(() => {
    const notefication = localStorage.getItem("notefication");
    if (notefication) {
      toast.info(notefication, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      localStorage.removeItem("notefication");  
    }
  }, []);

  const filteredChats = chatsData.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    const stored = localStorage.getItem("theme") || "light";
    setTheme(stored);
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  // 👤 Get user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?._id) setSenderId(storedUser._id);
  }, []);

  // 📥 Fetch chats
  useEffect(() => {
    if (!senderId) return;
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/chat/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(res.data);
      } catch (err) {
        console.error(" error fetching chats  ", err);
      }
    };
    fetchChats();
  }, [senderId]);
  useEffect(() => {
    if (activeChat && activeChat.messages) {
      setMessages(activeChat.messages);
    }
  }, [activeChat]);

  // 📥 Fetch messages
  useEffect(() => {
    if (chatId) {
      socket.emit("joinRoom", { chatId });
      fetchMessages();
      socket.on("receiveMessage", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });
    }
    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:3000/api/messages/${chatId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data);
    } catch (err) {
      console.error(" error fetching messages", err);
    }
  };

  const send = () => {
    if (!draft.trim() || !chatId || !senderId) return;
    socket.emit("sendMessage", { senderId, chatId, text: draft });
    setDraft("");
  };

  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/api/user/users/search/all",
        {
          params: { query: value },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResults(res.data);
    } catch (err) {
      console.error("  error while searching ", err);
    }
  };

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/contact/myCountacts`,
        {
          // params: { query: "" },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContacts(res.data);
    } catch (err) {
      console.error("error fetching contacts", err);
    }
  };


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const bg = theme === "light" ? "bg-gray-100" : "bg-[#183642]";
  const pane = theme === "light" ? "bg-white" : "bg-[#233746]";
  const handleDeleteMessage = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:3000/api/chat/deleteMessage/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // حذف الرسالة من الحالة
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
      alert(" An error occurred while deleting the message");
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `http://localhost:3000/api/chat/deletechat/${chatId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      
      setChats((prev) => prev.filter((c) => c._id !== chatId));

      
      if (activeChat?._id === chatId) {
        setActiveChat(null);
        setChatId(null);
      }
    } catch (err) {
      console.error("error deleting  :", err.response?.data || err.message);
      alert("An error occurred while deleting the conversation");
    }
  };

  const handleHangUp = () => {
    setCalling(false);
    socket.emit("call-ended", { chatId });
    setCalling(false);
  };

  return (
    <div className="min-h-screen flex bg-[#f6fafd] dark:bg-[#1a2a32]">
      <Navbar />

      {/* Chat List */}
      <aside className="h-screen w-[30%] min-w-[220px] max-w-[350px] bg-white dark:bg-[#233746] border-r border-[#1797A6]/20 flex flex-col">
        <div className="p-6 pb-2 border-b border-[#1797A6]/20 flex items-center justify-between">
          <h1 className="text-lg font-semibold dark:text-white">Chats</h1>
          <button
            onClick={() => {
              setShowContacts((prev) => !prev);
              if (!showContacts) fetchContacts();
            }}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Toggle Contacts"
          >
            <Users className="w-5 h-5 text-[#1797A6]" />
          </button>
        </div>

        <div className="p-3">
          {/* ✅ Search */}
          <div className="flex items-center gap-2 bg-gray-200 dark:bg-[#183642] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-500 dark:text-cyan-300" />
            <input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none text-black dark:text-[#F3F6F9] placeholder-gray-500 dark:placeholder-cyan-200"
            />
          </div>

          {/* {searchResults.length > 0 && (
            <div className="mt-2 max-h-64 overflow-y-auto">
              {searchResults.map((user) => (
                <button
                  key={user._id}
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");

                      const res = await axios.post(
                        `http://localhost:3000/api/chat/displayOrCreateChat/${user._id}`,
                        {},
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );

                      const data = res.data;
                      const chat = data.chat;
                      const messages = data.messages;

                      const otherUsers = chat.users.filter(
                        (u) => u._id !== senderId
                      );
                      const name =
                        otherUsers.map((u) => u.userName).join(", ") || "chat";

                      setActiveChat({
                        ...chat,
                        name,
                        avatar: otherUsers[0]?.avatar || "👤",
                        messages,
                      });

                      setChatId(chat._id);
                      setSearchResults([]);
                      setSearchQuery("");
                      setActiveSidebar(1);
                    } catch (error) {
                      console.error("Error loading the chat:", error);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#2b4f56] dark:hover:bg-[#1b3b41]"
                >
                  <span className="text-2xl">{user.avatar || "👤"}</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-black dark:text-white">
                      {user.userName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {user.phone}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )} */}
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-64 overflow-y-auto">
              {searchResults.map((user) => (
                <button
                  key={user._id}
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");

                      const res = await axios.post(
                        `http://localhost:3000/api/chat/displayOrCreateChat/${user._id}`,
                        {},
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );

                      const data = res.data;
                      const chat = data.chat;
                      const messages = data.messages;

                      const otherUsers = chat.users.filter(
                        (u) => u._id !== senderId
                      );
                      const name =
                        otherUsers.map((u) => u.userName).join(", ") || "chat";

                      setActiveChat({
                        ...chat,
                        name,
                        avatar: otherUsers[0]?.avatar || "👤",
                        messages,
                      });

                      setChatId(chat._id);
                      setSearchResults([]);
                      setSearchQuery("");
                      setActiveSidebar(1);
                    } catch (error) {
                      console.error("Error loading the chat:", error);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#2b4f56] dark:hover:bg-[#1b3b41]"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1797A6] flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.avatar}`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xl">👤</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-black dark:text-white">
                      {user.userName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {user.phone}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* {showContacts && contacts.length > 0 && (
            <div className="mt-2 max-h-64 overflow-y-auto">
              {contacts.map((contact) => (
                <button
                  key={contact._id}
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");

                      const res = await axios.post(
                        `http://localhost:3000/api/chat/displayOrCreateChat/${contact._id}`,
                        {},
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );

                      const data = res.data;
                      const chat = data.chat;
                      const messages = data.messages;

                      const otherUsers = chat.users.filter(
                        (u) => u._id !== senderId
                      );
                      const name =
                        otherUsers.map((u) => u.userName).join(", ") || "chat";

                      setActiveChat({
                        ...chat,
                        name,
                        avatar: otherUsers[0]?.avatar || "👤",
                        messages,
                      });

                      setChatId(chat._id);
                      setActiveSidebar(1);
                    } catch (error) {
                      console.error("Error loading the chat:", error);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#2b4f56] dark:hover:bg-[#1b3b41]"
                >
                  <span className="text-2xl">{contact.avatar || "👤"}</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-black dark:text-white">
                      {contact.userName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {contact.phone}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )} */}
          {showContacts && contacts.length > 0 && (
            <div className="mt-2 max-h-64 overflow-y-auto">
              {contacts.map((contact) => (
                <button
                  key={contact._id}
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");

                      const res = await axios.post(
                        `http://localhost:3000/api/chat/displayOrCreateChat/${contact._id}`,
                        {},
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );

                      const data = res.data;
                      const chat = data.chat;
                      const messages = data.messages;

                      const otherUsers = chat.users.filter(
                        (u) => u._id !== senderId
                      );
                      const name =
                        otherUsers.map((u) => u.userName).join(", ") || "chat";

                      setActiveChat({
                        ...chat,
                        name,
                        avatar: otherUsers[0]?.avatar || "👤",
                        messages,
                      });

                      setChatId(chat._id);
                      setActiveSidebar(1);
                    } catch (error) {
                      console.error("Error loading the chat:", error);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#2b4f56] dark:hover:bg-[#1b3b41]"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1797A6] flex items-center justify-center">
                    {contact.avatar ? (
                      <img
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${contact.avatar}`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xl">👤</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-black dark:text-white">
                      {contact.userName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {contact.phone}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`w-full flex items-center gap-3 px-6 py-5 border-b border-[#1797A6]/10 transition text-left ${
                activeChat.id === chat.id
                  ? "bg-[#e6f7fa] dark:bg-[#1e4e56]"
                  : "hover:bg-[#f0fafd] dark:hover:bg-[#1b3b41]"
              }`}
            >
              <span className="bg-[#1797A6]/10 text-[#1797A6] rounded-full p-2">
                {chat.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-[#183642] dark:text-white">
                  {chat.name}
                </p>
                <p className="text-xs text-gray-500 truncate dark:text-[#D9EFF2]">
                  {chat.last}
                </p>
              </div>
            </button>
          ))}
          {chats.map((chat) => {
            const otherUsers = chat.users.filter((u) => u._id !== senderId);
            const name = otherUsers.map((u) => u.userName).join(", ") || "chat";

            const unread = chat.unreadMessagesCount;

            return (
              <button
                key={chat._id}
                onClick={() => {
                  setActiveChat({
                    ...chat,
                    name,
                    avatar: otherUsers[0]?.avatar || "👤",
                    unreadMessagesCount: unread,
                  });
                  setChatId(chat._id);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition text-left ${
                  chatId === chat._id
                    ? "bg-[#1e4e56]"
                    : "hover:bg-[#2b4f56] dark:hover:bg-[#1b3b41]"
                }`}
              >
                {/* <span className="text-3xl">
                  {otherUsers[0]?.avatar || "👤"}
                </span> */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1797A6] flex items-center justify-center">
                  {otherUsers[0]?.avatar ? (
                    <img
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${otherUsers[0].avatar}`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xl">👤</span>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <p
                    className={`font-medium truncate ${
                      theme === "light" ? "text-black" : "text-white"
                    }`}
                  >
                    {name}
                  </p>

                  {unread > 0 && (
                    <span className="ml-2 text-xs text-white bg-blue-400 rounded-full w-6 h-6 flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </div>

                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat._id);
                  }}
                  title="Delete chat "
                  className="ml-2 text-red-500 hover:text-red-700 transition cursor-pointer"
                >
                  🗑️
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Chat Content */}
      <section className="flex-1 flex flex-col h-screen bg-[#fafdff] dark:bg-[#1a2a32]">
        <header className="flex items-center justify-between gap-2 border-b border-[#1797A6]/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveChat(null)}
              className="md:hidden p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5 text-black dark:text-[#F3F6F9]" />
            </button>

            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1797A6] flex items-center justify-center">
              {activeChat.avatar ? (
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${activeChat.avatar}`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xl">👤</span>
              )}
            </div>

            <div>
              <p className="font-medium leading-none text-black dark:text-[#F3F6F9]">
                {activeChat.name}
              </p>
              {/* <p className="text-xs text-gray-500 dark:text-[#D9EFF2]">
          online
        </p> */}
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-500 dark:text-[#D9EFF2]">
            {/* <Phone
              className="w-5 h-5 hover:text-[#1797A6] cursor-pointer"
              onClick={() => setCalling(true)}
            /> */}
            <div className="flex items-center gap-2 text-[#1797A6]">
              <button
                title="Voice Call"
                onClick={() => {
                  setVideoEnabled(false);
                  setCalling(true);
                }}
                className="hover:bg-[#1797A6]/20 p-2 rounded"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                title="More Options"
                onClick={() => alert("More options")}
                className="hover:bg-[#1797A6]/20 p-2 rounded"
              ></button>
            </div>
            <Video className="w-5 h-5 hover:text-[#1797A6] cursor-pointer" />
            <MoreVertical className="w-5 h-5 hover:text-[#1797A6] cursor-pointer" />
          </div>
          {/* <div className="flex items-center gap-2 text-[#1797A6]">
            <button
              title="Voice Call"
              onClick={() => {
                setVideoEnabled(false);
                setCalling(true);
              }}
              className="hover:bg-[#1797A6]/20 p-2 rounded"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              title="More Options"
              onClick={() => alert("More options")}
              className="hover:bg-[#1797A6]/20 p-2 rounded"
            ></button>
          </div> */}
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`group relative max-w-[70%] px-4 py-2 rounded-lg text-sm ${
                m.sender?._id === senderId
                  ? "ml-auto bg-[#1797A6] text-white"
                  : "bg-[#2a4c52] text-[#D9EFF2]"
              }`}
            >
              {m.text}

              <button
                onClick={() => handleDeleteMessage(m._id)}
                className="absolute top-0 right-0 mt-[-8px] mr-[-8px] opacity-0 group-hover:opacity-100 text-xs text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition"
                title=" delete message"
              >
                ×
              </button>
            </div>
          ))}
          <div ref={bottomRef} />
        </main>

        <footer className="px-4 py-3 border-t border-[#1797A6]/30 flex items-center gap-3">
          <Smile className="w-6 h-6 text-cyan-300 hover:text-[#1797A6] cursor-pointer" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Message..."
            className="flex-1 rounded-lg bg-[#233746] text-[#D9EFF2] px-4 py-2 text-sm focus:outline-none placeholder-cyan-200"
          />
          <button
            onClick={send}
            className="p-2 rounded-full bg-[#1797A6] hover:bg-cyan-400 text-white disabled:opacity-50 disabled:pointer-events-none"
            disabled={!draft.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </footer>
      </section>
      {calling && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1b3b41] p-6 rounded-lg shadow-xl text-center space-y-4">
            <p className="text-lg font-semibold text-black dark:text-white">
              {/* {callType === "video"
                ? "📹 Starting video call..."
                : "📞 Starting voice call..."} */}
            </p>
            {/* <button
              onClick={endCall}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              <X className="w-4 h-4" />
              End Call
            </button> */}
          </div>
        </div>
      )}
      {/* {calling && <VoiceCall socket={socket} chatId={chatId} />} */}
      {calling && (
        <CallInterface
          socket={socket}
          chatId={chatId}
          onHangUp={() => setCalling(false)}
          videoEnabled={videoEnabled}
          setVideoEnabled={setVideoEnabled}
        />
      )}
    </div>
  );
}
