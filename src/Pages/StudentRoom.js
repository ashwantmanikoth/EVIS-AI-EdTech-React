import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from "@mui/material";
import QuizComponent from '../Components/QuizComponent';
import "../css/Room.css";

const WebSocketComponent = () => {
  const roomId = sessionStorage.getItem("roomId");
  const userId = sessionStorage.getItem("userEmail");
  const userType = sessionStorage.getItem("userType");

  const [socket, setSocket] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizNumber, setQuizNumber] = useState(null);
  const [topic, setTopic] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [feedBack, setFeedback] = useState("");
  const [showFeedback, setShowFeedBack] = useState(false);
  const [enableSubmitFeedback, setEnableSubmitFeedBack] = useState(false);

  useEffect(() => {
    console.log("Inside use effect for web socket connection")
    // Create a new WebSocket connection with gameId, teamName, and userId as query parameters
    const ws_url = "wss://k1p17reb10.execute-api.us-east-1.amazonaws.com/dev"
    const ws_url_with_query_params = ws_url + `?roomId=${roomId}&userId=${userId}&userType=${userType}`;
    const ws = new WebSocket(ws_url_with_query_params);

    // Event listener for when the connection is established
    ws.onopen = () => {
      console.log('WebSocket connection established.');
      setSocket(ws); // Save the WebSocket instance to state
    };

    // Event listener for incoming messages from the server
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      if (message.quizQuestions) {
        setQuizQuestions(message.quizQuestions);
        setQuizNumber(message.quizNumber);
        setTopic(message.topic);
      }
      if (message.action) {
        if (message.action == "endQuiz") {
          setQuizQuestions([]);
          setQuizNumber(-1);
          setTopic("");

          setShowFeedBack(true);
          setFeedback("");
          setEnableSubmitFeedBack(true);
        }
      }
    };

    // Event listener for WebSocket errors
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Event listener for when the connection is closed
    ws.onclose = () => {
      console.log('WebSocket connection closed.');
      setSocket(null); // Reset the WebSocket instance when connection is closed
      // Redirect to the home page or any other page as needed
      // navigate('/');
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []);

  const handleExitRoom = () => {
    // Close the WebSocket connection
    if (socket) {
      const closeMessage = JSON.stringify({
        action: 'close',
        roomId: roomId,
      });
      socket.close(1000, closeMessage);
    }

    // Redirect to the home page or any other page as needed
    navigate('/');
  };

  // State to store selected answers for each question
  const [selectedAnswers, setSelectedAnswers] = useState(Array(quizQuestions.length).fill(null));

  // Handler function to update selected answers
  const handleSelectAnswer = (questionIndex, optionIndex) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const handleSubmitFeedback = async () => {
    if (feedBack.trim() !== '') {
      // setEnableSubmitFeedBack(false);
      const feedbackData = {
        roomId,
        userId,
        sessionId: 1,
        feedBack
      };

      const submitFeedbackRequest = {
        "action": "sendFeedback",
        "feedbackData": feedbackData
      }
      console.log(submitFeedbackRequest);

      socket.send(JSON.stringify(submitFeedbackRequest));

      // setShowFeedBack(false);
      setShowErrorMessage(false);
      setErrorMessage("");
    } else {
      setShowErrorMessage(true);
      setErrorMessage("Please enter a feedback to submit");
    }
  }

  // Handler function to handle form submission
  const handleSubmit = async (event) => {
    console.log('Submitted Answers:', selectedAnswers);

    // Check if all questions are answered
    const allQuestionsAnswered = selectedAnswers.every(answer => answer !== null);
    if (selectedAnswers.length == 0 || !allQuestionsAnswered) {
      setShowErrorMessage(true);
      setErrorMessage("Please answer all questions before submitting.");
      return;
    }

    setShowErrorMessage(false);
    setErrorMessage("");

    const quizAnswerData = {
      roomId,
      userId,
      quizNumber,
      topic,
      selectedAnswers
    }

    const submitQuizRequest = {
      "action": "submitQuiz",
      "quizAnswerData": quizAnswerData
    }
    console.log(submitQuizRequest);
    
    socket.send(JSON.stringify(submitQuizRequest));

    setQuizQuestions([]);
    setShowErrorMessage(false);

  };

  const navigate = useNavigate();



  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>

      <p>Welcome to the room! Room ID: <b>{roomId}</b></p>
      <p>Stay tuned for interactive content.</p>

      {showErrorMessage && (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}

      {quizQuestions && quizQuestions.length > 0 && (
        <div>
          <QuizComponent
            quizQuestions={quizQuestions}
            selectedAnswers={selectedAnswers}
            onSelectAnswer={handleSelectAnswer}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      {showFeedback && (
        <Container
          maxWidth="sm"
          sx={{
            background: "#cfe8fc",
            p: 2,
            border: "1px solid #ccc",
            borderRadius: "5px",
            mt: 2,
          }}
        >

          <Typography variant="body1" align="center">
            Please provide your feedback about this lecture
          </Typography>
          <textarea
            className="textarea-style"
            value={feedBack}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter text to analyze"
          />
          {enableSubmitFeedback && (
            <button className="btn-create-room" align="centre" onClick={handleSubmitFeedback}>
              Submit feedback
            </button>
          )}
        </Container>
      )}


      <button onClick={handleExitRoom}>Exit Room</button>

    </div>
  );
};

export default WebSocketComponent;
