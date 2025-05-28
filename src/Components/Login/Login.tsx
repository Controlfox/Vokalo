import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
import "./Login.css";
import { User } from '../../Types';
import { useUser } from '../../Context/UserContext';
import { loginUser } from '../../apiService/users';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const {setUser} = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setUser(data.user);
      if(data.user.role == 'parent') navigate('/ManageGlosor');
      else navigate('/WeeklyGlosor');
    } catch (err: any) {
      alert(err.message);
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
