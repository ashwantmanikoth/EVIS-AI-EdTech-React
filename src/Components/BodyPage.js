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
          <div>
            <button
              className="btn-pages"
              onClick={() =>
                (window.location.href =
                  "https://evis-student.auth.us-east-1.amazoncognito.com/login?client_id=1e5ud4pjf6afm1j30s49apgiih&response_type=code&scope=aws.cognito.signin.user.admin+email+openid&redirect_uri=https%3A%2F%2F54.226.10.191%3A3000%2Fauth%2Fcallback")
              }
            >
              Sign In as Student
            </button>
            <button
              className="btn-pages"
              onClick={() =>
                (window.location.href =
                  "https://evis-professors.auth.us-east-1.amazoncognito.com/login?client_id=7nsa0cqntm824rhqvo389r73eu&response_type=code&scope=aws.cognito.signin.user.admin+openid&redirect_uri=https%3A%2F%2F54.226.10.191%3A3000%2Fauth%2Fcallback%2Fprofessor")
              }
            >
              Sign In as Professor
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Body;
