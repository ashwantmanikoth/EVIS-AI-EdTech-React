import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/body.css";
import { Context } from "../App";
function Body() {
  const [isSignedIn, setIsSignedIn] = useContext(Context);
  const [text, setText] = useState("");
  const [keyPhrases, setKeyPhrases] = useState([]);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedUserType =sessionStorage.getItem("userType");
    if (storedUserType != null) {
      setUserType(storedUserType);
      setIsSignedIn(true);
    }
  } );

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
    <>
      <div className="menu">
        {userType ? (
          <>
            {userType == "Professor" ? (
              <div className="menuItem">
                <Link to="/roomcreate" className="menuLink">
                  Create Room!
                </Link>
              </div>
            ) : (
              <div className="menuItem">
                <Link to="/roomjoin" className="menuLink">
                  Join a Room!
                </Link>
              </div>
            )}
          </>
        ) : (
          <></>
        )}

        <div className="menuItem">
          <Link to="/userprofile" className="menuLink">
            Get current User Profile{" "}
          </Link>
        </div>
        <div className="menuItem">
          <Link to="/keyphrase" className="menuLink">
            Identify Key Phrases
          </Link>
        </div>
      </div>
    </>
  );
}

export default Body;
