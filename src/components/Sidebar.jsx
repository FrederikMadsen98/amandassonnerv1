import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import { Dashboard, Event, CalendarToday, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import AmandasLogo from "../assets/AmandasLogo.png"; // Logo

const Sidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { text: "Dashboard", icon: <Dashboard />, route: "/dashboard" },
        { text: "Opret Aktivitet", icon: <Event />, route: "/create-activity" },
        { text: "Kommende Aktiviteter", icon: <CalendarToday />, route: "/calendar" },

    ];

    // 🔹 Sidebar styling (kun desktop)
    const drawerStyle = {
        backgroundColor: "#1E2A97", // Blå farve fra logo
        color: "#fff", 
        height: "100vh",
        width: "240px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 0",
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                "& .MuiDrawer-paper": drawerStyle, 
            }}
            open
        >
            {/* Logo i toppen */}
            <Box sx={{ width: "100%", textAlign: "center", padding: "10px 0" }}>
                <img src={AmandasLogo} alt="Logo" style={{ width: "80px", height: "auto" }} />
            </Box>

            {/* Menu */}
            <List>
                {menuItems.map((item) => (
                    <ListItem button key={item.text} onClick={() => navigate(item.route)}>
                        <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
                <ListItem button onClick={() => signOut(auth)}>
                    <ListItemIcon sx={{ color: "#fff" }}><Logout /></ListItemIcon>
                    <ListItemText primary="Log Ud" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;