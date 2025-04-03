import React from 'react'
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'

function Business() {
    return (
      <div>
        <h1>Affärsplan</h1>
        <div className='Card'>
          <p>
            Vokalo är en revolutionerande
            app som gör glosinlärning
            roligt. Idén uppstod eftersom
            att många barn hellre spelar
            än pluggar glosor, vilket
            skapar frustration hos
            föräldrar. Vokalo löser det
            genom att kombinera lärandet
            med spel och en funktion där
            vårdnadshavare kan blockera
            andra dator funktioner tills
            glosorna är korrekt besvarade
          </p>
        </div>
        <div className='Card'>
          <p>
            Målgruppen är barn i
            skolåldern och deras
            vårdnadshavare, men på sikt
            även skolor och lärare.
            Intäkterna kommer främst från
            prenumerationer men en
            gratisversion med reklam kan
            också bli en del av
            affärsmodellen. Första
            versionen blir en enkel
            webbapp med grundläggande
            spelfunktioner.
          </p>
        </div>
        <div className='Card'>
          <p>
            Projektet drivs som en star tup
            parallellt med studier, med
            fokus på en hållbar
            utvecklingstakt. Största
            utmaningarna är att nå ut till
            användare, hantera tekniska
            utmaningar och balansera
            tiden effektivt. Riskerna
            hanteras genom smar t
            marknadsföring, noggrann
            testning och att prioritera
            funktioner som ger mest värde
            från start.
          </p>
        </div>
      </div>
    )
}

export default Business