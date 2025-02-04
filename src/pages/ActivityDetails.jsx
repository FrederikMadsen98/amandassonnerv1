import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAttendance, attendActivity, declineActivity } from "../firestore";
import { Container, Paper, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { auth } from "../firebase";

const ActivityDetails = ({ role }) => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [attendance, setAttendance] = useState({ attending: [], notAttending: [], pending: [] });
  const currentUser = auth.currentUser ? { id: auth.currentUser.uid, name: auth.currentUser.displayName } : null;

  useEffect(() => {
    const fetchData = async () => {
      const attendanceData = await getAttendance(id);
      if (attendanceData) {
        setAttendance(attendanceData);
      }
    };
    fetchData();
  }, [id]);

  const handleAttend = async () => {
    if (currentUser) {
      await attendActivity(id, currentUser);
      setAttendance((prev) => ({
        attending: [...prev.attending, currentUser],
        notAttending: prev.notAttending.filter((u) => u.id !== currentUser.id),
        pending: prev.pending.filter((u) => u.id !== currentUser.id),
      }));
    }
  };

  const handleDecline = async () => {
    if (currentUser) {
      await declineActivity(id, currentUser);
      setAttendance((prev) => ({
        notAttending: [...prev.notAttending, currentUser],
        attending: prev.attending.filter((u) => u.id !== currentUser.id),
        pending: prev.pending.filter((u) => u.id !== currentUser.id),
      }));
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginLeft: "260px", padding: "20px" }}>
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h4">{activity?.name}</Typography>
        <Typography><strong>Dato:</strong> {activity?.date}</Typography>
        <Typography><strong>Tid:</strong> {activity?.time}</Typography>
        <Typography><strong>Lokation:</strong> {activity?.location}</Typography>
        <Typography><strong>Type:</strong> {activity?.type}</Typography>
      </Paper>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Liste over tilmeldte brugere */}
        <Paper elevation={2} style={{ padding: "20px", flex: 1 }}>
          <Typography variant="h6">Tilmeldt</Typography>
          <List>
            {attendance.attending.map((user) => (
              <ListItem key={user.id}>
                <ListItemText primary={user.name} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Liste over afmeldte brugere */}
        <Paper elevation={2} style={{ padding: "20px", flex: 1 }}>
          <Typography variant="h6">Afmeldt</Typography>
          <List>
            {attendance.notAttending.map((user) => (
              <ListItem key={user.id}>
                <ListItemText primary={user.name} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Liste over brugere der mangler at svare */}
        <Paper elevation={2} style={{ padding: "20px", flex: 1 }}>
          <Typography variant="h6">Mangler svar</Typography>
          <List>
            {attendance.pending.map((user) => (
              <ListItem key={user.id}>
                <ListItemText primary={user.name} />
                {/* Spillere kan kun ændre deres egen status */}
                {user.id === auth.currentUser?.uid && (
                  <>
                    <Button variant="contained" color="primary" onClick={handleAttend} style={{ marginLeft: "10px" }}>
                      Tilmeld
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDecline} style={{ marginLeft: "10px" }}>
                      Afmeld
                    </Button>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </Container>
  );
};

export default ActivityDetails;