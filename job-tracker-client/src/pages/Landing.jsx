import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Gauge,
  Layers3,
} from "lucide-react";
import { demo } from "../services/jobService";

export default function Landing() {
  const navigate = useNavigate();

  const startDemo = () => {
    demo.enable({ seed: true });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white">
              <Layers3 size={16} />
            </span>
            <span>JobTracker</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <div className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600">
              <span className="inline-flex h-2 w-2 rounded-full bg-blue-600" />A
              simple system for tracking applications
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Keep job applications organized. Reduce the noise.
            </h1>

            <p className="mt-3 text-base text-gray-600 max-w-2xl">
              Add roles, track status changes, and review progress in one place.
              Clean UI, clear data, and quick actions.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={startDemo}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
              >
                <PlayCircle size={16} />
                Try demo
              </button>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Get started
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Gauge size={16} className="text-gray-700" />
                  Fast workflow
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Create, edit, filter, and update status quickly.
                </p>
              </div>

              <div className="rounded-md border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck size={16} className="text-gray-700" />
                  Real auth flow
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  JWT auth plus Google sign-in for production-like access.
                </p>
              </div>

              <div className="rounded-md border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Layers3 size={16} className="text-gray-700" />
                  Status insights
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  View counts by stage and track progress.
                </p>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-md border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="text-sm font-medium">Demo mode</div>
              <div className="text-xs text-gray-500">No signup required</div>
            </div>

            <div className="px-4 py-4 space-y-3">
              <p className="text-sm text-gray-600">
                Use the app without an account. Demo data is stored locally in
                your browser.
              </p>

              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Add / edit / delete jobs</li>
                <li>Filter and search</li>
                <li>View stats</li>
              </ul>

              <button
                onClick={startDemo}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                <PlayCircle size={16} />
                Start demo
              </button>

              <div className="text-xs text-gray-500">
                Create an account to save jobs to the database and access them
                across devices.
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-12 border-t border-gray-200 pt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} JobTracker.
        </footer>
      </main>
    </div>
  );
}
