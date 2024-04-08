import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useNavigate } from "react-router-dom";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpandArrowsAlt } from "@fortawesome/free-solid-svg-icons";

// Setting up the worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = () => {
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); // Added state for current page
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const fileInputRef = useRef(null);
  const [quizNumber, setQuizNumber] = useState(-1);
  const [quizStatus, setQuizStatus] = useState(-1); //-1 no Quiz 1 quiz Started 0 starting quiz
  const [topic, setTopic] = useState("AWS");
  const userId = sessionStorage.getItem("userEmail");
  const userType = sessionStorage.getItem("userType");
  const roomId = sessionStorage.getItem("roomId");

  const [socket, setSocket] = useState(null);

  // Trigger the file input dialog
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Update state when a file is selected
  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const handleQuizInsights = async (event) => {
    const response = await fetch("/quiz/getInsight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId: roomId }),
    });

    console.log(response);
  };
  useEffect(() => {
    console.log("Inside use effect for web socket connection");
    // Create a new WebSocket connection with gameId, teamName, and userId as query parameters
    const ws_url = "wss://k1p17reb10.execute-api.us-east-1.amazonaws.com/dev";
    const ws_url_with_query_params =
      ws_url + `?roomId=${roomId}&userId=${userId}&userType=${userType}`;
    const ws = new WebSocket(ws_url_with_query_params);

    // Event listener for when the connection is established
    ws.onopen = () => {
      console.log("WebSocket connection established.");
      setSocket(ws); // Save the WebSocket instance to state
    };

    // Event listener for incoming messages from the server
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      if (message.quiz_questions) {
        // setQuizQuestions(message.quiz_questions);
        setQuizNumber(message.quiz_number);
        setTopic(message.topic);
      }
    };

    // Event listener for WebSocket errors
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Event listener for when the connection is closed
    ws.onclose = () => {
      console.log("WebSocket connection closed.");
      setSocket(null); // Reset the WebSocket instance when connection is closed
      // Redirect to the home page or any other page as needed
      // navigate('/');
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, []);

  const handleStartQuiz = async () => {
    let qNum = 1,
      qtopic = "AWS";
    const quizDetails = {
      pageNumber: pageNumber,
      roomId,
      quizNumber: qNum,
      topic: qtopic,
    };
    console.log(quizDetails);
    setQuizStatus(0);
    const response = await fetch("/quiz/startQuiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizDetails),
    });

    const startQuizResponse = await response.json();
    console.log("startQuizResponse: ", startQuizResponse);

    if (response.status == 200) {
      setQuizNumber(qNum);
      setTopic(qtopic);
      setQuizStatus(1); //quiz successs
    } else {
      setQuizStatus(0); //fail to sytart quiz
    }
  };

  const handleEndQuiz = async () => {
    setQuizStatus(0);
    const quizDetails = {
      roomId,
      quizNumber,
      topic,
    };
    const response = await fetch("/quiz/endQuiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizDetails),
    });

    const endQuizResponse = await response.json();
    console.log("endQuizResponse: ", endQuizResponse);

    if (response.status == 200) {
      setQuizStatus(-1);
      setQuizCompleted(true);
      setTopic("");
    }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page whenever a new document is loaded
    handleFormSubmit();
  }

  function goToPrevPage() {
    setPageNumber(pageNumber - 1);
  }

  function goToNextPage() {
    setPageNumber(pageNumber + 1);
  }

  const handleFormSubmit = async () => {
    setisLoading(true);
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "jsonString",
      JSON.stringify({
        roomId: roomId,
        roomName: sessionStorage.getItem("roomName"),
      })
    );
    // uploading to s3
    try {
      const response = await axios.post("/quiz/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: JSON.stringify({
          roomId: roomId,
          roomName: sessionStorage.getItem("roomName"),
        }),
      });
      if (response.status == 200) {
        console.log("File uploaded successfully", response.data);
        setQuizCompleted(true);
        setisLoading(false);
      }
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Error uploading file");
    }
  };

  const getExtracts = async () => {
    try {
      const response = await fetch("/extract", { method: "GET" });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const blocksForCurrentPage = blocks.filter(
    (block) => block.page === pageNumber
  );

  return (
    <div className="horizontal-container">

    <div className="room-id-display">
      {file != null ? (
        <div>
          <div className="expand-icon">
            <FontAwesomeIcon icon={faExpandArrowsAlt} />
          </div>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="document"
          >
            <Page pageNumber={pageNumber} width={280} />
          </Document>

          <button
            className="btn-pages"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            Previous
          </button>
          <button
            className="btn-pages"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            Next
          </button>

          <div className="quiz-menu">
            <h1>Quiz Details:</h1>
            {quizStatus == 1 ? (
              <div className="horizontal-container">
                <h2>Ongoing quiz:</h2>
                <p>Quiz Number: {quizNumber}</p>
                {/* <p>Quiz Topic: {topic}</p> */}
                <button className="btn-create-room" onClick={handleEndQuiz}>
                  End Quiz
                </button>
              </div>
            ) : (
              <>
                {quizStatus == 0 ? (
                  <>
                    <p>Please wait...</p>
                    <div className="spinner"></div>
                  </>
                ) : (
                  <>
                    <p>No ongoing quizes!</p>
                    <button
                      className="btn-create-room"
                      onClick={handleStartQuiz}
                    >
                      Start Quiz
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <div>
            <input
              type="file"
              style={{ display: "none" }} // Hide the file input
              ref={fileInputRef}
              onChange={onFileChange}
              accept="application/pdf"
            />
            <h3>Upload lecture document</h3>
            <button className="btn-create-room" onClick={handleButtonClick}>
              Choose from Computer
            </button>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default PdfViewer;
