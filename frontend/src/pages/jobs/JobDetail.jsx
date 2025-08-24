import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext.jsx";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const load = async () => {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      setJob(data);
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to load job");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const apply = async () => {
    setStatus(null);
    setError(null);
    try {
      await api.post(`/jobs/${id}/apply`);
      setStatus("✅ Applied successfully!");
    } catch (e) {
      setError(e?.response?.data?.detail || "❌ Apply failed");
    }
  };

  if (error) return <div className="card text-red-600">{error}</div>;
  if (!job) return <div className="card">Loading...</div>;

  return (
    <div className="card max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-semibold mb-2">{job.title}</h1>
        <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
      </div>

      <div className="text-sm text-gray-500">
        Vacancies:{" "}
        <span className="font-medium text-gray-800">{job.vacancies}</span>
      </div>

      {user?.role === "student" && (
        <div className="flex flex-wrap gap-3">
          <button
            className="btn bg-blue-600 hover:bg-blue-700 text-white"
            onClick={apply}
          >
            Apply
          </button>
          <Link
            className="btn bg-green-600 hover:bg-green-700 text-white"
            to="/resume/upload"
          >
            Upload Resume
          </Link>
        </div>
      )}

      {user?.role === "hr" && (
        <div className="flex gap-3">
          <Link
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white"
            to={`/hr/jobs/${id}/resumes`}
          >
            View Resumes & Analyse
          </Link>
        </div>
      )}

      {status && <div className="text-green-700 font-medium">{status}</div>}
    </div>
  );
}
