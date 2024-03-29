import React from "react";
import { Container, Typography } from "@mui/material";
import { useState } from "react";

function KeyPhrases() {
  const [text, setText] = useState("");
  const [keyPhrases, setKeyPhrases] = useState([]);

  const handleSubmit = async () => {
    try {
      console.log(text);
      const response = await fetch("http://localhost:3001/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log(data);
      // Assuming 'data' has the 'Entities' structure as shown
      setKeyPhrases(data.KeyPhrases);
      //   console.log(keyPhrases)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
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
      <Typography variant="h4" gutterBottom align="center">
        Welcome to Evis
      </Typography>

      <Typography variant="body1" align="center">
        This is the body of the app. You can put your content here.
      </Typography>
      <textarea
        className="textarea-style"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to analyze"
      />

      <button className="btn-create-room" align="centre" onClick={handleSubmit}>
        Analyze Text
      </button>

      <div>
        <h2>Key Phrases</h2>
        {keyPhrases.length > 0 ? (
          <ul>
            {keyPhrases.map((phrase, index) => (
              <li key={index}>
                <strong>Text:</strong> {phrase.Text} <strong>Score:</strong>{" "}
                {phrase.Score.toFixed(3)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No key phrases found.</p>
        )}
      </div>
    </Container>
  );
}

export default KeyPhrases;
