import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function Shortlisted () {
  const [items, setItems] = useState([])
  const [jobId, setJobId] = useState('')
  const [error, setError] = useState(null)

  const load = async () => {
    if (!jobId) return
    try {
      const { data } = await api.get(`/resumes/job/${jobId}?shortlisted_only=true`)
      setItems(data)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to load shortlisted candidates')
    }
  }

  return (
    <div className="space-y-3">
      <div className="card flex items-end gap-3">
        <div className="flex-1">
          <label className="label">Job ID</label>
          <input className="input" value={jobId} onChange={(e) => setJobId(e.target.value)} placeholder="e.g., 1" />
        </div>
        <button className="btn" onClick={load}>Load</button>
      </div>
      {error && <div className="card text-red-600">{error}</div>}
      {items.map(r => (
        <div key={r.id} className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Resume #{r.id} • User {r.uploaded_by}</div>
              <div className="text-xs text-gray-500">Match: {r.match_score ?? 'N/A'}</div>
            </div>
            <span className="px-2 py-1 rounded-xl bg-green-600 text-white">Shortlisted</span>
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="card">No shortlisted candidates found.</div>}
    </div>
  )
}
