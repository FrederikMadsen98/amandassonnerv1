import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ role }) => {
  if (!role) return <p>Indlæser...</p>; // Vent til rollen er hentet

  return role === "admin" || role === "spiller" ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;