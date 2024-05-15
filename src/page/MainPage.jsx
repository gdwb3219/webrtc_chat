import React, { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

function MainPage() {
  const [message, setMessage] = useState("");

  const [publicIP, setPublicIP] = useState('Fetching...');

  // STUN 서버로 Public IP를 확인하는 로직
  useEffect(() => {
    const getPublicIP = async () => {
      try {
        const rtc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        rtc.createDataChannel(''); // Create a bogus data channel

        rtc.onicecandidate = (event) => {
          if (event && event.candidate) {
            console.log("ICE Candidate:", event.candidate);
            const candidate = event.candidate.candidate;
            const ipMatch = candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/);
            if (ipMatch) {
              console.log("Public IP Address found:", ipMatch[0]);
              rtc.onicecandidate = null; // Stop further processing
              rtc.close();
              setPublicIP(ipMatch[0]);
            }
          } else {
            console.log("ICE candidate gathering complete or no candidate found");
          }
        };

        rtc.createOffer()
          .then((offer) => rtc.setLocalDescription(offer))
          .catch((error) => {
            console.error('Failed to create offer:', error);
            setPublicIP('Failed to get public IP address.');
          });
      } catch (error) {
        console.error('Error during WebRTC processing:', error);
        setPublicIP('Failed to get public IP address.');
      }
    };

    getPublicIP();
  }, []);

  return (
    <>
      <div className='App'>
        <header className='App-header'>
          <button className='enter-button'>
            <Link className='link-style' to='meeting2'>
              Meeting Room2 입장
            </Link>
          </button>
          <button className='enter-button'>
            <Link className='link-style' to='meeting1'>
              Meeting Room1 입장
            </Link>
          </button>
        </header>
      </div>
    </>
  );
}

export default MainPage;
