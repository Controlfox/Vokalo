import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import './ParentDashboard.css';

interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: 'parent' | 'child';
  parent?: string;       // bara för barn
  children?: string[];   // bara för föräldrar
}

interface Glosa { swedish: string; english: string; }

const API = 'http://localhost:3001';

const ParentDashboard: React.FC = () => {
  const stored = localStorage.getItem('currentUser');
  const initialParent: User | null = stored
    ? JSON.parse(stored)
    : null;

  const [parent, setParent]       = useState<User | null>(initialParent);
  const [childName, setChildName] = useState('');
  const [childPass, setChildPass] = useState('');
  const [message, setMessage]     = useState('');

  // Läs in full parent från API (för att få uppdaterat children-array)
  useEffect(() => {
    if (!parent) return;
    fetch(`${API}/users/${parent.id}`)
      .then(r => r.json())
      .then((u: User) => setParent(u))
      .catch(console.error);
  }, [parent?.id]);

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parent || !childName || !childPass) return;

    // 1) Skapa nytt barn‐konto (hasha lösenord först)
    const hash = await bcrypt.hash(childPass, 10);
    const newChild: Omit<User, 'id'> = {
      username: childName,
      passwordHash: hash,
      role: 'child',
      parent: parent.username
    };

    const resChild = await fetch(`${API}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newChild)
    });
    if (!resChild.ok) {
      setMessage('Kunde inte skapa barnkontot');
      return;
    }
    const createdChild: User = await resChild.json();

    // 2) Uppdatera förälderns children-lista
    const updatedChildren = [...(parent.children || []), createdChild.username];
    const resParent = await fetch(`${API}/users/${parent.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ children: updatedChildren })
    });
    if (!resParent.ok) {
      setMessage('Kunde inte länka barnet till föräldern');
      return;
    }
    const updatedParent: User = await resParent.json();

    // 3) Spara lokalt
    setParent(updatedParent);
    localStorage.setItem('currentUser', JSON.stringify(updatedParent));

    setMessage(`Barnkonto ${createdChild.username} skapat och kopplat!`);
    setChildName('');
    setChildPass('');
  };

  if (!parent) return <p>Laddar …</p>;

  return (
    <div className="parent-dashboard">
      <h2>Föräldravy</h2>

      <section className="section">
        <h3>Skapa barnkonto</h3>
        <form onSubmit={handleAddChild} className="form">
          <input
            type="text"
            placeholder="Barnens användarnamn"
            value={childName}
            onChange={e => setChildName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={childPass}
            onChange={e => setChildPass(e.target.value)}
            required
          />
          <button type="submit">Skapa barn</button>
        </form>
      </section>

      {message && <p className="message">{message}</p>}

      <section className="section">
        <h3>Dina barn</h3>
        <ul>
          {parent.children?.map(c => (
            <li key={c}>{c}</li>
          )) || <li>Inga barn kopplade ännu</li>}
        </ul>
      </section>
    </div>
  );
};

export default ParentDashboard;
