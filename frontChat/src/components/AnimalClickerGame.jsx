import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ANIMAL_EMOJIS = [
  { emoji: '🦊', points: 1 },
  { emoji: '🐻', points: 2 },
  { emoji: '🐱', points: 1 },
  { emoji: '🐶', points: 2 },
  { emoji: '🐵', points: 3 },
  { emoji: '🦁', points: 2 },
  { emoji: '🐸', points: 1 },
  { emoji: '🐼', points: 3 },
  { emoji: '🐨', points: 2 },
  { emoji: '🐯', points: 3 },
];
const ENCOURAGE_MESSAGES = [
  { text: 'Great job! Keep going!', color: 'bg-green-200 text-green-800' },
  { text: 'Awesome! You are doing well!', color: 'bg-blue-200 text-blue-800' },
  { text: 'Fantastic! Stay relaxed!', color: 'bg-yellow-200 text-yellow-800' },
  { text: 'You rock! Keep it up!', color: 'bg-pink-200 text-pink-800' },
  { text: 'Amazing! Keep clicking!', color: 'bg-purple-200 text-purple-800' },
];
const GAME_BOX_WIDTH = 800;
const GAME_BOX_HEIGHT = 384;
const EMOJI_SIZE = 48;

function getRandomAnimal() {
  const idx = Math.floor(Math.random() * ANIMAL_EMOJIS.length);
  return ANIMAL_EMOJIS[idx];
}
function getRandomPosition() {
  const x = Math.random() * (GAME_BOX_WIDTH - EMOJI_SIZE);
  const y = Math.random() * (GAME_BOX_HEIGHT - EMOJI_SIZE);
  return { x, y };
}

export default function AnimalClickerGame({ onClose }) {
  const [score, setScore] = useState(0);
  const [emojis, setEmojis] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [encourage, setEncourage] = useState(null);

  const spawnEmoji = () => {
    const animal = getRandomAnimal();
    const pos = getRandomPosition();
    setEmojis((prev) => [
      ...prev,
      {
        id: Math.random(),
        emoji: animal.emoji,
        points: animal.points,
        x: pos.x,
        y: pos.y,
      },
    ]);
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setClicks(0);
    setEmojis([]);
    setEncourage(null);
    spawnEmoji();
  };

  const handleEmojiClick = (id, points) => {
    setEmojis((prev) => prev.filter((e) => e.id !== id));
    setScore((prev) => prev + points);
    setClicks((prev) => prev + 1);
    spawnEmoji();
  };

  const endGame = () => {
    setGameActive(false);
    setEmojis([]);
    setEncourage(null);
  };

  useEffect(() => {
    let interval;
    if (gameActive) {
      interval = setInterval(spawnEmoji, 2000);
    }
    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (clicks > 0 && clicks % 5 === 0) {
      const msg = ENCOURAGE_MESSAGES[Math.floor(Math.random() * ENCOURAGE_MESSAGES.length)];
      setEncourage(msg);
      const timeout = setTimeout(() => setEncourage(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [clicks]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <button
        className="absolute top-0 right-0 m-4 p-2 rounded-full bg-gray-200 dark:bg-[#233746] hover:bg-red-400 transition z-20"
        onClick={() => { onClose(); endGame(); }}
        title="Back to games"
      >
        <X className="w-7 h-7 text-gray-700 dark:text-white" />
      </button>
      {encourage && (
        <div className={`fixed left-1/2 -translate-x-1/2 mt-4 px-6 py-2 rounded-lg shadow-lg font-semibold text-lg z-50 ${encourage.color}`}
          style={{ top: '24px' }}>
          {encourage.text}
        </div>
      )}
      <h1 className="text-3xl font-bold text-blue-700 mb-4 mt-2">Relaxing Animal Game</h1>
      <p className="text-lg text-gray-600 mb-4">Enjoy clicking the animal emojis to relieve stress!</p>
      <div className="flex flex-col items-center space-y-4 mb-6">
        <p className="text-2xl text-blue-700">Score: {score}</p>
        {!gameActive ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={startGame}
          >
            Start Game
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={endGame}
          >
            End Game
          </button>
        )}
      </div>
      {/* Game Box */}
      <div
        className="relative bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center"
        style={{ width: `${GAME_BOX_WIDTH}px`, height: `${GAME_BOX_HEIGHT}px` }}
      >
        {emojis.map((emoji) => (
          <button
            key={emoji.id}
            className="absolute flex flex-col items-center justify-center text-4xl select-none focus:outline-none"
            style={{ left: emoji.x, top: emoji.y, width: `${EMOJI_SIZE}px`, height: `${EMOJI_SIZE}px` }}
            onClick={() => handleEmojiClick(emoji.id, emoji.points)}
            tabIndex={0}
          >
            <span>{emoji.emoji}</span>
            <span className="text-xs font-bold text-blue-600">+{emoji.points}</span>
          </button>
        ))}
      </div>
      {score > 0 && (
        <p className="mt-4 text-lg text-green-600 font-semibold">
          Well done! You have collected {score} points!
        </p>
      )}
    </div>
  );
} 