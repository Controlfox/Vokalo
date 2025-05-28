import React, { useEffect, useState } from "react";
import { User } from "../../Types";
import "./ManageGlosor.css";
import ChildSelector from "./ChildSelector";
import GlosaForm from "./GlosaForm";
import GlosaList from "./GlosaList";
import { fetchChildren } from "../../apiService/users";
import {
  addGlosa,
  deleteGlosa,
  fetchGlosor,
  updateGlosa,
} from "../../apiService/glosor";
import { useUser } from "../../Context/UserContext";

interface GlosaRecord {
  id: number;
  swedish: string;
  english: string;
  child: string;
}

/**
 * Komponent för att hantera veckans glosor för förälder
 */
const ManageGlosor: React.FC = () => {
  //Hämta inloggad användare från Context
  const { user } = useUser();

  // State för barn, valda barn, glosor och nya glosor
  const [children, setChildren] = useState<User[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [glosor, setGlosor] = useState<GlosaRecord[]>([]);
  const [newSwedish, setNewSwedish] = useState("");
  const [newEnglish, setNewEnglish] = useState("");

  // Hämta barn när förälder laddas in
  useEffect(() => {
    if (!user?.username) return;
    fetchChildren(user.username)
      .then((kids) => {
        setChildren(kids);
        if (kids.length) setSelectedChild(kids[0].username);
      })
      .catch((err) => alert(err.message));
  }, [user?.username]);

  //Hämta glosor när valt barn ändras
  useEffect(() => {
    if (!selectedChild) return;
    fetchGlosor(selectedChild)
      .then((data) => setGlosor(data))
      .catch((err) => alert(err.message));
  }, [selectedChild]);

  /**
   * Hanterar att lägga till ny glosa
   */
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await addGlosa({
        swedish: newSwedish,
        english: newEnglish,
        child: selectedChild,
      });
      setGlosor([...glosor, created]);
      setNewSwedish("");
      setNewEnglish("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  /**
   * Hanterar att uppdatera en glosa
   * @param id Id för glosan
   * @param field Vilket fält som uppdateras
   * @param value Nytt värde
   */
  const handleUpdate = async (
    id: number,
    field: "swedish" | "english",
    value: string
  ) => {
    const updatedList = glosor.map((g) =>
      g.id === id ? { ...g, [field]: value } : g
    );
    setGlosor(updatedList);
    const updatedRecord = updatedList.find((g) => g.id === id)!;
    try {
      await updateGlosa(id, updatedRecord);
    } catch (err: any) {
      alert(err.message);
    }
  };

  /**
   * Hanterar att radera glosa
   * @param id Id för glosan
   */
  const handleDelete = async (id: number) => {
    try {
      await deleteGlosa(id);
      setGlosor(glosor.filter((g) => g.id != id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="manage-container">
      <h2>Hantera veckans glosor</h2>
      <ChildSelector
        childrenList={children}
        selectedChild={selectedChild}
        onChange={(e) => setSelectedChild(e.target.value)}
      />
      <GlosaForm
        swedish={newSwedish}
        english={newEnglish}
        onSwedishChange={(e) => setNewSwedish(e.target.value)}
        onEnglishChange={(e) => setNewEnglish(e.target.value)}
        onSubmit={handleAdd}
      />
      <GlosaList
        glosor={glosor}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageGlosor;
