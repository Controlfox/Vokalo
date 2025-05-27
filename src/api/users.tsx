// src/api/users.ts

import { User } from "../Types";

const API = 'http://localhost:5287';

export async function loginUser(username: string, password: string) {
  try {
    const res = await fetch(`${API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Fel användarnamn eller lösenord');
    return await res.json();
  } catch (err) {
    throw new Error("Kunde inte kontakta servern.");
  }
}

export async function registerUser(userData: any) {
  try {
    const res = await fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Kunde inte skapa användare');
    return await res.json();
  } catch (err) {
    throw new Error("Kunde inte kontakta servern.");
  }
}

// ...lägg till fler funktioner för users!
