import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Select, MenuItem, Container, Typography, Paper } from "@mui/material";
import Sidebar from "../components/Sidebar";

const CreateActivity = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Kamp");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "activities"), { name, date, time, location, type });
      alert("Aktivitet oprettet!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Fejl ved oprettelse:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Container maxWidth="md" style={{ marginLeft: "260px", padding: "20px" }}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom>Opret ny aktivitet</Typography>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <TextField label="Navn" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
            <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} required fullWidth />
            <TextField type="time" value={time} onChange={(e) => setTime(e.target.value)} required fullWidth />
            <TextField label="Lokation" value={location} onChange={(e) => setLocation(e.target.value)} required fullWidth />
            <Select value={type} onChange={(e) => setType(e.target.value)} fullWidth>
              <MenuItem value="Kamp">Kamp</MenuItem>
              <MenuItem value="Træning">Træning</MenuItem>
              <MenuItem value="Socialt arrangement">Socialt arrangement</MenuItem>
            </Select>
            <Button type="submit" variant="contained" color="primary" fullWidth>Opret Aktivitet</Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default CreateActivity;