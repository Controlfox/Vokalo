import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { User } from "../Types";

// Typ för context-värdet
type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

// Skapa context med rätt typ!
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider-komponent
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  //Ladda användaren från localstorage
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if(saved) setUser(JSON.parse(saved));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser måste användas inom en UserProvider");
  }
  return context;
};
