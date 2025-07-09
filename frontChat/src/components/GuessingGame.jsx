import React, { useState } from "react";
import { X } from "lucide-react";

function getRandomNumber() {
  return Math.floor(Math.random() * 20) + 1;
}

export default function GuessingGame({ onClose }) {
  const [target, setTarget] = useState(getRandomNumber());
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [won, setWon] = useState(false);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 20) {
      setMessage("Enter a number between 1 and 20.");
      return;
    }
    if (num === target) {
      setMessage("Congratulations! You guessed it!");
      setWon(true);
    } else if (num < target) {
      setMessage("Too low! Try again.");
    } else {
      setMessage("Too high! Try again.");
    }
  };

  const reset = () => {
    setTarget(getRandomNumber());
    setGuess("");
    setMessage("");
    setWon(false);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-[400px]">
      <button
        className="absolute top-0 right-0 m-4 p-2 rounded-full bg-gray-200 dark:bg-[#233746] hover:bg-red-400 transition z-20"
        onClick={onClose}
        title="Back to games"
      >
        <X className="w-7 h-7 text-gray-700 dark:text-white" />
      </button>
      <h1 className="text-3xl font-bold text-cyan-700 mb-4 mt-2">Guessing Game</h1>
      <p className="text-lg text-gray-600 mb-4">Guess the number between 1 and 20!</p>
      <div className="flex flex-col items-center gap-4 mt-8">
        <input
          type="number"
          min={1}
          max={20}
          value={guess}
          onChange={e => setGuess(e.target.value)}
          className="w-32 p-2 rounded-lg border-2 text-xl text-center focus:outline-none bg-white dark:bg-[#183642] border-cyan-400"
          disabled={won}
        />
        <button
          className="px-6 py-2 rounded-full font-semibold shadow transition bg-[#1797A6] text-white hover:opacity-90"
          onClick={handleGuess}
          disabled={won}
        >
          Guess
        </button>
        <button
          className="px-6 py-2 rounded-full font-semibold shadow transition bg-gray-300 text-gray-800 hover:opacity-90"
          onClick={reset}
        >
          Play Again
        </button>
        {message && <p className="mt-2 text-lg font-semibold text-cyan-700 dark:text-cyan-200">{message}</p>}
      </div>
    </div>
  );
} 