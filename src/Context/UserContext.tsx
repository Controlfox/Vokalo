import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "../Types";

// Typ för värdet i contexten: användare + funktion för att ändra den
type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

// Skapar själva contexten, default undefined
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Provider som kapslar in hela appen och lagrar användaren i state
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Ladda användaren från localStorage om den finns (vid sidladdning)
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook för att använda contexten på ett enkelt sätt i andra komponenter
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser måste användas inom en UserProvider");
  }
  return context;
};
