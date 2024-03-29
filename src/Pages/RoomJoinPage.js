import React, { useState } from 'react';

function RoomJoinPage() {
  const [roomId, setRoomId] = useState('');
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
  
      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage('Room does not exists.');
          setHasJoined(false);
        } else {
          throw new Error('Failed to join room');
        }
      } else {
        setHasJoined(true); // Move this inside else to ensure it's only set on successful join
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
        <h2>Successfully Joined Room!</h2>
        <p>Welcome to the room with ID: {roomId}</p>
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
