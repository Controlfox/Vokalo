import React, { useState } from 'react'
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Business from './Business'
import Project from './Project'
import Contact from './Contact'
import Home from './Home'

function App() {

  const [page, setPage] = useState("Home")

    return (
      <div>
        <Router>
          <header className='header'>
            <nav>
              <ul>
                <li><Link to="/">Startsida</Link></li>
                <li><Link to="/Business">Affärsplan</Link></li>
                <li><Link to="/Project">Projectidé</Link></li>
                <li><Link to="/Contact">Kontakt</Link></li>
              </ul>
            </nav>
          </header>
          <main className='main'>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/Business' element={<Business/>}/>
              <Route path='/Project' element={<Project/>}/>
              <Route path='/Contact' element={<Contact/>}/>
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
