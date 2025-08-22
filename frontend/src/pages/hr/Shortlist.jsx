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
    setForm((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value },
    }));
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/resumes/shortlisted");
      setItems(data || []);
    } catch (e) {
      setError(
        e?.response?.data?.detail || "Failed to load shortlisted candidates"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
      String(r.job_id).includes(needle) ||
      (r.job_name || "").toLowerCase().includes(needle)
    );
  });

  if (loading) return <div className="card">Loading...</div>;
  if (error) return <div className="card text-red-600">{error}</div>;

  return (
    <div className="space-y-3">
      <div className="card flex items-center gap-3">
        <input
          className="input flex-1"
          placeholder="Filter by job id or job name…"
          value={filters.job}
          onChange={(e) => setFilters({ ...filters, job: e.target.value })}
        />
        <button className="btn" onClick={load}>
          Refresh
        </button>
      </div>

      {filtered.length === 0 && (
        <div className="card">No shortlisted candidates yet.</div>
      )}

      {filtered.map((r) => (
        <div key={r.id} className="card p-3 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-semibold">
                Resume #{r.id} • Job {r.job_name || r.job_id}
              </div>
              <div className="text-xs text-gray-500">
                {r.email} · {r.phone}{" "}
                {r.match_score != null && <>· Match: {r.match_score}</>}
              </div>
              <div className="text-sm">
                Status: <span className="text-green-600">Shortlisted</span>
                {r.interview_at && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                    Interview: {new Date(r.interview_at).toLocaleString()}{" "}
                    {r.interview_mode ? ` • ${r.interview_mode}` : ""}
                  </span>
                )}
              </div>
              {r.feedback && (
                <div className="text-xs text-gray-600">
                  Feedback: {r.feedback}
                </div>
              )}
            </div>

            {/* Schedule form */}
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              <input
                type="datetime-local"
                className="input"
                value={form[r.id]?.datetime || ""}
                onChange={(e) => updateForm(r.id, "datetime", e.target.value)}
                disabled={!!r.interview_at}
              />
              <select
                className="input"
                value={form[r.id]?.mode || ""}
                onChange={(e) => updateForm(r.id, "mode", e.target.value)}
                disabled={!!r.interview_at}
              >
                <option value="">Mode</option>
                <option value="online">Online</option>
                <option value="onsite">Onsite</option>
              </select>
              <input
                className="input"
                placeholder="Meet link / address (optional)"
                value={form[r.id]?.venue || ""}
                onChange={(e) => updateForm(r.id, "venue", e.target.value)}
                disabled={!!r.interview_at}
              />
              {!r.interview_at ? (
                <button
                  className="btn bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => schedule(r.id)}
                  disabled={savingId === r.id}
                >
                  {savingId === r.id ? "Scheduling…" : "Schedule"}
                </button>
              ) : (
                <span className="text-sm text-gray-500">
                  Already scheduled
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
