import { useEffect, useState } from "react";
import axiosInstance from "../api/axious";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Plus, Briefcase, Loader2, Pencil, Trash2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ConfirmModal from "../components/ConfirmModal";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        toast.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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
                <p className="text-sm mt-1">
                  <span className="font-medium text-gray-700">Status:</span>{" "}
                  {job.status}
                </p>

                {/* Buttons */}
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

      {/* Delete Confirmation Modal */}
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
