import React, { useState } from "react";
import { X as CloseIcon } from "lucide-react";

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function TicTacToeGame({ onClose }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  const handleClick = (i) => {
    if (squares[i] || winner) return;
    setSquares(sq => sq.map((val, idx) => idx === i ? (xIsNext ? 'X' : 'O') : val));
    setXIsNext(x => !x);
  };

  const reset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-[400px]">
      <button
        className="absolute top-0 right-0 m-4 p-2 rounded-full bg-gray-200 dark:bg-[#233746] hover:bg-red-400 transition z-20"
        onClick={onClose}
        title="Back to games"
      >
        <CloseIcon className="w-7 h-7 text-gray-700 dark:text-white" />
      </button>
      <h1 className="text-3xl font-bold text-pink-700 mb-4 mt-2">Tic Tac Toe</h1>
      <p className="text-lg text-gray-600 mb-4">Play X O with a friend!</p>
      <div className="grid grid-cols-3 gap-2 bg-white dark:bg-[#233746] p-4 rounded-xl shadow-lg">
        {squares.map((val, i) => (
          <button
            key={i}
            className={`w-16 h-16 text-3xl font-bold rounded-lg border-2 focus:outline-none transition ${val === 'X' ? 'text-pink-700' : val === 'O' ? 'text-cyan-700' : 'text-gray-400'} bg-white dark:bg-[#183642]`}
            onClick={() => handleClick(i)}
            disabled={!!val || winner}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {winner && <p className="text-xl font-semibold text-pink-700">Winner: {winner}</p>}
        {isDraw && <p className="text-xl font-semibold text-gray-700">Draw!</p>}
      </div>
      <button
        className="mt-4 px-6 py-2 rounded-full font-semibold shadow transition bg-[#1797A6] text-white hover:opacity-90"
        onClick={reset}
      >
        Reset
      </button>
    </div>
  );
} 