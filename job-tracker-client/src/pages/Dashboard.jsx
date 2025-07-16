function Dashboard() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6">JobTracker</h2>
        <nav className="space-y-4">
          <a href="/dashboard" className="block hover:text-blue-200">
            Dashboard
          </a>
          <a href="/add-job" className="block hover:text-blue-200">
            Add Job
          </a>
          <a href="/settings" className="block hover:text-blue-200">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock Job Card */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-800">
              Frontend Developer
            </h3>
            <p className="text-sm text-gray-500">Company: Google</p>
            <p className="text-sm text-gray-500">Location: Sydney</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
              Status: Interview
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-800">
              Backend Engineer
            </h3>
            <p className="text-sm text-gray-500">Company: Amazon</p>
            <p className="text-sm text-gray-500">Location: Melbourne</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
              Status: Applied
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
