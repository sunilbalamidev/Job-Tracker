import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { applyThemePreference } from "./utils/theme.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
applyThemePreference();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="732377292901-fll0utbfkmjkpk1un9odq205q5b17ndk.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthProvider>
          <App />
          <ToastContainer position="top-right" autoClose={1000} />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
