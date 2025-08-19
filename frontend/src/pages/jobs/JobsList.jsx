import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function JobsList () {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/jobs')
        setJobs(data)
      } catch (e) {
        setError(e?.response?.data?.detail || 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="card">Loading jobs...</div>
  if (error) return <div className="card text-red-600">{error}</div>

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {jobs.map((j) => (
        <div key={j.id} className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{j.title}</h3>
            <Link to={`/jobs/${j.id}`} className="link">View</Link>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3">{j.description}</p>
          <div className="text-xs text-gray-400 mt-1">
            Vacancies: {j.vacancies} • Posted by {j.created_by}
          </div>
        </div>
      ))}
      {jobs.length === 0 && <div className="card">No jobs yet.</div>}
    </div>
  )
}
