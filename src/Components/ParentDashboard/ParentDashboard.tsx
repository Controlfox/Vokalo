import React, { useState, useEffect } from 'react';
import './ParentDashboard.css';

interface Glosa { swedish: string; english: string; }
interface User { username: string; password: string; role: 'parent' | 'child'; children: string[]; }

const ParentDashboard = () => {
  const [parent, setParent] = useState<User | null>(null);
  const [childName, setChildName] = useState('');
  const [childPass, setChildPass] = useState('');
  const [glosorSw, setGlosorSw] = useState('');
  const [glosorEn, setGlosorEn] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const u: User = JSON.parse(stored);
      setParent(u);
      if (u.children.length > 0) setSelectedChild(u.children[0]);
    }
  }, []);

  const updateParentStore = (updated: User) => {
    localStorage.setItem(parent!.username, JSON.stringify(updated));
    localStorage.setItem('currentUser', JSON.stringify(updated));
    setParent(updated);
  };

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parent) return;
    if (childName && childPass) {
      // create child user
      const newChild: User = { username: childName, password: childPass, role: 'child', children: [] };
      localStorage.setItem(childName, JSON.stringify(newChild));
      // update parent
      const updated = { ...parent, children: [...parent.children, childName] };
      updateParentStore(updated);
      setMessage(`Barnkonto ${childName} skapat.`);
      setChildName(''); setChildPass('');
    }
  };

  const handleAddGlosa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;
    const key = `glosor_${selectedChild}`;
    const existing = localStorage.getItem(key);
    const arr: Glosa[] = existing ? JSON.parse(existing) : [];
    arr.push({ swedish: glosorSw, english: glosorEn });
    localStorage.setItem(key, JSON.stringify(arr));
    setMessage(`Lagt till glosa för ${selectedChild}.`);
    setGlosorSw(''); setGlosorEn('');
  };

  if (!parent) return <p>Laddar...</p>;

  return (
    <div className="parent-dashboard">
      <h2>Föräldravy</h2>
      <section className="section">
        <h3>Skapa barnkonto</h3>
        <form onSubmit={handleAddChild} className="form">
          <input value={childName} onChange={e => setChildName(e.target.value)} placeholder="Barnens användarnamn" />
          <input type="password" value={childPass} onChange={e => setChildPass(e.target.value)} placeholder="Lösenord" />
          <button type="submit">Skapa barn</button>
        </form>
      </section>

      <section className="section">
        <h3>Lägg till veckans glosor</h3>
        <form onSubmit={handleAddGlosa} className="form">
          <select value={selectedChild} onChange={e => setSelectedChild(e.target.value)}>
            {parent.children.map(child => <option key={child} value={child}>{child}</option>)}
          </select>
          <input value={glosorSw} onChange={e => setGlosorSw(e.target.value)} placeholder="Svensk" />
          <input value={glosorEn} onChange={e => setGlosorEn(e.target.value)} placeholder="Engelsk" />
          <button type="submit">Lägg till glosa</button>
        </form>
      </section>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ParentDashboard;
