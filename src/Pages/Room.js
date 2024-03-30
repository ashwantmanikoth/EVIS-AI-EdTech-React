import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizComponent from '../Components/QuizComponent';
import "../css/Room.css"; // Make sure to import the CSS file

const WebSocketComponent = () => {
  const room_id = sessionStorage.getItem("roomId");
  const user_id = sessionStorage.getItem("userEmail");
  const user_type = sessionStorage.getItem("userType");

  const [socket, setSocket] = useState(null);
  const [quizQuestions1, setQuizQuestions] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const quizQuestions = [
    {
      "question": "What is the capital of France?",
      "options": [
        "Paris",
        "London",
        "Berlin",
        "Madrid"
      ],
      "correct_option": 0
    },
    {
      "question": "Who painted the Mona Lisa?",
      "options": [
        "Leonardo da Vinci",
        "Pablo Picasso",
        "Vincent van Gogh",
        "Michelangelo"
      ],
      "correct_option": 1
    },
    {
      "question": "What is the largest planet in our solar system?",
      "options": [
        "Jupiter",
        "Saturn",
        "Mars",
        "Earth"
      ],
      "correct_option": 2
    },
    {
      "question": "What is the chemical symbol for gold?",
      "options": [
        "Au",
        "Ag",
        "Fe",
        "Cu"
      ],
      "correct_option": 3
    }
  ];

  useEffect(() => {
    console.log("Inside use effect for web socket connection")
    // Create a new WebSocket connection with gameId, teamName, and userId as query parameters
    const ws_url = "wss://k1p17reb10.execute-api.us-east-1.amazonaws.com/dev"
    const ws_url_with_query_params = ws_url + `?roomId=${room_id}&userId=${user_id}&userType=${user_type}`;
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

      if (message.quiz_questions) {
        setQuizQuestions(message.quiz_questions);
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
        roomId: room_id,
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

  // Handler function to handle form submission
  const handleSubmit = () => {
    console.log('Submitted Answers:', selectedAnswers);
    // Check if all questions are answered
    const allQuestionsAnswered = selectedAnswers.every(answer => answer !== null);
    if (!allQuestionsAnswered) {
      setShowErrorMessage(true);
      return;
    }

    // Perform any further actions here, such as sending the selected answers to a server
  };

  const navigate = useNavigate();



  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>

      <h2>Room Details</h2>
      <p>Room ID: {room_id}</p>

      {quizQuestions && quizQuestions.length > 0 && (
        <div>
          <QuizComponent
            quizQuestions={quizQuestions}
            selectedAnswers={selectedAnswers}
            onSelectAnswer={handleSelectAnswer}
          />
          {showErrorMessage && (
            <p style={{ color: 'red' }}>Please answer all questions before submitting.</p>
          )}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      <button onClick={handleExitRoom}>Exit Room</button>

    </div>
  );
};

export default WebSocketComponent;
