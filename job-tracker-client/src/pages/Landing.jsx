import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-blue-700">JobTracker</h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-gray-700 font-medium hover:text-blue-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4"
        >
          Simplify Your Job Hunt
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg text-gray-600 max-w-xl mb-8"
        >
          Keep track of all your job applications in one place. Stay organized
          and focused on landing your dream job.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            to="/register"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 text-lg transition"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </main>

      {/* Optional Footer */}
      <footer className="text-center text-gray-400 text-sm py-4">
        © {new Date().getFullYear()} JobTracker. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
