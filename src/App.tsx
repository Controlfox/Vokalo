import React, { useEffect, useState } from 'react'
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Business from './Business'
import Project from './Project'
import Contact from './Contact'
import Home from './Home'


function App() {

  const [page, setPage] = useState("")



  useEffect(() => {
    const qp = new URLSearchParams(window.location.search)
    const url = qp.get("page")


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
