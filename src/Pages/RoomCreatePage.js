import React, { useState, useEffect } from "react";
import "../css/RoomCreatePage.css"; // Ensure this CSS file contains the updated styles
import ProfessorRoom from "./ProfessorRoom";

function RoomCreatePage() {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };
  useEffect(() => {
    // checks if there are any active rooms in localstorage //todo neec to check in backend/cache
    const storedRoomId = sessionStorage.getItem("roomId");
    if (storedRoomId) {
      setRoomId(storedRoomId);
    }
  }, []);

  const createRoom = async () => {
    setIsSubmitting(true);
    const response = await fetch("/room/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomName: roomName,
        userEmail: sessionStorage.getItem("userEmail"),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setRoomId(data);
      sessionStorage.setItem("roomId", data);
    } else {
      alert("Failed to create room. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      {!roomId ? (
        <div className="container">
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
        </div>
      ) : (
        <>
          <ProfessorRoom roomName={roomName} roomId={roomId} />
        </>
      )}
    </div>
  );
}

export default RoomCreatePage;
