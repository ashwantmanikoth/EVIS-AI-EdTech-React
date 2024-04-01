import React, { useState } from "react";
import "../css/RoomCreatePage.css"; // Ensure this CSS file contains the updated styles
import ProfessorRoom from "./ProfessorRoom";
import PdfViewer from "./PdfViewer";
import { Padding } from "@mui/icons-material";

function RoomCreatePage() {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

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

        // <>
        //   {/* <h1>Room Created</h1> */}
        //   <div className="page-container">
        //     <div className="room-id-display">
        //       <div className="horizontal-container">
        //         <h2>Room ID: {roomId}</h2>
        //         <p>Share this ID with your students to join.</p>
        //         {/* <ProfessorRoom /> Uncomment or remove as needed */}
        //       </div>
        //     </div>
        //     <div className="horizontal-container">
        //       <PdfViewer />
        //     </div>
        //   </div>
        // </>
      )}
    </div>
  );
}

export default RoomCreatePage;
