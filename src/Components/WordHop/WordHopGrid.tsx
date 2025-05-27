import React from "react";

interface WordHopGridI {
    grid: string[];
    gridSize: number;
    position: {x: number; y: number};
}

const WordHopGrid: React.FC<WordHopGridI> = ({ grid, gridSize, position}) => (
    <div className="grid">
        {grid.map((letter, idx) => {
            const x = idx % gridSize;
            const y = Math.floor(idx / gridSize);
            const isPlayer = position.x == x && position.y == y;

            return (
                <div key={idx} className={`cell ${isPlayer ? 'player' : ''}`}>
                    {isPlayer ? <span className="icon">🧍</span> : letter}
                </div>
            );
        })}
    </div>
);

export default WordHopGrid;