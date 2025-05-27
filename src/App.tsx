import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, NavLink } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';
import Profile from './Components/Profile/Profile';
import WeeklyGlosor from './Components/WeeklyGlosor/WeeklyGlosor';
import WordHop from './Components/WordHop/WordHop';
import Challenges from './Components/Challenges/Challenges';
import ShootTheWord from './Components/ShootTheWord/ShootTheWord';
import ParentDashboard from './Components/ParentDashboard/ParentDashboard';
import ManageGlosor from './Components/ManageGlosor/ManageGlosor';
import { ErrorBoundary } from './ErrorBoundary';

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

  const isParent = currentUser?.role == 'parent';
  const isChild = currentUser?.role == 'child';

  return (
    <Router>
      {currentUser ? (
        <div className="app-layout">
          <aside className="sidebar">
            <h2 className="logo">Vokalo</h2>
            <nav>
              <ul>
                <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>🏠 Startsida</NavLink></li>
                {isChild && (
                  <>
                    <li><NavLink to="/WeeklyGlosor" className={({ isActive }) => isActive ? 'active' : ''}>🧠 Veckans glosor</NavLink></li>
                    <li><NavLink to="/Challenges" className={({ isActive }) => isActive ? 'active' : ''}>🎯 Utmaningar</NavLink></li>
                    <li><NavLink to="/Explore" className={({ isActive }) => isActive ? 'active' : ''}>📋 Utforska</NavLink></li>
                  </>
                )}
                {isParent && (
                  <>
                    <li><NavLink to="/ParentDashboard" className={({ isActive }) => isActive ? 'active' : ''}>🧑‍💼 Föräldravy</NavLink></li>
                    <li><NavLink to="/ManageGlosor" className={({isActive})=>isActive?'active':''}>📋 Hantera glosor</NavLink></li>
                  </>

                )}
                
                <li><NavLink to="/Profile" className={({ isActive }) => isActive ? 'active' : ''}>👤 Profil</NavLink></li>
                <li><button className="logout-button" onClick={handleLogout}>🚪 Logga ut</button></li>
              </ul>
            </nav>
          </aside>
          <ErrorBoundary>
          <main className="main-content">
            <Routes>
              {isChild && (
                <>
                  <Route path="/WeeklyGlosor" element={<WeeklyGlosor />} />
                  <Route path="/Challenges" element={<Challenges />} />
                  <Route path="/WordHop" element={<WordHop />} />
                  <Route path="/ShootTheWord" element={<ShootTheWord />} />
                </>
              )}
              {isParent && (
                <>
                  <Route path="/ParentDashboard" element={<ParentDashboard />} />
                  <Route path="/ManageGlosor" element={<ManageGlosor />} />
                </>
              )}
              <Route path="/Profile" element={<Profile user={currentUser} handleLogout={handleLogout} />} />
              <Route path="/Login" element={<Navigate to="/" />} />
              
            </Routes>
            <footer className="footer">
              <p>Vokalo 2025</p>
            </footer>
          </main>
          </ErrorBoundary>
        </div>
      ) : (
        <ErrorBoundary>
        <Routes>
          <Route path="*" element={<Login setCurrentUser={setCurrentUser} />} />
        </Routes>
        </ErrorBoundary>
      )}
    </Router>
  );
}

export default App;
