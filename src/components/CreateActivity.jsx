import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Select, MenuItem, Container, Typography, Paper } from "@mui/material";

const CreateActivity = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Kamp");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "activities"), {
        name,
        date,
        location,
        type,
      });
      alert("Aktivitet oprettet!");
      navigate("/dashboard"); // Send brugeren tilbage til dashboard
    } catch (error) {
      console.error("Fejl ved oprettelse:", error);
    }
  };

  // Dynamisk margin-left til at justere for sidebar
  const containerStyle = {
    marginLeft: window.innerWidth > 768 ? "260px" : "0px",
    padding: "20px",
    minHeight: "100vh",
    backgroundColor: "#F5F5F5", // Ensartet baggrund med dashboard
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Container style={containerStyle}>
      <Paper elevation={3} style={{ padding: "20px", width: "400px" }}>
        <Typography variant="h5" gutterBottom>
          Opret ny aktivitet
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <TextField
            label="Navn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Lokation"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            fullWidth
          />
          <Select value={type} onChange={(e) => setType(e.target.value)} fullWidth>
            <MenuItem value="Kamp">Kamp</MenuItem>
            <MenuItem value="Træning">Træning</MenuItem>
            <MenuItem value="Socialt arrangement">Socialt arrangement</MenuItem>
          </Select>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Opret aktivitet
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateActivity;