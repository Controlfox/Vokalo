import React from "react";

interface GlosaRecordI {
    id: number;
    swedish: string;
    english: string;
    child: string;
}

interface GlosaItemI {
    glosa: GlosaRecordI;
    onUpdate: (id: number, field: 'swedish' | 'english', value: string) => void;
    onDelete: (id: number) => void;
}

const GlosaItem: React.FC<GlosaItemI> = ({ glosa, onUpdate, onDelete}) => (
    <li className="glosa-item">
        <input 
            className="edit"
            value={glosa.swedish}
            onChange={e => onUpdate(glosa.id, "swedish", e.target.value)}
        />
        <input
            className="edit"
            value={glosa.english}
            onChange={e => onUpdate(glosa.id, "english", e.target.value)}
        />
        <button className="delete" onClick={() => onDelete(glosa.id)}>x</button>
    </li>
);

export default GlosaItem;