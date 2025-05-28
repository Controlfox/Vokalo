import { useEffect, useState } from "react";
import "./ShootTheWord.css";
import { fetchGlosor } from "../../apiService/glosor";
import { useUser } from "../../Context/UserContext";

/**
 * Komponent för "Shoot the Word"-spel:
 * Barn ska skjuta på rätt bokstäver i rätt ordning för att stava glosans engelska ord.
 */
interface Glosa {
  id: number;
  swedish: string;
  english: string;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const ShootTheWord = () => {
  const { user } = useUser();
  const [glosor, setGlosor] = useState<Glosa[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collected, setCollected] = useState<string[]>([]);
  const [targets, setTargets] = useState<
    { letter: string; left: number; state: "idle" | "hit" | "hidden" }[]
  >([]);
  const [message, setMessage] = useState("");
  const [crosshairPos, setCrosshairPos] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [score, setScore] = useState(0);
  const [hitIndex, setHitIndex] = useState<number | null>(null);

  // Hämta glosor för inloggat barn
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
      .catch((err) => setMessage(err.message));
  }, [user?.username]);

  // Sätt upp nya targets (bokstäver) när nytt ord laddas
  useEffect(() => {
    if (glosor.length > 0) {
      const word = glosor[currentIndex].english.toUpperCase();
      const mix = new Set(word);
      while (mix.size < 9) {
        mix.add(alphabet[Math.floor(Math.random() * alphabet.length)]);
      }
      const shuffled = Array.from(mix).sort(() => Math.random() - 0.5);
      const positioned = shuffled.map((letter) => ({
        letter,
        left: Math.random() * 80 + 10,
        state: "idle" as "idle",
      }));
      setTargets(positioned);
      setCollected([]);
      setMessage("");
    }
  }, [glosor, currentIndex]);

  // Fånga musposition för "crosshair"
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCrosshairPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /**
   * Hanterar när användaren "skjuter" på en bokstav
   */
  const handleShoot = (letter: string) => {
    const word = glosor[currentIndex].english.toUpperCase();
    const next = word[collected.length];

    if (letter === next) {
      // Rätt bokstav – lägg till och visa feedback
      const updated = [...collected, letter];
      setCollected(updated);
      setHitIndex(targets.findIndex((t) => t.letter === letter));
      setTargets((prev) =>
        prev.map((t) =>
          t.letter === letter && t.state === "idle" ? { ...t, state: "hit" } : t
        )
      );
      // Om hela ordet klart – spara poäng och gå vidare
      if (updated.join("") === word) {
        setScore((prev) => prev + 1);
        localStorage.setItem(`quizScore_${Date.now()}`, "1");
        setMessage("Rätt! 🥳");
        setTimeout(() => {
          setHitIndex(null);
          setTargets((prev) =>
            prev.map((t) =>
              t.letter == letter && t.state == "hit"
                ? { ...t, state: "idle" }
                : t
            )
          );
          if (currentIndex < glosor.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setMessage("Grattis! Alla ord klara!");
          }
        }, 1500);
      }
    } else {
      // Fel bokstav – visa feedback
      setMessage("Fel bokstav! Försök igen.");
      setTimeout(() => setMessage(""), 1000);
    }
  };

  if (glosor.length === 0 || targets.length === 0) return <p>Laddar spel...</p>;

  return (
    <div className="shoot-container">
      <h2>Skjut rätt bokstav</h2>
      <p>
        Stava engelska ordet för:{" "}
        <strong>{glosor[currentIndex].swedish}</strong>
      </p>
      <p>Ditt ord: {collected.join("")}</p>
      <p>Poäng: {score}</p>
      <div className="targets">
        {targets.map((target, idx) => (
          <button
            key={idx}
            className={`target ${target.state}`}
            onClick={() => handleShoot(target.letter)}
            style={{ left: `${target.left}%` }}
            disabled={target.state !== "idle"}
          >
            {target.letter}
          </button>
        ))}
      </div>
      {message && <p className="message">{message}</p>}
      <div
        className="crosshair"
        style={{ left: crosshairPos.x, top: crosshairPos.y }}
      ></div>
    </div>
  );
};

export default ShootTheWord;
