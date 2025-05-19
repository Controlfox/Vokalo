import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import Register from './Register';
import "./Login.css";
import { User } from '../../Types';

const API = 'http://localhost:3001';

interface LoginProps {
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Login: React.FC<LoginProps> = ({ setCurrentUser }) => {
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    //Hämta användaren från backend
    const res = await fetch(`${API}/users?username=${encodeURIComponent(username)}`);
    const users = await res.json();
    if (!users.length) {
      alert('Användarnamnet hittades inte');
      return;
    }
    const user = users[0] as User;

    //Jämför hash
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      alert('Fel lösenord');
      return;
    }

    //Inloggning lyckad — spara i localStorage och context
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);

    //Navigera baserat på roll
    if (user.role === 'parent') {
      navigate('/ManageGlosor');
    } else {
      navigate('/WeeklyGlosor');
    }
  };

  return (
    <div className="login-container">
      {isRegistering ? (
        <Register onRegistered={() => setIsRegistering(false)} />
      ) : (
        <form onSubmit={handleLogin}>
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
          <button type="submit">Logga in</button>
        </form>
      )}
      <button
        className="toggle-link"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering 
          ? 'Har du redan ett konto? Logga in'
          : 'Har du inget konto? Registrera'
        }
      </button>
    </div>
  );
};

export default Login;
