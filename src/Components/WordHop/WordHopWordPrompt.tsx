import React from "react";

interface WordHopWordPromptI {
    swedish: string;
}

const WordHopWordPrompt: React.FC<WordHopWordPromptI> = ({ swedish }) => (
    <p><strong>Stava det engelska ordet för:</strong> {swedish}</p>
);

export default WordHopWordPrompt;