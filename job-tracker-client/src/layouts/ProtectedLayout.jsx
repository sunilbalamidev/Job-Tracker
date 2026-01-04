import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { demo } from "../services/jobService";

const linkClass = ({ isActive }) =>
  [
    "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition border",
    isActive
      ? "bg-white border-gray-200 text-gray-900"
      : "bg-transparent border-transparent text-gray-600 hover:bg-white hover:border-gray-200",
  ].join(" ");

export default function ProtectedLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    // demo logout just disables demo
    if (demo.isEnabled()) {
      demo.disable({ clear: false });
      navigate("/", { replace: true });
      return;
    }

    logout();
    navigate("/login", { replace: true });
  };

  const title = demo.isEnabled()
    ? "Demo mode"
    : user?.name
    ? `Welcome, ${user.name}`
    : "Welcome";

  const subtitle = demo.isEnabled()
    ? "Data is saved in your browser only."
    : "Your jobs are saved to the database.";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Job Tracker</div>
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            <div className="text-xs text-gray-500">{subtitle}</div>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-100"
          >
            <LogOut size={16} />
            {demo.isEnabled() ? "Exit demo" : "Logout"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="h-fit rounded-lg border border-gray-200 bg-white p-2">
            <nav className="flex flex-col gap-1">
              <NavLink to="/dashboard" className={linkClass}>
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>
              <NavLink to="/add-job" className={linkClass}>
                <Plus size={16} />
                Add job
              </NavLink>
              <NavLink to="/stats" className={linkClass}>
                <BarChart3 size={16} />
                Stats
              </NavLink>

              {!demo.isEnabled() && (
                <NavLink to="/settings" className={linkClass}>
                  <SettingsIcon size={16} />
                  Settings
                </NavLink>
              )}
            </nav>

            <div className="mt-3 border-t border-gray-100 pt-3 px-2">
              <div className="text-xs text-gray-500">
                {demo.isEnabled() ? "Mode" : "Signed in as"}
              </div>
              <div className="text-sm font-medium truncate">
                {demo.isEnabled() ? "demo@local" : user?.email}
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
