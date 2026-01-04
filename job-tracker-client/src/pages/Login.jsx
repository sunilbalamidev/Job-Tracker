import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance, { warmUpServer } from "../api/axios"; // ✅ FIXED
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { demo } from "../services/jobService";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [warming, setWarming] = useState(false);
  const [warmDone, setWarmDone] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (demo.isEnabled()) demo.disable({ clear: false });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const runWarmup = async () => {
      setWarming(true);
      const ok = await warmUpServer();
      if (!cancelled) {
        setWarmDone(ok);
        setWarming(false);
      }
    };

    runWarmup();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { token, user } = res.data;

      login(user, token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const credential = credentialResponse?.credential;

      if (!credential) {
        toast.error("Google login failed: no credential received");
        return;
      }

      const res = await axiosInstance.post("/auth/google/token", {
        token: credential,
      });

      const { token, user } = res.data;
      login(user, token);

      toast.success("Logged in with Google!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Google login failed");
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
          Welcome back
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Login to access your saved jobs.
        </p>

        <div className="mb-4 rounded-lg bg-yellow-100 px-4 py-3 text-sm text-yellow-900">
          {warming ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              <span>Warming up server… first request may take a bit.</span>
            </div>
          ) : warmDone ? (
            <span>Server is ready ✅</span>
          ) : (
            <span>If login feels slow, the server may be waking up.</span>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="my-6 text-center">
          <p className="text-xs text-gray-500 mb-3">or continue with</p>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Google login failed")}
              width="100%"
            />
          </div>
        </div>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
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
