import React from "react";

interface WordHopStatusI {
    collectedLetters: string[];
    error: boolean;
    won: boolean;
    correctWord: string;
}

const WordHopStatus: React.FC<WordHopStatusI> = ({ collectedLetters, error, won, correctWord}) => (
    <div className="status">
        <p>Ditt ord: {collectedLetters.join('')}</p>
        {error && <p className="error">Fel bokstav! Försök igen.</p>}
        {won && <p className="win">Du stavade {correctWord.toUpperCase()} rätt! 🎉</p>}
    </div>
);

export default WordHopStatus;