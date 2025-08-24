import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext.jsx";

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

  if (loading) return <div className="card">Loading applicants...</div>;
  if (error) return <div className="card text-red-600">{error}</div>;

  return (
    <div className="space-y-3">
      {items.length === 0 && <div className="card">No applicants yet.</div>}

      {items.map((r) => (
        <div key={r.id} className="card">
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
                className="btn bg-green-600 hover:bg-green-700 text-white text-sm"
                onClick={() => shortlist(r.id, true)}
              >
                Shortlist
              </button>
              <button
                className="btn bg-red-600 hover:bg-red-700 text-white text-sm"
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
    </div>
  );
}
