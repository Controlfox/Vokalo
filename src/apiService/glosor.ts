const API = 'http://localhost:5287';

//Hämta och felhantera alla glosor/per barn
export async function fetchGlosor(child?: string) {
  try {
    const url = child ? `${API}/glosor?child=${child}` : `${API}/glosor`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Kunde inte hämta glosor");
    return await res.json();
  } catch {
    throw new Error("Kunde inte kontakta servern.");
  }
}

//Hämta och felhantering för att lägga till glosa
export async function addGlosa(record: any) {
  try {
    const res = await fetch(`${API}/glosor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (!res.ok) throw new Error("Kunde inte lägga till glosa");
    return await res.json();
  } catch {
    throw new Error("Kunde inte kontakta servern.");
  }
}

//Hämtning och felhantering för att uppdatera glosa
export async function updateGlosa(id: number, record: any) {
  try {
    const res = await fetch(`${API}/glosor/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (!res.ok) throw new Error("Kunde inte uppdatera glosa");
    return;
  } catch {
    throw new Error("Kunde inte kontakta servern.");
  }
}

//Hämtning och felhantering för att radera glosa
export async function deleteGlosa(id: number) {
  try {
    const res = await fetch(`${API}/glosor/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Kunde inte radera glosa");
    return;
  } catch {
    throw new Error("Kunde inte kontakta servern.");
  }
}
