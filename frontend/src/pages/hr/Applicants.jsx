import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext.jsx";
import { Briefcase, Users, Star, FileSearch } from "lucide-react";

export default function Applicants() {
  const { id } = useParams();
  const { user } = useAuth();
  const token = user?.token;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applicants for a job
  const load = async () => {
    if (!token) {
      setError("Not authorized. Please log in.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get(`/resumes/job/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(data || []);
      setError(null);
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id, token]);

  // Handle shortlist/unshortlist
  const shortlist = async (rid, value = true) => {
    if (!token) {
      setError("Not authorized. Please log in.");
      return;
    }

    try {
      await api.post(
        `/resumes/${value ? "shortlist" : "unshortlist"}/${rid}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await load(); // refresh after update
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to update shortlist");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg px-6 py-8">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">HR Panel</h2>
        <nav className="flex flex-col space-y-6 text-gray-700 font-medium">
          <Link
            to="/hr/jobs/new"
            className="flex items-center gap-2 hover:text-indigo-600"
          >
            <Briefcase className="w-5 h-5 text-indigo-500" />
            Post a Job
          </Link>
          <Link
            to="/jobs"
            className="flex items-center gap-2 hover:text-green-600"
          >
            <Users className="w-5 h-5 text-green-500" />
            Applicants
          </Link>
          <Link
            to="/hr/shortlist"
            className="flex items-center gap-2 hover:text-yellow-600"
          >
            <Star className="w-5 h-5 text-yellow-500" />
            Shortlist
          </Link>
          <Link
            to="/jobs"
            className="flex items-center gap-2 hover:text-red-600"
          >
            <FileSearch className="w-5 h-5 text-red-500" />
            Analyse Resumes
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-3">
        {loading && <div className="card">Loading applicants...</div>}
        {error && <div className="card text-red-600">{error}</div>}

        {!loading && !error && items.length === 0 && (
          <div className="card">No applicants yet.</div>
        )}

        {items.map((r) => (
          <div key={r.id} className="card bg-white p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800">
                  Resume #{r.id} • User {r.uploaded_by}
                </div>
                <div className="text-xs text-gray-500">
                  Match Score: {r.match_score ?? "N/A"}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                  onClick={() => shortlist(r.id, true)}
                >
                  Shortlist
                </button>
                <button
                  className="btn bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                  onClick={() => shortlist(r.id, false)}
                >
                  Unshortlist
                </button>
              </div>
            </div>

            {r.match_points && (
              <details className="mt-3">
                <summary className="cursor-pointer font-medium text-blue-600">
                  View Match Details
                </summary>
                <pre className="text-xs bg-gray-100 p-2 mt-2 rounded border border-gray-200 overflow-x-auto">
                  {JSON.stringify(r.match_points, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
