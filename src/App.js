import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import jsPDF from 'jspdf';
//import StudentAnswersPage from './StudentAnswersPage.js';
import UploadPicturesPage from './UploadPicturesPage';
import LoginPage from './login';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState([" "]);
  const [currentKeywords, setCurrentKeywords] = useState([" "]);
  const [currentMarks, setCurrentMarks] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const pdfRef = useRef();

  const handleStudentAnswersClick = () => {
    window.open('/upload-pictures.html', '_blank');
  };

  // Function to handle successful login
  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleQuestionChange = (event) => {
    setCurrentQuestion(event.target.value);
  };

  const handleAnswerChange = (index, event) => {
    const updatedAnswers = [...currentAnswer];
    updatedAnswers[index] = event.target.value;
    setCurrentAnswer(updatedAnswers);
  };

  const handleKeywordsChange = (index, event) => {
    const updatedKeywords = [...currentKeywords];
    updatedKeywords[index] = event.target.value;
    setCurrentKeywords(updatedKeywords);
  };

  const handleMarksChange = (event) => {
    setCurrentMarks(event.target.value);
  };

  const handleSave = () => {
    if (
      currentQuestion.trim() !== '' &&
      currentAnswer.length > 0 &&
      currentKeywords.length > 0 &&
      currentMarks.trim() !== ''
    ) {
      const newQuestion = {
        question: currentQuestion,
        answer: currentAnswer,
        keywords: currentKeywords,
        marks: currentMarks,
      };

      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      setCurrentQuestion('');
      setCurrentAnswer([]);
      setCurrentKeywords([]);
      setCurrentMarks('');

    }
  };

  const handleAdd = () => {
    if (
      currentQuestion.trim() !== '' &&
      currentAnswer.length > 0 &&
      currentKeywords.length > 0 &&
      currentMarks.trim() !== ''
    ) {
      const newQuestion = {
        question: currentQuestion,
        answer: currentAnswer,
        keywords: currentKeywords,
        marks: currentMarks,
      };

      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      setCurrentQuestion('');
      setCurrentAnswer([]);
      setCurrentKeywords([]);
      setCurrentMarks('');

      console.log(updatedQuestions)

      const jsonContent = JSON.stringify(updatedQuestions, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'questions.json';
      link.click();

      URL.revokeObjectURL(url);
    }
  };

  const handleAddAnswer = () => {
    setCurrentAnswer([...currentAnswer, '']);
  };

  const handleAddKeyword = () => {
    setCurrentKeywords([...currentKeywords, '']);
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    questions.forEach((q, index) => {
      const questionText = `${index + 1}. ${q.question}`;
      const markText = `${q.marks} marks`;
      doc.text(questionText, 20, 20 + index * 20);
      doc.text(markText, doc.internal.pageSize.width - 30, 20 + index * 20);
    });
    doc.save('questions.pdf');
  };

  return (
    <div>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <React.Fragment>
          <Router>
            <div class="container">
              <div class="screen__content">
                <h1> Question Setting </h1>
                <div class="login">
                  <div class="login__field">
                    <i class="login__icon fas fa-user"></i>
                    <h3>Question</h3>
                    <input type="text" value={currentQuestion} onChange={handleQuestionChange} class="login__input" />
                  </div>
                  <div class="login__field">
                    <h3>Answer</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div className="answer-input" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        {currentAnswer.map((answer, index) => (
                          <input
                            class="login__input"
                            key={index}
                            type="text"
                            value={answer}
                            onChange={(event) => handleAnswerChange(index, event)}
                          />
                        ))}
                      </div>
                      <button className="add-button" style={{ fontSize: "30px", height: "45px" }} onClick={handleAddAnswer}>+</button>
                    </div>
                  </div>
                  <div class="login__field">
                  <h3>Keyword</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="keyword-input" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    {currentKeywords.map((keyword, index) => (
                        <input
                          class="login__input"
                          type="text"
                          value={keyword}
                          onChange={(event) => handleKeywordsChange(index, event)}
                        />
                    ))}
                    </div>
                    <button className="add-button" style={{ fontSize: "30px", height: "45px" }} onClick={handleAddKeyword}>+</button>
                    </div>
                  </div>
                  <div class="login__field">
                    <i class="login__icon fas fa-lock"></i>
                    <h3>Marks</h3>
                    <input type="number" class="login__input" value={currentMarks} onChange={handleMarksChange} />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button class="button login__submit" onClick={handleSave}>
                      <span class="button__text" >Save </span>
                      <i class="button__icon fas fa-chevron-right"></i>
                    </button>
                    <button class="button login__submit" onClick={handleAdd}>
                      <span class="button__text">Add</span>
                      <i class="button__icon fas fa-chevron-right"></i>
                    </button>
                    <button class="button login__submit" onClick={handleGeneratePDF}>
                      <span class="button__text">Generate PDF</span>
                      <i class="button__icon fas fa-chevron-right"></i>
                    </button>
                    <button class="button login__submit" onClick={handleStudentAnswersClick}>
                      <span class="button__text">Answers</span>
                      <i class="button__icon fas fa-chevron-right"></i>
                    </button>
                  </div>
                  {questions.map((q, index) => (
                    <div className="question-container" key={index}>
                      <p className="question-number">Question {index + 1}:</p>
                      <p className="question">{q.question}</p>
                      <p className="marks">Marks: {q.marks}</p>
                      {q.answer.map((answer, answerIndex) => (
                        <p className="answer" key={answerIndex}>
                          Answer {answerIndex + 1}: {answer}
                        </p>
                      ))}
                      {q.keywords.map((keyword, keywordIndex) => (
                        <p className="keywords" key={keywordIndex}>
                          Keyword {keywordIndex + 1}: {keyword}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div class="screen__background">
                <span class="screen__background__shape screen__background__shape4"></span>
                <span class="screen__background__shape screen__background__shape3"></span>
                <span class="screen__background__shape screen__background__shape2"></span>
              </div>
            </div>


            <Routes>
              <Route path="/upload-pictures" element={<UploadPicturesPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Router>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
