import { useEffect, useState } from "react";
import CallCard from "../components/CallCard.jsx";
import Navbar from "../components/Navbar";

export default function CallHistoryPage() {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    const fetchedCalls = [
      {
        id: 1,
        name: "LunaFox",
        avatar: "/avatars/lunafox.png",
        type: "voice",
        direction: "incoming",
        status: "missed",
        timestamp: "2 hours ago",
      },
      {
        id: 2,
        name: "BearBreeze",
        avatar: "/avatars/bearbreeze.png",
        type: "video",
        direction: "outgoing",
        status: "received",
        timestamp: "5 hours ago",
      },
    ];
    setCalls(fetchedCalls);
  }, []);

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#233746]">
      <Navbar />
      <main className="flex-1 p-6 overflow-y-auto min-h-screen">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-black dark:text-[#F3F6F9]">
          Call History
        </h1>
        <div className="space-y-4 max-w-2xl mx-auto">
          {calls.map((call) => (
            <CallCard key={call.id} call={call} />
          ))}
        </div>
      </main>
    </div>
  );
}
