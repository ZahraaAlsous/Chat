import React, { useState, useEffect, useRef } from "react";

function AudioCallWithCamera({ callerName = "Unknown", callerImage = null }) {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callDeclined, setCallDeclined] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let interval;
    if (callAccepted && !callEnded) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callAccepted, callEnded]);

  useEffect(() => {
    if (cameraOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Camera error:", err);
          alert("Could not start the camera. Please check permissions.");
          setCameraOn(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, [cameraOn]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const resetCall = () => {
    setCallAccepted(false);
    setCallEnded(false);
    setCallDeclined(false);
    setCallDuration(0);
    setCameraOn(false);
    setRating(0);
    setHoverRating(0);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 font-sans text-right direction-rtl
        bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#075E54]
        bg-[length:200%_200%] animate-gradientMove text-white"
    >
      {/* Incoming Call Screen */}
      {!callAccepted && !callEnded && !callDeclined && (
        <div
          className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-xl w-full max-w-2xl p-8 text-center"
          style={{ color: "white", textShadow: "0 0 6px rgba(0,0,0,0.9)" }}
        >
          <h2 className="text-4xl font-extrabold mb-4">📞 Incoming Call</h2>
          <p className="text-xl mb-6">
            From: <span className="font-semibold">{callerName}</span>
          </p>
          <div className="flex justify-center space-x-8 rtl:space-x-reverse">
            <button
              onClick={() => setCallAccepted(true)}
              className="bg-[#25D366] hover:bg-[#1ebe58] text-white px-10 py-4 rounded-full text-lg shadow-lg 
                         transition-transform transform hover:scale-105 active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1ebe58]"
            >
              ✅ Accept
            </button>
            <button
              onClick={() => {
                setCallDeclined(true);
                setCallAccepted(false);
                setCallEnded(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full text-lg shadow-lg
                         transition-transform transform hover:scale-105 active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
            >
              ❌ Decline
            </button>
          </div>
        </div>
      )}

      {/* Ongoing Call Screen */}
      {callAccepted && !callEnded && !callDeclined && (
        <div
          className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-xl w-full max-w-3xl p-8 flex flex-col items-center space-y-6"
          style={{ color: "white", textShadow: "0 0 5px rgba(0,0,0,0.8)" }}
        >
          <div className="w-full flex justify-between items-center mb-4">
            <h2 className="text-2xl font-extrabold">{callerName}</h2>
            <span className="text-green-300 font-mono text-lg">
              {formatTime(callDuration)}
            </span>
          </div>

          {/* Caller Image or Video */}
          {!cameraOn ? (
            <div className="flex flex-col items-center space-y-6 w-full ">
              {callerImage ? (
                <img
                  src={callerImage}
                  alt="Caller"
                  className="rounded-full w-36 h-36 object-cover ring-4 ring-purple-400 shadow-lg
                             hover:scale-105 transform transition-transform duration-300 "
                />
              ) : (
                <div
                  className="bg-gray-300 rounded-full w-36 h-36 flex items-center justify-center text-5xl font-bold text-gray-600
                                hover:scale-105 transform transition-transform duration-300 "
                >
                  {callerName.charAt(0)}
                </div>
              )}
              <button
                onClick={() => setCameraOn(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-lg shadow-lg
                           transition-transform transform hover:scale-105 active:scale-95
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-700 "
              >
                🎥 Turn Camera On
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full max-w-2xl h-[400px] bg-black rounded-2xl mb-4 shadow-lg
                         hover:scale-105 transform transition-transform duration-300 blur-xl"
              autoPlay
              playsInline
              muted
            />
          )}

          <button
            onClick={() => {
              setCallEnded(true);
              setCallAccepted(false);
              setCameraOn(false);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full text-lg shadow-lg
                       transition-transform transform hover:scale-105 active:scale-95 mt-2
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
          >
            📴 End Call
          </button>
        </div>
      )}

      {/* Rating Screen */}
      {callEnded && !callDeclined && (
        <div
          className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-xl w-full max-w-md p-8 text-center "
          style={{ color: "white", textShadow: "0 0 6px rgba(0,0,0,0.9)" }}
        >
          <h2 className="text-3xl font-extrabold mb-6">⭐️ Rate the Call</h2>
          <div className="flex justify-center gap-3 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                filled={star <= (hoverRating || rating)}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
          {rating > 0 && (
            <p className="text-lg mb-4">
              Thanks for rating {rating} star{rating > 1 ? "s" : ""} 🌟
            </p>
          )}
          <button
            onClick={resetCall}
            className="bg-purple-700 hover:bg-purple-800 text-white px-10 py-4 rounded-full text-lg shadow-lg
                       transition-transform transform hover:scale-105 active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-800"
          >
            🔄 Call Again
          </button>
        </div>
      )}

      {/* Declined Call Screen */}
      {callDeclined && (
        <div
          className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-xl w-full max-w-md p-8 text-center"
          style={{ color: "white", textShadow: "0 0 6px rgba(0,0,0,0.9)" }}
        >
          <h2 className="text-3xl font-extrabold mb-6">❌ Call Declined</h2>
          <button
            onClick={() => {
              setCallDeclined(false);
              resetCall();
            }}
            className="bg-purple-700 hover:bg-purple-800 text-white px-10 py-4 rounded-full text-lg shadow-lg
                       transition-transform transform hover:scale-105 active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-800"
          >
            🔄 Call
          </button>
        </div>
      )}

      {/* Background animation */}
      <style>{`
        @keyframes gradientMove {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradientMove {
          animation: gradientMove 15s ease infinite;
        }
      `}</style>
    </div>
  );
}

// Star Component
function Star({ filled, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <svg
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      xmlns="http://www.w3.org/2000/svg"
      className={`w-8 h-8 cursor-pointer transition-colors duration-300  ${
        filled ? "text-yellow-400" : "text-gray-300"
      }`}
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  );
}

export default AudioCallWithCamera;
