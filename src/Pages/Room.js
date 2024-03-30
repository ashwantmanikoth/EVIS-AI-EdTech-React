import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WebSocketComponent = () => {
  const room_id = sessionStorage.getItem("roomId");
  const user_id = sessionStorage.getItem("userId");
  const user_type = sessionStorage.getItem("userType");

  const [socket, setSocket] = useState(null);

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

  const navigate = useNavigate();



  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>

    <h2>Room Details</h2>
        <p>Room ID: {room_id}</p>
    <button onClick={handleExitRoom}>Exit Game</button>

    </div>
  );
};

export default WebSocketComponent;
