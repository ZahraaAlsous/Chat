import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function BreathingGame({ onClose }) {
  const [breathStep, setBreathStep] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    setBreathStep(0);
    let steps = ["Inhale...", "Hold...", "Exhale...", "Hold..."];
    let interval = setInterval(() => {
      setBreathStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [started]);

  const stepColors = [
    "from-green-400 to-cyan-400", // Inhale
    "from-cyan-400 to-blue-400",  // Hold
    "from-blue-400 to-green-400", // Exhale
    "from-green-400 to-cyan-400", // Hold
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#183642] via-[#1797A6]/80 to-[#1a2a32] animate-pulse-slow" />
      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <button
          className="absolute top-8 right-10 p-3 rounded-full bg-white/30 hover:bg-red-400/80 transition z-20 shadow-lg"
          onClick={onClose}
          title="Back to games"
        >
          <X className="w-9 h-9 text-white" />
        </button>
        {!started ? (
          <button
            className="px-12 py-6 rounded-full bg-[#1797A6] text-white text-3xl font-bold shadow-xl hover:scale-105 transition mb-8"
            onClick={() => setStarted(true)}
          >
            Start Breathing Exercise
          </button>
        ) : (
          <>
            <h1 className="text-5xl font-extrabold text-[#7fffd4] mb-6 drop-shadow-lg tracking-wide">Breathing Exercise</h1>
            <p className="text-2xl text-white/90 mb-8 drop-shadow">Follow the animation and text to relax.</p>
            <div className="flex flex-col items-center justify-center mt-8">
              <div
                className={`w-80 h-80 rounded-full bg-gradient-to-br ${stepColors[breathStep]} flex items-center justify-center text-4xl font-extrabold shadow-2xl animate-bounce-slow`}
                style={{ transition: 'background 1s' }}
              >
                {['Inhale...', 'Hold...', 'Exhale...', 'Hold...'][breathStep]}
              </div>
              <p className="mt-10 text-2xl text-white/80 animate-fade-in">Breathe with the circle above</p>
            </div>
          </>
        )}
      </div>
      <style>{`
        .animate-pulse-slow {
          animation: pulse-slow 6s infinite alternate;
        }
        @keyframes pulse-slow {
          0% { filter: brightness(0.9) blur(0px); }
          100% { filter: brightness(1.1) blur(2px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite alternate;
        }
        @keyframes bounce-slow {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.08); }
          100% { transform: scale(0.95); }
        }
        .animate-fade-in {
          animation: fade-in 2s;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
} 