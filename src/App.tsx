import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Business from './Business';
import Project from './Project';
import Contact from './Contact';
import Login from './Login';
import Profile from './Profile';
import GlosQuiz from './GlosQuiz';

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser)); // Läs från localStorage när appen laddas
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser'); // Ta bort användardata vid utloggning
    setCurrentUser(null); // Uppdatera tillståndet för användaren
  };

  return (
    <div>
      <Router>
        <header className="header">
          <nav>
            <ul>
              <button><Link to="/">Startsida</Link></button>
              <button><Link to="/Business">Affärsplan</Link></button>
              <button><Link to="/Project">Projektidé</Link></button>
              <button><Link to="/Contact">Kontakt</Link></button>
              {currentUser ? (
                <button><Link to="/Profile">Profil</Link></button>
              ) : (
                <button><Link to="/Login">Logga in</Link></button>
              )}
              <button><Link to="/GlosQuiz">Glosor</Link></button>
            </ul>
          </nav>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Business" element={<Business />} />
            <Route path="/Project" element={<Project />} />
            <Route path="/Contact" element={<Contact />} />
            <Route
              path="/Login"
              element={<Login setCurrentUser={setCurrentUser} />}
            />
            <Route
              path="/Profile"
              element={<Profile user={currentUser} handleLogout={handleLogout} />}
            />
            <Route path="/GlosQuiz" element={<GlosQuiz />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>Vokalo 2025</p>
        </footer>
      </Router>
    </div>
  );
}

export default App;
