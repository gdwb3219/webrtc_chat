import React, { useEffect, useRef } from "react";
import VideoChat from "./VideoChat";
import { Link } from "react-router-dom";
import "../css/WebRTCComponent.css";
import ButtonBar from "./ButtonBar";

function WebRTCComponent({ stream }) {
  const ws = useRef(null);
  const peerConnection = useRef(null);
  // const dataChannel = useRef(null); // Data Channel 레퍼런스 추가

  // VidoeRef를 여기에서 처리해보자
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Web Socket 연결 useEffect
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
      } else {
        data = message.data;
        console.log("Blob 아니다.", data);
      }
      try {
        const jsonData = JSON.parse(data);
        console.log("Data 받았다.", jsonData);
        handleSignalingData(jsonData);
      } catch (e) {
        console.error("Error parsing JSON:", e);
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

  const createPeerConnection = () => {
    console.log("와드2 : createPeerConnection 함수 실행");
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun1.l.google.com:19302" }],
    });

    console.log("RTCPeerConnection created, setting up ICE candidate handler");

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Found ICE candidate!!!:", event.candidate);
        safeSend(
          JSON.stringify({ type: "candidate", candidate: event.candidate })
        );
      } else {
        console.log("End of candidates.");
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE Connection State Change: ", pc.iceConnectionState);
      if (
        pc.iceConnectionState === "connected" ||
        pc.iceConnectionState === "completed"
      ) {
        console.log("WebRTC connection established");
      } else if (pc.iceConnectionState === "disconnected") {
        console.log("ICE Connection State is disconnected. Attempting to reconnect...")
      }
    };

    pc.onicegatheringstatechange = () => {
      console.log("ICE Gathering State Change: ", pc.iceGatheringState);
    };

    // Data Channel 생성 및 이벤트 핸들러 설정
    // dataChannel.current = pc.createDataChannel("chat");
    const dataChannel = pc.createDataChannel("chat");
    dataChannel.onopen = () => {
      console.log("DataChannel is open");
    };
    dataChannel.onmessage = (event) => {
      console.log("DataChannel message received:", event.data);
    };
    dataChannel.onclose = () => {
      console.log("DataChannel is closed");
    };

    console.log("RTCPeerConnection setup complete");

    console.log("와드2 종료");
    return pc;
  };

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
    console.log("와드1 : createOffer 함수 실행");
    peerConnection.current = createPeerConnection();

    const offer = await peerConnection.current.createOffer();
    console.log("와드1-1 : offer 생성", offer);
    await peerConnection.current.setLocalDescription(offer);
    console.log("와드1-2 : local설명 설정");
    console.log(
      "Local description set:",
      peerConnection.current.localDescription
    );

    // 주기적으로 ICE 수집 상태를 확인하여 로그 출력
    const checkIceGatheringState = setInterval(() => {
      if (peerConnection.current) {
        console.log(
          "ICE Gathering State (interval):",
          peerConnection.current.iceGatheringState
        );
        if (peerConnection.current.iceGatheringState === "complete") {
          clearInterval(checkIceGatheringState);
        }
      }
    }, 1000);
    safeSend(JSON.stringify({ type: "offer", offer }));
    console.log("와드1 종료");
  };

  const createAnswer = async (offer) => {
    console.log("와드4 : createAnswer 함수 실행");

    peerConnection.current = createPeerConnection();

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    console.log("SetLocalDescription");
    safeSend(JSON.stringify({ type: "answer", answer }));
    console.log("와드4 종료");
  };

  const checkPeerConnectionState = () => {
    if (peerConnection.current) {
      console.log(
        "ICE Gathering State:",
        peerConnection.current.iceGatheringState
      );
      console.log(
        "ICE Connection State:",
        peerConnection.current.iceConnectionState
      );
      console.log("Signaling State:", peerConnection.current.signalingState);
    } else {
      console.log("PeerConnection is not initialized.");
    }
  };

  const handleSignalingData = (data) => {
    switch (data.type) {
      case "offer":
        console.log("offer 받았다.");
        createAnswer(data.offer);
        break;
      case "answer":
        console.log("answer 받았다.");
        peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        break;
      case "candidate":
        console.log("Candidate 받았다.");
        peerConnection.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    console.log("UseEffect 실행!");
    createOffer(); // Offer 생성 로직을 자동으로 실행하려면 여기에 추가
    console.log("createOffer 종료!");
    checkPeerConnectionState();
    console.log("ICE 데이터 확인");
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
