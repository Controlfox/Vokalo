import { Link } from 'react-router-dom';
import './Challenges.css';

const Challenges = () => {
  return (
    <div className="challenges-container">
      <h2>Utmaningar</h2>
      <p>Här hittar du olika spel och utmaningar!</p>

      <div className="challenge-card-container">
        <Link to="/WordHop" className="challenge-card">
          <h3>🔤 Bokstavshopp</h3>
          <p>Stava ordet genom att hoppa på rätt bokstäver!</p>
        </Link>
        <Link to="/ShootTheWord" className="challenge-card">
          <h3>🎯 Skjut rätt bokstav</h3>
          <p>Träffa rätt bokstav i rätt ordning för att stava rätt!</p>
        </Link>
      </div>
    </div>
  );
};

export default Challenges;
