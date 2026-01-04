import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Loader2,
  Pencil,
  Trash2,
  X,
  Plus,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import { demo, jobService } from "../services/jobService";

const statusBadge = (status) => {
  const base = "inline-flex items-center rounded-md border px-2 py-0.5 text-xs";
  if (status === "Applied")
    return `${base} border-blue-200 bg-blue-50 text-blue-700`;
  if (status === "Interview")
    return `${base} border-amber-200 bg-amber-50 text-amber-800`;
  if (status === "Rejected")
    return `${base} border-red-200 bg-red-50 text-red-700`;
  if (status === "Offer")
    return `${base} border-emerald-200 bg-emerald-50 text-emerald-700`;
  return `${base} border-gray-200 bg-gray-50 text-gray-700`;
};

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: "all",
    jobType: "all",
    sort: "latest",
    search: "",
    page: 1,
    limit: 50,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await jobService.list(filters);
        if (!cancelled) setJobs(res.jobs || []);
      } catch (err) {
        if (!cancelled)
          toast.error(
            err?.response?.data?.error || err.message || "Failed to fetch jobs"
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchJobs();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const summary = useMemo(() => {
    const total = jobs.length;
    const applied = jobs.filter((j) => j.status === "Applied").length;
    const interview = jobs.filter((j) => j.status === "Interview").length;
    const rejected = jobs.filter((j) => j.status === "Rejected").length;
    const offer = jobs.filter((j) => j.status === "Offer").length;
    return { total, applied, interview, rejected, offer };
  }, [jobs]);

  const activeFilters = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "sort" || key === "page" || key === "limit") return false;
      if (!value) return false;
      if (value === "all") return false;
      if (key === "search" && value.trim() === "") return false;
      return true;
    });
  }, [filters]);

  const clearFilter = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === "search" ? "" : "all",
      page: 1,
    }));
  };

  const clearAll = () => {
    setFilters({
      status: "all",
      jobType: "all",
      sort: "latest",
      search: "",
      page: 1,
      limit: 50,
    });
  };

  const openDeleteModal = (id) => {
    setJobToDelete(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setJobToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await jobService.remove(jobToDelete);
      setJobs((prev) => prev.filter((job) => job._id !== jobToDelete));
      toast.success("Job deleted");
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err.message || "Failed to delete job"
      );
    } finally {
      closeModal();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>

            {demo.isEnabled() && (
              <span className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-900">
                <Sparkles size={14} />
                Demo Mode
              </span>
            )}
          </div>

          {demo.isEnabled() ? (
            <p className="mt-1 text-sm text-yellow-800">
              You’re exploring with sample data. Jobs are saved on{" "}
              <span className="font-medium">this device only</span>.
            </p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              Track applications. Keep it simple. Ship.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <Link
              to="/add-job"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Add job
            </Link>
            <Link
              to="/stats"
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
            >
              <BarChart3 size={16} />
              Stats
            </Link>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          ["Total", summary.total],
          ["Applied", summary.applied],
          ["Interview", summary.interview],
          ["Rejected", summary.rejected],
          ["Offer", summary.offer],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-md border border-gray-200 bg-white p-3"
          >
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-lg font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="rounded-md border border-gray-200 bg-white p-3">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search position/company..."
            value={filters.search}
            onChange={(e) =>
              setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))
            }
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))
            }
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">Status: All</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>

          <select
            value={filters.jobType}
            onChange={(e) =>
              setFilters((p) => ({ ...p, jobType: e.target.value, page: 1 }))
            }
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">Type: All</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters((p) => ({ ...p, sort: e.target.value, page: 1 }))
            }
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="latest">Sort: Latest</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A–Z Position</option>
            <option value="z-a">Z–A Position</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="rounded-md border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="text-sm font-medium">Jobs</div>
          <div className="text-xs text-gray-500">
            {loading ? "Loading..." : `${jobs.length} result(s)`}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-8 text-gray-600">
            <Loader2 className="animate-spin" size={18} />
            <span className="text-sm">Fetching jobs…</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-sm font-medium">No jobs yet</div>
            <div className="mt-1 text-sm text-gray-500">
              {demo.isEnabled()
                ? "Add your first demo job to explore the tracker."
                : "Add your first application to start tracking."}
            </div>
            <div className="mt-4">
              <Link
                to="/add-job"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Add job
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {job.position}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{job.company}</td>
                    <td className="px-4 py-3 text-gray-700">{job.location}</td>
                    <td className="px-4 py-3 text-gray-700">{job.jobType}</td>
                    <td className="px-4 py-3">
                      <span className={statusBadge(job.status)}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/edit-job/${job._id}`)}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(job._id)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        message="Delete this job? This action can’t be undone."
      />
    </div>
  );
}
