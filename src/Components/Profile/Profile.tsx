import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Profile.css"

const Profile = ({ user, handleLogout }: { user: any, handleLogout: () => void }) => {
  const [totalScore, setTotalScore] = useState<number>(0);
  const navigate = useNavigate(); // För att hantera omdirigering

  // Hämta alla quizpoäng från localStorage och summera dem
  useEffect(() => {
    const allScores = Object.keys(localStorage).filter(key => key.startsWith('quizScore_'));
    const total = allScores.reduce((acc, key) => acc + parseInt(localStorage.getItem(key) || '0', 10), 0);
    setTotalScore(total);
  }, []);

  const handleLogoutAndRedirect = () => {
    handleLogout(); // Ta bort användardata från localStorage
    navigate('/Login'); // Omdirigera till inloggningssidan
  };

  return (
    <div className="profile-container">
      {user ? (
        <div>
          <h2>Välkommen, {user.username}!</h2>
          <p>Totala poäng: {totalScore}</p>
          <button onClick={handleLogoutAndRedirect}>Logga ut</button>
        </div>
      ) : (
        <p>Du är inte inloggad. Logga in för att se din profil.</p>
      )}
    </div>
  );
};

export default Profile;
