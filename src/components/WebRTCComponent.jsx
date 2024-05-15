import React, { useEffect, useRef } from "react";
import VideoChat from "./VideoChat";
import { Link } from "react-router-dom";
import "../css/WebRTCComponent.css";
import ButtonBar from "./ButtonBar";

function WebRTCComponent({ stream }) {
  const ws = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080"); // 시그널링 서버 URL
    ws.current.onopen = () => {
      console.log("Connected to the signaling server");
    };

    // message 받은 걸 JSON 객체로 변환
    ws.current.onmessage = async (message) => {
      let data;
      if (message.data instanceof Blob) {
        data = await message.data.text();
        console.log("Blob이다", data)
      } else {
        data = message.data;
        console.log("Blob 아니다.", data)
      }
      try {
        const jsonData = JSON.parse(data);
        console.log("Data 받았다.", jsonData)
        handleSignalingData(jsonData);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    };

    // 연결 종료
    ws.current.onclose = () =>
      console.log("Disconnected from the signaling server");

    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
      ws.current.close();
    };
  }, []);

  // safe Send 함수로 상대방에게 Data를 전달
  const safeSend = (data) => {
    // 나한테는 보내지 않음 && 상대방이 Open인 경우만 보냄
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    } else {
      console.error("WebSocket is not open.");
      // 여기서 재연결 로직이나 재시도 로직을 추가할 수도 있습니다.
    }
  };

  const createOffer = async () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        safeSend({ type: "candidate", candidate: event.candidate });
      }
    };


    // ICE 연결 상태 변경 이벤트 핸들러
    peerConnection.current.oniceconnectionstatechange = () => {
      console.log("ICE Connection State Change: ", peerConnection.current.iceConnectionState);
      if (peerConnection.current.iceConnectionState === 'connected' || peerConnection.current.iceConnectionState === 'completed') {
        console.log("WebRTC connection established");
      }
    };

    // ICE Candidate 이벤트 핸들러
    peerConnection.current.onicecandidate = (event) => {

      if (event.candidate) {
        safeSend(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      }
    };

    // 미디어 트랙 설정, 여기서는 getUserMedia 등을 사용하여 로컬 미디어를 설정할 수 있음

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    safeSend(JSON.stringify({ type: "offer", offer }));
  };

  const createAnswer = async (offer) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
    });
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        
        safeSend(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      }
    };

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    safeSend(JSON.stringify({ type: "answer", answer }));
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
      <div>
        <div>
          <div className='video-container'>
            <VideoChat />
          </div>
        </div>
        <div className='under-nav'>
          <ButtonBar />
        </div>
      </div>
    </>
  );
}

export default WebRTCComponent;
