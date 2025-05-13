import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import Register from './Register';
import "./Login.css";

const Login = ({ setCurrentUser }: { setCurrentUser: React.Dispatch<React.SetStateAction<any>> }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = localStorage.getItem(username);
    if (!userData) {
      alert('Användarnamnet hittades inte');
      return;
    }
    const parsedUser = JSON.parse(userData) as any;

    // Om vi har en hashalgoritm för lösenord
    if (parsedUser.passwordHash) {
      try {
        const match = await bcrypt.compare(password, parsedUser.passwordHash);
        if (!match) throw new Error();
      } catch {
        alert('Fel lösenord');
        return;
      }
    } else if (parsedUser.password) {
      // Fallback för gamla konton: jämför klartext
      if (parsedUser.password !== password) {
        alert('Fel lösenord');
        return;
      }
      // Migrera till hashad lösenord om inloggning lyckas
      const newHash = await bcrypt.hash(password, 10);
      const updatedUser = { ...parsedUser, passwordHash: newHash };
      delete updatedUser.password;
      localStorage.setItem(username, JSON.stringify(updatedUser));
      parsedUser.passwordHash = newHash;
    }

    // Inloggning lyckad
    localStorage.setItem('currentUser', JSON.stringify(parsedUser));
    setCurrentUser(parsedUser);
    // Navigera efter roll
    navigate(parsedUser.role === 'parent' ? '/ParentDashboard' : '/WeeklyGlosor');
  };

  return (
    <div className="login-container">
      {isRegistering ? (
        <Register />
      ) : (
        <form onSubmit={handleLogin}>
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
          <button type="submit">Logga in</button>
        </form>
      )}
      <button onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
        {isRegistering ? 'Har du redan ett konto? Logga in' : 'Har du inget konto? Registrera'}
      </button>
    </div>
  );
};

export default Login;
