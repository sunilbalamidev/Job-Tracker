import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axios";
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
import { Loader2, ArrowLeft, BarChart3, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { demo, jobService } from "../services/jobService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const emptyStats = { Applied: 0, Interview: 0, Rejected: 0, Offer: 0 };

const pill = (label) => {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium";
  if (label === "Applied")
    return `${base} border-blue-200 bg-blue-50 text-blue-700`;
  if (label === "Interview")
    return `${base} border-amber-200 bg-amber-50 text-amber-800`;
  if (label === "Rejected")
    return `${base} border-red-200 bg-red-50 text-red-700`;
  if (label === "Offer")
    return `${base} border-emerald-200 bg-emerald-50 text-emerald-700`;
  return `${base} border-gray-200 bg-gray-50 text-gray-700`;
};

export default function Stats() {
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);
      try {
        if (demo.isEnabled()) {
          // compute from local demo jobs
          const data = await jobService.list({
            status: "all",
            jobType: "all",
            sort: "latest",
            search: "",
            page: 1,
            limit: 500,
          });

          const computed = { ...emptyStats };
          (data.jobs || []).forEach((job) => {
            if (computed[job.status] !== undefined) computed[job.status] += 1;
          });

          if (!cancelled) setStats(computed);
        } else {
          // backend endpoint
          const res = await axiosInstance.get("/jobs/stats");
          if (!cancelled) setStats({ ...emptyStats, ...res.data });
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err?.response?.data?.error || err.message || "Failed to load stats"
          );
          setStats(emptyStats);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = useMemo(
    () => Object.values(stats).reduce((a, b) => a + b, 0),
    [stats]
  );

  const rows = useMemo(
    () => [
      { label: "Applied", value: stats.Applied },
      { label: "Interview", value: stats.Interview },
      { label: "Rejected", value: stats.Rejected },
      { label: "Offer", value: stats.Offer },
    ],
    [stats]
  );

  const chartData = useMemo(
    () => ({
      labels: rows.map((r) => r.label),
      datasets: [
        {
          label: "Jobs",
          data: rows.map((r) => r.value),
          backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444", "#22c55e"],
          borderRadius: 10,
          barThickness: 44,
        },
      ],
    }),
    [rows]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    }),
    []
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2">
            <BarChart3 size={16} />
            Stats
          </h2>
          <p className="text-sm text-gray-500">
            {demo.isEnabled()
              ? "Demo mode: stats computed locally."
              : "A quick overview of your pipeline."}
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white p-8 text-gray-600">
          <Loader2 className="animate-spin" size={18} />
          <span className="text-sm">Loading stats…</span>
        </div>
      ) : (
        <>
          {/* Top summary card */}
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-gray-500">Total applications</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight">
                  {total}
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600">
                <Sparkles size={14} />
                Status overview
              </div>
            </div>

            {/* Breakdown pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {rows.map((r) => (
                <span key={r.label} className={pill(r.label)}>
                  {r.label}:{" "}
                  <span className="ml-1 font-semibold">{r.value}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Grid: chart + table */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_0.6fr]">
            {/* Chart */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Pipeline chart
                  </div>
                  <div className="text-xs text-gray-500">
                    Jobs grouped by current status
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Compact list */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="text-sm font-medium text-gray-900">Breakdown</div>
              <div className="text-xs text-gray-500">
                Share-friendly snapshot
              </div>

              <div className="mt-4 space-y-3">
                {rows.map((r) => {
                  const pct = total ? Math.round((r.value / total) * 100) : 0;
                  return (
                    <div key={r.label} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{r.label}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {r.value}{" "}
                          <span className="text-xs text-gray-500">
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-gray-900/15"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
