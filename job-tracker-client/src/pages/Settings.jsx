import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axious";

function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };
  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Are you sure? This will permanently delete your account."
    );
    if (!confirm) return;

    try {
      await axiosInstance.delete("/users/delete");
      logout(); // clear auth
      toast.success("Your account has been deleted.");
      navigate("/register");
    } catch (err) {
      toast.error("Failed to delete account.");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-md">
        {/* Page Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Account Settings
        </h2>

        {/* 1. User Info Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">
            Account Info
          </h3>
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Member Since:</strong>{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        {/* 2. Change Password Stub */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">
            Change Password
          </h3>
          <p className="text-sm text-gray-500 mb-2">Feature coming soon.</p>
          <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition">
            Change Password
          </button>
        </div>

        {/* 3. Danger Zone - Delete Account Stub */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">
            Danger Zone
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            This will permanently delete your account.
          </p>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            onClick={handleDeleteAccount}
          >
            Delete My Account
          </button>
        </div>

        {/* 4. Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Settings;
