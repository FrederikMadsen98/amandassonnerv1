import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // **Importér Sidebar**
import { Card, CardContent, Typography } from "@mui/material";

const Dashboard = ({ role }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "activities"));
        const activitiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivities(activitiesData);
      } catch (error) {
        console.error("Fejl ved hentning af aktiviteter:", error);
      }
      setLoading(false);
    };

    fetchActivities();
  }, []);

  const getBorderColor = (type) => {
    switch (type) {
      case "Kamp": return "2px solid red";
      case "Træning": return "2px solid blue";
      case "Socialt arrangement": return "2px solid green";
      default: return "2px solid gray";
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar /> 
      <div style={{ flexGrow: 1, padding: "20px", marginLeft: "250px" }}> {/* Tilføjer margin, så sidebar ikke overlapper */}
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
          AMANDAS SØNNER
        </h1>

        {loading ? (
          <p>Indlæser aktiviteter...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            {activities.map((activity) => (
              <Card key={activity.id} style={{ border: getBorderColor(activity.type), cursor: "pointer" }} onClick={() => navigate(`/activity/${activity.id}`)}>
                <CardContent>
                  <Typography variant="h5">{activity.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {activity.date} - {activity.time} - {activity.location}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;