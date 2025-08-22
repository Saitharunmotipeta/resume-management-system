import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api/axios'

export default function JobResumes () {
  const { jobName } = useParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/jobs/${jobName}/resumes/analyse`)
        setItems(data)
      } catch (e) {
        setError(e?.response?.data?.detail || 'Failed to load resumes')
      } finally {
        setLoading(false)
      }
    })()
  }, [jobName])

  if (loading) return <div className="card">Loading...</div>
  if (error) return <div className="card text-red-600">{error}</div>

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Resumes for Job: {jobName}</h2>
      {items.map(r => (
        <div key={r.email} className="card">
          <div className="flex justify-between">
            <div>
              <div className="font-semibold">{r.candidateName} ({r.email})</div>
              <div className="text-xs text-gray-500">Score: {r.rating}</div>
              <div className="text-xs text-gray-500">Feedback: {r.feedback}</div>
            </div>
            <a href={r.resumeUrl} target="_blank" rel="noreferrer" className="btn">View Resume</a>
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="card">No applicants yet.</div>}
    </div>
  )
}
