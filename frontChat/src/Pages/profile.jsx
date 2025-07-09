import React, { useState, useEffect } from "react";
import { Sun, Moon, User } from "lucide-react";
import axios from "axios";
import AvatarSelector from "../components/avatarSelector";
import Navbar from "../components/Navbar";

export default function UserProfile() {
  const [theme, setTheme] = useState("light");
  const [avatarSeed, setAvatarSeed] = useState(null);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [diary, setDiary] = useState("");
  const [diaries, setDiaries] = useState([]);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await fetch("http://localhost:3000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("error");
        }

        const data = await response.json();
        setName(data.userName || "");
        setPhone(data.phone || "");
        setDiary(data.diary || "");
        setAvatarSeed(data.avatar || null);
      } catch (error) {
        console.error("error:", error.message);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/api/dairy/Dairys", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDiaries(res.data);
    } catch (error) {
      console.error("error", error.message);
    }
  };

  const saveProfile = async () => {
    if (!diary.trim()) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3000/api/dairy/addDairy",
        { text: diary },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDiary("");
      fetchDiaries();
    } catch (error) {
      console.error("error: ", error.message);
    }
  };

  const updateAvatar = async (newAvatarSeed) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/profile/avatar",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: newAvatarSeed }),
        }
      );

      if (!response.ok) {
        throw new Error("error");
      }

      setAvatarSeed(newAvatarSeed);
      setShowAvatarOptions(false);
      alert("Avatar successfully changed");
    } catch (error) {
      console.error(error.message);
      alert("Error updating avatar");
    }
  };

  const deleteDiary = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/api/dairy/deleteDairy/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDiaries((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="min-h-screen flex bg-[#183642] text-[#F3F6F9]">
        {/* Sidebar Navbar */}
        <div className="w-[240px] bg-[#1a2a32] shadow-md">
          <Navbar />
        </div>

        {/* Divider */}
        <div className="w-px bg-[#1797A6]/20" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-start space-y-12 overflow-y-auto">
          {/* Avatar + Inputs */}
          <div className="w-full max-w-lg bg-[#233746] border border-[#1797A6]/40 rounded-2xl shadow-xl p-8 space-y-6 mt-10">
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                className="w-28 h-28 flex items-center justify-center rounded-full bg-[#1797A6] text-6xl text-white border-4 border-cyan-300 hover:scale-105 transition"
              >
                {avatarSeed ? (
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`}
                    alt="avatar"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16" />
                )}
              </button>
              <p className="text-sm text-[#F3F6F9] opacity-70">choose avatar</p>

              {showAvatarOptions && (
                <div className="mt-4">
                  <AvatarSelector
                    onSelectAvatar={(seed) => updateAvatar(seed)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="user Name"
                className="w-full px-4 py-2 rounded-lg bg-[#2b4f56] border border-[#1797A6]/30 placeholder-cyan-200 text-[#F3F6F9] focus:outline-none focus:ring-2 focus:ring-[#1797A6]"
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="phone"
                className="w-full px-4 py-2 rounded-lg bg-[#2b4f56] border border-[#1797A6]/30 placeholder-cyan-200 text-[#F3F6F9] focus:outline-none focus:ring-2 focus:ring-[#1797A6]"
              />
            </div>
          </div>

          {/* Diary Section */}
          <div className="flex flex-col md:flex-row items-start gap-10">
            {/* Diary Input */}
            <div className="w-full max-w-lg bg-[#233746] border border-[#1797A6]/40 rounded-2xl shadow-xl p-8 space-y-6">
              <textarea
                value={diary}
                onChange={(e) => setDiary(e.target.value)}
                placeholder="tell me..."
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-[#2b4f56] border border-[#1797A6]/30 placeholder-cyan-200 text-[#F3F6F9] focus:outline-none focus:ring-2 focus:ring-[#1797A6]"
              ></textarea>

              <button
                onClick={saveProfile}
                className="w-full py-3 rounded-lg bg-[#1797A6] hover:bg-cyan-400 text-white font-medium transition"
              >
                save
              </button>
            </div>

            {/* Diary List */}
            <div className="w-full max-w-xl mt-10 md:mt-0 bg-[#233746] border border-[#1797A6]/40 rounded-2xl shadow-xl p-6 space-y-4">
              <h3 className="text-white text-xl font-semibold">
                Diary and achievement:
              </h3>
              {diaries.length === 0 && (
                <p className="text-gray-300">Add some notes!</p>
              )}
              <ul className="space-y-3">
                {diaries.map((item) => (
                  <li
                    key={item._id}
                    className="bg-[#2b4f56] p-3 rounded text-white"
                  >
                    <div className="flex justify-between items-start">
                      <span>{item.text}</span>
                      <button
                        onClick={() => deleteDiary(item._id)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        delete
                      </button>
                    </div>
                    <p className="text-sm text-left text-gray-300 mt-2">
                      {item.createdAt.slice(0, 10)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
