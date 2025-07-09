import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Card, CardContent } from "../components/ui/card";
import AnimalClickerGame from "../components/AnimalClickerGame";
import SudokuGame from "../components/SudokuGame";
import TicTacToeGame from "../components/TicTacToeGame";
import GuessingGame from "../components/GuessingGame";
import { PawPrint, Grid, Circle, Target, Gamepad } from "lucide-react";

const gameCards = [
  {
    id: "animal",
    title: "Animal Clicker",
    desc: "Click the animal emoji to relieve stress and collect points!",
    icon: PawPrint,
    color: "#183642",
  },
  {
    id: "sudoku",
    title: "Sudoku 4x4",
    desc: "Fill the grid so every row, column, and box contains 1-4.",
    icon: Grid,
    color: "#183642",
  },
  {
    id: "tictactoe",
    title: "Tic Tac Toe",
    desc: "Play X O with a friend!",
    icon: Circle,
    color: "#183642",
  },
  {
    id: "guess",
    title: "Guessing Game",
    desc: "Guess the number between 1 and 20!",
    icon: Target,
    color: "#183642",
  },
];

export default function GamesPage() {
  const [view, setView] = useState("cards"); // 'cards', 'animal', 'sudoku', 'tictactoe', 'guess'

  return (
    <div className="min-h-screen flex relative bg-gradient-to-br from-[#f6fafd] via-[#e0f7fa] to-[#b2ebf2] dark:from-[#1a2a32] dark:via-[#183642] dark:to-[#1797A6]">
      <Navbar />
      {/* خلفية أيقونات شفافة */}
      <div className="pointer-events-none select-none absolute inset-0 z-0">
        <Gamepad className="absolute top-10 left-20 w-32 h-32 text-[#1797A6] opacity-10" />
        <PawPrint className="absolute bottom-24 left-1/3 w-28 h-28 text-[#183642] opacity-10" />
        <Grid className="absolute top-1/2 right-24 w-24 h-24 text-[#1797A6] opacity-10" />
        <Target className="absolute bottom-10 right-1/4 w-32 h-32 text-[#183642] opacity-10" />
        <Circle className="absolute top-1/4 right-1/3 w-20 h-20 text-[#1797A6] opacity-10" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen bg-transparent relative z-10">
        {view === "cards" && (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1797A6] mb-8 text-center drop-shadow-lg">
              Ready for some fun? Challenge yourself and enjoy the games!
            </h2>
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {gameCards.map((card) => (
                <Card
                  key={card.id}
                  className={`cursor-pointer transition-transform duration-200 shadow-lg hover:shadow-2xl hover:scale-105`}
                  style={{ background: card.color }}
                  onClick={() => setView(card.id)}
                >
                  <CardContent className="flex flex-col items-center justify-center min-h-[320px]">
                    <span className="text-6xl mb-4 text-white drop-shadow">
                      {card.emoji}
                    </span>
                    {card.icon && (
                      <card.icon className="w-14 h-14 mb-4 text-white" />
                    )}
                    <h2 className="text-2xl font-bold mb-2 text-white drop-shadow">
                      {card.title}
                    </h2>
                    <p className="text-lg text-white text-center mb-4">
                      {card.desc}
                    </p>
                    <button className="mt-auto px-6 py-2 rounded-full font-semibold shadow transition bg-[#1797A6] text-white hover:opacity-90">
                      Play
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
        {view === "animal" && (
          <AnimalClickerGame onClose={() => setView("cards")} />
        )}
        {view === "sudoku" && <SudokuGame onClose={() => setView("cards")} />}
        {view === "tictactoe" && (
          <TicTacToeGame onClose={() => setView("cards")} />
        )}
        {view === "guess" && <GuessingGame onClose={() => setView("cards")} />}
      </div>
    </div>
  );
}
