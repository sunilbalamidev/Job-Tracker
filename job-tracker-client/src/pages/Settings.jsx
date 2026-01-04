// src/pages/Settings.jsx
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { demo } from "../services/jobService";

export default function Settings() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const isDemo = demo.isEnabled();

  const [name, setName] = useState(user?.name || "");
  const email = useMemo(() => user?.email || "", [user]);

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (isDemo) {
      toast.info("Demo mode: profile changes are disabled.");
      return;
    }

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await axiosInstance.put("/users/update-profile", {
        name: name.trim(),
      });

      // Server might return only a message; keep client state consistent.
      const updated = res?.data?.user
        ? res.data.user
        : { ...user, name: name.trim() };
      updateUser(updated);

      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (isDemo) {
      toast.info("Demo mode: password changes are disabled.");
      return;
    }

    if (!password || !newPassword) {
      toast.error("Please fill both password fields");
      return;
    }

    setSavingPassword(true);
    try {
      await axiosInstance.put("/users/update-password", {
        oldPassword: password,
        newPassword,
      });

      toast.success("Password updated");
      setPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (isDemo) {
      toast.info("Demo mode: account deletion is disabled.");
      setModalOpen(false);
      return;
    }

    setDeleting(true);
    try {
      await axiosInstance.delete("/users/delete");
      toast.success("Account deleted");

      logout();
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete account");
    } finally {
      setDeleting(false);
      setModalOpen(false);
    }
  };

  const exitDemo = () => {
    demo.disable({ clear: false });
    toast.success("Exited demo mode");
    // If you want to force logout and go home:
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Settings</h2>
          <p className="text-sm text-gray-500">
            Manage profile, password, and account lifecycle.
          </p>

          {isDemo && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800">
              Demo mode is ON — account settings are disabled.
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Demo actions */}
      {isDemo && (
        <section className="rounded-md border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <div className="text-sm font-medium">Demo controls</div>
            <div className="text-xs text-gray-500">
              Demo data stays in your browser. Exit demo to use real accounts.
            </div>
          </div>

          <div className="p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700">
              Want to sign in and save to database?
            </div>
            <div className="flex gap-2">
              <button
                onClick={exitDemo}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
              >
                <LogOut size={16} />
                Exit demo
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Profile */}
      <section className="rounded-md border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="text-sm font-medium">Profile</div>
          <div className="text-xs text-gray-500">
            Basic account details used across the app.
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isDemo}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingProfile || isDemo}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span className="ml-2">Saving…</span>
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Password */}
      <section className="rounded-md border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="text-sm font-medium">Password</div>
          <div className="text-xs text-gray-500">
            Update your password. You’ll stay logged in.
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Current password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isDemo}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isDemo}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPassword || isDemo}
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span className="ml-2">Updating…</span>
                </>
              ) : (
                "Update password"
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="rounded-md border border-red-200 bg-white">
        <div className="border-b border-red-200 px-4 py-3">
          <div className="text-sm font-medium text-red-700">Danger zone</div>
          <div className="text-xs text-red-600">
            Permanent actions. No undo.
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-medium">Delete account</div>
            <div className="text-sm text-gray-600">
              This removes your profile and all jobs.
            </div>
            {isDemo && (
              <div className="mt-1 text-xs text-gray-500">
                Disabled in demo mode.
              </div>
            )}
          </div>

          <button
            onClick={() => setModalOpen(true)}
            disabled={isDemo}
            className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100 disabled:opacity-60"
          >
            Delete account
          </button>
        </div>
      </section>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteAccount}
        message={
          deleting
            ? "Deleting account…"
            : "Are you sure you want to permanently delete your account and all your jobs?"
        }
      />
    </div>
  );
}
