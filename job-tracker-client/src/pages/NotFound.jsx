// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center text-center bg-white  text-gray-800 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">
        Page not found. The link might be broken or the page has been removed.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </motion.div>
  );
};

export default NotFound;
