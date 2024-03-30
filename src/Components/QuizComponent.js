import React from 'react';

function QuizComponent({ quizQuestions, selectedAnswers, onSelectAnswer }) {
  const handleOptionChange = (questionIndex, optionIndex) => {
    onSelectAnswer(questionIndex, optionIndex);
  };

  return (
    <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
      {quizQuestions.map((question, questionIndex) => (
        <div key={questionIndex} style={{ marginBottom: '20px' }}>
          <h3>Question {questionIndex + 1}:</h3>
          <p>{question.question}</p>
          <ul>
            {question.options.map((option, optionIndex) => (
              <li key={optionIndex}>
                <input
                  type="radio"
                  id={`option-${questionIndex}-${optionIndex}`}
                  name={`question-${questionIndex}`}
                  value={optionIndex}
                  checked={selectedAnswers[questionIndex] === optionIndex}
                  onChange={() => handleOptionChange(questionIndex, optionIndex)}
                />
                <label htmlFor={`option-${questionIndex}-${optionIndex}`}>{option}</label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default QuizComponent;
