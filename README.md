[Projekt-rapport](Rapport.md)
[Publicerad-app] (https://vokalo-app-b5nzr.ondigitalocean.app/)
[Krav](Krav.md)

### Versionshantering

Jag använder mig av branching-strategi för att hålla dom olika inlämningarna separata.

### Vokalo

Vokalo är en webbapplikation som hjälper barn att lära sig glosor på ett roligt och interaktivt sätt genom spel. Applikationen tillåter användare att sätta upp en daglig glosutmaning och motiverar genom belöningssystem och statistik. Vokalo kan blockera andra funktioner på datorn tills alla glosor är korrekt besvarade.

### Funktioner

* Daglig glosutmaning med möjlighet att ställa in exakt tid.

* Poängsystem för att motivera användaren.

* Statistikvy som visar användarens framsteg.

* Interaktiva glos-spel.

* Inloggning/registrering för både föräldrar och barn.

### Repo-struktur och teknikstack

Det här repot innehåller både frontend (React/Vite) och backend (ASP.NET Core 8).Projektet använder in-memory database för backend.

/frontend   – React/Vite-app (src, public)
/backend    – ASP.NET Core 8 API (Controllers, Data, Models)

* I nuläget ligger både backend och frontend i samma repo-rot.

### Portar och startkommandon

> OBS: I nuläget ligger både backend och frontend i samma repo-rot.

---

## Portar och startkommandon

| Applikation | Standardport | Startkommando                |
| ----------- | ------------ | ---------------------------- |
| Frontend    | 5173 (Vite)  | `npm run dev` (i rotmappen)  |
| Backend     | 5287         | `dotnet run` (i rotmappen)   |
| Databas     | In-memory    | -                            |

---

## Installation och körning

### Förutsättningar

* [Node.js](https://nodejs.org/) (v16 eller senare)
* [npm](https://www.npmjs.com/)
* [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)

---

1. Klona projektet

git clone https://github.com/controlfox/vokalo.git
cd vokalo

2. Installera frontend-beroenden

npm install

3. Starta backend (API)

dotnet run

Backend startar på http://localhost:5287

4. Starta frontend (React/Vite)

npm run dev

Frontend startar på t.ex. http://localhost:5173

### Tips om du vill ändra portar

Om du vill köra frontend på annan port (t.ex. 3000), ändra i vite.config.ts och API-url i din kod.

### Hur frontend och backend hänger ihop

* Frontend (React) kommunicerar med backend via REST API-anrop.

* API-url anges i koden (t.ex. const API = "http://localhost:5287").

* Data hämtas och skickas från flera olika React-komponenter.

### API-dokumentation och exempel

GET-exempel i React-komponent

// Hämta glosor för inloggat barn
const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
fetch(`http://localhost:5287/glosor?child=${user.username}`)
  .then(res => res.json())
  .then(data => setQuestions(data));

// Hämta barn till förälder
fetch(`http://localhost:5287/users/children/thlm`)
  .then(res => res.json())
  .then(data => setChildren(data));

### POST-exempel i React-komponent

// Registrera ny användare
fetch('http://localhost:5287/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: "barn123",
    password: "hemligt",
    role: "child",
    parent: "thlm"
  })
});

// Lägg till en ny glosa
fetch('http://localhost:5287/glosor', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    swedish: "hund",
    english: "dog",
    child: "barn123"
  })
});


### Bygg och produktion

För att bygga frontend för produktion:

npm run build

Kör npm run preview för att förhandsgranska produktionen lokalt.


### Teknisk stack

Frontend: React, Vite, TypeScript, CSS

Backend: ASP.NET Core 8, Entity Framework In-Memory DB

### Mina komponenter

1. Challenges
2. Login
3. Register
4. ChildSelector
5. GlosaForm
6. GlosaItem
7. GlosaList
8. ManageGlosor
9. ParentDashboard
10. Profile
11. ShootTheWord
12. WeeklyGlosor
13. WordHop
14. WordHopGrid
15. WordHopStatus
16. WordHopWordPrompt