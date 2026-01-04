import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { demo } from "../services/jobService";

export default function PublicRoute({ children }) {
  const { user } = useAuth();

  // If demo enabled, treat as "inside app"
  if (demo.isEnabled()) return <Navigate to="/dashboard" replace />;

  // If user is already logged in, redirect
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}
