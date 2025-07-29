import axios from "axios";

// ✅ Get API base URL from Vite environment variable
const API = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API}/api`,
});

// ✅ Automatically attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
