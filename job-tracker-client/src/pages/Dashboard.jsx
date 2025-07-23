// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/axious";
import { toast } from "react-toastify";
import { Plus, Briefcase, Loader2, Pencil, Trash2, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ConfirmModal from "../components/ConfirmModal";

const Dashboard = () => {
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
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(filters).toString();
        const res = await axiosInstance.get(`/jobs?${query}`);
        setJobs(res.data);
      } catch (err) {
        toast.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

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
      await axiosInstance.delete(`/jobs/${jobToDelete}`);
      setJobs((prev) => prev.filter((job) => job._id !== jobToDelete));
      toast.success("Job deleted successfully");
    } catch (err) {
      toast.error("Failed to delete job", err);
    } finally {
      closeModal();
    }
  };

  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => key !== "sort" && value && value !== "all"
  );

  const clearFilter = (key) => {
    setFilters({ ...filters, [key]: "all" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
            <Briefcase className="text-blue-500" />
            <div>
              <p className="text-lg font-semibold">{jobs.length}</p>
              <p className="text-sm text-gray-500">Total Jobs</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
            <Plus className="text-green-500" />
            <div>
              <p className="text-lg font-semibold">
                {jobs.filter((j) => j.status === "Applied").length}
              </p>
              <p className="text-sm text-gray-500">Applied</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
            <Briefcase className="text-yellow-500" />
            <div>
              <p className="text-lg font-semibold">
                {jobs.filter((j) => j.status === "Interview").length}
              </p>
              <p className="text-sm text-gray-500">Interviews</p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="grid sm:grid-cols-4 gap-4 mt-6">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={filters.jobType}
            onChange={(e) =>
              setFilters({ ...filters, jobType: e.target.value })
            }
            className="border px-3 py-2 rounded-lg"
          >
            <option value="all">All Job Types</option>
            <option value="Full-time">Full-Time</option>
            <option value="Part-time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A-Z Position</option>
            <option value="z-a">Z-A Position</option>
          </select>

          <input
            type="text"
            placeholder="Search company or role"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeFilters.map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {key}: {value}
                <button
                  onClick={() => clearFilter(key)}
                  className="ml-2 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            <button
              className="ml-2 text-sm underline text-blue-600 hover:text-blue-800"
              onClick={() =>
                setFilters({
                  status: "all",
                  jobType: "all",
                  sort: "latest",
                  search: "",
                })
              }
            >
              Clear All
            </button>
          </div>
        )}

        {/* Add Job Button */}
        <div className="flex justify-end">
          <Link
            to="/add-job"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Add Job
          </Link>
        </div>

        {/* Job List */}
        <section className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="flex justify-center py-10 text-blue-500">
              <Loader2 className="animate-spin" size={28} />
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No jobs found.</p>
          ) : (
            jobs.map((job) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold text-gray-800">
                  {job.position} @ {job.company}
                </h3>
                <p className="text-sm text-gray-600">{job.location}</p>
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Type:</span> {job.jobType}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Status:</span> {job.status}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-600">Posted:</span>{" "}
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-job/${job._id}`)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(job._id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </section>
      </main>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this job?"
      />
    </div>
  );
};

export default Dashboard;
