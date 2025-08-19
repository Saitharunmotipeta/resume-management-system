import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext.jsx'

export default function JobDetail () {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const load = async () => {
    try {
      const { data } = await api.get(`/jobs/${id}`)
      setJob(data)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to load job')
    }
  }

  useEffect(() => { load() }, [id])

  const apply = async () => {
    try {
      await api.post(`/jobs/${id}/apply`)
      setStatus('Applied successfully')
    } catch (e) {
      setError(e?.response?.data?.detail || 'Apply failed')
    }
  }

  if (error) return <div className="card text-red-600">{error}</div>
  if (!job) return <div className="card">Loading...</div>

  return (
    <div className="card space-y-2">
      <h1 className="text-xl font-semibold">{job.title}</h1>
      <p className="whitespace-pre-wrap">{job.description}</p>
      <div className="text-sm text-gray-500">Vacancies: {job.vacancies}</div>
      {user?.role === 'student' && (
        <div className="flex gap-3">
          <button className="btn" onClick={apply}>Apply</button>
          <Link className="btn bg-green-600 hover:bg-green-700" to="/resume/upload">Upload Resume for this Job</Link>
        </div>
      )}
      {user?.role === 'hr' && (
        <Link className="btn" to={`/hr/jobs/${id}/applicants`}>View Applicants</Link>
      )}
      {status && <div className="text-green-700">{status}</div>}
    </div>
  )
}
