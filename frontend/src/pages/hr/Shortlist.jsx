import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Shortlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [filters, setFilters] = useState({ job: "" });
  const [form, setForm] = useState({});

  const updateForm = (id, field, value) => {
    setForm((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }));
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/resumes/shortlisted");
      setItems(data || []);
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to load shortlisted candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const schedule = async (resumeId) => {
    const f = form[resumeId] || {};
    if (!f.datetime || !f.mode) {
      alert("Please pick date/time and mode");
      return;
    }
    setSavingId(resumeId);
    try {
      await api.post(`/resumes/${resumeId}/schedule`, {
        datetime: f.datetime,
        mode: f.mode,
        venue: f.venue || "",
      });
      await load();
    } catch (e) {
      alert(e?.response?.data?.detail || "Scheduling failed");
    } finally {
      setSavingId(null);
    }
  };

  const filtered = items.filter((r) => {
    if (!filters.job) return true;
    const needle = filters.job.toLowerCase();
    return (
      String(r.job_id || "").includes(needle) ||
      (r.job_name || "").toLowerCase().includes(needle)
    );
  });

  if (loading) return <div className="card p-6 text-gray-600">Loading...</div>;
  if (error) return <div className="card p-6 text-red-600">{error}</div>;

  return (
    <div className="space-y-5 p-6">
      {/* Filter/Search bar */}
      <div className="card flex items-center gap-3 p-4 shadow-sm">
        <input
          className="input flex-1"
          placeholder="Filter by job id or job name…"
          value={filters.job}
          onChange={(e) => setFilters({ ...filters, job: e.target.value })}
        />
        <button className="btn bg-blue-600 hover:bg-blue-700 text-white px-5" onClick={load}>
          Refresh
        </button>
      </div>

      {filtered.length === 0 && (
        <div className="card p-6 text-gray-500 text-center">
          No shortlisted candidates yet.
        </div>
      )}

      {filtered.map((r) => (
        <div
          key={r.resume_id}
          className="card p-5 space-y-3 border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Candidate Info */}
            <div>
              <div className="text-lg font-semibold">
                Resume #{r.resume_id} • {r.job_name || `Job ${r.job_id}`}
              </div>
              <div className="text-sm text-gray-600">
                {r.student_email}
                {r.student_name && <> · {r.student_name}</>}
                {r.match_score != null && <> · Match: {r.match_score}</>}
              </div>
              <div className="mt-1 text-sm">
                Status:{" "}
                <span
                  className={`${
                    r.scheduled_at ? "text-blue-600" : "text-green-600"
                  } font-medium`}
                >
                  {r.scheduled_at ? "Interview scheduled" : "Shortlisted"}
                </span>
                {r.scheduled_at && (
                  <div className="mt-1 inline-block px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs">
                    {new Date(r.scheduled_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    {r.mode ? ` • ${r.mode}` : ""} {r.venue ? ` • ${r.venue}` : ""}
                  </div>
                )}
              </div>
              {r.feedback && (
                <div className="mt-1 text-xs text-gray-500">
                  Feedback: {r.feedback}
                </div>
              )}
            </div>

            {/* Schedule Form */}
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              {!r.scheduled_at ? (
                <>
                  <input
                    type="datetime-local"
                    className="input"
                    value={form[r.resume_id]?.datetime || ""}
                    onChange={(e) => updateForm(r.resume_id, "datetime", e.target.value)}
                  />
                  <select
                    className="input"
                    value={form[r.resume_id]?.mode || ""}
                    onChange={(e) => updateForm(r.resume_id, "mode", e.target.value)}
                  >
                    <option value="">Mode</option>
                    <option value="online">Online</option>
                    <option value="onsite">Onsite</option>
                  </select>
                  <input
                    className="input"
                    placeholder="Meet link / address (optional)"
                    value={form[r.resume_id]?.venue || ""}
                    onChange={(e) => updateForm(r.resume_id, "venue", e.target.value)}
                  />
                  <button
                    className="btn bg-green-600 hover:bg-green-700 text-white px-5"
                    onClick={() => schedule(r.resume_id)}
                    disabled={savingId === r.resume_id}
                  >
                    {savingId === r.resume_id ? "Scheduling…" : "Schedule"}
                  </button>
                </>
              ) : (
                <span className="text-sm text-gray-500">Already scheduled</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
