import React, { useState } from 'react'
import api from '../../api/axios'

export default function Shortlist() {
  const [items, setItems] = useState([])
  const [jobId, setJobId] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!jobId) {
      setError("Please enter a Job ID")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get(`/resumes/job/${jobId}`)
      setItems(data)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to load shortlist')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, action) => {
    try {
      if (action === "shortlist") {
        await api.post(`/resumes/shortlist/${id}`)
      } else {
        await api.post(`/resumes/unshortlist/${id}`)
      }
      // update status locally without reloading
      setItems(prev =>
        prev.map(r =>
          r.id === id ? { ...r, shortlisted: action === "shortlist" ? "yes" : "no" } : r
        )
      )
    } catch (e) {
      console.error("Failed to update status", e)
    }
  }

  return (
    <div className="space-y-3">
      {/* Job ID input */}
      <div className="card flex items-end gap-3">
        <div className="flex-1">
          <label className="label">Job ID</label>
          <input
            className="input"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="e.g., 1"
          />
        </div>
        <button className="btn" onClick={load}>Load</button>
      </div>

      {/* Error message */}
      {error && <div className="card text-red-600">{error}</div>}

      {/* Loading state */}
      {loading && <div className="card">Loading candidates...</div>}

      {/* Resumes */}
      {!loading && items.length > 0 && items.map(r => (
        <div key={r.id} className="card flex items-center justify-between">
          <div>
            <div className="font-semibold">Resume #{r.id} • User {r.uploaded_by}</div>
            <div className="text-xs text-gray-500">Match: {r.match_score ?? 'N/A'}</div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status badge */}
            <span
              className={`px-2 py-1 rounded-xl ${
                r.shortlisted === "yes"
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {r.shortlisted === "yes" ? "Shortlisted" : "Unshortlisted"}
            </span>

            {/* Shortlist / Unshortlist buttons */}
            <button
              className="btn bg-green-600 text-white"
              onClick={() => updateStatus(r.id, "shortlist")}
            >
              Shortlist
            </button>
            <button
              className="btn bg-red-600 text-white"
              onClick={() => updateStatus(r.id, "unshortlist")}
            >
              Unshortlist
            </button>

            {/* Edit option (always active) */}
            <button className="btn bg-gray-500 text-white">
              Edit
            </button>
          </div>
        </div>
      ))}

      {/* Empty state */}
      {!loading && items.length === 0 && !error && (
        <div className="card">No candidates found for this job.</div>
      )}
    </div>
  )
}
