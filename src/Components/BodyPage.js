import React, { useContext, useState, useEffect, useMemo } from "react";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

import "../css/body.css";
import { Context } from "../App";
function Body() {
  const [isSignedIn, setIsSignedIn] = useContext(Context);
  const [text, setText] = useState("");
  const [keyPhrases, setKeyPhrases] = useState([]);
  const [userType, setUserType] = useState(null);

  // Effect to check session storage for user type
  useEffect(() => {
    const storedUserType = sessionStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
      setIsSignedIn(true);
    }
  }, []); // Empty dependency array ensures this runs only once

  const headers = [
    "Welcome to Evis",
    "Empowering Education with Advanced AI Insights",
    "Sign In to Proceed",
  ];

  const userName = useMemo(
    () => sessionStorage.getItem("userName"),
    [userType, isSignedIn]
  );

  return (
    <>
      {isSignedIn ? (
        <>
          <div className="menu">
            <div className="menuItem">
              <Link
                to={userType === "Professor" ? "/roomcreate" : "/roomjoin"}
                className="menuLink"
              >
                {userType === "Professor" ? "Create Room!" : "Join a Room!"}
              </Link>
            </div>
            <div className="menuItem">
              <Link to="/reports" className="menuLink">
                Session Report
              </Link>
            </div>
            <div className="menuItem">
              <Link to="/feedbackPage" className="menuLink">
                View Feedbacks //todo
              </Link>
            </div>
            <div className="menuItem">
              <Link to="/keyphrase" className="menuLink">
                My Account <p>{userName}</p>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="emptypage">
          {headers.map((text, index) => (
            <Typography
              variant="h3"
              key={index}
              gutterBottom
              align="center"
              className="fade-in"
              style={{
                "--delay": `${index * 2}s`,
              }}
            >
              {text}
            </Typography>
          ))}
        </div>
      )}
    </>
  );
}

export default Body;
