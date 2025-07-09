import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Card, CardContent } from "../components/ui/card";
import BreathingGame from "../components/BreathingGame";
import AffirmationsGame from "../components/AffirmationsGame";
import RelaxingMusicPlayer from "../components/RelaxingMusicPlayer";
import { HeartPulse, MessageCircle, Music, Cloud, Smile } from "lucide-react";

const therapyCards = [
  {
    id: "breath",
    title: "Breathing Exercise",
    desc: "Follow the guided breathing to relax and calm your mind.",
    icon: HeartPulse,
    color: "#183642",
  },
  {
    id: "affirm",
    title: "Positive Affirmations",
    desc: "Read and repeat positive affirmations to boost your mood.",
    icon: MessageCircle,
    color: "#183642",
  },
  {
    id: "music",
    title: "Relaxing Music",
    desc: "Listen to calming music and enjoy beautiful, relaxing images.",
    icon: Music,
    color: "#183642",
  },
];

export default function TherapyPage() {
  const [view, setView] = useState("cards"); // 'cards', 'breath', 'affirm', 'music'

  return (
    <div className="min-h-screen flex relative bg-gradient-to-br from-[#f6fafd] via-[#e0f7fa] to-[#b2ebf2] dark:from-[#1a2a32] dark:via-[#183642] dark:to-[#1797A6]">
      <Navbar />
      {/* خلفية أيقونات شفافة */}
      <div className="pointer-events-none select-none absolute inset-0 z-0">
        <HeartPulse className="absolute top-10 left-16 w-32 h-32 text-[#1797A6] opacity-10" />
        <Music className="absolute bottom-24 left-1/3 w-28 h-28 text-[#183642] opacity-10" />
        <MessageCircle className="absolute top-1/2 right-24 w-24 h-24 text-[#1797A6] opacity-10" />
        <Cloud className="absolute bottom-10 right-1/4 w-32 h-32 text-[#183642] opacity-10" />
        <Smile className="absolute top-1/4 right-1/3 w-20 h-20 text-[#1797A6] opacity-10" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen bg-transparent relative z-10">
        {view === "cards" && (
          <React.Fragment>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1797A6] mb-8 text-center drop-shadow-lg">
              You are in a safe, supportive space. Take a deep breath and let
              yourself grow.
            </h2>
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {therapyCards.map((card) => (
                <Card
                  key={card.id}
                  className={`cursor-pointer transition-transform duration-200 shadow-lg hover:shadow-2xl hover:scale-105`}
                  style={{ background: card.color }}
                  onClick={() => setView(card.id)}
                >
                  <CardContent className="flex flex-col items-center justify-center min-h-[320px]">
                    <span className="text-5xl mb-4">{card.emoji}</span>
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
                      Start
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </React.Fragment>
        )}
        {view === "breath" && (
          <BreathingGame onClose={() => setView("cards")} />
        )}
        {view === "affirm" && (
          <AffirmationsGame onClose={() => setView("cards")} />
        )}
        {view === "music" && (
          <RelaxingMusicPlayer onClose={() => setView("cards")} />
        )}
      </div>
    </div>
  );
}
