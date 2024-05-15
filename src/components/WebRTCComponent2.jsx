import React, { useState, useRef} from 'react';
import WrongCode from '../modals/WrongCode';

function WebRTCComponent2({ stream }) {
  const [roomCode, setRoomCode] = useState('');
  const [connected, setConnected] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const socketRef = useRef();
  const videoRef = useRef();
  const peerRef = useRef();
  const otherVideoRef = useRef();

  const handleJoinRoom = async () => {
    try {
      const response = await fetch('http://localhost:8000/validate-room-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room_code: roomCode }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          socketRef.current = new WebSocket(`ws://localhost:8000/ws/${roomCode}`);

          socketRef.current.onopen = () => {
            console.log(`Connected to room ${roomCode}`);
          };

          socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'offer') {
              handleReceiveOffer(message);
            } else if (message.type === 'answer') {
              handleAnswer(message);
            } else if (message.type === 'ice-candidate') {
              handleNewICECandidateMsg(message);
            }
          };

          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: false });
            videoRef.current.srcObject = stream;

            const peer = createPeer();
            stream.getTracks().forEach(track => peer.addTrack(track, stream));
            peerRef.current = peer;

            setConnected(true);
          } catch (err) {
            setModalMessage('Error accessing media devices: ' + err.message);
            setModalIsOpen(true);
          }
        }
      } else {
        throw new Error('Invalid room code');
      }
    } catch (error) {
      setModalMessage('Incorrect Room Code. Please try again.');
      setModalIsOpen(true);
    }
  };

  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.stunprotocol.org' },
        { urls: 'turn:TURN_SERVER_URL', username: 'TURN_USERNAME', credential: 'TURN_CREDENTIAL' },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;

    peer.createOffer().then(offer => {
      return peer.setLocalDescription(offer);
    }).then(() => {
      const payload = {
        type: 'offer',
        sdp: peer.localDescription,
        roomCode,
      };
      socketRef.current.send(JSON.stringify(payload));
    });

    return peer;
  };

  const handleReceiveOffer = (message) => {
    const peer = createPeer();
    peerRef.current = peer;

    const desc = new RTCSessionDescription(message.sdp);
    peer.setRemoteDescription(desc).then(() => {
      return navigator.mediaDevices.getUserMedia({ video: false, audio: false });
    }).then(stream => {
      videoRef.current.srcObject = stream;
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
    }).then(() => {
      return peer.createAnswer();
    }).then(answer => {
      return peer.setLocalDescription(answer);
    }).then(() => {
      const payload = {
        type: 'answer',
        sdp: peer.localDescription,
        roomCode,
      };
      socketRef.current.send(JSON.stringify(payload));
    }).catch(err => {
      setModalMessage('Error processing offer: ' + err.message);
      setModalIsOpen(true);
    });
  };

  const handleAnswer = (message) => {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch(e => {
      console.log(e);
      setModalMessage('Error setting remote description: ' + e.message);
      setModalIsOpen(true);
    });
  };

  const handleICECandidateEvent = (e) => {
    if (e.candidate) {
      const payload = {
        type: 'ice-candidate',
        candidate: e.candidate,
        roomCode,
      };
      socketRef.current.send(JSON.stringify(payload));
    }
  };

  const handleNewICECandidateMsg = (incoming) => {
    const candidate = new RTCIceCandidate(incoming.candidate);
    peerRef.current.addIceCandidate(candidate).catch(e => {
      console.log(e);
      setModalMessage('Error adding ICE candidate: ' + e.message);
      setModalIsOpen(true);
    });
  };

  const handleTrackEvent = (e) => {
    otherVideoRef.current.srcObject = e.streams[0];
  };

  return (
    <div>
      <WrongCode
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        message={modalMessage}
      />
      {!connected ? (
        <div>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter Room Code"
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <video ref={videoRef} autoPlay playsInline muted />
          <video ref={otherVideoRef} autoPlay playsInline />
        </div>
      )}
    </div>
  );
};

export default WebRTCComponent2;
