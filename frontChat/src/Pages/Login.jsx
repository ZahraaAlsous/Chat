import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// const backgroundImages = [
//   "https://images.unsplash.com/photo-1682236149004-517e8a2dac24?w=600&auto=format&fit=crop&q=60",
//   "https://images.unsplash.com/photo-1728628162606-75246e9434fb?q=80&w=1332&auto=format&fit=crop",
//   "https://images.unsplash.com/photo-1612043396297-7dd9172d38d0?w=600&auto=format&fit=crop&q=60",
//   "https://images.unsplash.com/photo-1648169047901-180b907254cb?w=600&auto=format&fit=crop&q=60",
//   "https://plus.unsplash.com/premium_photo-1663954645386-2614f7e30ffb?w=600&auto=format&fit=crop&q=60",
// ];
const backgroundImages = [
  "https://plus.unsplash.com/premium_photo-1728302531433-83deebcb46f8?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", //Accompanied
  "https://images.unsplash.com/photo-1721679241447-505d6d5596f8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Integrated
  "https://plus.unsplash.com/premium_photo-1709865737629-ae137178bddb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U29jaWFibGV8ZW58MHx8MHx8fDA%3D", // Sociable
  "https://images.unsplash.com/photo-1647282518004-f37573ae12d4?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Joyful
  "https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Peaceful
];

const imageDescriptions = [
  {
    word: "Accompanied",
    phrase: "You're surrounded by support. Welcome back to your community.",
    color: "#10B981", // Emerald green for growth and support
  },
  {
    word: "Integrated",
    phrase: "You belong here. Your presence makes us stronger together.",
    color: "#8B5CF6", // Purple for unity and belonging
  },
  {
    word: "Sociable",
    phrase: "Your energy brightens our space. Keep spreading positivity.",
    color: "#F59E0B", // Amber for warmth and social energy
  },
  {
    word: "Joyful",
    phrase: "Your happiness is contagious. Thank you for sharing your light.",
    color: "#F97316", // Orange for joy and energy
  },
  {
    word: "Peaceful",
    phrase: "Your calm presence brings balance to our community.",
    color: "#06B6D4", // Cyan for peace and tranquility
  },
];


const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          userName: form.username,
          password: form.password,
        }
      );

      // ✅ تخزين البيانات
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("notefication", response.data.notefication);
      // ✅ توجيه للمحادثات
      navigate("/ChatPage");
    } catch (error) {
      alert(error.response?.data.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* القسم الأيسر - form مع خلفية blur */}
      <div className="w-1/2 flex items-center justify-center px-8 py-8 bg-[#183642] relative overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={bgIndex}
              src={backgroundImages[bgIndex]}
              alt="background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="object-cover w-full h-full absolute inset-0"
              style={{ filter: "blur(8px) brightness(0.3)" }}
            />
          </AnimatePresence>
        </div>
        <motion.div
          className="relative w-full max-w-md rounded-3xl shadow-2xl p-8 bg-[#183642]/80 text-[#F3F6F9] border border-[#1797A6]/20 backdrop-blur-sm z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2 text-center text-[#1797A6]">
            Welcome Back
          </h2>
          <p className="mb-6 text-center text-[#F3F6F9]">
            We're glad to see you again. You are not alone.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block mb-1 text-sm font-medium text-[#F3F6F9]"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-[#1797A6] bg-transparent text-[#F3F6F9] focus:outline-none focus:ring-2 focus:ring-[#1797A6]"
              />
            </div>
            <div>
              <label
                className="block mb-1 text-sm font-medium text-[#F3F6F9]"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-[#1797A6] bg-transparent text-[#F3F6F9] focus:outline-none focus:ring-2 focus:ring-[#1797A6]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1797A6] hover:opacity-90 text-[#F3F6F9] p-3 rounded-xl font-semibold transition"
            >
              Login
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#1797A6] hover:underline">
              Register
            </Link>
          </p>
          <p className="text-center text-xs mt-2">
            <Link to="/" className="hover:underline text-[#F3F6F9]">
              Back to Home
            </Link>
          </p>
        </motion.div>
      </div>

      {/* <div className="w-1/2 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={bgIndex}
            src={backgroundImages[bgIndex]}
            alt="background"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="object-cover w-full h-full absolute inset-0"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-xl opacity-90">
              Connect, Share, and Grow Together
            </p>
          </motion.div>
        </div>
      </div> */}
       <div className="w-1/2 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={bgIndex}
                        src={backgroundImages[bgIndex]}
                        alt="background"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="object-cover w-full h-full absolute inset-0"
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <motion.div
                        className="text-center text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <motion.h1 
                            className="text-5xl font-bold mb-4"
                            style={{ color: imageDescriptions[bgIndex].color }}
                            key={bgIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.6 }}
                        >
                            {imageDescriptions[bgIndex].word}
                        </motion.h1>
                        <motion.p 
                            className="text-xl opacity-90 max-w-md mx-auto leading-relaxed"
                            key={`phrase-${bgIndex}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            {imageDescriptions[bgIndex].phrase}
                        </motion.p>
                    </motion.div>
                </div>
            </div>
    </div>
  );
};

export default Login;
