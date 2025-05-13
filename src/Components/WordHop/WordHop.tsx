import { useState } from 'react';
import './WordHop.css';

const targetWord = 'KATT';

const WordHop = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState('');

  const shuffledLetters = [...targetWord].sort(() => Math.random() - 0.5);

  const handleLetterClick = (letter: string) => {
    if (letter === targetWord[currentIndex]) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setMessage('');

      if (nextIndex === targetWord.length) {
        setMessage('🎉 Rätt ord! Du vann!');
      }
    } else {
      setMessage('❌ Fel bokstav! Försök igen.');
    }
  };

  return (
    <div className="bokstavshopp-container">
      <h2>Bokstavshopp</h2>
      <p>Klicka på bokstäverna i rätt ordning för att stava: <strong>{targetWord}</strong></p>
      <div className="letter-grid">
        {shuffledLetters.map((letter, index) => (
          <button
            key={index}
            className="letter-button"
            onClick={() => handleLetterClick(letter)}
            disabled={currentIndex >= targetWord.length}
          >
            {letter}
          </button>
        ))}
      </div>
      <p className="message">{message}</p>
    </div>
  );
};

export default WordHop;
