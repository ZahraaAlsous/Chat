import React, { useState } from "react";
import { X } from "lucide-react";

const affirmations = [
  "You are strong and resilient.",
  "This feeling is temporary.",
  "You are worthy of love and support.",
  "Every day is a new beginning.",
  "You are not alone.",
  "You can do this!",
];

export default function AffirmationsGame({ onClose }) {
  const [affirmIdx, setAffirmIdx] = useState(0);
  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-[400px]">
      <button
        className="absolute top-0 right-0 m-4 p-2 rounded-full bg-gray-200 dark:bg-[#233746] hover:bg-red-400 transition z-20"
        onClick={onClose}
        title="Back to games"
      >
        <X className="w-7 h-7 text-gray-700 dark:text-white" />
      </button>
      <h1 className="text-3xl font-bold text-yellow-700 mb-4 mt-2">Positive Affirmations</h1>
      <p className="text-lg text-gray-600 mb-4">Read and repeat the affirmation below:</p>
      <div className="flex flex-col items-center justify-center mt-8">
        <div className="w-full max-w-xl bg-yellow-100 dark:bg-yellow-300/20 rounded-xl shadow-lg p-10 text-center text-2xl font-semibold text-yellow-900 dark:text-yellow-200">
          {affirmations[affirmIdx]}
        </div>
        <div className="flex gap-4 mt-8">
          <button
            className="px-6 py-2 rounded-full font-semibold shadow transition bg-[#1797A6] text-white hover:opacity-90"
            onClick={() => setAffirmIdx((prev) => (prev + 1) % affirmations.length)}
          >
            Next
          </button>
          <button
            className="px-6 py-2 rounded-full font-semibold shadow transition bg-gray-300 text-gray-800 hover:opacity-90"
            onClick={() => setAffirmIdx((prev) => (prev - 1 + affirmations.length) % affirmations.length)}
          >
            Previous
          </button>
        </div>
      </div>
    </div>
  );
} 