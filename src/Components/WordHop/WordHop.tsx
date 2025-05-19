import React, { useEffect, useState } from 'react';
import './WordHop.css';

interface Glosa {
  id: number;
  swedish: string;
  english: string;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const WordHop = () => {
  const [glosor, setGlosor] = useState<Glosa[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [grid, setGrid] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [error, setError] = useState(false);

  const gridSize = 5; // 5x5 grid
  const stored = localStorage.getItem('currentUser');
  const user = stored ? JSON.parse(stored) : null;
  
  useEffect(() => {
    if (!user?.username) return;
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5287/glosor?child=${user.username}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => setGlosor(
        data.map((g: any) => ({
          id: g.id,
          swedish: g.swedish ?? g.Swedish,
          english: g.english ?? g.English
        }))
      ));
  }, [user?.username]);
  

  useEffect(() => {
    if (glosor.length > 0) {
      const word = glosor[currentIndex].english.toUpperCase();
      const newGrid = getRandomGrid(word);
      setGrid(newGrid);
      setPosition({ x: 0, y: 0 });
      setCollectedLetters([]);
      setWon(false);
      setError(false);
    }
  }, [glosor, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (won || error) return;

      setPosition((prev) => {
        const next = { ...prev };
        if (e.key === 'ArrowUp' && prev.y > 0) next.y--;
        if (e.key === 'ArrowDown' && prev.y < gridSize - 1) next.y++;
        if (e.key === 'ArrowLeft' && prev.x > 0) next.x--;
        if (e.key === 'ArrowRight' && prev.x < gridSize - 1) next.x++;
        return next;
      });

      if (e.key === ' ') {
        const index = position.y * gridSize + position.x;
        const letter = grid[index];
        const nextLetter = glosor[currentIndex].english.toUpperCase()[collectedLetters.length];

        if (letter !== nextLetter) {
          setError(true);
          setTimeout(() => {
            const word = glosor[currentIndex].english.toUpperCase();
            const newGrid = getRandomGrid(word);
            setGrid(newGrid);
            setPosition({ x: 0, y: 0 });
            setCollectedLetters([]);
            setError(false);
          }, 1000);
          return;
        }

        const updated = [...collectedLetters, letter];
        setCollectedLetters(updated);

        if (updated.join('') === glosor[currentIndex].english.toUpperCase()) {
          setWon(true);
          localStorage.setItem(`quizScore_${Date.now()}`, '1');
          setTimeout(() => {
            if (currentIndex < glosor.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              alert('Grattis! Du har klarat alla ord!');
            }
          }, 1500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, grid, collectedLetters, glosor, currentIndex, won, error]);

  const getRandomGrid = (correctWord: string) => {
    const mixedLetters = [...correctWord];
    while (mixedLetters.length < gridSize * gridSize) {
      const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!mixedLetters.includes(letter) || mixedLetters.filter(l => l === letter).length < 2) {
        mixedLetters.push(letter);
      }
    }
    return mixedLetters.sort(() => Math.random() - 0.5);
  };

  if (glosor.length === 0 || grid.length === 0) return <p>Laddar spelet...</p>;

  return (
    <div className="wordhop-container">
      <h2>Bokstavshopp</h2>
      <p><strong>Stava det engelska ordet för:</strong> {glosor[currentIndex].swedish}</p>
      <div className="grid">
        {grid.map((letter, idx) => {
          const x = idx % gridSize;
          const y = Math.floor(idx / gridSize);
          const isPlayer = position.x === x && position.y === y;

          return (
            <div key={idx} className={`cell ${isPlayer ? 'player' : ''}`}>
              {isPlayer ? <span className="icon">🧍</span> : letter}
            </div>
          );
        })}
      </div>
      <div className="status">
        <p>Ditt ord: {collectedLetters.join('')}</p>
        {error && <p className="error">Fel bokstav! Försök igen.</p>}
        {won && <p className="win">Du stavade {glosor[currentIndex].english.toUpperCase()} rätt! 🎉</p>}
      </div>
    </div>
  );
};

export default WordHop;
