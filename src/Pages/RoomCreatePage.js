import React, { useState } from "react";
import "../css/RoomCreatePage.css"; // Make sure to import the CSS file
import Room from "./Room";
function RoomCreatePage() {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };
  const createRoom = async (event) => {
    const response = await fetch("/room/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName }),
    });

    const data = await response.json();
    
    if (response.status == 200) {
      setRoomId(data);
      sessionStorage.setItem("roomId",data.roomId);
    } else {
      alert("Failed to create room. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="page-container">
      {!roomId ? ( // Conditional rendering based on roomId
        <>
          <h1>Create Room</h1>
          <input
            className="input-room-name"
            type="text"
            placeholder="Enter Room Name"
            value={roomName}
            onChange={handleRoomNameChange}
            disabled={isSubmitting}
          />
          <button
            className="btn-create-room"
            onClick={createRoom}
            disabled={isSubmitting || !roomName.trim()}
          >
            {isSubmitting ? "Creating..." : "Create Room"}
          </button>
        </>
      ) : (
        <>
          <h1>Room Created</h1>
          <div className="room-id-display">
            <h2>Room ID: {roomId}</h2>
            <p>Share this ID with your students to join.</p>
          </div>
          <Room />
        </>
      )}
    </div>
  );
}

export default RoomCreatePage;
