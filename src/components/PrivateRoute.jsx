import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
