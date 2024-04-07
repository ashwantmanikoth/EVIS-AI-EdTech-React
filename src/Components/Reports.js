import React, { useState, useEffect } from "react";
import "../css/body.css";
import "../css/RoomCreatePage.css";

function Reports() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [quizzes, setQuizzes] = useState([]);

  const transformQuizData = (data) => {
    return data.map((item) => ({
      name: `Quiz ${item.quiz_number.N}`,
      participantCount: parseInt(item.total_submission_count.N),
      total_avg_score:item.total_avg_score.N,
      topics: item.avg_score_based_on_topic
        ? typeof item.avg_score_based_on_topic.S === "string"
          ? Object.entries(JSON.parse(item.avg_score_based_on_topic.S)).map(
              ([key, value]) => ({
                name: key,
                score: parseInt(value.N),
              })
            )
          : Object.entries(item.avg_score_based_on_topic.M).map(
              ([key, value]) => ({
                name: key,
                score: parseInt(value.N),
              })
            )
        : [],
    }));
  };

  // Fetch quizzes from the backend when the component mounts
  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch("/room/getMyRooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: sessionStorage.getItem("userEmail"),
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data[0].roomId.S);

          const roomsData = data.map((room) => ({
            id: room.roomId.S,
            professorId: room.professorId.S,
            createdAt: room.created_at.S,
          }));

          // Sorting the rooms by created_at date descending
          // roomsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setRooms(roomsData);
        }
      } catch (error) {
        console.error("Failed to fetch my rooms", error);
      }
    }

    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      console.log("touches");
      async function fetchQuizzes() {
        try {
          const response = await fetch(`/room/reports`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomId: selectedRoom,
            }),
          });
          const quizzesData = await response.json(); // Assuming the response is directly usable

          if (quizzesData) {
            const rawData = quizzesData; // Assuming the response structure contains an items array
            const transformedData = transformQuizData(rawData);
            setQuizzes(transformedData);

            // Here you would typically set some state with transformedData
          } else {
            console.error("Fetch quizzes response not OK:", quizzesData);
          }
        } catch (error) {
          console.error("Failed to fetch quizzes:", error);
        }
      }
      fetchQuizzes();
    }
  }, [selectedRoom]);

  return (
    <>
    <div className="horizontal-container">
    <h3>Choose Your past room to view Session Report</h3>
      {rooms.map((room) => (
        
      
          <ul className="no-bullets">
            <li key={room.id}>
              <button
                className="btn-list"
                onClick={() => setSelectedRoom(room.id)}
              >
                {`Room ID: ${room.id}`}
              </button>
            </li>
          </ul>
         
      ))}
    </div>
      
      {selectedRoom && (
        <div className="quiz-container">
          {quizzes.map((quiz, index) => (
            <div key={index} className="quiz-block">
              <div className="quiz-header">{quiz.name}</div>
              <div className="quiz-info">
                Participant Count: {quiz.participantCount}
              </div>
              <div className="quiz-info">
                Total Average score: {quiz.total_avg_score  }
              </div>
              <div className="quiz-info">
                Topics:
                {quiz.topics.map((topic, index) => (
                  <div key={index}>
                    <div className="quiz-topic">{topic.name}</div>
                    <div className="score-bar">
                      <div
                        className={`score ${
                          topic.score >= 80 ? "high" : "low"
                        }`}
                        style={{ width: `${topic.score}%` }}
                      >
                        {topic.score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Reports;
