import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function StudentAnswersPage({ questions }) {
  const navigate = useNavigate();

  const handleAnswerClick = () => {
    navigate('/upload');
  };

  return (
    <div className="container">
      <h1>Student's Answers</h1>
      {questions.map((q, index) => (
        <div className="question-container" key={index}>
          <p className="question-number">Question {index + 1}:</p>
          <p className="question">{q.question}</p>
          <p className="answer">Answer:</p>
        </div>
      ))}
      <button onClick={handleAnswerClick}>Student Answer</button>
    </div>
  );
}

export default StudentAnswersPage;
