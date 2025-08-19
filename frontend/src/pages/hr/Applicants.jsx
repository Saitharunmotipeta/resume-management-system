import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Applicants() {
  const { id } = useParams();
  const { user } = useAuth(); // ✅ always get latest user/token
  const token = user?.token;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load applicants for a job
  const load = async () => {
    if (!token) {
      setError("Not authorized. Please log in.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // const payload = JSON.parse(atob(token.split('.')[1]));
      // console.log("Role in token:", payload.role);

      const { data } = await api.get(`/resumes/job/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(data);
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // ✅ reload whenever job id or user changes
  }, [id, token]);

  // Shortlist/unshortlist a resume
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
      await load(); // refresh list after update
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to update shortlist');
    }
  };

  if (loading) return <div className="card">Loading...</div>;
  if (error) return <div className="card text-red-600">{error}</div>;

  return (
    <div className="space-y-3">
      {items.map((r) => (
        <div key={r.id} className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">
                Resume #{r.id} • User {r.uploaded_by}
              </div>
              <div className="text-xs text-gray-500">
                Match: {r.match_score ?? 'N/A'}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="btn bg-green-600 hover:bg-green-700"
                onClick={() => shortlist(r.id, true)}
              >
                Shortlist
              </button>
              <button
                className="btn bg-gray-600 hover:bg-gray-700"
                onClick={() => shortlist(r.id, false)}
              >
                Unshortlist
              </button>
            </div>
          </div>

          {r.match_points && (
            <details className="mt-2">
              <summary className="cursor-pointer">Details</summary>
              <pre className="text-xs bg-gray-100 p-2 rounded">
                {JSON.stringify(r.match_points, null, 2)}
              </pre>
            </details>
          )}
        </div>
      ))}

      {items.length === 0 && <div className="card">No applicants yet.</div>}
    </div>
  );
}
