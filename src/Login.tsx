import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './Register';

const Login = ({ setCurrentUser }: { setCurrentUser: React.Dispatch<React.SetStateAction<any>> }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Lägg till state för att hantera registrering
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = localStorage.getItem(username);
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.password === password) {
        localStorage.setItem('currentUser', JSON.stringify(parsedUser));
        setCurrentUser(parsedUser); // Uppdatera tillståndet när användaren loggar in
        navigate('/Profile');
      } else {
        alert('Fel lösenord');
      }
    } else {
      alert('Användarnamnet hittades inte');
    }
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
      
      {/* Knapp för att växla mellan inloggning och registrering */}
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Logga in' : 'Har du inget konto? Registrera'}
      </button>
    </div>
  );
};

export default Login;
