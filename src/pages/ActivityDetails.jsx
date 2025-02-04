import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Button } from "@mui/material";
import Sidebar from "../components/Sidebar";

const ActivityDetails = ({ role }) => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const docRef = doc(db, "activities", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setActivity({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Fejl ved hentning af aktivitet:", error);
      }
    };

    fetchActivity();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Er du sikker på, at du vil slette denne aktivitet?")) {
      try {
        await deleteDoc(doc(db, "activities", id));
        navigate("/calendar");
      } catch (error) {
        console.error("Fejl ved sletning af aktivitet:", error);
      }
    }
  };

  if (!activity) return <p>Indlæser...</p>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Container maxWidth="md" style={{ marginLeft: "260px", padding: "20px" }}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom>{activity.name}</Typography>
          <Typography variant="body1"><strong>Dato:</strong> {activity.date}</Typography>
          <Typography variant="body1"><strong>Tid:</strong> {activity.time}</Typography>
          <Typography variant="body1"><strong>Lokation:</strong> {activity.location}</Typography>
          <Typography variant="body1"><strong>Type:</strong> {activity.type}</Typography>

          {role === "admin" && (
            <div style={{ marginTop: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/edit-activity/${activity.id}`)}
                style={{ marginRight: "10px" }}
              >
                Rediger
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDelete}
              >
                Slet
              </Button>
            </div>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default ActivityDetails;