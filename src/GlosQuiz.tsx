import { useState } from "react";

const GlosQuiz = () => {
    const questions = [
        { question: 'Vad betyder "här"?', options: ['here', 'house', 'car'], correctAnswer: 'here' },
        { question: 'Vad betyder "bok"?', options: ['book', 'apple', 'pen'], correctAnswer: 'book' },
        { question: 'Vad betyder "hund"?', options: ['dog', 'cat', 'fish'], correctAnswer: 'dog' }
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);

    const handleAnswer = (answer: string) => {
        if(answer == questions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
            alert("Rätt svar!")
        }
        else {
            alert("Fel svar!");
        }
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        else {
            localStorage.setItem("quizScore", score.toString());
            //alert("Quizet är slut! Din poäng: " + score.toString());
        }
    };

    return (
        <div className="quiz-container">
            <h2>Glosor Quiz</h2>
            <p>
                {questions[currentQuestionIndex].question}
            </p>
            <div>
                {questions[currentQuestionIndex].options.map((option, index) => (
                    <button key={index} onClick={() => handleAnswer(option)}>
                        {option}
                    </button>
                ))}
                <div>
                    <p>
                        Poäng: {score}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default GlosQuiz;