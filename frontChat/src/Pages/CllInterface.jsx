import React from "react";

function CallInterface({
  socket,
  chatId,
  onHangUp,
  videoEnabled,
  setVideoEnabled,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white z-50">
      <h2 className="text-xl mb-4">
        {videoEnabled ? "Video Call" : "Voice Call"} in progress...
      </h2>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setVideoEnabled(false)}
          className={`px-4 py-2 rounded border ${
            !videoEnabled ? "border-white" : "border-gray-600"
          }`}
        >
          Voice
        </button>
        <button
          onClick={() => setVideoEnabled(true)}
          className={`px-4 py-2 rounded border ${
            videoEnabled ? "border-white" : "border-gray-600"
          }`}
        >
          Video
        </button>
      </div>
      <button
        onClick={onHangUp}
        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
      >
        Hang Up
      </button>
    </div>
  );
}
