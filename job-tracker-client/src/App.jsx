import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="*"
        element={
          <PublicRoute>
            <NotFound />
          </PublicRoute>
        }
      />

      {/* Protected Routes with Layout */}
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-job" element={<AddJob />} />
        <Route path="/edit-job/:id" element={<AddJob />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stats" element={<Stats />} />
      </Route>
    </Routes>
  );
};

export default App;
