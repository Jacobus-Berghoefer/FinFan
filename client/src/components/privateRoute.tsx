// client/src/components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-white text-center mt-10">Checking session...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
