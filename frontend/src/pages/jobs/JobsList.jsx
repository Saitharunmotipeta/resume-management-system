import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="card animate-pulse">Loading jobs...</div>;
  if (error) return <div className="card text-red-600">{error}</div>;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {jobs.map((j) => (
        <div
          key={j.id}
          className="card hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{j.title}</h3>
            <Link
              to={`/jobs/${j.id}`}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View
            </Link>
          </div>
          <h3 className="text-lg font-semibold">Job ID:{j.id}</h3>

          <p className="text-sm text-gray-600 line-clamp-3 mt-1">
            {j.description}
          </p>

          <div className="text-xs text-gray-400 mt-2 flex justify-between">
            <span>Vacancies: {j.vacancies}</span>
            <span className="italic">Posted by {j.created_by}</span>
          </div>
        </div>
      ))}

      {jobs.length === 0 && (
        <div className="card text-center text-gray-500">
          🚀 No jobs posted yet. Check back later!
        </div>
      )}
    </div>
  );
}
