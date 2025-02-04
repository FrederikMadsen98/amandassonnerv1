import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Paper, List, ListItem, ListItemText, Button, Divider } from "@mui/material";
import Sidebar from "../components/Sidebar";

const CalendarPage = ({ role }) => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "activities"));
        const activitiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sortér aktiviteter efter dato (ældre først)
        activitiesData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setActivities(activitiesData);
      } catch (error) {
        console.error("Fejl ved hentning af aktiviteter:", error);
      }
    };

    fetchActivities();
  }, []);

  // Funktion til at slette en aktivitet (kun for admin)
  const handleDelete = async (id) => {
    if (window.confirm("Er du sikker på, at du vil slette denne aktivitet?")) {
      try {
        await deleteDoc(doc(db, "activities", id));
        setActivities((prev) => prev.filter((activity) => activity.id !== id));
      } catch (error) {
        console.error("Fejl ved sletning af aktivitet:", error);
      }
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Container maxWidth="md" style={{ marginLeft: "260px", padding: "20px" }}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom>
            Kommende aktiviteter
          </Typography>
          <List>
            {activities.length === 0 ? (
              <Typography variant="body1">Ingen aktiviteter fundet.</Typography>
            ) : (
              activities.map((activity) => (
                <div key={activity.id}>
                  <ListItem
                    button
                    onClick={() => navigate(`/activity/${activity.id}`)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <ListItemText
                      primary={activity.name}
                      secondary={`${activity.date} kl. ${activity.time} - ${activity.location}`}
                    />
                    {role === "admin" && (
                      <div>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-activity/${activity.id}`);
                          }}
                          style={{ marginRight: "10px" }}
                        >
                          Rediger
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(activity.id);
                          }}
                        >
                          Slet
                        </Button>
                      </div>
                    )}
                  </ListItem>
                  <Divider />
                </div>
              ))
            )}
          </List>
        </Paper>
      </Container>
    </div>
  );
};

export default CalendarPage;