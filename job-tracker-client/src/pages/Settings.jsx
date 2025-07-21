import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axious";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Settings = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    // Replace with real API
    try {
      await axiosInstance.put("/users/update-profile", { name });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    }
    const updatedUser = { ...user, name };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.location.reload(); // simple force-refresh
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/users/update-password", {
        oldPassword: password,
        newPassword,
      });
      toast.success("Password updated!");
      setPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete account?")) return;
    try {
      await axiosInstance.delete("/users/delete");
      logout();
      toast.success("Account deleted");
    } catch (err) {
      toast.error("Failed to delete account", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 py-10"
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Settings</h1>

      {/* Profile Info */}
      <section className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Profile Info
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2 border bg-gray-100 rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </form>
      </section>

      {/* Change Password */}
      <section className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Current Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Change Password
          </button>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
        <p className="text-gray-600 mb-4">
          Permanently delete your account and all associated data.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </section>
    </motion.div>
  );
};

export default Settings;
