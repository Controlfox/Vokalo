import React from "react";

interface GlosaFormI {
    swedish: string;
    english: string;
    onSwedishChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEnglishChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const GlosaForm: React.FC<GlosaFormI> = ({swedish, english, onSwedishChange, onEnglishChange, onSubmit}) => (
    <form onSubmit={onSubmit} className="add-form">
        <input
            type="text" 
            placeholder="Svenska"
            value={swedish}
            onChange={onSwedishChange}
            required
        />
        <input
            type="text"
            placeholder="Engelska"
            value={english}
            onChange={onEnglishChange}
            required    
        />
        <button type="submit">Lägg till</button>
    </form>
);

export default GlosaForm;