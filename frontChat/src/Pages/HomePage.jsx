import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from "framer-motion";

const supportiveMessages = [
  "You are not alone",
  "Every feeling is valid",
  "This is a safe space",
  "Your story matters",
  "We care about you",
  "You belong here",
  "Support is here for you",
  "You are valued",
  "Hope lives here",
  "Your feelings matter",
  "Kindness is strength",
  "You are enough",
  "You make a difference",
  "You are seen and heard",
  "Healing starts here",
  "You inspire others",
  "Courage is asking for help",
  "You are important",
  "We listen without judgment",
  "Support is strength",
  "You are safe here"
];

function isOverlap(a, b, minDist = 0) {
  return !(
    a.left + a.width + minDist < b.left ||
    a.left > b.left + b.width + minDist ||
    a.top + a.height + minDist < b.top ||
    a.top > b.top + b.height + minDist
  );
}

const getNonOverlappingPositions = (count, avoidBox, msgBox) => {
  const positions = [];
  const width = msgBox.width;  
  const height = msgBox.height;  
  let attempts = 0;
  const maxAttempts = count * 200;
  while (positions.length < count && attempts < maxAttempts) {
    attempts++;

    const top = Math.random() * (95 - height);
    const left = Math.random() * (90 - width);
    const rect = { top, left, width, height };
  
    if (
      isOverlap(rect, avoidBox, 2) ||
      positions.some((p) => isOverlap(rect, p, 2))
    ) {
      continue;
    }
    positions.push(rect);
  }
 
  return positions;
};


const getRandomDelay = () => 0.1 + Math.random() * 0.7;

const HomePage = () => {
  const avoidBox = { top: 30, left: 20, width: 40, height: 40 };
  const msgBox = { width: 14, height: 5 };
  const positions = useMemo(
    () => getNonOverlappingPositions(supportiveMessages.length, avoidBox, msgBox),
    []
  );
  const visibleMessages = positions
    .map((pos, i) => ({ pos, msg: supportiveMessages[i] }))
    .filter(({ pos }) => !isOverlap(pos, avoidBox, 4));
  return (
    <>
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0.3; }
          }
          
          @keyframes glowEffect {
            0% { opacity: 0.3; filter: brightness(1); }
            50% { opacity: 0.8; filter: brightness(1.2); }
            100% { opacity: 0.3; filter: brightness(1); }
          }
        `}
      </style>
      <div
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #167785 0%, #233746 100%)"
        }}
      >
        {visibleMessages.map(({ msg, pos }, i) => (
          <motion.div
            key={i}
            className="pointer-events-none select-none text-xs md:text-base font-semibold text-white drop-shadow absolute z-0 whitespace-nowrap"
            style={{
              top: `${pos.top + msgBox.height / 2}%`,
              left: `${pos.left + msgBox.width / 2}%`,
              width: `${msgBox.width}%`,
              height: `${msgBox.height}%`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              animation: `fadeInOut 3s ease-in-out ${getRandomDelay()}s forwards, glowEffect 2s ease-in-out infinite ${3 + getRandomDelay()}s`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: getRandomDelay() }}
          >
            {msg}
          </motion.div>
        ))}
        <div className="w-full max-w-2xl rounded-2xl shadow-1xl p-12 py-16 flex flex-col items-center bg-[#183642] text-white  relative">
          <h1 className="text-4xl font-extrabold mb-4 text-center drop-shadow text-cyan-300">
            UpToYou
          </h1>
          <p className="text-lg mb-8 text-center text-white">
            Welcome to a safe space for those who feel insecure or isolated. Here, you are valued and never alone. Connect, share, and find comfort in a caring community.
          </p>
          <div className="flex gap-4 w-full justify-center">
            <Link
              to="/login"
              className="px-6 py-2 rounded-full font-semibold shadow transition bg-[#1797A6] text-white hover:opacity-90"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 rounded-full font-semibold shadow transition bg-white text-[#183642] hover:opacity-90"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
