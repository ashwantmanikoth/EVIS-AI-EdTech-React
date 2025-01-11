import React, { useState, useEffect } from "react";

function UserProfile() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userType = sessionStorage.getItem("userType");

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const accessToken = sessionStorage.getItem("accessToken");

        if (accessToken === undefined) {
          throw new Error("No access token found");
        }

        if (userType == "Professor") {
          const response = await fetch("/api/auth/professor-details", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken }),
          });
        }

        const response = await fetch("/api/auth/user-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessToken }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUserDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>{userType} Profile</h2>
      {userDetails && (
        <div>
          <p>Name: {userDetails.username}</p>
          <p>Email: {userDetails.email}</p>
          {/* Display other user details as needed */}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
