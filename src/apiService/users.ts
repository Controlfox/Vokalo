const API = 'http://localhost:5287';

//Hämtning och felhantering för att logga in användare
export async function loginUser(username: string, password: string) {
  try {
    const res = await fetch(`${API}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username, password})
    });
    if(!res.ok) throw new Error("Fel användarnamn eller lösenord");
    return await res.json();
  } catch (err) {
    throw new Error("Kunde inte kontakta servern.");
  }
}

//Hämtning och felhantering för att skapa användare
export async function registerUser(data:any) {
  try{
    const res = await fetch(`${API}/users`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error("Kunde inte skapa användaren");
    return await res.json();
  } catch {
    throw new Error("Kunde inte kontakta servern.")
  }
}

//Hämtning och felhantering för att hämta barn
export async function fetchChildren(parentUsername: string) {
  try {
    const res = await fetch(`${API}/users/children/${parentUsername}`);
    if(!res.ok) throw new Error("Kunde inte hämta barn");
    return await res.json();
  } catch {
    throw new Error("Kunde inte kontakta servern.");
  }
}

//Hämtning och felhantering för att hämta användare med id
export async function fetchUserById(id: number) {
  try {
    const res = await fetch(`${API}/users/${id}`);
    if (!res.ok) throw new Error("Kunde inte hämta användare");
    return await res.json();
  } catch {
    throw new Error("Kunde inte kontakta servern.");
  }
}

//Hämtning och felhantering för att uppdatera användare
export async function patchUser(id: number, patchData: any) {
  try {
    const res = await fetch(`${API}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchData)
    });
    if (!res.ok) throw new Error("Kunde inte uppdatera användare");
    return await res.json();
  } catch {
    throw new Error("Kunde inte kontakta servern.");
  }
}
