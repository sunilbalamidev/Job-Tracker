import axios from "axios";

const RAW_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// normalize: remove trailing slashes and remove optional "/api"
const BASE = RAW_BASE.replace(/\/+$/, "").replace(/\/api$/, "");

const axiosInstance = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 25000,
  // withCredentials only matters if you use cookie/session auth.
  // Keep it true to avoid future CORS issues (safe for token auth too).
  withCredentials: true,
});

// attach JWT token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Warm up ping (helps free-tier cold start; still fine locally)
export async function warmUpServer() {
  try {
    await axios.get(`${BASE}/`, { timeout: 15000 });
    return true;
  } catch {
    return false;
  }
}

export default axiosInstance;
