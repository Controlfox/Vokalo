import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import "./Login.css";
import { User } from '../../Types';

const API = 'http://localhost:3001';

interface RegisterProps {
  onRegistered: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegistered }) => {
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole]                 = useState<'parent' | 'child'>('parent');
  const [parentUsername, setParentUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) Lösenordsvalidering
    if (password !== confirmPassword) {
      setErrorMessage('Lösenorden matchade inte!');
      return;
    }

    // 2) Kontrollera om användarnamn redan finns
    const existing = await fetch(`${API}/users?username=${encodeURIComponent(username)}`)
      .then(r => r.json());
    if (existing.length) {
      setErrorMessage('Användarnamnet är upptaget!');
      return;
    }

    // 3) Om barn, kontrollera förälder finns
    if (role === 'child') {
      const parentList = await fetch(`${API}/users?username=${encodeURIComponent(parentUsername)}&role=parent`)
        .then(r => r.json());
      if (!parentList.length) {
        setErrorMessage('Föräldrakonto hittades inte!');
        return;
      }
    }

    // 4) Hasha lösenordet
    const hash = await bcrypt.hash(password, 10);

    // 5) POST mot backend
    const newUser: User = {
      username,
      passwordHash: hash,
      role,
      ...(role === 'child' ? { parent: parentUsername } : { children: [] })
    };
    const res = await fetch(`${API}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    if (!res.ok) {
      setErrorMessage('Något gick fel vid skapandet');
      return;
    }

    alert('Användare skapad!');
    onRegistered();
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <select
          value={role}
          onChange={e => setRole(e.target.value as 'parent' | 'child')}
        >
          <option value="parent">Förälder</option>
          <option value="child">Barn</option>
        </select>
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Bekräfta lösenord"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        {role === 'child' && (
          <input
            type="text"
            placeholder="Förälderns användarnamn"
            value={parentUsername}
            onChange={e => setParentUsername(e.target.value)}
            required
          />
        )}
        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}
        <button type="submit">Skapa användare</button>
      </form>
    </div>
  );
};

export default Register;
