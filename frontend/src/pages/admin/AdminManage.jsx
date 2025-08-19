import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminManage () {
  const [jobs, setJobs] = useState([])
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      const { data } = await api.get('/jobs')
      setJobs(data)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to load jobs')
    }
  }

  useEffect(() => { load() }, [])

  const del = async (id) => {
    try {
      await api.delete(`/jobs/${id}`)
      await load()
    } catch (e) {
      setError(e?.response?.data?.detail || 'Delete failed')
    }
  }

  return (
    <div className="space-y-3">
      {error && <div className="card text-red-600">{error}</div>}
      {jobs.map(j => (
        <div key={j.id} className="card flex items-center justify-between">
          <div>
            <div className="font-semibold">{j.title}</div>
            <div className="text-xs text-gray-500">ID {j.id} • Vacancies {j.vacancies}</div>
          </div>
          <button className="btn bg-red-600 hover:bg-red-700" onClick={() => del(j.id)}>Delete</button>
        </div>
      ))}
      {jobs.length === 0 && <div className="card">No jobs.</div>}
    </div>
  )
}
