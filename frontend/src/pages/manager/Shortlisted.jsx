import React, { useState } from "react";
import api from "../../api/axios";
import { Loader2, AlertCircle, CheckCircle2, FileText } from "lucide-react";

export default function Shortlisted() {
  const [items, setItems] = useState([]);
  const [jobId, setJobId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(
        `/resumes/job/${jobId}?shortlisted_only=true`
      );
      setItems(data);
    } catch (e) {
      setError(
        e?.response?.data?.detail || "Failed to load shortlisted candidates"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 🔹 Job ID Input */}
      <div className="card flex items-end gap-3">
        <div className="flex-1">
          <label className="label font-medium">Job ID</label>
          <input
            className="input border rounded-md p-2 w-full"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="e.g., 1"
          />
        </div>
        <button
          className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          onClick={load}
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          {loading ? "Loading..." : "Load"}
        </button>
      </div>

      {/* 🔹 Error Message */}
      {error && (
        <div className="card flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* 🔹 Shortlisted Results */}
      {items.map((r) => (
        <div
          key={r.id}
          className="card hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Resume #{r.id} • User {r.uploaded_by}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                Match:
                {r.match_score != null ? (
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs">
                    {r.match_score}%
                  </span>
                ) : (
                  "N/A"
                )}
              </div>
            </div>
            <span className="flex items-center gap-1 px-2 py-1 rounded-xl bg-green-600 text-white text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" /> Shortlisted
            </span>
          </div>
        </div>
      ))}

      {/* 🔹 Empty State */}
      {!loading && items.length === 0 && !error && (
        <div className="card flex items-center gap-2 text-gray-500 justify-center">
          <FileText className="w-5 h-5" />
          <span>No shortlisted candidates found.</span>
        </div>
      )}
    </div>
  );
}
