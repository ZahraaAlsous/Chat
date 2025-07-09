import React, { useState, useEffect, useRef } from "react";

function IncomingCall({ userId, signalingSocket, onCallAccepted }) {
  const [incomingOffer, setIncomingOffer] = useState(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (!signalingSocket) return;

    signalingSocket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "offer" && data.to === userId) {
        console.log("Incoming call offer", data);
        setIncomingOffer(data.offer);
      }
    };
  }, [signalingSocket, userId]);

  async function acceptCall() {
    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    localStreamRef.current = stream;
    stream
      .getTracks()
      .forEach((track) => pcRef.current.addTrack(track, stream));

    pcRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        signalingSocket.send(
          JSON.stringify({
            type: "ice-candidate",
            candidate: event.candidate,
            to: "callerUserId", // Replace with caller ID or manage dynamically
            from: userId,
          })
        );
      }
    };

    await pcRef.current.setRemoteDescription(
      new RTCSessionDescription(incomingOffer)
    );
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    signalingSocket.send(
      JSON.stringify({
        type: "answer",
        answer,
        to: "callerUserId", // Replace with caller ID
        from: userId,
      })
    );

    if (onCallAccepted) onCallAccepted(pcRef.current);
    setIncomingOffer(null);
  }

  function declineCall() {
    setIncomingOffer(null);
    signalingSocket.send(
      JSON.stringify({
        type: "call-declined",
        to: "callerUserId", // Replace with caller ID
        from: userId,
      })
    );
  }

  if (!incomingOffer) return <div>No incoming calls</div>;

  return (
    <div>
      <h3>Incoming call</h3>
      <button onClick={acceptCall}>Accept</button>
      <button onClick={declineCall}>Decline</button>
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
}

export default IncomingCall;
