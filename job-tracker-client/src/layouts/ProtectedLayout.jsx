// src/layouts/ProtectedLayout.jsx
import { Outlet } from "react-router-dom";
import { LogOut, Layers3, Cog } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const ProtectedLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <header className="flex items-center justify-between p-4 shadow bg-white sticky top-0 z-20">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xl font-bold text-blue-600"
        >
          <Layers3 />
          JobTracker
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 hidden sm:block">👋 {user?.name}</span>
          <Link
            to="/settings"
            className="flex items-center gap-1 text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md transition"
          >
            <Cog size={16} />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Protected Pages Render Here */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
