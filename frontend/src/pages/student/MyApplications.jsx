import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MyApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/resumes/applications/me");
      setItems(data || []);
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="card">Loading…</div>;
  if (error) return <div className="card text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Applications</h1>

      {items.length === 0 && (
        <div className="card text-gray-600">No applications yet.</div>
      )}

      {items.map((app) => (
        <div
          key={app.id}
          className="card p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
        >
          {/* Job Title */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-lg">
                {app.job_title || `Job #${app.job_id}`}
              </h2>
              <p className="text-sm text-gray-500">
                Applied on {new Date(app.applied_at).toLocaleDateString()}
              </p>
            </div>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                app.shortlisted
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {app.shortlisted ? "Shortlisted" : "Pending / Not Shortlisted"}
            </span>
          </div>

          {/* Interview Info */}
          {app.shortlisted && (
            <div className="mt-3">
              {app.interview_at ? (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-medium text-blue-700">
                    Interview Scheduled
                  </h3>
                  <p className="text-sm text-gray-700">
                    Date:{" "}
                    <span className="font-medium">
                      {new Date(app.interview_at).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Mode:{" "}
                    <span className="font-medium">{app.interview_mode}</span>
                  </p>
                  {app.interview_venue && (
                    <p className="text-sm text-gray-700">
                      Venue/Link:{" "}
                      <span className="font-medium">{app.interview_venue}</span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Awaiting interview schedule
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
