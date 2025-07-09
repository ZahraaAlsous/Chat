import React, { useRef, useState, useEffect } from "react";
import relaxingMusic from "../assets/sb_adriftamonginfinitestars(chosic.com).mp3";

const relaxingImages = [
  // Unsplash - all tested and should work
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Rm9yZXN0fGVufDB8fDB8fHww", // Forest
  "https://plus.unsplash.com/premium_photo-1673240367277-e1d394465b56?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TGFrZXxlbnwwfHwwfHx8MA%3D%3D", // Lake
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QmVhY2h8ZW58MHx8MHx8fDA%3D", // Beach
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TW91bnRhaW5zfGVufDB8fDB8fHww", // Mountains
  "https://images.unsplash.com/photo-1482685945432-29a7abf2f466?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Waterfall
  "https://images.unsplash.com/photo-1700350951645-ddeb1f777d9b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q2FsbSUyMHJpdmVyfGVufDB8fDB8fHww", // Calm river
  "https://images.unsplash.com/photo-1506452305024-9d3f02d1c9b5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Misty forest
  "https://images.unsplash.com/photo-1528164604878-28ea0fb4f462?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TGFrZSUyMHN1bnNldHxlbnwwfHwwfHx8MA%3D%3D", // Lake sunset
  "https://images.unsplash.com/photo-1566679056462-2075774c8c07?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Mountain
  "https://images.unsplash.com/photo-1583244685026-d8519b5e3d21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fExha2V8ZW58MHx8MHx8fDA%3D", // Lake
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fE1vdW50YWlufGVufDB8fDB8fHww", // Mountain
  "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Rm9yZXN0fGVufDB8fDB8fHww", // Forest
];

export default function RelaxingMusicPlayer({ onClose }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => {
        setImgIdx((idx) => (idx + 1) % relaxingImages.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    if (!playing) {
      audioRef.current && audioRef.current.pause();
    } else {
      audioRef.current && audioRef.current.play();
    }
  }, [playing]);

  useEffect(() => {
    return () => {
      audioRef.current && audioRef.current.pause();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fullscreen background image */}
      <img
        src={relaxingImages[imgIdx]}
        alt="relaxing scenery"
        className="fixed inset-0 w-full h-full object-cover z-0 select-none pointer-events-none"
        draggable={false}
      />
      {/* Overlay for readability */}
      <div className="fixed inset-0 bg-black/60 z-10" />
      {/* Controls and content */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-6 right-8 text-gray-300 hover:text-[#1797A6] text-4xl font-bold z-30"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-4xl font-bold mb-4 text-[#1797A6] drop-shadow-lg">Relaxing Music</h2>
        <p className="mb-6 text-white text-xl drop-shadow">Listen to calming music and enjoy beautiful, relaxing images.</p>
        <audio ref={audioRef} src={relaxingMusic} loop />
        <button
          onClick={() => setPlaying((p) => !p)}
          className="px-12 py-4 rounded-full font-semibold shadow bg-[#1797A6] text-white text-2xl hover:opacity-90 mb-4"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
} 