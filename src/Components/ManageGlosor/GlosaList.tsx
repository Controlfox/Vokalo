import React from "react";
import GlosaItem from "./GlosaItem";

interface GlosaRecordI {
    id: number;
    swedish: string;
    english: string;
    child: string;
}

interface GlosaListI {
    glosor: GlosaRecordI[];
    onUpdate: (id: number, field: 'swedish' | 'english', value: string) => void;
    onDelete: (id: number) => void;
}

const GlosaList: React.FC<GlosaListI> = ({ glosor, onUpdate, onDelete}) => (
    <ul className="glosa-list">
        {glosor.map(g => (
            <GlosaItem
                key={g.id}
                glosa={g}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        ))}
    </ul>
);

export default GlosaList;