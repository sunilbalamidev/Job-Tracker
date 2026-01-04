import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance, { warmUpServer } from "../api/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { demo } from "../services/jobService";
import { Loader2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warming, setWarming] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (demo.isEnabled()) demo.disable({ clear: false });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setWarming(true);
      await warmUpServer();
      if (!cancelled) setWarming(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });

      const { token, user } = res.data;
      login(user, token);

      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 text-center">
          Create your account
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Save jobs to the database and access across devices.
        </p>

        <div className="mb-4 rounded-lg bg-yellow-100 px-4 py-3 text-sm text-yellow-900">
          {warming ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              <span>Warming up server… first request may take a bit.</span>
            </div>
          ) : (
            <span>If signup feels slow, the server may be waking up.</span>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500"
              placeholder="Sunil Balami"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Create account
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
