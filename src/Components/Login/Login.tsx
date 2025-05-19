import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
import "./Login.css";
import { User } from '../../Types';

const API = 'http://localhost:5287';

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
    try {
      const res = await fetch(`${API}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }) // plaintext
      });
  
      if (!res.ok) {
        alert('Fel användarnamn eller lösenord');
        return;
      }
      const data = await res.json();
      // Spara token och användare
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setCurrentUser(data.user);
  
      if (data.user.role === 'parent') {
        navigate('/ManageGlosor');
      } else {
        navigate('/WeeklyGlosor');
      }
    } catch (error) {
      alert('Kunde inte kontakta servern.');
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
