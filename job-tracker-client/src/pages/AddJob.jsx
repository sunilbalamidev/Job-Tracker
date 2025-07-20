import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axious";
import { Loader2 } from "lucide-react";

const initialForm = {
  position: "",
  company: "",
  location: "",
  jobType: "Full-time",
  status: "Applied",
};

const AddJob = () => {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch job if editing
  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/jobs/${id}`);
        setForm({
          position: res.data.position,
          company: res.data.company,
          location: res.data.location,
          jobType: res.data.jobType,
          status: res.data.status,
        });
      } catch (err) {
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (id) {
        await axiosInstance.put(`/jobs/${id}`, form);
        toast.success("Job updated");
      } else {
        await axiosInstance.post("/jobs", form);
        toast.success("Job added");
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-blue-500" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {id ? "Edit Job" : "Add New Job"}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <input
            type="text"
            name="position"
            value={form.position}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2 mt-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2 mt-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2 mt-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 mt-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 mt-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offer">Offer</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition mt-4"
        >
          {isSubmitting ? "Submitting..." : id ? "Update Job" : "Create Job"}
        </button>
      </form>
    </div>
  );
};

export default AddJob;
