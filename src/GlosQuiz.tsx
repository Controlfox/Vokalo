import { useState, useEffect } from 'react';

const Glosquiz = () => {
  const [questions] = useState([
    { question: 'Apple', answer: 'äpple' },
    { question: 'Bucket', answer: 'hink' },
    { question: 'Blue', answer: 'blå' }
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Hämta sparade poäng från localStorage vid komponentens laddning
  useEffect(() => {
    const savedScore = localStorage.getItem('currentQuizScore');
    if (savedScore) {
      setScore(Number(savedScore)); // Sätt den sparade poängen
    }
  }, []);

  // Spara poäng i localStorage när quizet är avslutat
  useEffect(() => {
    if (quizFinished) {
      // Spara varje quizpoäng med ett unikt nyckelnamn
      const quizId = `quizScore_${new Date().getTime()}`;
      localStorage.setItem(quizId, score.toString());
    }
  }, [quizFinished, score]);

  const handleAnswer = () => {
    if (userAnswer.trim().toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase()) {
      setScore(prevScore => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setUserAnswer('');
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setQuizFinished(false);
    localStorage.removeItem('currentQuizScore'); // Ta bort sparad poäng från localStorage
  };

  return (
    <div className="glosquiz">
      <h2>Glosquiz</h2>
      {!quizFinished ? (
        <>
          <h3>{questions[currentQuestionIndex].question}</h3>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Ditt svar"
          />
          <button onClick={handleAnswer} disabled={userAnswer.trim() === ''}>
            Svara
          </button>
        </>
      ) : (
        <div className="result">
          <p>Dina poäng: {score} av {questions.length}</p>
          <button onClick={handleReset}>Gör om quiz</button>
        </div>
      )}
    </div>
  );
};

export default Glosquiz;
