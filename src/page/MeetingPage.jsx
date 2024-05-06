import React from "react";
import VideoChat from "../VideoChat";
import { Link } from "react-router-dom";

function MeetingPage({ stream }) {
  const handleStop = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };
  return (
    <>
      <div>
        <VideoChat />
        <button onClick={handleStop}>
          <Link to='/'> Home </Link>
        </button>
      </div>
    </>
  );
}

export default MeetingPage;
