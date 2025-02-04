import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PrivateRoute from "./components/PrivateRoute";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import ActivityDetails from "./pages/ActivityDetails";
import CreateActivity from "./components/CreateActivity";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Indlæser...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthForm />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthForm />} />
        <Route element={<PrivateRoute role={role} />}>
          <Route path="/dashboard" element={<Dashboard role={role} />} />
          <Route path="/activity/:id" element={<ActivityDetails />} />
          {role === "admin" && <Route path="/create-activity" element={<CreateActivity />} />}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
