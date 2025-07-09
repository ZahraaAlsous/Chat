import { useEffect, useRef } from "react";

const VoiceCall = ({ socket, chatId, isVideo }) => {
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const constraints = isVideo
      ? { audio: true, video: true }
      : { audio: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (localStreamRef.current) {
          if (isVideo) {
            localStreamRef.current.srcObject = stream;
          } else {
            // For audio only, attach stream to hidden audio element
            localStreamRef.current.srcObject = stream;
          }

          stream.getTracks().forEach((track) => {
            peerConnection.current.addTrack(track, stream);
          });
        }
      })
      .catch((err) => {
        console.error("Media error:", err);
      });

    peerConnection.current.ontrack = (event) => {
      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtcIceCandidate", {
          chatId,
          candidate: event.candidate,
        });
      }
    };

    socket.emit("joinRoom", { chatId });

    socket.on("webrtcOffer", async ({ offer }) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("webrtcAnswer", { chatId, answer });
    });

    socket.on("webrtcAnswer", async ({ answer }) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("webrtcIceCandidate", async ({ candidate }) => {
      try {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (err) {
        console.error("Error adding received ICE candidate", err);
      }
    });

    const startCall = async () => {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("webrtcOffer", { chatId, offer });
    };

    startCall();

    return () => {
      socket.off("webrtcOffer");
      socket.off("webrtcAnswer");
      socket.off("webrtcIceCandidate");
      peerConnection.current.close();
    };
  }, [socket, chatId, isVideo]);

  return (
    <div>
      {isVideo ? (
        <>
          <video
            ref={localStreamRef}
            autoPlay
            muted
            className="w-24 h-24 rounded-lg object-cover"
          />
          <video
            ref={remoteStreamRef}
            autoPlay
            className="w-full rounded-lg object-cover"
          />
        </>
      ) : (
        <>
          <audio ref={localStreamRef} autoPlay muted />
          <audio ref={remoteStreamRef} autoPlay />
        </>
      )}
    </div>
  );
};

export default VoiceCall;
