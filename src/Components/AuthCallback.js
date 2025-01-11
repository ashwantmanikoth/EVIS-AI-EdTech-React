import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  const exchangeCodeForToken = useCallback(async (code) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/exchange`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        }
      );

      if (!response.ok) throw new Error("Failed to exchange code for tokens");

      const data = await response.json();

      sessionStorage.setItem("userName", data.userName);
      sessionStorage.setItem("userType", "Student");
      sessionStorage.setItem("userEmail", data.userEmail);
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("idToken", data.idToken);
      sessionStorage.setItem("refreshToken", data.refreshToken);

      navigate("/");
    } catch (error) {
      console.error("Error exchanging code:", error);
      navigate("/error"); // Navigate to an error page if needed
    }
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      exchangeCodeForToken(code);
    } else {
      navigate("/");
    }
  }, [exchangeCodeForToken, navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;
