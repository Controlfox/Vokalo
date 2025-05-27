import React, { useEffect, useState } from "react";
import { User } from "../../Types";
import './ManageGlosor.css'
import ChildSelector from "./ChildSelector";
import GlosaForm from "./GlosaForm";
import GlosaList from "./GlosaList";

interface GlosaRecord {
    id: number;
    swedish: string;
    english: string;
    child: string;
}

const API = 'http://localhost:5287';

const ManageGlosor: React.FC = () => {
    const stored = localStorage.getItem('currentUser');
    const parent: User = stored ? JSON.parse(stored) : ({} as User);

    const [children, setChildren] = useState<User[]>([]);
    const [selectedChild, setSelectedChild] = useState<string>('');
    const [glosor, setGlosor] = useState<GlosaRecord[]>([]);
    const [newSwedish, setNewSwedish] = useState('');
    const [newEnglish, setNewEnglish] = useState('');

    // 1. Hämta barn från backend
    useEffect(() => {
        if (!parent.username) return;
        fetch(`${API}/users/children/${parent.username}`)
            .then(res => res.json())
            .then((kids: User[]) => {
                setChildren(kids);
                if (kids.length) setSelectedChild(kids[0].username);
            })
            .catch(err => console.error('Hämtning av barn misslyckades', err));
    }, [parent.username]);

    // 2. Hämta glosor för valt barn
    useEffect(() => {
        if (!selectedChild) return;
        fetch(`${API}/glosor?child=${selectedChild}`)
            .then(res => res.json())
            .then((data: GlosaRecord[]) => setGlosor(data))
            .catch(err => console.error('Hämtning av glosor misslyckades', err));
    }, [selectedChild]);

    // 3. Lägg till ny glosa
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const record = { swedish: newSwedish, english: newEnglish, child: selectedChild };
        fetch(`${API}/glosor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record)
        })
            .then(res => res.json())
            .then((created: GlosaRecord) => {
                setGlosor([...glosor, created]);
                setNewSwedish('');
                setNewEnglish('');
            })
            .catch(err => console.error('Lägg till glosa misslyckades', err));
    };

    // 4. Uppdatera glosa
    const handleUpdate = (id: number, field: 'swedish' | 'english', value: string) => {
        const updatedList = glosor.map(g => g.id === id ? { ...g, [field]: value } : g);
        setGlosor(updatedList);
        const updatedRecord = updatedList.find(g => g.id === id)!;
        fetch(`${API}/glosor/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRecord)
        }).catch(err => console.error('Uppdatering av glosa misslyckades', err));
    };

    // 5. Radera glosa
    const handleDelete = (id: number) => {
        fetch(`${API}/glosor/${id}`, { method: 'DELETE' })
            .then(() => setGlosor(glosor.filter(g => g.id !== id)))
            .catch(err => console.error('Radering av glosa misslyckades', err));
    };

    return (
        <div className="manage-container">
            <h2>Hantera veckans glosor</h2>
            <ChildSelector
                childrenList={children}
                selectedChild={selectedChild}
                onChange={e => setSelectedChild(e.target.value)}
            />
            <GlosaForm
                swedish={newSwedish}
                english={newEnglish}
                onSwedishChange={e => setNewSwedish(e.target.value)}
                onEnglishChange={e => setNewEnglish(e.target.value)}
                onSubmit={handleAdd}
            />
            <GlosaList
                glosor={glosor}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default ManageGlosor;
