import React from 'react'
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'

function Contact() {
    return (
      <div>
        <h1>Kontakta oss</h1>
        <div>
            <img src="src/Jag.jpeg" alt="En bild på mig och en av mina katter" />
            <p>Vokalo@mail.se</p>
            <p>0723456789</p>
        </div>
      </div>
    )
}

export default Contact