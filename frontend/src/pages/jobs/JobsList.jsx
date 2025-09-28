import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Search } from "lucide-react";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/jobs");
        setJobs(data);
      } catch (e) {
        setError(e?.response?.data?.detail || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-indigo-600">💼 Job Portal</h2>
        <div className="flex items-center gap-3">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Explore Opportunities
        </h1>

        {loading && (
          <div className="bg-white p-4 rounded-lg shadow animate-pulse text-gray-500">
            Loading jobs...
          </div>
        )}

        {error && (
          <div className="bg-white p-4 rounded-lg shadow text-red-600 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((j) => (
              <div
                key={j.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {j.title}
                    </h3>
                    <Link
                      to={`/jobs/${j.id}`}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </Link>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {j.description}
                  </p>
                </div>

                <div className="text-xs text-gray-400 flex justify-between mt-3">
                  <span>Vacancies: {j.vacancies}</span>
                  <span className="italic">Posted by {j.created_by}</span>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="bg-white text-center text-gray-500 p-6 rounded-xl shadow col-span-full">
                🚀 No matching jobs found.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
