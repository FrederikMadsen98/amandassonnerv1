import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ role }) => {
  return role ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
