import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizComponent from '../Components/QuizComponent';
import "../css/Room.css"; // Make sure to import the CSS file

const WebSocketComponent = () => {
  const roomId = sessionStorage.getItem("roomId");
  const userId = sessionStorage.getItem("userEmail");
  const userType = sessionStorage.getItem("userType");

  const [socket, setSocket] = useState(null);
  const [quizQuestions1, setQuizQuestions] = useState([]);
  const [quizNumber1, setQuizNumber] = useState(null);
  const [topic, setTopic] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const quizNumber = 1;
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

      if (message.quiz_questions) {
        setQuizQuestions(message.quiz_questions);
        setQuizNumber(message.quiz_number);
        setTopic(message.topic);
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

    // populateQuizPerformanceInsights();

    // Redirect to the home page or any other page as needed
    navigate('/');
  };

  const populateQuizPerformanceInsights = async () => {
    const quizDetails = {
      roomId,
      quizNumber,
      topic
    }
    console.log(quizDetails);

    const response = await fetch("/quiz/savePerformanceInsights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizDetails),
    });

    const performanceInsightsResponse = await response.json();
    console.log("performanceInsightsResponse: ", performanceInsightsResponse);
    
    // if (response.status == 200) {
    //   setShowErrorMessage(false);
    // } else {
    //   setShowErrorMessage(true);
    //   setErrorMessage(performanceInsightsResponse.message);
    // }
  }

  // State to store selected answers for each question
  const [selectedAnswers, setSelectedAnswers] = useState(Array(quizQuestions.length).fill(null));

  // Handler function to update selected answers
  const handleSelectAnswer = (questionIndex, optionIndex) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(updatedSelectedAnswers);
  };

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

    const submitAnswerRequest = {
      roomId,
      userId,
      quizNumber,
      topic,
      selectedAnswers
    }
    console.log(submitAnswerRequest);

    const response = await fetch("/quiz/submitAnswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitAnswerRequest),
    });

    const submitAnswerResponse = await response.json();
    console.log("submitAnswerResponse: ", submitAnswerResponse);
    
    if (response.status == 200) {
      setQuizQuestions([]);
      setShowErrorMessage(false);
    } else {
      setShowErrorMessage(true);
      setErrorMessage(submitAnswerResponse.message);
    }
  };

  const navigate = useNavigate();



  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>

        <p>Welcome to the room! Room ID: <b>{roomId}</b></p>
        <p>Stay tuned for interactive content.</p>

      {quizQuestions && quizQuestions.length > 0 && (
        <div>
          <QuizComponent
            quizQuestions={quizQuestions}
            selectedAnswers={selectedAnswers}
            onSelectAnswer={handleSelectAnswer}
          />
          {showErrorMessage && (
            <p style={{ color: 'red' }}>{errorMessage}</p>
          )}
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      <button onClick={handleExitRoom}>Exit Room</button>

    </div>
  );
};

export default WebSocketComponent;
