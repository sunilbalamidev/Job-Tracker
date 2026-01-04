import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { demo } from "../services/jobService";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // ✅ Allow demo mode without auth
  if (demo.isEnabled()) return children;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
