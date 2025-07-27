// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axious";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// ✅ Google OAuth
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ Email/password login handler
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

  // ✅ Google OAuth login handler
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      if (!credential) {
        toast.error("Google login failed: No credential received");
        return;
      }

      const decoded = jwtDecode(credential);
      console.log("Google user:", decoded);

      const res = await axiosInstance.post("/auth/google/token", {
        token: credential,
      });

      const { token, user } = res.data;
      login(user, token);
      toast.success("Logged in with Google!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Welcome Back
        </h2>

        {/* Email/Password Login Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Google Login */}
        <div className="my-6 text-center">
          <p className="text-gray-500 mb-3">or</p>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google login failed")}
            width="100%"
          />
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
      </motion.div>
    </motion.div>
  );
}

export default Login;
