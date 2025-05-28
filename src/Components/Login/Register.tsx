import React, { useState } from 'react';
import "./Login.css";
import { User } from '../../Types';
import { registerUser } from '../../apiService/users';

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
  
    if (password !== confirmPassword) {
      setErrorMessage('Lösenorden matchade inte!');
      return;
    }
    
    try {
      await registerUser({
        username,
        password,
        role,
        ...(role == 'child' ? {parent: parentUsername} : {children: []})
      });
      alert('Användare skapad!');
      onRegistered();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
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
