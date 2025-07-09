import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // match your backend port

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VoiceCallWithCameraToggle() {
  const [myID, setMyID] = useState(null);
  const [callTo, setCallTo] = useState("");
  const [inCall, setInCall] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const peerConnection = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      setMyID(socket.id);
    });

    // Incoming call signal
    socket.on("incomingCall", async ({ from, offer }) => {
      await setupPeerConnection(from);

      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answerCall", { to: from, answer });
      setInCall(true);
    });

    // Answer received
    socket.on("callAnswered", async ({ answer }) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
      setInCall(true);
    });

    socket.on("webrtcIceCandidate", async ({ candidate }) => {
      try {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (e) {
        console.error("Error adding ICE candidate", e);
      }
    });

    socket.on("callEnded", () => {
      endCall();
    });

    return () => {
      // keep socket connection for app lifetime
    };
  }, []);

  const setupPeerConnection = async (remoteSocketId) => {
    peerConnection.current = new RTCPeerConnection(configuration);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtcIceCandidate", {
          to: remoteSocketId,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Start with audio only
    localStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
    }

    // Add tracks to peer connection
    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });
  };

  const startCall = async () => {
    if (!callTo) return alert("Enter ID to call");

    await setupPeerConnection(callTo);

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("callUser", { to: callTo, offer });
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setInCall(false);
    setCameraOn(false);
  };

  const toggleCamera = async () => {
    if (!localStream.current || !peerConnection.current) return;

    if (cameraOn) {
      // Turn camera off: remove video tracks & senders
      const senders = peerConnection.current.getSenders();

      localStream.current.getVideoTracks().forEach((track) => {
        track.stop();
        localStream.current.removeTrack(track);
      });

      senders.forEach((sender) => {
        if (sender.track && sender.track.kind === "video") {
          peerConnection.current.removeTrack(sender);
        }
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }
      setCameraOn(false);
    } else {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const videoTrack = videoStream.getVideoTracks()[0];
        localStream.current.addTrack(videoTrack);
        peerConnection.current.addTrack(videoTrack, localStream.current);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }
        setCameraOn(true);
      } catch (err) {
        console.error("Could not get video:", err);
      }
    }
  };

  return (
    <div>
      <h2>Your ID: {myID}</h2>
      <input
        placeholder="ID to call"
        value={callTo}
        onChange={(e) => setCallTo(e.target.value)}
        disabled={inCall}
      />
      <button onClick={startCall} disabled={inCall}>
        Call
      </button>
      <button onClick={endCall} disabled={!inCall}>
        End Call
      </button>
      <button onClick={toggleCamera} disabled={!inCall}>
        {cameraOn ? "Turn Camera Off" : "Turn Camera On"}
      </button>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: 200,
            border: "1px solid black",
            backgroundColor: "#000",
          }}
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{
            width: 200,
            border: "1px solid black",
            backgroundColor: "#000",
          }}
        />
      </div>
    </div>
  );
}
