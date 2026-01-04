import axiosInstance from "../api/axios";

const DEMO_FLAG = "demo";
const DEMO_KEY = "demo_jobs";

const safeJson = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const nowIso = () => new Date().toISOString();

const makeId = () =>
  (globalThis.crypto?.randomUUID && globalThis.crypto.randomUUID()) ||
  `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;

const seedDemoJobs = () => {
  const t = nowIso();
  return [
    {
      _id: makeId(),
      position: "Frontend Developer",
      company: "Acme Pty Ltd",
      location: "Sydney",
      status: "Applied",
      jobType: "Full-time",
      createdBy: "demo",
      createdAt: t,
      updatedAt: t,
    },
    {
      _id: makeId(),
      position: "Integration Engineer",
      company: "Nimbus Systems",
      location: "Remote",
      status: "Interview",
      jobType: "Contract",
      createdBy: "demo",
      createdAt: t,
      updatedAt: t,
    },
  ];
};

const readDemoJobs = () => {
  const raw = localStorage.getItem(DEMO_KEY);
  const jobs = safeJson(raw, []);
  return Array.isArray(jobs) ? jobs : [];
};

const writeDemoJobs = (jobs) => {
  localStorage.setItem(DEMO_KEY, JSON.stringify(jobs));
};

const matchesSearch = (job, search) => {
  if (!search?.trim()) return true;
  const s = search.trim().toLowerCase();
  return (
    (job.position || "").toLowerCase().includes(s) ||
    (job.company || "").toLowerCase().includes(s)
  );
};

const sortJobs = (jobs, sort = "latest") => {
  const list = [...jobs];

  if (sort === "latest")
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sort === "oldest")
    return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (sort === "a-z")
    return list.sort((a, b) =>
      (a.position || "").localeCompare(b.position || "")
    );
  if (sort === "z-a")
    return list.sort((a, b) =>
      (b.position || "").localeCompare(a.position || "")
    );

  return list;
};

const normalizeListResponse = (jobs, page = 1, limit = 50) => {
  const totalJobs = jobs.length;
  const safeLimit = Math.max(1, Number(limit));
  const safePage = Math.max(1, Number(page));
  const numOfPages = Math.ceil(totalJobs / safeLimit) || 0;

  const start = (safePage - 1) * safeLimit;
  const paged = jobs.slice(start, start + safeLimit);

  return {
    jobs: paged,
    totalJobs,
    numOfPages,
    currentPage: safePage,
  };
};

export const demo = {
  isEnabled() {
    return localStorage.getItem(DEMO_FLAG) === "true";
  },

  enable({ seed = true } = {}) {
    localStorage.setItem(DEMO_FLAG, "true");
    const existing = readDemoJobs();
    if (seed && existing.length === 0) writeDemoJobs(seedDemoJobs());
    else if (!localStorage.getItem(DEMO_KEY)) writeDemoJobs(existing);
  },

  disable({ clear = false } = {}) {
    localStorage.removeItem(DEMO_FLAG);
    if (clear) localStorage.removeItem(DEMO_KEY);
  },

  reset({ seed = true } = {}) {
    if (seed) writeDemoJobs(seedDemoJobs());
    else writeDemoJobs([]);
  },
};

export const jobService = {
  async list(params = {}) {
    // REAL
    if (!demo.isEnabled()) {
      const query = new URLSearchParams(params).toString();
      const res = await axiosInstance.get(`/jobs?${query}`);
      return res.data;
    }

    // DEMO
    let jobs = readDemoJobs();

    const {
      status = "all",
      jobType = "all",
      search = "",
      sort = "latest",
      page = 1,
      limit = 50,
    } = params;

    if (status !== "all") jobs = jobs.filter((j) => j.status === status);
    if (jobType !== "all") jobs = jobs.filter((j) => j.jobType === jobType);

    jobs = jobs.filter((j) => matchesSearch(j, search));
    jobs = sortJobs(jobs, sort);

    return normalizeListResponse(jobs, page, limit);
  },

  async get(id) {
    if (!demo.isEnabled()) {
      const res = await axiosInstance.get(`/jobs/${id}`);
      return res.data;
    }

    const job = readDemoJobs().find((j) => j._id === id);
    if (!job) throw new Error("Job not found");
    return job;
  },

  async create(payload) {
    if (!demo.isEnabled()) {
      const res = await axiosInstance.post("/jobs", payload);
      return res.data;
    }

    const jobs = readDemoJobs();
    const now = nowIso();

    const job = {
      ...payload,
      _id: makeId(),
      createdBy: "demo",
      createdAt: now,
      updatedAt: now,
    };

    jobs.unshift(job);
    writeDemoJobs(jobs);
    return job;
  },

  async update(id, payload) {
    if (!demo.isEnabled()) {
      const res = await axiosInstance.put(`/jobs/${id}`, payload);
      return res.data;
    }

    const jobs = readDemoJobs();
    const idx = jobs.findIndex((j) => j._id === id);
    if (idx === -1) throw new Error("Job not found");

    jobs[idx] = { ...jobs[idx], ...payload, updatedAt: nowIso() };
    writeDemoJobs(jobs);
    return jobs[idx];
  },

  async remove(id) {
    if (!demo.isEnabled()) {
      const res = await axiosInstance.delete(`/jobs/${id}`);
      return res.data;
    }

    const jobs = readDemoJobs().filter((j) => j._id !== id);
    writeDemoJobs(jobs);
    return { message: "Job deleted successfully" };
  },
};
