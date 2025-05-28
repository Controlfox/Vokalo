import React, { useState, useEffect } from "react";
import "./ParentDashboard.css";
import { fetchUserById, patchUser, registerUser } from "../../apiService/users";
import ReusableTable from "../ReusableTable";
import { User } from "../../Types";
import { useUser } from "../../Context/UserContext";

/**
 * Komponent för föräldravy: visar barn, hanterar att skapa barnkonto och koppla till förälder.
 */
const ParentDashboard: React.FC = () => {
  const { user, setUser } = useUser();
  const [parent, setParent] = useState<User | null>(user);
  const [childName, setChildName] = useState("");
  const [childPass, setChildPass] = useState("");
  const [message, setMessage] = useState("");

  // Hämta aktuell användare från API för att få uppdaterad info om barn etc.
  useEffect(() => {
    if (!user) return;
    fetchUserById(user.id)
      .then((u: User) => {
        setParent(u);
        setUser(u); // Uppdatera Context
      })
      .catch((err) => setMessage(err.message));
  }, [user, setUser]);

  /**
   * Hanterar att skapa och koppla barnkonto till föräldern
   */
  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parent || !childName || !childPass) return;

    try {
      //Skapa barnkonto
      const createdChild: User = await registerUser({
        username: childName,
        password: childPass,
        role: "child",
        parent: parent.username,
      });

      // Uppdatera förälderns children-lista
      const updatedChildren = [
        ...(parent.children || []),
        createdChild.username,
      ];
      const updatedParent: User = await patchUser(parent.id, {
        children: updatedChildren,
      });

      // Spara både lokalt och i context
      setParent(updatedParent);
      localStorage.setItem("currentUser", JSON.stringify(updatedParent));

      setMessage(`Barnkonto ${createdChild.username} skapat och kopplat!`);
      setChildName("");
      setChildPass("");
    } catch (err: any) {
      setMessage(err.message || "Något gick fel");
    }
  };

  if (!parent) return <p>Laddar …</p>;

  return (
    <div className="parent-dashboard">
      <h2>Föräldravy</h2>

      <section className="section">
        <h3>Skapa barnkonto</h3>
        <form onSubmit={handleAddChild} className="form">
          <input
            type="text"
            placeholder="Barnens användarnamn"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={childPass}
            onChange={(e) => setChildPass(e.target.value)}
            required
          />
          <button type="submit">Skapa barn</button>
        </form>
      </section>

      {message && <p className="message">{message}</p>}

      <section className="section">
        {parent.children && parent.children.length > 0 ? (
          <ReusableTable
            columns={["Barn"]}
            data={parent.children.map((name) => ({ Barn: name }))}
          />
        ) : (
          <p>Inga barn kopplade ännu</p>
        )}
      </section>
    </div>
  );
};

export default ParentDashboard;
