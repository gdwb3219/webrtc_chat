import React, { useEffect, useRef, useState } from "react";

function VideoChat() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  const [stream, setStream] = useState(null);

  useEffect(() => {
    const servers = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // Google's public STUN server
      ],
    };

    peerConnection.current = new RTCPeerConnection(servers);
    peerConnection.current.ontrack = handleTrackEvent;
    peerConnection.current.onicecandidate = handleICECandidateEvent;

    // Get local media stream
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("미디어 스트림을 가져오는데 실패했습니다.", error);
      }
    };

    getMedia();
    // const mediaStream = await navigator.medi

    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((stream) => {
    //     localVideoRef.current.srcObject = stream;
    //     stream
    //       .getTracks()
    //       .forEach((track) => peerConnection.current.addTrack(track, stream));
    //   })
    //   .catch((error) => console.error("Stream error: ", error));

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
        // localVideoRef.current.srcObject &&
        //   localVideoRef.current.srcObject
        //     .getTracks()
        //     .forEach((track) => track.stop());
      }
      stream && stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleTrackEvent = (event) => {
    remoteVideoRef.current.srcObject = event.streams[0];
  };

  const handleICECandidateEvent = (event) => {
    if (event.candidate) {
      // Send the candidate to the remote peer
    }
  };

  const createOffer = () => {
    peerConnection.current
      .createOffer()
      .then((sdp) => peerConnection.current.setLocalDescription(sdp))
      .then(() => {
        // Send the offer to the remote peer
      });
  };

  const handleStop = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const createAnswer = (offer) => {
    peerConnection.current
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => peerConnection.current.createAnswer())
      .then((sdp) => peerConnection.current.setLocalDescription(sdp))
      .then(() => {
        // Send the answer to the remote peer
      });
  };
  return (
    <>
      <div>
        <video ref={localVideoRef} autoPlay playsInline></video>
        <video ref={remoteVideoRef} autoPlay playsInline></video>
        <button onClick={createOffer}>Call</button>
        <button onClick={handleStop}>Video Stop</button>
      </div>
    </>
  );
}

export default VideoChat;
