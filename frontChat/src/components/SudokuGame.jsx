import React, { useState } from "react";
import { X } from "lucide-react";

const initialBoard = [
  [1, '', '', 4],
  ['', 3, '', ''],
  ['', '', 2, ''],
  [2, '', '', 3],
];
const solution = [
  [1, 2, 3, 4],
  [4, 3, 1, 2],
  [3, 4, 2, 1],
  [2, 1, 4, 3],
];

export default function SudokuGame({ onClose }) {
  const [board, setBoard] = useState(initialBoard);
  const [message, setMessage] = useState("");

  const handleChange = (r, c, val) => {
    if (initialBoard[r][c] !== '') return;
    if (!/^\d?$/.test(val)) return;
    setBoard((prev) => prev.map((row, i) => i === r ? row.map((cell, j) => j === c ? val : cell) : row));
  };

  const checkSolution = () => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (parseInt(board[r][c]) !== solution[r][c]) {
          setMessage("Try again! Some values are incorrect.");
          return;
        }
      }
    }
    setMessage("Congratulations! You solved the Sudoku!");
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
      <h1 className="text-3xl font-bold text-purple-700 mb-4 mt-2">Sudoku 4x4</h1>
      <p className="text-lg text-gray-600 mb-4">Fill the grid so every row, column, and 2x2 box contains 1-4.</p>
      <div className="grid grid-cols-4 gap-2 bg-white dark:bg-[#233746] p-4 rounded-xl shadow-lg">
        {board.map((row, r) => row.map((cell, c) => (
          <input
            key={r + '-' + c}
            className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none ${initialBoard[r][c] !== '' ? 'bg-gray-200 dark:bg-[#2b4f56] text-gray-500' : 'bg-white dark:bg-[#183642] text-purple-700 dark:text-purple-200'}`}
            value={cell}
            onChange={e => handleChange(r, c, e.target.value)}
            maxLength={1}
            disabled={initialBoard[r][c] !== ''}
            inputMode="numeric"
          />
        )))}
      </div>
      <button
        className="mt-6 px-6 py-2 rounded-full font-semibold shadow transition bg-[#1797A6] text-white hover:opacity-90"
        onClick={checkSolution}
      >
        Check Solution
      </button>
      {message && <p className="mt-4 text-lg font-semibold text-purple-700 dark:text-purple-200">{message}</p>}
    </div>
  );
} 