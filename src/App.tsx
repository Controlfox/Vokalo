import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';
import Profile from './Components/Profile/Profile';
import WeeklyGlosor from './Components/WeeklyGlosor/WeeklyGlosor';
import WordHop from './Components/WordHop/WordHop';
import Challenges from './Components/Challenges/Challenges';

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <Router>
      {currentUser ? (
        <div className="app-container">
          <aside className="sidebar">
            <h2>Vokalo</h2>
            <nav>
              <ul>
              <li><Link to="/">🏠 Startsida</Link></li>
              <li><Link to="/Explore">📋 Utforska</Link></li>
              <li><Link to="/WeeklyGlosor">🧠 Veckans glosor</Link></li>
              <li><Link to="/Challenges">📞 Utmaningar</Link></li>
              <li><Link to="/Profile">👤 Profil</Link></li>
                <li><button onClick={handleLogout}>🚪 Logga ut</button></li>
              </ul>
            </nav>
          </aside>
          <main className="main-content">
          <Routes>
            <Route path="/WeeklyGlosor" element={<WeeklyGlosor />} />
            <Route path="/Profile" element={<Profile user={currentUser} handleLogout={handleLogout} />} />
            <Route path="/Login" element={<Navigate to="/" />} />
            <Route path="/Challenges" element={<Challenges />} />
            <Route path="/WordHop" element={<WordHop />} />
          </Routes>
            <footer className="footer">
              <p>Vokalo 2025</p>
            </footer>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<Login setCurrentUser={setCurrentUser} />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
