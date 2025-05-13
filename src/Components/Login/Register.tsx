import React, { useState } from 'react';
import "./Login.css";
import bcrypt from 'bcryptjs';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'parent' | 'child'>('parent');
  const [parentUsername, setParentUsername] = useState(''); //För barnkonton
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validera om lösenordet och bekräftelsen är samma
    if (password !== confirmPassword) {
      setErrorMessage('Lösenorden matchade inte!');
      return;
    }

    // Kontrollera om användarnamnet redan finns
    const existingUser = localStorage.getItem(username);
    if (existingUser) {
      setErrorMessage('Användarnamnet är upptaget!');
      return;
    }

    if(role == 'child') {
        const parent = localStorage.getItem(parentUsername);
        if(!parent) {
            setErrorMessage('Föräldrakonto hittades inte!');
            return;
        }
    }

    const hash = await bcrypt.hash(password, 10);

    const userData = {
        username,
        passwordHash: hash,
        role,
        ...(role == 'child' && {parent: parentUsername}),
        ...(role == 'parent' && {children: []}),
    };

    // Spara användarinformationen i localStorage
    localStorage.setItem(username, JSON.stringify({ userData }));
    setErrorMessage('');
    alert('Användare skapad!');
    // Du kan här kanske navigera användaren till inloggningssidan efter skapandet
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <select value={role} onChange={(e) => setRole(e.target.value as 'parent' | 'child')}>
            <option value="parent">Förälder</option>
            <option value="child">Barn</option>
        </select>
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Bekräfta lösenord"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {role == 'child' && (
            <input type="text"
            placeholder='Förälderns användarnamn'
            value={parentUsername}
            onChange={(e) => setParentUsername(e.target.value)}
            />
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Skapa användare</button>
      </form>
    </div>
  );
};

export default Register;
