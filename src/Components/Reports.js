import React, { useState, useEffect } from "react";
import "../css/body.css";
import "../css/RoomCreatePage.css";
import AspectChart from "./AspectChart";

function Reports() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [quizzes, setQuizzes] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [data,setData]= useState([]);
  // const data = [
  //   {
  //     "user_id": {"S": "sreedevi.rw@gmail.com"},
  //     "absa": {
  //       "L": [
  //         {
  //           "M": {
  //             "score": {"S": "0.9"},
  //             "sentiment": {"S": "POSITIVE"},
  //             "type": {"S": "PERSON"},
  //             "aspect": {"S": "Professor"}
  //           }
  //         },
  //         {
  //           "M": {
  //             "score": {"S": "0.70"},
  //             "sentiment": {"S": "NEGATIVE"},
  //             "type": {"S": "OTHER"},
  //             "aspect": {"S": "course"}
  //           }
  //         }
  //       ]
  //     },
  //     "feedback": {"S": "Professor is awesome but course is difficult"},
  //     "session_id": {"N": "1"}
  //   }
  // ];
  const transformQuizData = (data) => {
    return data.map((item) => ({
      name: `Quiz ${item.quiz_number.N}`,
      participantCount: parseInt(item.total_submission_count.N),
      total_avg_score: item.total_avg_score.N,
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
          console.log(data);

          const roomsData = data.map((room) => ({
            roomName: room.roomName.S,
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
          let quizzesData = await response.json(); // Assuming the response is directly usable

          if (quizzes.length == 0) {
            console.log(quizzesData);
            const transformedData = transformQuizData(quizzesData);
            setQuizzes(transformedData);
          } else {
            setQuizzes([]);
            console.error("Fetch quizzes response not OK:", quizzesData);
          }
        } catch (error) {
          console.error("Failed to fetch quizzes:", error);
        }
      }

      async function fetchFeedBack() {
        try {
          const response = await fetch(`/room/feedbacks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomId: selectedRoom,
            }),
          });
          const feedbackData = await response.json(); // Assuming the response is directly usable

          if (feedbackData) {
            const rawData = feedbackData; // Assuming the response structure contains an items array
            if (rawData) {
              console.log(rawData)
              setData(rawData);
              // const transformQuizData = transformQuizData(rawData);
              // setQuizzes(transformQuizData);
            } else {
              // setQuizzes([]);
            }
          } else {
            console.error("No report Found!");
          }
        } catch (error) {
          console.error("Failed to fetch quizzes:", error);
        }
      }
      fetchQuizzes();
      fetchFeedBack();
    }
  }, [selectedRoom]);

  return (
    <>
      <div className="row-button">
        <h3>Choose Your past room to view Session Report</h3>
        {rooms.map((room) => (
          <button
            key={room.id}
            className="btn-rows"
            onClick={() => setSelectedRoom(room.id)}
          >
            {`Session Report for ${room.roomName}`}
          </button>
        ))}
      </div>

      {selectedRoom && (
        <div className="quiz-container">
          {quizzes.map((quiz, index) => (
            <div
              key={index}
              className="quiz-block"
              style={{
                animationDelay: `${
                  index * 0.5
                }s` /* Delay based on index, 0.5s apart */,
              }}
            >
              <div className="quiz-header">{quiz.name}</div>
              <div className="quiz-info">
                Participant Count: {quiz.participantCount}
              </div>
              <div className="quiz-info">
                Total Average score: {quiz.total_avg_score}
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
      {data && (<div>
      <h1>Aspect Based Performance Chart</h1>
      <AspectChart responseData={data} />
    </div>)}
      
    </>
  );
}

export default Reports;
