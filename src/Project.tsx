import React from 'react'
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'

function Project() {
    return (
      <div>
        <h1>Projektidé</h1>
        <div className='Card'>
          <h5>
            Funktioner i den första versionen:
          </h5>
          <ul>
            <li>
              En användarvänlig design där användaren loggar in
              och får en ny ordutmaning varje dag.
            </li>
            <li>
              Möjlighet att ställa in när på dagen utmaningen
              ska aktiveras.
            </li>
            <li>
              Ett poäng/belöningssystem för motivation.
            </li>
            <li>
              En översikt där användaren kan se sina förbättringar över tid.
            </li>
          </ul>
          </div>
          <div className='Card'>
            <h5>
              Planerad prototyp:
            </h5>
            <p>
              Prototypen byggs med React och till en början fokusera
              på grundläggande funktioner.
            </p>
            <ul>
              <li>
                En vy med enkel inloggning/Profilsida/Inställningar.
              </li>
              <li>
                En vy med dagens glosor och åtminstone 1 spel-alternativ
                istället för traditionella flashcards.
              </li>
              <li>
                En överssiktssida som visar statistik över inlärningen.
              </li>
              <li>
                Vid tid även inloggning för vårdnadshavare med tillhörande
                vyer.
              </li>
            </ul>
            <p>
              Vid senare utvecklingsfaser kan funktioner som AI, flerspelarläge
              och mer avancerade spel.
            </p>
          </div>
      </div>
    )
}

export default Project