import React, { useState } from "react";
import "./Login.css";
import { registerUser } from "../../apiService/users";

/**
 * Register-komponent: visar formulär för att skapa ett nytt konto.
 * När ett konto skapats visas login-formuläret igen.
 */
interface RegisterProps {
  onRegistered: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegistered }) => {
  // Formulärstate för användaruppgifter
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"parent" | "child">("parent");
  const [parentUsername, setParentUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Skickar register-formuläret till servern.
   * Vid lyckad registrering återgår komponenten till login-läge.
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Lösenorden matchade inte!");
      return;
    }

    try {
      await registerUser({
        username,
        password,
        role,
        ...(role == "child" ? { parent: parentUsername } : { children: [] }),
      });
      alert("Användare skapad!");
      onRegistered(); // Återgå till login
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "parent" | "child")}
        >
          <option value="parent">Förälder</option>
          <option value="child">Barn</option>
        </select>
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Bekräfta lösenord"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {role === "child" && (
          <input
            type="text"
            placeholder="Förälderns användarnamn"
            value={parentUsername}
            onChange={(e) => setParentUsername(e.target.value)}
            required
          />
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Skapa användare</button>
      </form>
    </div>
  );
};

export default Register;
