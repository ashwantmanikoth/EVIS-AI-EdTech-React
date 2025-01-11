import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackProfessor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log("soopi");
    if (code) {
      // Now, send this code to your Express backend to exchange it for tokens
      exchangeCodeForToken(code);
    } else {
      // Handle error or redirect
      navigate("/");
    }
  });

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await fetch(
        "https://54.226.10.191:3001/api/auth/professor/exchange",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        }
      );

      if (!response.ok) throw new Error("Failed to exchange code for tokens");

      const data = await response.json();

      sessionStorage.setItem("userName", data.userName);
      sessionStorage.setItem("userType", "Professor");
      sessionStorage.setItem("userEmail", data.userEmail);
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("idToken", data.idToken);
      sessionStorage.setItem("refreshToken", data.refreshToken);
      navigate("/");
    } catch (error) {
      console.error("Error exchanging code:", error);
      navigate("/");
    }
  };

  return <div>Loading...</div>;
};

export default AuthCallbackProfessor;
