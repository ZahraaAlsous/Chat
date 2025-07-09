import { useState, useEffect } from "react";
import { PhoneOff, Video, VideoOff } from "lucide-react";

function CallInterface({
  socket,
  chatId,
  onHangUp,
  videoEnabled,
  setVideoEnabled,
}) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((sec) => sec + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white z-50">
      <h2 className="text-xl mb-2">
        {videoEnabled ? "Video Call in Progress" : "Voice Call in Progress"}
      </h2>
      <p className="mb-4 text-sm text-gray-300">
        Call Duration: {formatTime(seconds)}
      </p>

      {/* Simulated video window */}
      {videoEnabled && (
        <div className="w-60 h-40 bg-gray-800 mb-4 flex items-center justify-center rounded">
          <span>🎥 Video Feed</span>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => setVideoEnabled(!videoEnabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            videoEnabled
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {videoEnabled ? (
            <VideoOff className="w-4 h-4" />
          ) : (
            <Video className="w-4 h-4" />
          )}
          {videoEnabled ? "Turn Off Video" : "Turn On Video"}
        </button>

        <button
          onClick={onHangUp}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          <PhoneOff className="w-4 h-4" />
          Hang Up
        </button>
      </div>
    </div>
  );
}

export default CallInterface;
