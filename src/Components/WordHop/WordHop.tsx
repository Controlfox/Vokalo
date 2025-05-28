import { useEffect, useState } from "react";
import "./WordHop.css";
import WordHopWordPrompt from "./WordHopWordPrompt";
import WordHopGrid from "./WordHopGrid";
import WordHopStatus from "./WordHopStatus";
import { fetchGlosor } from "../../apiService/glosor";
import { useUser } from "../../Context/UserContext";

/**
 * Komponent för "Bokstavshopp"-spel.
 * Användaren styr en figur över ett rutnät med bokstäver och måste samla in rätt bokstäver i ordning.
 */
interface Glosa {
  id: number;
  swedish: string;
  english: string;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const WordHop = () => {
  const [glosor, setGlosor] = useState<Glosa[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [grid, setGrid] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [error, setError] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const gridSize = 5; // 5x5 grid
  const { user } = useUser();

  // Hämta glosor för användaren
  useEffect(() => {
    if (!user?.username) return;
    fetchGlosor(user.username)
      .then((data) =>
        setGlosor(
          data.map((g: any) => ({
            id: g.id,
            swedish: g.swedish ?? g.Swedish,
            english: g.english ?? g.English,
          }))
        )
      )
      .catch((err) => setApiError(err.message));
  }, [user?.username]);

  // Skapa nytt rutnät när nytt ord laddas
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

  // Hantera tangenttryckningar för att styra spelaren och samla bokstäver
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (won || error) return;

      setPosition((prev) => {
        const next = { ...prev };
        if (e.key === "ArrowUp" && prev.y > 0) next.y--;
        if (e.key === "ArrowDown" && prev.y < gridSize - 1) next.y++;
        if (e.key === "ArrowLeft" && prev.x > 0) next.x--;
        if (e.key === "ArrowRight" && prev.x < gridSize - 1) next.x++;
        return next;
      });

      if (e.key === " ") {
        const index = position.y * gridSize + position.x;
        const letter = grid[index];
        const nextLetter =
          glosor[currentIndex].english.toUpperCase()[collectedLetters.length];

        if (letter !== nextLetter) {
          // Fel bokstav – visa fel och återställ
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

        // Rätt bokstav – lägg till
        const updated = [...collectedLetters, letter];
        setCollectedLetters(updated);

        // Om hela ordet klart – spara poäng och gå vidare
        if (updated.join("") === glosor[currentIndex].english.toUpperCase()) {
          setWon(true);
          localStorage.setItem(`quizScore_${Date.now()}`, "1");
          setTimeout(() => {
            if (currentIndex < glosor.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              alert("Grattis! Du har klarat alla ord!");
            }
          }, 1500);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, grid, collectedLetters, glosor, currentIndex, won, error]);

  /**
   * Skapar ett rutnät där rätt ord ingår men resterande fylls ut med slumpmässiga bokstäver.
   * @param correctWord Ordet som ska finnas i rutnätet
   */
  const getRandomGrid = (correctWord: string) => {
    const mixedLetters = [...correctWord];
    while (mixedLetters.length < gridSize * gridSize) {
      const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
      // Lägg till bokstav max 2 gånger
      if (
        !mixedLetters.includes(letter) ||
        mixedLetters.filter((l) => l === letter).length < 2
      ) {
        mixedLetters.push(letter);
      }
    }
    return mixedLetters.sort(() => Math.random() - 0.5);
  };

  if (glosor.length === 0 || grid.length === 0) return <p>Laddar spelet...</p>;

  return (
    <div className="wordhop-container">
      <h2>Bokstavshopp</h2>
      <WordHopWordPrompt swedish={glosor[currentIndex].swedish} />
      <WordHopGrid grid={grid} gridSize={gridSize} position={position} />
      <WordHopStatus
        collectedLetters={collectedLetters}
        error={error}
        won={won}
        correctWord={glosor[currentIndex].english}
      />
    </div>
  );
};

export default WordHop;
