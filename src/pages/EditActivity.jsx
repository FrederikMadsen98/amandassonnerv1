import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Paper, Select, MenuItem } from "@mui/material";
import Sidebar from "../components/Sidebar";

const EditActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    type: "Kamp",
  });

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const docRef = doc(db, "activities", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setActivity(docSnap.data());
        }
      } catch (error) {
        console.error("Fejl ved hentning af aktivitet:", error);
      }
    };

    fetchActivity();
  }, [id]);

  const handleChange = (e) => {
    setActivity({ ...activity, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "activities", id), activity);
      alert("Aktiviteten er opdateret!");
      navigate("/calendar");
    } catch (error) {
      console.error("Fejl ved opdatering af aktivitet:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Container maxWidth="md" style={{ marginLeft: "260px", padding: "20px" }}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom>Rediger Aktivitet</Typography>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <TextField label="Navn" name="name" value={activity.name} onChange={handleChange} required fullWidth />
            <TextField type="date" name="date" value={activity.date} onChange={handleChange} required fullWidth />
            <TextField type="time" name="time" value={activity.time} onChange={handleChange} required fullWidth />
            <TextField label="Lokation" name="location" value={activity.location} onChange={handleChange} required fullWidth />
            <Select name="type" value={activity.type} onChange={handleChange} fullWidth>
              <MenuItem value="Kamp">Kamp</MenuItem>
              <MenuItem value="Træning">Træning</MenuItem>
              <MenuItem value="Socialt arrangement">Socialt arrangement</MenuItem>
            </Select>
            <Button type="submit" variant="contained" color="primary" fullWidth>Opdater Aktivitet</Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default EditActivity;