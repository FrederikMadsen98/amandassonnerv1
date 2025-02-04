import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const ActivityForm = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Kamp"); // Standardværdi sat til "Kamp"

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "activities"), {
        name,
        date,
        location,
        time,
        type,
      });
      alert("Aktivitet tilføjet!");
      setName("");
      setDate("");
      setLocation("");
      setTime("");
      setType("Kamp"); // Nulstil dropdown til standardværdien
    } catch (err) {
      console.error("Fejl ved tilføjelse af aktivitet:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Navn" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="text" placeholder="Lokation" value={location} onChange={(e) => setLocation(e.target.value)} required />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      
      {/* Dropdown menu til valg af aktivitetstype */}
      <select value={type} onChange={(e) => setType(e.target.value)} required>
        <option value="Kamp">Kamp</option>
        <option value="Træning">Træning</option>
        <option value="Socialt arrangement">Socialt arrangement</option>
      </select>
      
      <button type="submit">Tilføj Aktivitet</button>
    </form>
  );
};

export default ActivityForm;