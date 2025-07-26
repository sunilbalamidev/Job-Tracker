// src/pages/Stats.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/axious";
import { toast } from "react-toastify";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/jobs/stats");
        setStats(res.data);
      } catch (err) {
        toast.error("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cardData = [
    { label: "Applied", count: stats?.Applied || 0, color: "bg-blue-500" },
    {
      label: "Interview",
      count: stats?.Interview || 0,
      color: "bg-yellow-500",
    },
    { label: "Rejected", count: stats?.Rejected || 0, color: "bg-red-500" },
    { label: "Offer", count: stats?.Offer || 0, color: "bg-green-500" },
  ];

  const chartData = {
    labels: cardData.map((c) => c.label),
    datasets: [
      {
        label: "Jobs Count",
        data: cardData.map((c) => c.count),
        backgroundColor: ["#3b82f6", "#facc15", "#ef4444", "#22c55e"],
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Job Statistics
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={30} />
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cardData.map((card) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow p-4"
              >
                <p className="text-sm text-gray-500">{card.label}</p>
                <p
                  className={`text-2xl font-bold ${card.color} text-white rounded px-2 mt-1`}
                >
                  {card.count}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Status Overview
            </h2>
            <Bar data={chartData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Stats;
