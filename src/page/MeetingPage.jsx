import React, { useEffect, useState } from "react";
import VideoChat from "../components/VideoChat";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

function MeetingPage({ stream }) {
  const [socket, setSocket] = useState(null);
  const [socketStatus, setSocketStatus] = useState("Disconneted"); // 연결 상태
  const [messages, setMessage] = useState([]);
  useEffect(() => {
    // socket.io-client를 사용하여 연결
    const newSocket = io("http://localhost:8080", { path: "/ws/chat" });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setSocketStatus("Connected");
      console.log("WebSocket Connected");
    });

    newSocket.on("disconnect", () => {
      setSocketStatus("Disconnected");
      console.log("WebSocket Disconnected");
    });

    newSocket.on("connect_error", (error) => {
      setSocketStatus(`Connection Error: ${error.message}`);
      console.log("Connection Error:", error);
    });

    newSocket.on("reconnect_attempt", () => {
      setSocketStatus("Reconnecting...");
      console.log("Attempting to reconnect...");
    });

    newSocket.on("chat message", (msg) => {
      setMessage((prevMessages) => [...prevMessages, msg]);
    });

    newSocket.on("reply", (data) => {
      console.log(data.response, "RESPONSE!!!");
    });

    return () => newSocket.close();
  }, []);

  const sendMessage = (msg) => {
    socket.emit("chat message", { message: msg });
    console.log("Message 전송!!!", msg);
  };

  const handleStop = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };
  return (
    <>
      <div className='socket-status'>
        <p>Status: {socketStatus}</p>
      </div>
      <div>
        <VideoChat />
        <button onClick={handleStop}>
          <Link to='/'> Home </Link>
        </button>
      </div>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.message}</li>
          ))}
        </ul>
        <button onClick={() => sendMessage("Hello!")}>Send Message</button>
      </div>
    </>
  );
}

export default MeetingPage;
