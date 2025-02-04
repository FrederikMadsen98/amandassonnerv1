import { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Toolbar, AppBar } from "@mui/material";
import { Menu, Dashboard, Event, CalendarToday, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/AmandasLogo.png"; // 🏆 Importér logoet

const Sidebar = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: "Dashboard", icon: <Dashboard />, route: "/dashboard" },
        { text: "Opret Aktivitet", icon: <Event />, route: "/create-activity" },
        { text: "Kalender", icon: <CalendarToday />, route: "/calendar" },
    ];

    return (
        <>
            {/* AppBar for mobil menu */}
            <AppBar position="fixed" sx={{ display: { xs: "block", md: "none" } }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
                        <Menu />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Sidebar (Drawer) */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    "& .MuiDrawer-paper": { 
                        width: 240, 
                        boxSizing: "border-box", 
                        backgroundColor: "#0033A0", // Blå farve 
                        color: "white", 
                        padding: 2
                    }
                }}
                open
            >
                {/* 🏆 Logoet i toppen af sidebar */}
                <div style={{ textAlign: "center", padding: "16px" }}>
                    <img src={logo} alt="Amandas Sønner Logo" style={{ width: "80%", borderRadius: "50%" }} />
                </div>

                <List>
                    {menuItems.map((item) => (
                        <ListItem button key={item.text} onClick={() => navigate(item.route)}>
                            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                    <ListItem button onClick={() => signOut(auth)}>
                        <ListItemIcon sx={{ color: "white" }}><Logout /></ListItemIcon>
                        <ListItemText primary="Log Ud" />
                    </ListItem>
                </List>
            </Drawer>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": { width: 240, backgroundColor: "#FDFDFD", color: "white" }
                }}
            >
                {/* 🏆 Logo i mobilversion også */}
                <div style={{ textAlign: "center", padding: "16px" }}>
                    <img src={logo} alt="Amandas Sønner Logo" style={{ width: "80%", borderRadius: "50%" }} />
                </div>

                <List>
                    {menuItems.map((item) => (
                        <ListItem button key={item.text} onClick={() => navigate(item.route)}>
                            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                    <ListItem button onClick={() => signOut(auth)}>
                        <ListItemIcon sx={{ color: "white" }}><Logout /></ListItemIcon>
                        <ListItemText primary="Log Ud" />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default Sidebar;