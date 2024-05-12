import React, { useEffect, useRef } from "react";
import VideoChat from "../components/VideoChat";
import { Link } from "react-router-dom";

function WebRTCComponent({ stream }) {
  const ws = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080"); // 시그널링 서버 URL
    ws.current.onopen = () => {
      console.log("Connected to the signaling server");
    };
    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      handleSignalingData(data);
    };
    ws.current.onclose = () =>
      console.log("Disconnected from the signaling server");

    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
      ws.current.close();
    };
  }, []);

  const createOffer = async () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // ICE Candidate 이벤트 핸들러
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current.send(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      }
    };

    // 미디어 트랙 설정, 여기서는 getUserMedia 등을 사용하여 로컬 미디어를 설정할 수 있음

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    ws.current.send(JSON.stringify({ type: "offer", offer }));
  };

  const createAnswer = async (offer) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current.send(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      }
    };

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    ws.current.send(JSON.stringify({ type: "answer", answer }));
  };

  const handleSignalingData = (data) => {
    switch (data.type) {
      case "offer":
        createAnswer(data.offer);
        break;
      case "answer":
        peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        break;
      case "candidate":
        peerConnection.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    createOffer(); // Offer 생성 로직을 자동으로 실행하려면 여기에 추가
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const handleStop = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  return (
    <>
      <div>WebRTC and Signaling Example</div>
      <div>
        <div>
          <div className='video-box'>
            <div className='v-stream me-vdo'>
              <VideoChat />
            </div>
            <div className='v-stream you-vdo'>
              <VideoChat />
            </div>
          </div>

          <button onClick={handleStop}>
            <Link to='/'> Home </Link>
          </button>
        </div>
      </div>
    </>
  );
}

export default WebRTCComponent;
