import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, ArrowLeft } from "lucide-react";
import { demo, jobService } from "../services/jobService";

const initialForm = {
  position: "",
  company: "",
  location: "",
  jobType: "Full-time",
  status: "Applied",
};

export default function AddJob() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch job if editing
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await jobService.get(id);
        if (cancelled) return;

        setForm({
          position: data.position || "",
          company: data.company || "",
          location: data.location || "",
          jobType: data.jobType || "Full-time",
          status: data.status || "Applied",
        });
      } catch (err) {
        if (!cancelled)
          toast.error(
            err?.response?.data?.error ||
              err.message ||
              "Failed to load job details"
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchJob();
    return () => {
      cancelled = true;
    };
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
        await jobService.update(id, form);
        toast.success("Job updated");
      } else {
        await jobService.create(form);
        toast.success("Job added");
      }

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err.message || "Submission failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-600">
        <Loader2 className="animate-spin" size={18} />
        <span className="ml-2 text-sm">Loading job…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">
            {id ? "Edit job" : "Add job"}
          </h2>
          <p className="text-sm text-gray-500">
            {demo.isEnabled()
              ? "Demo mode: saved in this browser only."
              : "Keep your tracking structured and consistent."}
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              required
              placeholder="Frontend Developer"
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              placeholder="Acme Pty Ltd"
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Sydney"
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600">
                Type
              </label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span className="ml-2">Saving…</span>
              </>
            ) : id ? (
              "Update job"
            ) : (
              "Create job"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
