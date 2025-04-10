import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = (e: React.FormEvent) => {
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

    // Spara användarinformationen i localStorage
    localStorage.setItem(username, JSON.stringify({ username, password }));
    setErrorMessage('');
    alert('Användare skapad!');
    // Du kan här kanske navigera användaren till inloggningssidan efter skapandet
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Skapa användare</button>
      </form>
    </div>
  );
};

export default Register;
