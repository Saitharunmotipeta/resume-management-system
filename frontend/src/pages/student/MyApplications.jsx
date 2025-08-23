import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function MyApplications () {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/resumes/applications/me')
      setItems(data || [])
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="card">Loading…</div>
  if (error) return <div className="card text-red-600">{error}</div>

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">My Applications</h1>
      {items.length === 0 && <div className="card">No applications yet.</div>}
      {items.map(app => (
        <div key={app.id} className="card p-3 space-y-1">
          <div className="font-semibold">{app.job_title || `Job #${app.job_id}`}</div>
          <div className="text-sm text-gray-600">
            Applied on {new Date(app.applied_at).toLocaleDateString()}
          </div>
          <div className="text-sm">
            Status:{' '}
            {app.shortlisted
              ? <span className="text-green-600">Shortlisted</span>
              : <span className="text-gray-600">Pending / Not Shortlisted</span>}
          </div>

          {app.shortlisted && (
            <div className="mt-2 text-sm">
              {app.interview_at ? (
                <div className="p-2 bg-blue-50 rounded">
                  <div className="font-medium">Interview Scheduled</div>
                  <div>Date: {new Date(app.interview_at).toLocaleString()}</div>
                  <div>Mode: {app.interview_mode}</div>
                  {app.interview_venue && <div>Venue/Link: {app.interview_venue}</div>}
                </div>
              ) : (
                <div className="text-gray-500">Awaiting interview schedule</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
