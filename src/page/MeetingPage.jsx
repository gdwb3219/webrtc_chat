import React from 'react'
import VideoChat from '../VideoChat'
import { Link } from 'react-router-dom'

function MeetingPage() {
  return (
    <>
      <div>
        <VideoChat />
        <button><Link to='/'> Home </Link></button>
      </div>
    </>
  )
}

export default MeetingPage