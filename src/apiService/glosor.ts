const API = "http://localhost:5287";

/**
 * Hämta glosor från servern, antingen alla eller per barn.
 * @param child Om anges, hämtas glosor för detta barn.
 */
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

/**
 * Lägg till en ny glosa via POST-anrop.
 * @param record Ny glosa att lägga till.
 */
export async function addGlosa(record: any) {
  try {
    const res = await fetch(`${API}/glosor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error("Kunde inte lägga till glosa");
    return await res.json();
  } catch {
    throw new Error("Kunde inte kontakta servern.");
  }
}

/**
 * Uppdatera en glosa via PUT.
 * Hanterar även svaret om servern returnerar 204 (No Content).
 * @param id Glosans id.
 * @param record Uppdaterad glosa.
 */
export async function updateGlosa(id: number, record: any) {
  try {
    const res = await fetch(`${API}/glosor/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error("Kunde inte uppdatera glosa");
    return;
  } catch {
    throw new Error("Kunde inte kontakta servern.");
  }
}

/**
 * Ta bort en glosa via DELETE.
 * @param id Id för glosan som ska tas bort.
 */
export async function deleteGlosa(id: number) {
  try {
    const res = await fetch(`${API}/glosor/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Kunde inte radera glosa");
    return;
  } catch {
    throw new Error("Kunde inte kontakta servern.");
  }
}
