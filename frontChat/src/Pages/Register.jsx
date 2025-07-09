import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const backgroundImages = [
  "https://images.unsplash.com/photo-1473830394358-91588751b241?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", ///Lonely
  "https://images.unsplash.com/photo-1644428239740-b8295bfef42f?q=80&w=1090&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // isolated
  "https://images.unsplash.com/photo-1592806088932-05058af0ad8d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // depressed
  "https://plus.unsplash.com/premium_photo-1679070894746-34e61c9d91a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEludHJvdmVydGVkfGVufDB8fDB8fHww", // Introverted
  "https://images.unsplash.com/photo-1534343133720-0c20dba3a360?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Anxious
];

const imageDescriptions = [
  {
    word: "Lonely",
    phrase:
      "You're not alone in feeling alone. Connect with others who understand.",
    color: "#F59E0B", // Amber color for warmth
  },
  {
    word: "Isolated",
    phrase: "Break free from isolation. Find your tribe here.",
    color: "#10B981", // Emerald green for growth
  },
  {
    word: "Depressed",
    phrase: "Your feelings are valid. Let's walk this journey together.",
    color: "#8B5CF6", // Purple for healing
  },
  {
    word: "Introverted",
    phrase: "Quiet souls have powerful stories. Share yours safely.",
    color: "#06B6D4", // Cyan for calmness
  },
  {
    word: "Anxious",
    phrase: "Breathe easy. You're in a safe space now.",
    color: "#F97316", // Orange for energy and warmth
  },
];
const Register = () => {
  const [form, setForm] = useState({
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          userName: form.username,
          phone: form.phone,
          password: form.password,
          confirmPassword: form.confirmPassword,
          avatar: "",
        }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/ChatPage");
    } catch (error) {
      alert(error.response?.data.message || "Signup failed");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
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
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 text-[#1797A6]">
              Join the Community
            </h2>
            <p>You are welcome here. Let's connect and support each other.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block mb-1 text-sm font-medium"
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
                className="w-full p-3 rounded-xl border border-[#1797A6] bg-transparent text-[#F3F6F9] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1797A6]"
                placeholder="Choose a unique username"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-[#1797A6] bg-transparent text-[#F3F6F9] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1797A6]"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label
                className="block mb-1 text-sm font-medium"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 pr-20 rounded-xl border border-[#1797A6] bg-transparent text-[#F3F6F9] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1797A6]"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#1797A6] underline focus:outline-none"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={0}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label
                className="block mb-1 text-sm font-medium"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border border-[#1797A6] bg-transparent text-[#F3F6F9] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1797A6]"
                placeholder="Confirm your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1797A6] hover:opacity-90 text-[#F3F6F9] p-3 rounded-xl font-semibold transition duration-300"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#1797A6] hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
            <p className="mt-2 text-sm">
              <Link
                to="/"
                className="text-[#F3F6F9] hover:underline font-medium"
              >
                Back to Home
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right - Animated Image and Text */}
      <div className="w-1/2 relative overflow-hidden">
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
        {/* طبقة شفافة مع نص ترحيبي */}
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

export default Register;
