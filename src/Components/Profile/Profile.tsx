import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Profile.css"
import { User } from '../../Types';
import ReusableTable from '../ReusableTable';
import { useUser } from '../../Context/UserContext';

const mockHighscores = [
  {Namn: "Lisa", Poäng: 10},
  {Namn: "Anna", Poäng: 8},
  {Namn: "Kalle", Poäng: 7},
];

const columns = ["Namn", "Poäng"];

const Profile = () => {
  const [totalScore, setTotalScore] = useState<number>(0);
  const {user, setUser} = useUser();
  const navigate = useNavigate();

  // Hämta alla quizpoäng från localStorage och summera dem
  useEffect(() => {
    const allScores = Object.keys(localStorage).filter(key => key.startsWith('quizScore_'));
    const total = allScores.reduce((acc, key) => acc + parseInt(localStorage.getItem(key) || '0', 10), 0);
    setTotalScore(total);
  }, []);

  const handleLogoutAndRedirect = () => {
    setUser(null); // Ta bort användardata från localStorage
    localStorage.removeItem('currentUser')
    navigate('/Login'); // Omdirigera till inloggningssidan
  };

  return (
    <div className="profile-container">
      {user ? (
        <div>
          <h2>Välkommen, {user.username}!</h2>
          <p>Totala poäng: {totalScore}</p>
          <p>Highscore</p>
          <ReusableTable columns={columns} data={mockHighscores} />
          <button onClick={handleLogoutAndRedirect}>Logga ut</button>
        </div>
      ) : (
        <p>Du är inte inloggad. Logga in för att se din profil.</p>
      )}
    </div>
  );
};

export default Profile;
