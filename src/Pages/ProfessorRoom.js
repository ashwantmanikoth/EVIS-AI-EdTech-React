import React, { useState, useRef } from "react";
import PdfViewer from "./PdfViewer";

const ProfessorRoom = (props) => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); // Added state for current page
  const [blocks, setBlocks] = useState([]);
  const [parentValue, setParentValue] = useState([]);

  // Callback function to receive value from the child
  const handleValueChange = (newValue) => {
    setParentValue(newValue);
  };

  return (
    <>
      <div className="page-container">
        <div className="room-id-display">
          <h1>Room Created {props.roomName}</h1>
          <div className="horizontal-container">
            <h2>Room ID: {props.roomId}</h2>
            <p>Share this ID with your students to join.</p>
            {/* <ProfessorRoom /> Uncomment or remove as needed */}
          </div>
        </div>
        <div className="horizontal-container">
          <PdfViewer />
        </div>
      </div>
    </>
  );
};

export default ProfessorRoom;
