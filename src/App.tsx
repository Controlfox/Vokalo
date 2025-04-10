import { useEffect, useState } from 'react'
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Business from './Business'
import Project from './Project'
import Contact from './Contact'
import Home from './Home'
import Login from './Login'
import GlosQuiz from './GlosQuiz'


function App() {

  const [page] = useState("")



  useEffect(() => {


  }, [page])

    return (
      <div>
        <Router>
          <header className='header'>
            <nav>
              <ul>
                <button><Link to="/">Startsida</Link></button>
                <button><Link to="/Business">Affärsplan</Link></button>
                <button><Link to="/Project">Projektidé</Link></button>
                <button><Link to="/Contact">Kontakt</Link></button>
                <button><Link to="/Login">Logga in</Link></button>
                <button><Link to="/GlosQuiz">Glosor</Link></button>
              </ul>
            </nav>
          </header>
          <main className='main'>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/Business' element={<Business/>}/>
              <Route path='/Project' element={<Project/>}/>
              <Route path='/Contact' element={<Contact/>}/>
              <Route path='/Login' element={<Login/>}/>
              <Route path='/GlosQuiz' element={<GlosQuiz/>}/>
            </Routes>
          </main>
          <footer className='footer'>
            <p>Vokalo 2025</p>
          </footer>
        </Router>
      </div>
    )
}

export default App
