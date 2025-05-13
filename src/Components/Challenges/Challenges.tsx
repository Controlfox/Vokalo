
import { Link } from 'react-router-dom';
import './Challenges.css';

const Challenges = () => {
  return (
    <div className="challenges-container">
      <h2>Utmaningar</h2>
      <p>Här hittar du olika spel och utmaningar!</p>

      <ul className="challenge-list">
        <li>
          <Link to="/WordHop">🔤 Bokstavshopp – Stava ordet rätt</Link>
        </li>
        {/* Här kan du lägga till fler spel senare */}
        {/* <li><Link to="/ett-annat-spel">🎯 Ett annat spel</Link></li> */}
      </ul>
    </div>
  );
};

export default Challenges;
