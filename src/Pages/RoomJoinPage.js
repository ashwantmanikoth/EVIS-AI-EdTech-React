import React, { useState } from 'react';
import Room from "./Room";
function RoomJoinPage() {
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');

  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // New state for managing error messages


  const handleRoomIdChange = (event) => {
    setRoomId(event.target.value);
  };

  const joinRoom = async () => {
    setIsJoining(true);
    try {
      // Assuming your backend has an endpoint `/room/join` for joining rooms
      const response = await fetch('/room/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
      });

  
      if(response.status ==200){
        const data = await response.json();
        sessionStorage.setItem("roomId",roomId)
        setRoomName(data.roomName)
        sessionStorage.setItem("roomName",data.roomName)
        setHasJoined(true); // Move this inside else to ensure it's only set on successful join
      }else{
        setErrorMessage('Room does not exists.');
        setHasJoined(false);
      }
    } catch (error) {
      setErrorMessage(error.message); // Use the error message for display
      setHasJoined(false);
    }
    setIsJoining(false);
  };

  if (hasJoined) {
    return (
      <div className="join-room-success">
        <Room />
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Join Room</h1>
      <input
        className="input-room-name"
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={handleRoomIdChange}
        disabled={isJoining}
      />
      <button
        onClick={joinRoom}
        className="btn-create-room"
        disabled={isJoining || roomId.trim() === ''}
      >
        {isJoining ? 'Joining...' : 'Join Room'}
      </button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

    </div>
  );
}

export default RoomJoinPage;
