import { useState, useEffect } from 'react';
import "./WeeklyGlosor.css";
import { fetchGlosor } from '../../apiService/glosor';
import { useUser } from '../../Context/UserContext';

type Glosa = {
  id: number;
  swedish: string;
  english: string;
};

const WeeklyGlosor = () => {
  const {user} = useUser();
  const [questions, setQuestions] = useState<Glosa[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Hämta glosor från backend
  useEffect(() => {
    if (!user?.username) return;
    fetchGlosor(user.username)
      .then(data => setQuestions(
        data.map((g: any) => ({
          id: g.id,
          swedish: g.swedish ?? g.Swedish,
          english: g.english ?? g.English
        }))
      ))
      .catch(err => alert(err.message));
  }, [user?.username]);

  // Hämta sparade poäng från localStorage vid komponentens laddning
  useEffect(() => {
    const savedScore = localStorage.getItem('currentQuizScore');
    if (savedScore) {
      setScore(Number(savedScore));
    }
  }, []);

  // Spara poäng i localStorage när quizet är avslutat
  useEffect(() => {
    if (quizFinished) {
      const quizId = `quizScore_${new Date().getTime()}`;
      localStorage.setItem(quizId, score.toString());
    }
  }, [quizFinished, score]);

  const handleAnswer = () => {
    const correctAnswer = questions[currentQuestionIndex].english;
    if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
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
    localStorage.removeItem('currentQuizScore');
  };

  if (questions.length === 0) return <p>Laddar glosor...</p>;

  return (
    <div className="glosquiz">
      <h2>Glosquiz</h2>
      {!quizFinished ? (
        <>
          <p><strong>Översätt detta ord till engelska:</strong></p>
          <h3>{questions[currentQuestionIndex].swedish}</h3>
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

export default WeeklyGlosor;
